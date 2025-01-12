const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

const pokemonsFilePath = path.join(__dirname, "pokemons.json");
const pokemons = JSON.parse(fs.readFileSync(pokemonsFilePath, "utf-8"));

app.use(express.json());

//add cors middleware
app.use(cors("*"));

app.get("/pokemons", (req, res) => {
  const { type, search } = req.query;

  let filteredPokemons = pokemons;

  if (type) {
    filteredPokemons =
      type === "All"
        ? filteredPokemons
        : filteredPokemons.filter((pokemon) =>
            pokemon.type.some((t) => t.toLowerCase() === type.toLowerCase())
          );
  }

  if (search) {
    filteredPokemons = filteredPokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
        String(pokemon.id).includes(search)
    );
  }

  res.json(filteredPokemons);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
