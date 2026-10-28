---
description: Walk through a completed Recipe Box step and quiz me on my own code
argument-hint: <step number, or leave empty for the last completed step>
---

Review **Step $ARGUMENTS** of `docs/ROADMAP.md` with me. If no step number was given, use the most recent step marked Done in the status table.

This is a learning review. **Do not change any code or files** unless I explicitly ask.

## Part 1: Walkthrough

1. Read the step's section in `docs/ROADMAP.md`.
2. Find the step's commit (match its commit message with `git log --oneline`) and look at what it changed (`git show --stat <hash>`, then the files themselves).
3. Walk me through the changes in a sensible reading order (types → data/utils → hooks → components → App/pages):
   - For each file: its job in one sentence, then the important lines quoted as short snippets with a plain-language explanation.
   - Point out each concept the step practises and its tracker day (e.g. "Day 2 – reduce").
   - Trace one real user action through the code from start to finish (e.g. "you click ★ → … → the card re-renders").
4. End Part 1 with: "Ready for the questions?" and wait for my reply.

## Part 2: Questions

5. Ask the step's **review questions** from the roadmap, plus **two more** of your own about this code: one "what would happen if…" question and one "spot the bug" question (show a small, changed version of a real snippet from the step with one bug in it).
6. Ask **one question at a time** and wait for my answer before continuing.
7. After each answer, say whether it's ✅ correct, 🟡 partly right or ❌ not right, then give the complete correct answer in 2–4 sentences, referring to the actual code.
8. If I say "I don't know" or ask for a hint, give a hint first; give the answer only if I'm still stuck.

## Part 3: Wrap-up

9. Finish with:
   - Score (e.g. 4/5, counting partly-right as half)
   - The 1–3 concepts I should revisit, each with a link to the official docs (react.dev, typescriptlang.org, developer.mozilla.org, reactrouter.com)
   - One sentence on what the next step will build
