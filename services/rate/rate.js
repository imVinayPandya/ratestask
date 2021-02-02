const db = require('../../utils/db');
const dbQueries = require('./query');

exports.getAveragePrice = async (req, res) => {
  const { origin, destination, date_from, date_to } = req.query;
  const isNull = !!req.isNull;

  const query = dbQueries.getAveragePrice(
    origin,
    destination,
    date_from,
    date_to,
    isNull
  );
  const { rows } = await db.query(query);

  return res.status(200).send(rows);
};
