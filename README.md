# Recipe Box

A recipe app built step by step as a learning project with React, TypeScript and Vite.

**Current status:** Step 1 — project scaffold. The app renders a single "Recipe Box" heading. Features come in later steps.

## Tech stack

- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) 8 with [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

## Requirements

Node.js 20.19+ or 22.12+ (required by Vite 8).

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL that Vite prints (usually http://localhost:5173).

## Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the dev server with hot module reload  |
| `npm run build`   | Type-check with `tsc` and build to `dist/`   |
| `npm run lint`    | Lint the project with Oxlint                 |
| `npm run preview` | Serve the production build locally           |

## Project structure

```
recipe-box/
├── index.html          # HTML entry point, loads src/main.tsx
├── public/             # Static files served as-is
└── src/
    ├── main.tsx        # Mounts <App /> into #root
    ├── App.tsx         # Top-level component
    ├── index.css       # Global base styles
    ├── App.css         # App styles (empty for now)
    ├── components/     # Reusable UI components
    ├── data/           # Recipe data
    └── types/          # Shared TypeScript types
```

`components/`, `data/` and `types/` are empty for now (kept in Git with `.gitkeep`) and will be filled in later steps.
