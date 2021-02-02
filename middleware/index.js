/**
 * Just to pass isNull flag to api code,
 * So we can call /rates and /rates_null using single service function
 */
exports.rateNullRequest = (req, _res, next) => {
  req.isNull = true;
  return next();
};
