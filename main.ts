const express = require(`express`);

const http = require(`http`);

const Dbs = require(`./src/services/dbs`);
const Queue = require(`./src/services/queue`);
const Routes = require(`./src/routes`);

const app = express();
Routes.configure(app);
const port = 8080;
const server = require(`http`).Server(app);
server.listen(port);

console.log(`Server online on port ${port}`);