require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { ValidationError, NotFoundError } = require("./errors.js");
const { db } = require("./db");
const { eq } = require("drizzle-orm");
const { pokemon } = require("./db/schema");

// Initialize Express variables
const app = express();
const port = process.env.PORT;
const router = express.Router();

// Express Middleware
app.use(helmet());
app.use(express.json()); // Parse responses in JSON format

// Log each hit to the API
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  next();
});

app.use("/api/v1/pokemon", router); // Add prefix to request and route to a defined path

// Route definitions
// Get all Pokemon
router.get("/", async (req, res) => {
  try {
    const allPokemon = await db.select().from(pokemon);
    console.log(pokemon.name.notNull);
    res.json(allPokemon);
  } catch (err) {
    res.status(500).send("Database error!");
  }
});

// Get 1 Pokemon
router.get("/:id", async (req, res) => {
  try {
    const selectedPokemon = await findSelectedPokemon(req.params.id);
    return res.json(selectedPokemon);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send(error.message);
    }
  }
});

// Add 1 Pokemon
router.post("/", async (req, res) => {
  const requestBody = req.body;
  try {
    validateRequestKeys(requestBody);
    validateRequiredKeys(requestBody);

    const [newPokemon] = await db
      .insert(pokemon)
      .values(requestBody)
      .returning();

    res.status(201).json(newPokemon);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).json(`ERROR: ${error}`);
    }
  }
});

// Update 1 Pokemon
router.put("/:id", async (req, res) => {
  try {
    const pokemonId = req.params.id;
    const selectedPokemon = await findSelectedPokemon(pokemonId);
    const requestBody = req.body;

    validateRequestKeys(requestBody);

    const [updatedPokemon] = await db
      .update(pokemon)
      .set(requestBody)
      .where(eq(pokemon.id, Number(pokemonId)))
      .returning();

    res.status(200).json(updatedPokemon);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send(error.message);
    } else if (error instanceof ValidationError) {
      res.status(400).send(error.message);
    } else {
      res.status(500).json(`ERROR: ${error}`);
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const pokemonId = req.params.id;
    const selectedPokemon = await findSelectedPokemon(pokemonId);

    const [deletedPokemon] = await db
      .delete(pokemon)
      .where(eq(pokemon.id, pokemonId))
      .returning();

    res.status(200).json(deletedPokemon);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("Something went wrong!");
    }
  }
});

// Open up port (local server)
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`),
);

// Helper functions
async function findSelectedPokemon(pokemonId) {
  const selectedPokemon = await db
    .select()
    .from(pokemon)
    .where(eq(pokemon.id, Number(pokemonId)));

  if (Array.isArray(selectedPokemon) && selectedPokemon.length > 0) {
    return selectedPokemon;
  } else {
    throw new NotFoundError(`Pokemon with ID #${pokemonId} not found.`);
  }
}

function validateRequestKeys(requestBody) {
  if (Object.keys(requestBody).length > 0) {
    for (const key in requestBody) {
      if (Object.keys(pokemon).includes(key)) {
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

function validateRequiredKeys(requestBody) {
  for (const key of Object.keys(pokemon)) {
    const isRequired =
      pokemon[key].notNull && key != "id" && key != "createdAt";
    const isEmpty =
      typeof requestBody[key] == "string" && requestBody[key].length === 0;
    const isMissing = !(key in requestBody);
    if (isRequired && (isMissing || isEmpty)) {
      throw new ValidationError(
        `${key} is a required key, please provide a value.`,
      );
    }
  }
  return true;
}
