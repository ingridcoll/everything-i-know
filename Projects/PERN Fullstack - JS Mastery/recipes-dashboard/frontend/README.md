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

# Vite does not include React Router
# To install it:
npm i react-router
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
  - `pages/`: Store different tabs or pages that combine components
  - `App.tsx`: The main component that serves as the entry point for the app
  - `main.tsx`: The file that connects React to the HTML page. It finds the <div id="root"> in the HTML and renders the app there
  - `index.css`: Global styles that apply to the entire app like CSS resets, body font, and base HTML element styles

**Configuration files**

- `package.json`: Lists `dependencies` (React, React-DOM) and `devDependencies`, tools used only for development (TypeScript, ESLint, Vite). Side note: React itself is platform-agnostic; it doesn't know about browsers. `react-dom` is what bridges React to the browser's DOM. That's why `main.tsx` imports from `react-dom/client`, not from `react`. This file also contains scripts:
  - `npm run dev` → Starts the development server
  - `npm run build` → Creates the production version
  - `npm run lint` → Checks for code quality issues
- `tsconfig.json`: TypeScript configuration that contains two references: `tsconfig.app.json` (for app code) and `tsconfig.node.json` (for build tool configs)
- `tsconfig.app.json`: Rules for the app code
  - `target: "es2023"` → Uses modern JavaScript features
  - `jsx: "react-jsx"` → Tells TypeScript this is a React project
  - `noUnusedLocals/Parameters` → Forces removal of unused code (keeps things clean). Unused variables are often signs of bugs or leftover code from a deleted feature. The compiler catching it beats you finding it in review.

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

# Pages, Layout and React Router

I created the page `Dashboard.tsx` inside the `pages/` folder.

In `App.tsx`, I created a route that serves the Dashboard component when the user visits `/`:

```ts
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
```

## Adding a sidebar and header

### Making the sidebar and header a parent component (Layout)

I created these files:

```txt
src/
  components/
    Layout/
      index.tsx
      Sidebar.tsx
      Header.tsx
```

The idea is to create a Layout component that combines the sidebar and header, and implement it as the parent route. That way, all other routes are rendered under this layout, ensuring the sidebar and header show up for all pages.

Why a `Layout/` folder instead of a flat `Layout.tsx`? Because `Layout` is made of multiple files (`Sidebar`, `Header`). Grouping them makes it clear they belong together. The `index.tsx` is the public face of the folder; when you import from `./components/Layout`, TypeScript automatically looks for `index.tsx`.

In `App.tsx`, I added `Layout` as the parent route, rendering `Outlet`, which is a placeholder. From the nested routes, once a path matches the client's URL, it will render that element and replace the `Outlet` placeholder.

When the URL is `/`, React Router matches `<Route path="/" element={<Dashboard />} />`. It then looks at its parent route and sees `<Outlet />` inside `<Layout>`. It replaces that `<Outlet />` with `<Dashboard />`.
So the final render looks like:

```ts
<Layout>
  <Dashboard /> ← Outlet got replaced with this
</Layout>
```

The Layout renders once. Only the Outlet slot changes as you navigate.

### Writing the sidebar and header components

I built a layout with 3 parts:

- A retractable sidebar on the left with navigation links
- A header at the top with a dark/light mode toggle and application title
- A main content area on the right where pages render

#### Sidebar.tsx

```ts
// NavLink is like an <a> tag but intercepts clicks to prevent full page reloads.
// It also auto-applies an "active" CSS class when its URL matches the current route.
import { NavLink } from "react-router-dom";

// Defines the shape of props this component accepts.
// isCollapsed: tracks whether the sidebar is open or closed.
// onCollapse: a function passed in from Layout that toggles isCollapsed.
// The sidebar doesn't own this state — Layout does. Sidebar just calls the function.
type SidebarProps = {
  isCollapsed: boolean;
  onCollapse: () => void;
};

// Props are destructured directly in the parameter list.
// Instead of writing props.isCollapsed, destructuring lets you use isCollapsed directly.
const Sidebar = ({ isCollapsed, onCollapse }: SidebarProps) => {
  return (
    // Semantic HTML element for sidebar content.
    // The template literal dynamically adds the "collapsed" class when isCollapsed is true.
    // Template literal syntax: `static-class ${condition ? "class-if-true" : "class-if-false"}`
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Calls onCollapse when clicked, which flips isCollapsed in Layout via setIsCollapsed.
          The label reflects the action the button will perform, not the current state. */}
      <button onClick={onCollapse}>
        {isCollapsed ? "Expand" : "Collapse"}
      </button>

      {/* Short-circuit rendering: if isCollapsed is true, nothing renders after &&.
          If isCollapsed is false, the nav renders.
          Pattern: {condition && <Component />} */}
      {!isCollapsed && (
        // Semantic HTML element that wraps navigation links.
        <nav>
          {/* to="/" is the route this link navigates to, equivalent to href in a plain <a> tag. */}
          <NavLink to="/">Dashboard</NavLink>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
```

#### Header.tsx

```ts
// type is a TypeScript keyword for defining the shape of an object
// Anything called HeaderProps must have exactly these two properties, with exactly these types
type HeaderProps = {
  isDark: boolean;
  onToggleDark: () => void;
  // subtitle?: string; -> Adding a ? after the prop name make sit optional
};

// The props coming into this component must match the HeaderProps shape
// A default value can be assigned in this line, like isDark = false
const Header = ({ isDark, onToggleDark }: HeaderProps) => {
  return (
    <header className="header">
      <span className="header-title">Recipes</span>
      <button onClick={onToggleDark}>
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
};

export default Header;
```

### The dark mode toggle

We're going to store a boolean in React state: `isDark`. When it's true, we add a CSS class to the layout When it's false, we remove it.

```ts
const [isDark, setIsDark] = useState(false);
```

`useState` returns two things:

- The current value (`isDark`)
- A function to update it (`setIsDark`)

When you call `setIsDark(true)`, React re-renders the component with the new value. This is how React reacts to changes (hence the name).

The `Header` doesn't own the dark mode state. The `Layout` does, because both `Header` and the page content need to respond to it. When state needs to affect multiple components, you lift it up to their shared parent and pass it down as props. This is called **lifting state up**. It's one of the most important patterns in React.

I added the toggle in the `Layout` component, when rendering the `Header`:

```ts
<Header
  isDark={isDark}
   onToggleDark={() => setIsDark(!isDark)}
/>
```

2:09:00
