const express = require("express");
const bodyParser = require("body-parser");
const router = require("./app/routes");
const env = require('dotenv');

const app = express();

env.config()
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const db = require("./app/models");
db.sequelize.sync();

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});