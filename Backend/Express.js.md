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

## Developing an API

### Router

You can add routers to avoid repeating code like the pre-fix of each API route. For example, if your API starts with `/api/v1/pokemon`:

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

### Middleware

Express makes it easy to add middleware. Common real uses for middleware:

- Logging - record every request (method, URL, timestamp, response time)
- Authentication - verify a token before the request reaches any route
- Request parsing - `express.json()` is itself middleware that reads the raw body and puts it on req.body
- Rate limiting - count requests per IP, reject if too many
- CORS headers - tell browsers which origins are allowed to call your API
- Input sanitization - strip dangerous characters before your routes touch the data
- Compression
- Validation
- Error handling
- Performance
- Bot protection

One responsibility per middleware block. Don't bundle logging with auth with rate limiting into one function.

#### Parsing JSON

We want to be able to parse JSON requests and responses. Simply add `app.use(express.json())` when creating the server.

```javascript
// server.js
import express from "express";

const app = express();

const port = 3000;

const router = express.Router();

app.use(express.json()); // Middleware that parses JSON

const pokemon = [
  // Sample data
  {
    id: 1,
    name: "Bulbasaur",
    type: ["Grass", "Poison"],
    base: {
      HP: 45,
      Attack: 49,
      Defense: 49,
      "Sp. Attack": 65,
      "Sp. Defense": 65,
      Speed: 45,
    },
    description:
      "Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun’s rays, the seed grows progressively larger.",
    height: 0.7,
    weight: 6.9,
    evolves: true,
  },
  {
    id: 2,
    name: "Ivysaur",
    type: ["Grass", "Poison"],
    base: {
      HP: 60,
      Attack: 62,
      Defense: 63,
      "Sp. Attack": 80,
      "Sp. Defense": 80,
      Speed: 60,
    },
    description:
      "There is a bud on this Pokémon’s back. To support its weight, Ivysaur’s legs and trunk grow thick and strong. If it starts spending more time lying in the sunlight, it’s a sign that the bud will bloom into a large flower soon.",
    height: 1,
    weight: 13,
    evolves: true,
  },
  {
    id: 3,
    name: "Venusaur",
    type: ["Grass", "Poison"],
    base: {
      HP: 80,
      Attack: 82,
      Defense: 83,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      Speed: 80,
    },
    description:
      "There is a large flower on Venusaur’s back. The flower is said to take on vivid colors if it gets plenty of nutrition and sunlight. The flower’s aroma soothes the emotions of people.",
    height: 2,
    weight: 100,
    evolves: false,
  },
];

router.get("/", (req, res) => {
  res.json(pokemon); // Send the data array as response in JSON format
});

router.get("/:id", (req, res) => {
  let pokemonId = req.params.id;
  res.send(`Select Pokemon with ID #${pokemonId}`);
});

router.post("/", (req, res) => {
  res.send("Create new Pokemon");
});

router.put("/:id", (req, res) => {
  let pokemonId = req.params.id;
  res.send(`Update Pokemon with ID #${pokemonId}`);
});

app.use("/api/v1/pokemon", router);

app.listen(3000, console.log(`Server is running on http://localhost:${port}`));
```

#### Logging

Another useful form of middleware is the ability to log every time our API is hit.

```javascript
// Log each hit to the API
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  // After request is done, also log response headers
  res.on("finish", () => {
    console.log(
      `[${timestamp}] RESPONSE HEADERS: ${res.statusCode}`,
      res.getHeaders(),
    );
  });

  next();
});
```

The order of each middleware block matters. Logging should be place before the router logic, so the API hit is registered before it goes down each definition's path.

#### Helmet for secure HTTP response headers

[Helmet](https://helmetjs.github.io/#get-started) helps secure Node/Express apps. It sets HTTP response headers such as Content-Security-Policy and Strict-Transport-Security. It aims to be quick to integrate and be low maintenance afterward. To implement:

```bash
npm install helmet
```

```javascript
import helmet from "helmet";

const app = express();

app.use(helmet());
```

### Implementing simple POST, PUT and DELETE API methods

This sample API, shows how to handle errors and implement different methods:

```javascript
import express from "express";
import { ValidationError, NotFoundError } from "./errors.js";

// Initialize Express variables
const app = express();

const port = 3000;

const router = express.Router();

