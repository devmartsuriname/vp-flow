# Incoming Post & Archive — Corrected Architecture

## Corrected State Machine

```text
                    +------------+
                    |  received  |  Secretary scans/uploads
                    +-----+------+
                          |
                    Secretary adds metadata
                          |
                    +-----v-------+
                    | registered  |  Metadata complete, doc attached
                    +-----+-------+
                          |
                    VP reviews registered item
                          |
              +-----------+-----------+-----------+
              |                       |           |
        VP requests advice      VP decides     VP rejects
              |                  to forward        |
        +-----v-----------+   +-----v------+  +---v------+
        | waiting_advice   |   | forwarded  |  | rejected |
        +-----+-----------+   +-----+------+  +---+------+
              |                       |            |
        Secretary/VP provides         |            |
        advice response               |         (terminal
              |                       |          before close)
        +-----v-----------+          |
        | advice_received  |          |
        +-----+-----------+          |
              |                       |
              +--- VP decides --------+
              |    to forward         |
              |                       |
              +--- VP decides ---+    |
              |    appointment   |    |
              |                  |    |
        +-----v----------------+ |    |
        | appointment_created  | |    |
        +-----+----------------+ |    |
              |                   |    |
              +-------------------+----+
              |
        VP marks closed
              |
        +-----v------+
        |   closed   |  All actions complete
        +-----+------+
              |
        VP archives (IMMUTABLE LOCK)
              |
        +-----v------+
        |  archived  |  FINAL — no modifications
        +------------+
```

### Key Design Decisions

- `**closed` is mandatory before `archived**` — archive is only a preservation lock, not an action resolution
- `**rejected**` is a VP-only terminal decision; must be closed before archival
- `**waiting_advice` / `advice_received**` explicitly models the advice loop
- `**appointment_created**` records that an appointment was spawned; creates a linkage audit event
- Secretary **cannot** forward — only VP can transition to `forwarded`

---

## Transition Table


| From                | To                  | Authority     | Conditions                           |
| ------------------- | ------------------- | ------------- | ------------------------------------ |
| received            | registered          | Secretary, VP | Metadata complete, document attached |
| registered          | forwarded           | **VP only**   | VP forwarding decision               |
| registered          | waiting_advice      | VP            | VP requests advice                   |
| registered          | rejected            | **VP only**   | VP rejection decision                |
| waiting_advice      | advice_received     | Secretary, VP | Advice response provided             |
| advice_received     | forwarded           | **VP only**   | VP forwarding decision post-advice   |
| advice_received     | rejected            | **VP only**   | VP rejection decision post-advice    |
| advice_received     | appointment_created | **VP only**   | VP creates linked appointment        |
| forwarded           | appointment_created | **VP only**   | VP creates linked appointment        |
| forwarded           | closed              | **VP only**   | Action complete                      |
| appointment_created | closed              | **VP only**   | Appointment handled                  |
| rejected            | closed              | **VP only**   | Rejection finalized                  |
| closed              | archived            | **VP only**   | Immutable lock applied               |
| archived            | *(none)*            | —             | **IMMUTABLE — trigger-enforced**     |


### Prohibited Transitions

- Secretary **cannot** transition to: `forwarded`, `rejected`, `closed`, `archived`, `appointment_created`
- No status can skip `closed` to reach `archived`
- No backward transitions from `closed` or `archived`

---

## Updated RLS Matrix


| Action                      | VP                         | Secretary                                                               | Protocol                                                                 |
| --------------------------- | -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| SELECT                      | All records                | All records                                                             | `category = 'invitation'` AND `status NOT IN ('received', 'registered')` |
| INSERT                      | Yes                        | Yes (registration only)                                                 | No                                                                       |
| UPDATE (metadata)           | All non-archived           | Own registered + status IN ('received', 'registered', 'waiting_advice') | No                                                                       |
| UPDATE (status transitions) | Per transition table above | `received → registered` only                                            | No                                                                       |
| DELETE                      | No (soft archive)          | No                                                                      | No                                                                       |


### Secretary Authority (Explicit)

- **CAN:** Scan/upload document, register metadata, provide advice response
- **CANNOT:** Forward, reject, create appointments, close, or archive

### VP Authority (Explicit)

- **CAN:** All Secretary actions + all status transitions + archive finalization
- Full decision authority on forwarding, rejection, advice requests, and appointment linkage

---

## Appointment Linkage

When VP transitions to `appointment_created`:

1. A new appointment is created via existing Appointments module
2. `incoming_post` record stores `linked_appointment_id` (nullable UUID FK → appointments)
3. Audit event: `incoming_post_appointment_linked` logged with both IDs
4. The incoming post continues its lifecycle independently (→ closed → archived)

### Additional Schema Field

```text
linked_appointment_id  uuid  nullable, FK → appointments(id)
```

### Additional Audit Action

```text
incoming_post_appointment_linked
```

Total new audit actions: **6** (created, updated, status_changed, archived, forwarded, appointment_linked)

---

## Archive Enforcement

Database trigger: `prevent_archived_incoming_post_update`

- Pattern: identical to existing `prevent_closed_case_update`
- Blocks ALL updates/deletes on rows where `status = 'archived'`
- `archived_at` and `archived_by` set automatically on transition to `archived`

Status transition trigger: `validate_incoming_post_status_transition`

- Enforces the transition table above
- Ensures `archived` is only reachable from `closed`
- Enforces VP-only transitions via `is_vp(auth.uid())` check

---

## Open Decisions (Carried Forward)

1. **Protocol document access for invitations** — Decision Required
2. **Reference number format** (auto vs manual) — Decision Required
3. **Case linkage** (can incoming post generate a case?) — Recommended deferred

---

**Note:**  
Approved for documentation baseline. Before implementation starts, explicitly lock these three decisions:

1. Whether Protocol may view the attached invitation document itself, or only the Incoming Post record metadata.
2. Reference number format must be fixed as auto-generated yearly sequence with prefix (recommended: `SECVP-YYYY-0001`).
3. Case linkage remains deferred unless explicitly authorized in a later phase.  
  
**HARD STOP — Documentation only. No implementation performed. Awaiting explicit authorization.**