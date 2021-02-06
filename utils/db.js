/**
 * Database connection and pooling
 */
const Pool = require('pg-pool');
const config = require('config');

const pg = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  max: 20 // max pool size
});

module.exports = pg;
