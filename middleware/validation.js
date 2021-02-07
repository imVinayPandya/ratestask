/**
 * Joi API validation using schema
 */
const createHttpError = require('http-errors');

const { getRateSchema, postRateSchema } = require('../schema/rate');
const { joiValidation } = require('../utils/utils');

exports.getRates = async (req, _res, next) => {
  const { error, value } = joiValidation(getRateSchema, req.query);

  if (error) {
    throw createHttpError(
      400,
      `Validation error: ${error.details.map(x => x.message).join(', ')}`
    );
  } else {
    req.query = value;
    next();
  }
};

exports.postRate = async (req, _res, next) => {
  const { error, value } = joiValidation(postRateSchema, req.body);

  if (error) {
    throw createHttpError(
      400,
      `Validation error: ${error.details.map(x => x.message).join(', ')}`
    );
  } else {
    req.body = value;
    next();
  }
};
