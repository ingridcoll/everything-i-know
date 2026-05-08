# Everything I Know About React

**Started:** _October 16th, 2025_

**Note:** This section compiles different lessons from courses and other learning resources. Most of the theory was not written by me. These are the **references** for most of the knowledge in this section:

- [React Tutorial for Beginners - Programming with Mosh](https://www.youtube.com/watch?v=SqcY0GlETPk)

**Table of Contents**

- [Everything I Know About React](#everything-i-know-about-react)
- [Root of the application](#root-of-the-application)
- [What Are Components?](#what-are-components)
- [Creating a Dynamic List Group Component](#creating-a-dynamic-list-group-component)
- [Writing Code that Renders](#writing-code-that-renders)
- [Conditional Logic](#conditional-logic)
- [Handling Mouse Events](#handling-mouse-events)
- [Props vs. State](#props-vs-state)
- [useState](#usestate)
- [Passing Data via Props and Interfaces](#passing-data-via-props-and-interfaces)
- [Passing Functions via Props](#passing-functions-via-props)
- [Passing Children to a Component](#passing-children-to-a-component)
- [React Router](#react-router)
  - [How React Router works](#how-react-router-works)
  - [Why BrowserRouter wraps everything](#why-browserrouter-wraps-everything)
  - [Nested routes and Outlet](#nested-routes-and-outlet)

# Root of the application

index.html is the container of our application. The root lives inside a div.

```html
<!-- index.html -->
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

The main.tsx script creates the root element when loaded into the browser and renders our App.tsx code:

```ts
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

# What Are Components?

When a website is loaded in a browser, the browser turns the HTML code into a tree-like structure called the Document Object Model (DOM). With React, we do not need to query and update DOM elements. Instead, we create components, which are small, reusable, organized code files. React then efficiently creates and updates DOM elements. A React application is a tree of components, with the App at the root bringing everything together.

When our application starts, the library "react-dom" (React dependency) is responsible for creating a JavaScript data structure called Virtual DOM. It is different than the actual DOM in the browser, since it is in-memory and lightweight representation of our components tree, each node representing a component and its properties.

When the **state** of a component changes, "react-dom" changes its corresponding node. Then, it compares the new version of the Virtual DOM with the previous version to identify the nodes that should be updated, and updates them.

Use the Pascal convention when naming components by capitalizing the first letter of each word.

# Creating a Dynamic List Group Component

A component can only return **one element**. That is because when the code compiles, JavaScript creates an HTML element for the component similar to React.createElement('h1'). For a component to return more than one element, we have to wrap the JSX code in `<Fragment>` tags, which can be abbreviated to `<></>`. This component returns an h1 element and a ul element:

```ts
export default function ListGroup() {
  return (
    <>
      <h1>List Group</h1>
      <ul className="max-w-xs flex flex-col">
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
          Profile
        </li>
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
          Settings
        </li>
        <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
          Newsletter
        </li>
      </ul>
    </>
  );
}
```

To **pass data** to a list component, we can use the `listName.map` function. JavaScript or TypeScript code needs to be wrapped with {} when added in-between HTML elements.

```ts
export default function ListGroup() {
  //Assign variables here
  const items = ["New York", "Austin"];

  return (
    <>
      <h1>List Group</h1>
      <ul className="max-w-xs flex flex-col">
      //Map each item inside "items" as a "li" element, adding the "key" property (unique value) to properly identify each item
        {items.map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg"
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
```

# Writing Code that Renders

To **write code that renders**, we can:

- Wrap our code in {} when placed **inside** the return block
- **Create and assign a variable**, that will later be passed like {variableName} in the return block, such as `const message = items.length === 0 ? <p>No items.</p> : null}`
- **Create a function** that will later be called in the return block like {functionName()}. For example:

```ts
//Functions in Typescript are constructed like nameOfFunction = (props, optional) => {return}
  const displayMessage = () => {
    return items.length === 0 ? <h1>No items found</h1> : null;
  };

  return (
    <>
      <h1>List Group</h1>
      {displayMessage()}
    </>
  )
```

# Conditional Logic

A **conditional statement** is constructed like `{items.length === 0 ? <p>No items.</p> : null}`. In short, (element) (operator) (value) ? (result if true) : (result if false). There is another way to write conditional logic when the value to return if false is null: (element) (operator) (value) && (result if true), like `items.length === 0 && <h1>No items</h1>`.

# Handling Mouse Events

To **handle events** such as a mouse click, we can use the property `onClick={}`. For example, if we have a list item and we want to log the timestamp of when the user clicks on that item, we can do this:

```ts
import { type MouseEvent } from "react";

export default function ListGroup() {
  const items = ["New York", "Austin"];

  const displayMessage = () => {
    return items.length === 0 ? <h1>No items found</h1> : null;
  };

  //Event handler function. Notice we are declaring the "type" of the prop we are passing (e or event), which is of type "MouseEvent" in React.
  const handleClick = (e: MouseEvent) => console.log(e.type);

  return (
    <>
      <h1>List Group</h1>
      {displayMessage()}
      {items.length === 0 ? <p>No items.</p> : null}
      <ul className="max-w-xs flex flex-col">
        {items.map((item) => (
          <li
            key={item}
            // We are pasing a reference to the function, not calling it, so no ()
            onClick={handleClick}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
```

# Props vs. State

**Props** (properties) are:

- Input passed to a component
- Similar to function args (arguments)
- Immutable: read-only, unchangeable. That is why we don't set prop variables in the component itself, we do it in the parent component.
- Any time they change, React will re-render our component and change the DOM

**State** is:

- Data managed by a component
- Similar to local variables
- Mutable: the data can change over time
- Any time they change, React will re-render our component and change the DOM

# useState

A hook is a function that allows us to tap into built-in features in React. The hook `useState()` is used to tell React that this component can have data or state that will change over time. For example, if we want to track a selected item in a list, we can use `const [selectedIndex, setSelectedIndex] = useState(-1);`. This array holds two values:

- The actual variable we are tracking `selectedIndex`
- And an updater function `setSelectedIndex`, that updates the selectedIndex variable, and notifies React to re-render our component
  When we first declare the `useState()` function, we can assign it a value or leave it blank.

```ts
import { useState } from "react";

export default function ListGroup() {
  const items = ["New York", "Austin"];
//To track which item has been selected by the user, starting with -1 (no index)
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h1>List Group</h1>
      {items.length === 0 ? <p>No items.</p> : null}
      <ul className="max-w-xs flex flex-col">
        {items.map((item, index) => (
          <li
            className={
              //If the selectedIndex variable equals the index of the current list item, apply "active" CSS class for styling
              selectedIndex === index
                ? "active"
                : "inline-flex items-center gap-x-2 py-3 px-4 text-sm bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg"
            }
            key={item}
            onClick={() => {
              //OnClick update the selected index variable with the current list item's index
              setSelectedIndex(index);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
```

# Passing Data via Props and Interfaces

To make our components reusable and avoid them having static data only, we can pass props. Props (properties) are the inputs to our components.

- First, we need to decide the **shape** of the input of the component. To do this, we can create an **interface**, which defines the shape of an **object**. For example:

```ts
//The object we want to pass to our component has two elements:
interface ListGroupProps {
  items: string[]; //----> Array of strings
  heading: string; //----> string
}
```

We can also **restrict** props' values and make them required or **optional**:

```ts
interface ButtonProps {
  buttonText: string;
  onClick: () => void;
  //We can make props optional by adding ?
  //We can also restrict props' values by declaring them here inside the interface:
  // | ---> union, "or"
  color?: "bg-blue-500" | "bg-yellow-500";
}
```

- Then, add the DESTRUCTURED props interface inside the component's parameters. That way we can target different elements from the ListGroupProps interface:

```ts
export default function ListGroup({ items, heading }: ListGroupProps) { //Deconstructed interface inside the components parameter: nameOfComponent( {element1, element2}: propsInterface)
  const [selectedIndex, setSelectedIndex] = useState(-1); //To track which item has been selected by the user, starting with -1 (no index)
  return (
    <>
    {/* We can now access the props variables */}
      <h1>{heading}</h1>
      {items.length === 0 ? <p>No items.</p> : null}
      <ul className="max-w-xs flex flex-col">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "active"
                : "inline-flex items-center gap-x-2 py-3 px-4 text-sm bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
```

- Lastly, find any **parent** component in the application that uses this **child** component (for example, the App component), and pass the parameters following the interface specifications:

```ts
import ListGroup from "@/components/ListGroup";

export default function App() {
  // Array of strings
  const items = ["New York", "Austin", "Seattle"];
  // String
  const heading = "Top 10 Cities";
  return (
    <div>
      <div>
        {/* When calling the component, we now have to pass data in its parameters */}
        <ListGroup items={items} heading={heading}></ListGroup>
      </div>
    </div>
  );
}
```

# Passing Functions via Props

We might want to trigger a function when the user selects an item in the list. To configure our component to pass functions, we first need to modify the **interface** of the component, and add the function:

```ts
interface ListGroupProps {
  items: string[];
  heading: string;
  //Function structure: nameOfFunction: (parameter1: dataType) => return
  //This function acts as a placeholder for the actual function defined in the parent components
  //That way, we can reuse this component and make it call different functions depending on the parent component
  onSelectItem: (item: string) => void; //Similar to onClick
}
```

Then, we need to modify the component's parameters, to include that function:

```ts
export default function ListGroup({
  items,
  heading,
  onSelectItem, //---> function
}: ListGroupProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  return (
    <>
      <h1>{heading}</h1>
      {items.length === 0 ? <p>No items.</p> : null}
      <ul className="max-w-xs flex flex-col">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "active"
                : "inline-flex items-center gap-x-2 py-3 px-4 text-sm bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              //When the user clicks the item, the onSelectItem function is triggered, passing the current item as a parameter:
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
```

Lastly, we need to modify any parent component that is calling this child component:

```ts
import ListGroup from "@/components/ListGroup";

export default function App() {
  //Array of strings
  const items = ["New York", "Austin", "Seattle"];
  //String
  const heading = "Top 10 Cities";

  //This function defined in the parent component is the ACTUAL function we want to trigger
  //Convention is to name it "handleNameOfPlaceHolderFunction"
  //Specify the data to pass and its data type, matching the interface defined in the child component:
  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  return (
    <div>
      <div>
        <ListGroup
          items={items}
          heading={heading}
          //Pass the actual function through the placeholder function
          onSelectItem={handleSelectItem}
        ></ListGroup>
      </div>
    </div>
  );
}
```

# Passing Children to a Component

There is a special prop that ALL components have called `children`. In React, a component can have one, many, or no children. React is all about building reusable components. But what if you want to pass content inside a component rather than through props like `title` or `description`?

For example, let's say we want to add an alert below the list's header. We can create a new component `Alert.tsx`:

```ts
interface AlertProps {
  text: string;
}

export default function Alert({ text }: AlertProps) {
  return (
    <>
      <h1>{text}</h1>
    </>
  );
}
```

Then, we need to update the `ListComponent.tsx` and add the `children` property to it, so React can render it properly:

```ts
import { useState, type ReactNode } from "react";

interface ListGroupProps {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
  children: ReactNode; //Children have to be of type "ReactNode"
}

export default function ListGroup({
  items,
  heading,
  onSelectItem,
  children, //Add the children prop here too
}: ListGroupProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  return (
    <>
      <h1>{heading}</h1>
      {children} //Reference the children prop wherever you want to render the children
      {items.length === 0 ? <p>No items.</p> : null}
      <ul className="max-w-xs flex flex-col">
        {items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "active"
                : "inline-flex items-center gap-x-2 py-3 px-4 text-sm bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg"
            }
            key={item}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
```

Lastly, in the parent component, we can insert the `Alert` component inside the `ListGroup` component:

```ts
import ListGroup from "@/components/ListGroup";
import Alert from "@/components/Alert";

export default function App() {
  const items = ["New York", "Austin", "Seattle"];
  const heading = "Top 10 Cities";

  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  return (
    <div>
      <div>
        <ListGroup //Parent component
          items={items}
          heading={heading}
          onSelectItem={handleSelectItem}
        >
        //Alert child component
          <Alert text="Alert before list items!"></Alert>
        </ListGroup>
      </div>
    </div>
  );
}
```

# React Router

In a traditional website, when you go to `/dashboard`, the browser sends a request to a server, which returns a completely new HTML page.

React apps don't work this way. They load a single HTML file (`index.html`) once. Everything after that is JavaScript swapping components in and out without ever requesting a new page from the server. This is called a Single Page Application (SPA).

The URL still changes (so bookmarks and the back button work), but the browser never actually navigates anywhere. React Router intercepts the URL change and decides which component to render.

## How React Router works

```ts
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};
```

- `BrowserRouter`. The browser has a built-in API called the History API. It lets JavaScript read and change the URL in the address bar without triggering a full page reload. `BrowserRouter` is a component that sits at the top of your app and listens to this API. When the URL changes, `BrowserRouter` captures the new path and stores it in React Context. Think of Context as a value that's been made available to every component in the tree below it, like a shared variable that any child can read without you passing it down manually through props. So when you're deep inside a `Settings` component and you want to know the current URL, or navigate somewhere, you can access it because BrowserRouter put it in Context at the top.
- `Routes` is just a selector. It reads the current URL from Context (put there by `BrowserRouter`) and looks through all its direct `Route` children to find the one whose path matches. It renders the first match and ignores the rest.
- `Route` takes two key props:
  - `path`: the URL pattern to match against
  - `element`: the component to render when it matches

When the URL is `/`, React renders `Dashboard`. When it's `/settings`, it renders `Settings`. No server involved.

## Why BrowserRouter wraps everything

React uses a pattern called Context to pass data through a component tree without manually passing props at every level. `BrowserRouter` uses this to make the current URL available to any component inside it, no matter how deeply nested. If a component outside `BrowserRouter` tries to use routing features, it will crash because it has no access to that context.

## Nested routes and Outlet

Look at this structure:

```ts
<Routes>
  <Route element={<Layout><Outlet /></Layout>}>
    <Route path="/" element={<Dashboard />} />
  </Route>
</Routes>
```

There are two levels of Route here. The outer one has no path. The inner one has `path="/"`.

Why nest them?
The outer route is not a page. It's a wrapper. It exists to say: "every route inside me should be wrapped in this `Layout` component." This means the sidebar and header render once, and only the content area swaps out when the URL changes. Without this pattern, you'd have to import and render your sidebar inside every single page component. Change the sidebar? Update every page. That violates the single responsibility principle: your `Dashboard` page should not know or care about the sidebar.

`Outlet` is a placeholder. It tells React Router: "render the matched child route here."

When the URL is `/`, React Router matches `<Route path="/" element={<Dashboard />} />`. It then looks at its parent route and sees `<Outlet />` inside `<Layout>`. It replaces that `<Outlet />` with `<Dashboard />`.
So the final render looks like:

```ts
<Layout>
  <Dashboard /> ← Outlet got replaced with this
</Layout>
```

The Layout renders once. Only the Outlet slot changes as you navigate.
