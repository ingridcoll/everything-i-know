import express from "express";
import helmet from "helmet";
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
app.use(helmet());

app.use(express.json()); // Parse responses in JSON format

// Log each hit to the API
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  // After request is done, also log response headers (to test for helmet)
  res.on("finish", () => {
    console.log(
      `[${timestamp}] RESPONSE HEADERS: ${res.statusCode}`,
      res.getHeaders(),
    );
  });

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
