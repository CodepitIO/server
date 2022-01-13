"use strict";

const express = require("express");
const http = require("http");

const Dbs = require("./src/services/dbs");
const Queue = require("./src/services/queue");
const Routes = require("./src/routes");

let app = express();
Routes.configure(app);
let port = 3000;
let server = require("http").Server(app);
server.listen(port);

console.log("Codepit web online");
