const createHttpError = require('http-errors');

const dbQueries = require('./query');
const db = require('../../utils/db');
const utils = require('../../utils/utils');

exports.insertRates = async (req, res) => {
  const {
    origin_code,
    destination_code,
    date_from,
    date_to,
    currency = 'USD',
  } = req.body;
  let { price } = req.body;
  let rates;

  if (currency !== 'USD') {
    rates = await utils.getLatestExchangeCurrencyRates();

    if (rates[currency])
      price = Math.ceil(Number.parseFloat(price / rates[currency]));
    else
      throw createHttpError(
        400,
        `${currency} is not supported or Invalid currency`
      );
  }

  if (price <= 1) throw createHttpError(400, `${price} USD is very low price.`);

  const query = dbQueries.insertRates(
    origin_code,
    destination_code,
    price,
    date_from,
    date_to
  );

  const { rows } = await db.query(query);
  return res.status(201).send(rows);
};

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
