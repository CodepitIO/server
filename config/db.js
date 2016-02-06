'use strict';

var url = `mongodb://${process.env.DB_PORT_27017_TCP_ADDR}:${process.env.DB_PORT_27017_TCP_PORT}/maratonando`;
console.log(url);
module.exports = {
  'url' : url,
};