// Sample data
const pokemon = [
  {
    id: 1,
    name: "Bulbasaur",
    type: ["Grass", "Poison"],
    base: {
      HP: 45,
      Attack: 49,
      Defense: 49,
      "Sp. Attack": 65,
      "Sp. Defense": 65,
      Speed: 45,
    },
    description:
      "Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun’s rays, the seed grows progressively larger.",
    height: 0.7,
    weight: 6.9,
    evolves: true,
  },
  {
    id: 2,
    name: "Ivysaur",
    type: ["Grass", "Poison"],
    base: {
      HP: 60,
      Attack: 62,
      Defense: 63,
      "Sp. Attack": 80,
      "Sp. Defense": 80,
      Speed: 60,
    },
    description:
      "There is a bud on this Pokémon’s back. To support its weight, Ivysaur’s legs and trunk grow thick and strong. If it starts spending more time lying in the sunlight, it’s a sign that the bud will bloom into a large flower soon.",
    height: 1,
    weight: 13,
    evolves: true,
  },
  {
    id: 3,
    name: "Venusaur",
    type: ["Grass", "Poison"],
    base: {
      HP: 80,
      Attack: 82,
      Defense: 83,
      "Sp. Attack": 100,
      "Sp. Defense": 100,
      Speed: 80,
    },
    description:
      "There is a large flower on Venusaur’s back. The flower is said to take on vivid colors if it gets plenty of nutrition and sunlight. The flower’s aroma soothes the emotions of people.",
    height: 2,
    weight: 100,
    evolves: false,
  },
];

// Express Middleware
app.use(express.json()); // Parse responses in JSON format

// Log each hit to the API
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  next();
});

app.use("/api/v1/pokemon", router); // Add prefix to request and route to a defined path

// Route definitions
router.get("/", (req, res) => {
  res.json(pokemon);
});

router.get("/:id", (req, res) => {
  try {
    const selectedPokemon = findSelectedPokemon(req.params.id);
    return res.send(selectedPokemon);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send(error.message);
    }
  }
});

router.post("/", (req, res) => {
  const requestBody = req.body;
  try {
    validateRequestKeys(requestBody);

    const newPokemon = { id: pokemon.length + 1, ...requestBody };

    pokemon.push(newPokemon);

    res
      .status(201)
      .send(
        `Pokemon with ID #${newPokemon.id} created. ${JSON.stringify(newPokemon)}`,
      );
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Something went wrong!");
    }
  }
});

router.put("/:id", (req, res) => {
  try {
    const selectedPokemon = findSelectedPokemon(req.params.id);
    const requestBody = req.body;

    validateRequestKeys(requestBody);

    for (const key in requestBody) {
      selectedPokemon[key] = requestBody[key];
    }

    const pokemonIndex = pokemon.indexOf(selectedPokemon);

    pokemon[pokemonIndex] = selectedPokemon;

    res
      .status(200)
      .send(
        `Pokemon with ID #${selectedPokemon.id} has been updated. ${JSON.stringify(pokemon)}`,
      );
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send(error.message);
    } else if (error instanceof ValidationError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).send("Something went wrong!");
    }
  }
});

router.delete("/:id", (req, res) => {
  try {
    const selectedPokemon = findSelectedPokemon(req.params.id);

    let pokemonIndex = pokemon.indexOf(selectedPokemon);
    pokemon.splice(pokemonIndex, 1);
    console.log(pokemon);
    res.status(200).send(`Pokemon ${selectedPokemon.name} has been deleted.`);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("Something went wrong!");
    }
  }
});

// Open up port (local server)
app.listen(3000, () =>
  console.log(`Server is running on http://localhost:${port}`),
);

// Helper functions
function findSelectedPokemon(pokemonId) {
  const selectedPokemon = pokemon.find(
    (pokemon) => pokemon.id === Number(pokemonId),
  ); // Convert pokemonId from request to number (originally string) and try to find it in the array

  if (selectedPokemon) {
    return selectedPokemon;
  } else {
    throw new NotFoundError(`Pokemon with ID #${pokemonId} not found.`);
  }
}

function validateRequestKeys(requestBody) {
  if (Object.keys(requestBody).length > 0) {
    for (const key in requestBody) {
      if (Object.keys(pokemon[0]).includes(key)) {
        continue;
      } else {
        throw new ValidationError(`${key} does not match the Pokemon schema.`);
      }
    }
  } else {
    throw new ValidationError(
      "The request body is empty. Please provide a body in JSON format for POST and PUT requests.",
    );
  }

  return true;
}
```

### Adding a PostgreSQL database
