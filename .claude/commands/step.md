---
description: Implement one step of the Recipe Box roadmap
argument-hint: <step number, or leave empty for the next step>
---

Implement **Step $ARGUMENTS** of `docs/ROADMAP.md`. If no step number was given, use the first step in the status table that is not marked Done.

Follow `CLAUDE.md` throughout.

1. Read `CLAUDE.md`, the status table and the full section for this step in `docs/ROADMAP.md`.
2. If an earlier step is not Done, stop and tell me which one. If this step is already Done, ask whether I want to redo it before changing anything.
3. Look at the current code the step touches, so the changes fit what already exists.
4. Show a short plan: the files you will create or change, one line each. Then carry on without waiting.
5. Implement the step exactly as specified. Nothing more.
6. Verify: `npm run build`, `npm run lint`, plus every check listed in the step. Fix problems and re-run until everything passes. If something in the spec can't work as written, stop and explain instead of improvising.
7. In the status table of `docs/ROADMAP.md`, mark this step **Done** with today's date.
8. Commit everything with the step's commit message.
9. Finish with the learning summary described in `CLAUDE.md`.
