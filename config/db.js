'use strict';

var url = `mongodb://${process.env.DB_ADDR_PORT}/maratonando`;
console.log(url);
module.exports = {
  'url' : url,
};
