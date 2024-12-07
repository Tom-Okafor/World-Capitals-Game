import exp from "constants";
import express, { response } from "express";
import pg from "pg";

const APP = express();
const PORT = 1510;
APP.use(express.static("/public"));

let countriesData;
let flags;

const { Client } = pg;
const DATABASE = new Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "51017991",
  port: 5432,
});

await DATABASE.connect();
try {
  let response = await DATABASE.query("SELECT * FROM capitals ORDER BY id ASC");
  let nextResponse = await DATABASE.query(
    "SELECT * FROM flags ORDER BY id ASC"
  );
  countriesData = response.rows;
  flags = nextResponse.rows;
} catch (error) {
  console.log(error);
} finally {
  DATABASE.end();
}

APP.get("/", (request, response) => {
  response.render("index.ejs");
});

function getRandomCountry() {
  const NUM_OF_COUNTRIES = countriesData.length;
  const RANDOM_INDEX_VALUE = Math.floor(Math.random() * NUM_OF_COUNTRIES);
  return countriesData[RANDOM_INDEX_VALUE].country;
}

function getCapitalOfRandomCountry(randomCountry) {
  const INDEX = countriesData.findIndex(
    (country) => country.country === randomCountry
  );
  return countriesData[INDEX].capital;
}

function generateArrayOfRandomCapitals() {
  const RANDOM_ARRAY = [];
  for (let i = 0; i < 2; i++) {
    RANDOM_ARRAY.push(
      countriesData[Math.floor(Math.random() * countriesData.length)].capital
    );
  }
  RANDOM_ARRAY.push(getCapitalOfRandomCountry(getRandomCountry()));
  return RANDOM_ARRAY;
}

function shuffleArrayOfRandomCapitals() {
  const RANDOM_ARRAY = generateArrayOfRandomCapitals();
  const SHUFFLED_ARRAY = [];
  function runShuffleLoop(iteration) {
    for (let i = 0; i < iteration; i++) {
      const RANDOM_INDEX = Math.floor(Math.random() * RANDOM_ARRAY.length);
      const NEW_SHUFFLED_ITEM = RANDOM_ARRAY[RANDOM_INDEX];
      if (SHUFFLED_ARRAY.includes(NEW_SHUFFLED_ITEM)) {
        continue;
      } else SHUFFLED_ARRAY.push(NEW_SHUFFLED_ITEM);
    }
    if (SHUFFLED_ARRAY.length < RANDOM_ARRAY.length) {
      let newIteration = RANDOM_ARRAY.length - SHUFFLED_ARRAY.length;
      runShuffleLoop(newIteration);
    }
  }
  runShuffleLoop(RANDOM_ARRAY.length);
  return SHUFFLED_ARRAY;
}
console.log(shuffleArrayOfRandomCapitals());
console.log(
  `Country: ${getRandomCountry()} and capital: ${getCapitalOfRandomCountry(
    getRandomCountry()
  )}`
);

APP.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is currently listening at http://localhost:${PORT}`);
});
