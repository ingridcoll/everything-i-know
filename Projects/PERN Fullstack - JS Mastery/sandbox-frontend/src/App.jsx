import React, { useEffect, useState } from "react";
import Pokemon from "../components/Pokemon";

const App = () => {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    fetch("api/v1/pokemon")
      .then((res) => res.json())
      .then((data) => setPokemon(data))
      .catch((err) => console.log(err));
  }, []);

  console.log(pokemon);

  return (
    <div>
      <h1>Pokemon API v1</h1>
      <ul>
        {pokemon.map((pokemon) => (
          <Pokemon key={pokemon.id} {...pokemon} />
        ))}
      </ul>
    </div>
  );
};

export default App;
