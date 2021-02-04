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
  ...getRateSchema,
  price: Joi.number().required().messages({
    'number.required': 'Price is required field',
    'number.base': 'Price must be number',
  }),
  currency: Joi.string().optional().messages({
    'string.base': 'Currency must be string',
  }),
};

module.exports = {
  getRateSchema,
  postRateSchema,
};
