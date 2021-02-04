const router = require('express-promise-router')();

const middleware = require('./middleware/index');
const validation = require('./middleware/validation');

const homeRouter = require('./services/home/home');
const rateRouter = require('./services/rate/rate');

/** Home routes */
router.get('/', homeRouter.homeRoute);
router.get('/health-check', homeRouter.healthCheckRoute);

/** Rate routes */
router.get('/rates', validation.getRates, rateRouter.getAveragePrice);
router.get(
  '/rates_null',
  [validation.getRates, middleware.rateNullRequest],
  rateRouter.getAveragePrice
);
router.post('/rates', validation.postRate, rateRouter.insertRates);

module.exports = router;
