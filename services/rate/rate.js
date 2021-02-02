const db = require('../../utils/db');
const dbQueries = require('./query');
const utils = require('../../utils/utils');

exports.insertRates = async (req, res) => {
  const {
    origin,
    destination,
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
      return res.status(400).send({
        success: false,
        message: `${currency} is not supported or Invalid currency`,
      });
  }

  if (price <= 1)
    return res.status(400).send({
      success: false,
      message: `${currency} to USD conversation is ${price},  Your price is very low.`,
    });

  const query = dbQueries.insertRates(
    origin,
    destination,
    price,
    date_from,
    date_to
  );
  console.log(query);
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
