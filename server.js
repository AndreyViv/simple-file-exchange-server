const express = require('express');
const bodyParser = require('body-parser');
const router = require('./app/routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const db = require('./app/models');
db.sequelize.sync();

app.use(router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});