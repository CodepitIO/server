'use strict'

const express = require('express'),
  http = require('http')

const services = require('./src/services/services'),
  routes = require('./src/routes')

let app = express()
routes.configure(app)

let port = process.env.PORT || 3000
let server = require('http').Server(app)
server.listen(port)
services.setup(server)

console.log('Codepit web online')
