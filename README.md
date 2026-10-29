# Recipe Box

A recipe app built step by step as a learning project with React, TypeScript and Vite.

**Current status:** Step 3 — static UI. The app shows a grid of recipe cards built from sample data. Interactivity (favourites, delete, search, forms) comes in later steps.

## Tech stack

- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) 8 with [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
- Plain CSS in `src/index.css` (no CSS framework) with the [Geist](https://vercel.com/font) font via `@fontsource-variable/geist`
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
    ├── App.tsx         # Top-level component, renders the recipe list
    ├── index.css       # Colour variables, base styles and component styles
    ├── App.css         # App styles (empty for now)
    ├── components/     # Layout, List, Card, Button and RecipeCard components
    ├── constants/      # Shared constants (recipe categories)
    ├── data/           # Sample recipe data
    ├── types/          # Shared TypeScript types
    └── utils/          # Recipe helper functions
```
