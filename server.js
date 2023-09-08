const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

const path = require("path"); // Import the 'path' module

// Create an absolute path to the 'models' directory
const modelsPath = path.join(__dirname, "models");
// Import your models using the absolute path
const { User, Thought, Reaction } = require(modelsPath);

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//.use for routes
app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
