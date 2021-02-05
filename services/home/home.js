const db = require('../../utils/db');

/* home page. */
exports.homeRoute = (_req, res) =>
  res.status(200).send('Abandon all hope, ye who enter here.');

/* Health check */
exports.healthCheckRoute = async (_req, res) => {
  const {
    rows: [{ now = null }]
  } = await db.query('SELECT NOW()');

  return res.status(200).send({ db: now });
};
