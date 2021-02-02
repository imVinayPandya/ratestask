const router = require('express-promise-router')();

const middleware = require('./middleware/index');

const homeRouter = require('./services/home/home');
const rateRouter = require('./services/rate/rate');

/** Home routes */
router.get('/', homeRouter.homeRoute);
router.get('/health-check', homeRouter.healthCheckRoute);

/** Rate routes */
router.get('/rates', rateRouter.getAveragePrice);
router.get(
  '/rates_null',
  middleware.rateNullRequest,
  rateRouter.getAveragePrice
);

module.exports = router;
