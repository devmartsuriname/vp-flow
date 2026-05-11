# Skill: Task Contract (TC) Reference

All implementation work in VP-Flow is governed by Task Contracts.

## Location

All TCs live in: /Task Contracts/
Naming: TC-[NNN]-[Module]-[Description].md

## TC Structure (for reference)

A valid TC contains:
- TC ID and title
- Status: DRAFT / APPROVED / EXECUTED / CLOSED
- Scope: exactly what must be done
- Out of scope: explicitly what must NOT be done
- Files affected
- Acceptance criteria
- Restore point names (pre and post)
- Approved by: Delroy
- Approval date

## Claude Code Rules for TCs

1. Only execute TCs with Status: APPROVED
2. Do not modify the TC during execution
3. If scope is unclear: stop and report
4. After execution: update TC status to EXECUTED
5. Attach post-execution restore point name to TC

## No TC = No Execution

If there is no approved TC for a task: do not execute. Report to Delroy via Claude.ai (Cowork).
