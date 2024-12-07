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
  const RANDOM_COUNTRY = getRandomCountry();
  const CAPITAL_CITY = getCapitalOfRandomCountry(RANDOM_COUNTRY);
  const SHUFFLED_CAPITAL_CITIES = shuffleArrayOfRandomCapitals(CAPITAL_CITY);
  const FLAG = getFlag(RANDOM_COUNTRY);
  response.render("index.ejs", {
    country: RANDOM_COUNTRY,
    options: SHUFFLED_CAPITAL_CITIES,
    FLAG,
  });
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

function generateArrayOfRandomCapitals(capital) {
  let randomArray = [];
  for (let i = 0; i < 2; i++) {
    const CAPITAL =
      countriesData[Math.floor(Math.random() * countriesData.length)].capital;
    if (CAPITAL === "" || CAPITAL === " ") continue;
    if (randomArray.includes(CAPITAL)) continue;

    randomArray.push(CAPITAL);
  }
  if (randomArray.length < 2) {
    generateArrayOfRandomCapitals(capital);
  }
  randomArray.push(capital);
  return randomArray;
}

function shuffleArrayOfRandomCapitals(capital) {
  const RANDOM_CAPITALS = generateArrayOfRandomCapitals(capital);
  const NUM_OF_CAPITALS = RANDOM_CAPITALS.length;
  const SHUFFLE_INDEX = [];
  while (SHUFFLE_INDEX.length < NUM_OF_CAPITALS) {
    const INDEX = Math.floor(Math.random() * NUM_OF_CAPITALS);
    if (!SHUFFLE_INDEX.includes(INDEX)) {
      SHUFFLE_INDEX.push(INDEX);
    }
  }
  const SHUFFLED_CAPITALS = [];
  for (const INDEX of SHUFFLE_INDEX) {
    SHUFFLED_CAPITALS.push(RANDOM_CAPITALS[INDEX]);
  }
  return SHUFFLED_CAPITALS;
}

function getFlag(country) {
  const COUNTRY_INDEX = flags.findIndex((flag) => flag.name === country);
  const FLAG = flags[COUNTRY_INDEX].flag;
  return FLAG;
}

APP.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is currently listening at http://localhost:${PORT}`);
});
