import express, { response } from "express";
import pg from "pg";

const APP = express();
const PORT = 1510;
let quizData;

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
  quizData = response.rows;
} catch (error) {
  console.log(error);
} finally {
  DATABASE.end();
}


APP.get("/", (request, response) => {
  response.send("Here");
});

APP.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is currently listening at http://localhost:${PORT}`);
});
