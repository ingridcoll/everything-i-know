const Pokemon = ({ name, type, height, evolves }) => {
  return (
    <li>
      <p>Name: {name}</p>
      <p>Type: {type}</p>
      <p>Height: {height}</p>
      <p>Evolves? {String(evolves)}</p>
    </li>
  );
};

export default Pokemon;
