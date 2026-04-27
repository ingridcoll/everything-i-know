# Everything I Know About Express.js

**Started:** _April 26th, 2026_

**Note:** This section compiles different lessons from courses and other learning resources. Most of the theory was not written by me. These are the **references** for most of the knowledge in this section:

- [Full Stack Engineering Course | Build and Deploy a Full Stack PERN Admin Dashboard in 2026 - JavaScript Mastery](https://www.youtube.com/watch?v=ek7hmv5PVV8)

## What is Express?

Express.js is a minimal framework that sits on top of Node.js and makes handling http requests and sending responses easier.

It gives you:

- Routing
- Middleware: lets you extend behavior like adding loggers, authentication, etc.
- A cleaner request/response API

It doesn't tell you how to structure your app, where to put your files, or how to handle authorization, logging, or databases. You decide all of that. In the bigger picture, Express is the foundation that most Node.js backend tools build on top of, including NestJS. It's the HTTP layer. Everything else, your business logic, your database access, your auth, sits above it.

Express is a good choice when you need fast and flexible, for example for REST APIs, microservices, and mobile backends.

## Creating a server with Express

To create a local server with Express, write:

```javascript
// server.js
import express from "express";

const app = express();

const port = 3000;

// Add any of the HTTP methods, like app.post, app.put, or app.delete
app.get("/", (req, res) => {
  res.send("Hi");
});

// A dynamic route
app.get("/v1/pokemon/:id", (req, res) => {
  let pokemonId = req.params.id;
  res.send(`You selected Pokemon #${pokemonId}`);
});

app.listen(3000, console.log(`Server is running on http://localhost:${port}`));
```

Then, add the script `node server.js` to your `package.json` to start up the server.

You can also add routers to avoid repeating code like the pre-fix of each API route. For example, if your API starts with `/api/v1/pokemon`:

```javascript
// server.js
import express from "express";

const app = express();

const port = 3000;

const router = express.Router(); // Initialize router here

// Add any of the HTTP methods, like app.post, app.put, or app.delete
router.get("/", (req, res) => {
  res.send("Hi");
});

// A dynamic route
router.get("/:id", (req, res) => {
  // We can delete the pre-fix /api/v1/pokemon
  let pokemonId = req.params.id;
  res.send(`You selected Pokemon #${pokemonId}`);
});

app.use("/api/v1/pokemon", router); // Define API pre-fix

app.listen(3000, console.log(`Server is running on http://localhost:${port}`));
```
