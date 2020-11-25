const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// turn on routes
app.use(routes);

// turn on connection to db and server
// The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables
// If it doesn't find a table, it'll create it automatically
sequelize.sync({force: false}).then(() => {
  app.listen(PORT, () => console.log(`\nServer is listening on port: ${PORT}\n`));
});