import express from "express";

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/v1/pokemon/:id", (req, res) => {
  let pokemonId = req.params.id;
  res.send(`You added Pokemon #${pokemonId}`);
});

app.use();

app.listen(3000, console.log(`Server is running on http://localhost:${port}`));
