const got = require('got');
const config = require('config');

exports.getLatestExchangeCurrencyRates = async () => {
  const endpoint = `${config.openExchangeRates.apiEndpoint}/latest.json?app_id=${config.openExchangeRates.appId}`;
  const { rates } = await got(endpoint).json();
  return rates;
};
