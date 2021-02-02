const Pool = require('pg-pool');

const pg = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  max: 20, // max pool size
});

module.exports = pg;
