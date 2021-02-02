const got = require('got');

exports.getLatestExchangeCurrencyRates = async () => {
  // https://openexchangerates.org/api/latest.json?app_id=d1c9192f651443ba999418c91e79b86b
  const endpoint = `${process.env.OPEN_EXCH_API_URL}/latest.json?app_id=${process.env.OPEN_EXCH_APP_ID}`;

  const { rates } = await got(endpoint).json();
  return rates;
};
