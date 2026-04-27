# Everything I Know About Node.js

**Started:** _April 26th, 2026_

**Note:** This section compiles different lessons from courses and other learning resources. Most of the theory was not written by me. These are the **references** for most of the knowledge in this section:

- [Full Stack Engineering Course | Build and Deploy a Full Stack PERN Admin Dashboard in 2026 - JavaScript Mastery](https://www.youtube.com/watch?v=ek7hmv5PVV8)

## What is Node?

Node is a runtime environment for JavaScript, which makes it possible for it to run OUTSIDE of a browser (server-side). A server is nothing more than a program running indefinitely in a computer, that is listening to requests and responding to them.

When you download Node, you get:

- Node JS, the program that executes JavaScript files
- NPM, a package manager that installs libraries
- REPL (Read-Eval-Print-Loop), similar to the Python shell, you can open it up by typing `node` in a terminal. It lets you write and execute JavaScript code

Since Node does not run in a browser, all objects related to `window` and `document` will break your code. For example, running `alert()` or `prompt()` will fail.

However, Node provides a different set of tools, such as:

- File system access (`fs`)
- Network utilities
- Streams and buffers
- Events
- Built-in modules like `http`, `crypto`, `path`, and `os`

Writing programs with only Node is possibly, but you have to manually handle:

- Parsing bodies
- Handling errors
- Routing logic
- Building a middleware system

That is why higher-level frameworks exist on top of Node, like [Express](https://github.com/ingridcoll/everything-i-know/tree/main/Backend/Express.js.md), Koa, Nest, Fastify or Hono.

## Creating a server in Node

To create a local server only with Node, write:

```javascript
// /server.js
import http from "http";

const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, "Success!");
  res.end("Yay, it's live");
});

server.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`),
);
```

Then `cd` into the project's folder, and run `node server.js`. The server is live.
