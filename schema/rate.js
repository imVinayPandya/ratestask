const Joi = require('joi').extend(require('@joi/date'));

const getRateSchema = {
  origin: Joi.string().trim().required().messages({
    'string.base': 'Origin must be string',
    'any.required': 'Origin is required field',
  }),
  destination: Joi.string().trim().required().messages({
    'string.base': 'Destination must be string',
    'any.required': 'Destination is required field',
  }),
  date_from: Joi.date()
    .format('YYYY-MM-DD')
    .less(Joi.ref('date_to'))
    .raw()
    .required()
    .messages({
      'any.required': 'DateFrom is required field',
      'date.base': 'DateFrom must be string',
      'date.less': 'DateFrom must be less than DateTo',
      'date.format': 'DateFrom must be in YYYY-MM-DD format',
    }),
  date_to: Joi.date().format('YYYY-MM-DD').raw().required().messages({
    'any.required': 'DateTo is required field',
    'date.base': 'DateTo must be string',
    'date.format': 'DateTo must be in YYYY-MM-DD format',
  }),
};

const postRateSchema = {
  origin_code: getRateSchema.origin,
  destination_code: getRateSchema.destination,
  date_from: getRateSchema.date_from,
  date_to: getRateSchema.date_to,
  price: Joi.number().required().messages({
    'any.required': 'Price is required field',
    'any.base': 'Price must be number',
  }),
  currency: Joi.string().required().messages({
    'any.base': 'Currency must be string',
    'any.required': 'Currency is required field',
  }),
};

module.exports = {
  getRateSchema,
  postRateSchema,
};
