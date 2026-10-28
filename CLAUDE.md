# Recipe Box — instructions for Claude Code

## What this project is

Recipe Box is a **learning project** for the "React Application Development — Foundational" path (40-day tracker, 1 Oct – 25 Nov 2026). The developer practises every topic from the path in one growing application.

All code is written by Claude Code from the step specs in `docs/ROADMAP.md`. The developer runs the steps, checks the result and must be able to **explain every part of the code**. So the code you write is also teaching material.

**Stack:** Vite · React · TypeScript · npm. React Router is added in Step 12. Nothing else is installed unless a step says so.

## How to work

- **One step at a time.** Implement only the step you are asked for, exactly as specified in `docs/ROADMAP.md`. Do not start the next step or add "nice to have" features.
- **Check order.** Before starting, read the status table at the top of `docs/ROADMAP.md`. If an earlier step is not marked Done, stop and say so.
- **Ask when unclear.** If the spec is ambiguous or conflicts with the current code, stop and ask before editing. Do not silently change the spec.
- **No new packages** unless the step lists them. Never change `package.json` scripts or tooling config unless the step says to.
- **Stay in scope.** Only create or change files the step needs. Keep existing behaviour working.

## Code style (written for a learner)

- Simple, idiomatic, readable code over clever code. No abstractions the step doesn't ask for.
- Function components with arrow functions or function declarations; **named exports** for everything new (leave `main.tsx` and the default `App` export as the template made them unless a step changes them).
- Explicit types on exported functions, props and hook return values. **Never use `any`**; use `unknown` and narrow it.
- Props types are named `<Component>Props` and declared next to the component.
- Never mutate state or props; update with spread, `map` and `filter`.
- Short comments only where a concept is easy to miss (e.g. why a cleanup function exists). No comments that restate the code.
- Accessible basics: every input has a `<label>`, non-submit buttons have `type="button"`, images have `alt` text.
- Styling: plain CSS with simple class names in `src/index.css`. Keep it minimal and tidy; no CSS frameworks.

## Verify every step

1. Run `npm run build` and `npm run lint`. Both must pass with no errors or warnings before committing.
2. Run any extra checks the step lists.
3. **Never start the dev server** (`npm run dev` runs forever). Instead, list the manual browser checks the developer should do.

## Git

- One commit per step, using the exact commit message from the step.
- Include the `docs/ROADMAP.md` status update in the same commit.
- Do not commit if verification fails. Never push, rebase or rewrite history.

## After every step: learning summary

Finish with this, in plain language:

1. **What changed:** each file created or edited, one or two sentences each.
2. **Concepts used:** each JavaScript / TypeScript / React concept the step practises, the tracker day it belongs to, and the exact place in the code where it appears (file + function or component).
3. **How it fits together:** a short description of how data flows through the new code.
4. **Manual checks for you:** a checklist of things to try in the browser after `npm run dev`.
5. A reminder: "Run `/review` to walk through the code and answer the review questions."

Do **not** answer the step's review questions in the summary; they are for `/review`.
