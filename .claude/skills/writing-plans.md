# Skill: Writing Implementation Plans

Use this skill before writing any code. Every TC requires a written implementation plan first.

## When to Use

Before any implementation task. Read the TC, then produce a plan before touching code.

## Plan Format

For every TC task, write a plan with:

1. SCOPE CONFIRMATION
   Restate exactly what the TC asks. Nothing more.

2. FILES AFFECTED
   List every file that will be modified or created. If unsure, read the file first.

3. MIGRATION IMPACT
   Will a new Supabase migration be needed? If yes, describe it. Additive only.

4. STEP-BY-STEP TASKS
   Break the work into 2-5 minute steps. Each step: what file, what change, what it does.

5. RESTORE POINT
   Name the pre-execution restore point you will create before starting.

6. BUILD VALIDATION
   What command confirms success? (e.g., npm run build, npm run lint)

7. STOP CONDITION
   What would cause you to stop and report to Delroy instead of continuing?

## Rules

- Plan must be presented to Delroy before execution begins
- Do not start coding until the plan is confirmed (or Delroy says "start")
- If the plan reveals the TC is ambiguous: stop and report
- Plans are DRAFT until Delroy confirms
