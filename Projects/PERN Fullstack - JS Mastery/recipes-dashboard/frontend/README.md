# Building a Fullstack Dashboard using Postgres, Express, React and Node

**Started:** _May 1st, 2026_

**Note:** This recounts the steps I took to create this project, including concepts and lessons learned. Most of the theory was not written by me. These are the **references** for most of the knowledge in this section:

- [Full Stack Engineering Course | Build and Deploy a Full Stack PERN Admin Dashboard in 2026 - JavaScript Mastery](https://www.youtube.com/watch?v=ek7hmv5PVV8)

**Table of Contents**

## Setting up the project

After creating the project's root folder, I created the `frontend` folder to separate each layer of the app in different repos, if needed. This helps with scaling the app in the future, if the two repos need to be deployed to different VMs.

### Vite for fast development

Vite is a frontend build tool that bundles and serves JavaScript/TypeScript code for the browser. Older tools like Webpack were slow, especially during development, since they had to bundle the entire app before you could see anything in the browser. Vite sidesteps this by using native ES modules in the browser during dev, which means it only processes the file you're actively editing rather than the whole app. This makes the dev server start nearly instantly and hot module replacement (when you save a file and see it update live) extremely fast regardless of app size.

The main tradeoff is that Vite uses two different tools under the hood: `esbuild` for the dev server and `Rollup` for production builds. This means your dev and production environments are technically not identical, which can cause rare but frustrating bugs that only appear in production. The other tradeoff is that it assumes you're building for modern browsers. If you need to support very old browsers, you'll need extra plugins and configuration.

I scaffolded the `frontend` project by running:

```bash
npm create vite@latest
```

This creates the skeleton of a React + TypeScript app (if selected).

### Tailwind CSS for quick styling

As per [Tailwind's documentation](https://tailwindcss.com/docs/installation/using-vite), in the project's root, I ran:

```bash
npm install tailwindcss @tailwindcss/vite
```

Then, I added the @tailwindcss/vite plugin to the project's Vite configuration (`vite.config.ts`):

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
});
```

For each CSS file, I added the import directive at the top:

```css
@import "tailwindcss";
```

### The folder structure

**Source code**

- `node_modules/` — All library dependencies live here (auto-generated)
- `public/`: Files that copy as-is to production (favicon, static images)
- `dist/`: The compiled output when the app is built for production (auto-generated)
- `index.html`: The HTML entry point. Contains `<div id="root"></div>` where React renders the app
- `src/`: The code lives here
  - `assets/`: Images, icons, and other static files
  - `components/`: Folder for reusable UI pieces (buttons, cards, headers, etc.)
  - `hooks/`: Custom React hooks for logic that can be reused
  - `lib/` (with `utils.ts`): Helper functions and utilities
  - `App.tsx`: The main component that serves as the entry point for the app
  - `App.css`: CSS styles that apply to the `App.tsx` component only
  - `main.tsx`: The file that connects React to the HTML page. It finds the <div id="root"> in the HTML and renders the app there
  - `index.css`: Global styles that apply to the entire app like CSS resets, body font, and base HTML element styles

**Configuration files**

- `package.json`: Lists `dependencies` (React, React-DOM) and `devDependencies`, tools used only for development (TypeScript, ESLint, Vite). Contains scripts:
  - `npm run dev` → Starts the development server
  - `npm run build` → Creates the production version
  - `npm run lint` → Checks for code quality issues
- `tsconfig.json`: TypeScript configuration that contains two references: `tsconfig.app.json` (for app code) and `tsconfig.node.json` (for build tool configs)
- `tsconfig.app.json`: Rules for the app code
  - `target: "es2023"` → Uses modern JavaScript features
  - `jsx: "react-jsx"` → Tells TypeScript this is a React project
  - `noUnusedLocals/Parameters` → Forces removal of unused code (keeps things clean)
- `vite.config.ts`: Vite's settings. Configures Vite to use the React plugin for proper handling of `.tsx` files
- `eslint.config.js`: Code quality checker. Enforces best practices for React, hooks, and TypeScript
  Ignores the `dist/` folder (the production build).

**How it works together**

When you run `npm run dev`, Vite starts a local server and watches your files for changes.
You edit `.tsx` files in `src/`
Vite converts TypeScript to JavaScript and hot-reloads in your browser
ESLint checks your code as you type
When you're ready for production, `npm run build` creates optimized, minified files in `dist/`
This setup prioritizes developer experience (fast feedback) and code quality (ESLint + TypeScript catch bugs early).

## Defining a theme/color palette with tweakcn

I used [tweakcn](https://tweakcn.com/editor/theme) and chose a community style (Zen Inspired Theme by Bikash). I copied the code under the `index.css` tab and pasted into the app's `App.css` file.
