const path = require('path');
const request = require('supertest');
const { describe, expect, test } = require('@jest/globals');

const envPath = path.join(__dirname, '..', '..', '..', '.env');

require('dotenv-safe').config({ path: envPath });

const app = require('../../../app');

describe('Rates api: success', () => {
  test('Get /rates', async () => {
    const res = await request(app)
      .get('/rates')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-01-01',
        date_to: '2016-01-10'
      })
      .expect(200);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          day: expect.any(String),
          average_price: expect.any(Number)
        })
      ])
    );
  });

  test('Get /rates_null', async () => {
    const res = await request(app)
      .get('/rates_null')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-01-01',
        date_to: '2016-01-10'
      })
      .expect(200);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          day: expect.any(String),
          average_price: expect.any(Number || null)
        })
      ])
    );
  });

  test('Post /rates', async () => {
    const res = await request(app)
      .post('/rates')
      .send({
        origin_code: 'CNSGH',
        destination_code: 'GBSOU',
        date_from: '2020-01-01',
        date_to: '2020-01-10',
        price: '250',
        currency: 'AFN'
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          orig_code: expect.any(String),
          dest_code: expect.any(String),
          day: expect.any(String),
          price: expect.any(Number)
        })
      ])
    );
  });
});

describe('Get /rates api: With no records in response', () => {
  test('Get /rates: No records', async () => {
    const res = await request(app)
      .get('/rates')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2001-01-01',
        date_to: '2001-01-10'
      })
      .expect(200);

    expect(res.body.length).toEqual(0);
  });

  test('Get /rates_null: No records', async () => {
    const res = await request(app)
      .get('/rates_null')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2000-01-01',
        date_to: '2000-01-10'
      })
      .expect(200);

    expect(res.body.length).toEqual(0);
  });
});

describe('Get /rates api: validation check', () => {
  test('Get /rates: origin required field', async () => {
    const res = await request(app)
      .get('/rates')
      .query({
        destination: 'north_europe_main',
        date_from: '2016-01-01',
        date_to: '2016-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: Origin is required field'
    );
  });

  test('Get /rates: destination required field', async () => {
    const res = await request(app)
      .get('/rates')
      .query({
        origin: 'CNSGH',
        date_from: '2016-01-01',
        date_to: '2016-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: Destination is required field'
    );
  });

  test('Get /rates: date_from required field', async () => {
    const res = await request(app)
      .get('/rates')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_to: '2016-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateFrom is required field'
    );
  });

  test('Get /rates: date_to required field', async () => {
    const res = await request(app)
      .get('/rates')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-01-01'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateTo is required field'
    );
  });

  test('Get /rates: Invalid date format of DateFrom', async () => {
    const res = await request(app)
      .get('/rates')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-31-01',
        date_to: '2016-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateFrom must be in YYYY-MM-DD format'
    );
  });

  test('Get /rates: Invalid date format of DateTo', async () => {
    const res = await request(app)
      .get('/rates')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-01-01',
        date_to: '2016-31-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateTo must be in YYYY-MM-DD format'
    );
  });

  test('Get /rates: DateTo smaller than DateFrom', async () => {
    const res = await request(app)
      .get('/rates')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-01-01',
        date_to: '2015-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateFrom must be less than DateTo'
    );
  });
});

describe('Get /rates_null api: validation check', () => {
  test('Get /rates_null: origin required field', async () => {
    const res = await request(app)
      .get('/rates_null')
      .query({
        destination: 'north_europe_main',
        date_from: '2016-01-01',
        date_to: '2016-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: Origin is required field'
    );
  });

  test('Get /rates_null: destination required field', async () => {
    const res = await request(app)
      .get('/rates_null')
      .query({
        origin: 'CNSGH',
        date_from: '2016-01-01',
        date_to: '2016-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: Destination is required field'
    );
  });

  test('Get /rates_null: date_from required field', async () => {
    const res = await request(app)
      .get('/rates_null')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_to: '2016-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateFrom is required field'
    );
  });

  test('Get /rates_null: date_to required field', async () => {
    const res = await request(app)
      .get('/rates_null')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-01-01'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateTo is required field'
    );
  });

  test('Get /rates_null: Invalid date format of DateFrom', async () => {
    const res = await request(app)
      .get('/rates_null')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-31-01',
        date_to: '2016-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateFrom must be in YYYY-MM-DD format'
    );
  });

  test('Get /rates_null: Invalid date format of DateTo', async () => {
    const res = await request(app)
      .get('/rates_null')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-01-01',
        date_to: '2016-31-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateTo must be in YYYY-MM-DD format'
    );
  });

  test('Get /rates_null: DateTo smaller than DateFrom', async () => {
    const res = await request(app)
      .get('/rates_null')
      .query({
        origin: 'CNSGH',
        destination: 'north_europe_main',
        date_from: '2016-01-01',
        date_to: '2015-01-10'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateFrom must be less than DateTo'
    );
  });
});

describe('Post /rates api: validation check', () => {
  test('Post /rates origin_code required field', async () => {
    const res = await request(app)
      .post('/rates')
      .send({
        destination_code: 'GBSOU',
        date_from: '2020-01-01',
        date_to: '2020-01-10',
        price: '250',
        currency: 'AFN'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: Origin is required field'
    );
  });

  test('Post /rates destination_code required field', async () => {
    const res = await request(app)
      .post('/rates')
      .send({
        origin_code: 'CNSGH',
        date_from: '2020-01-01',
        date_to: '2020-01-10',
        price: '250',
        currency: 'AFN'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: Destination is required field'
    );
  });

  test('Post /rates date_from required field', async () => {
    const res = await request(app)
      .post('/rates')
      .send({
        origin_code: 'CNSGH',
        destination_code: 'GBSOU',
        date_to: '2020-01-10',
        price: '250',
        currency: 'AFN'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateFrom is required field'
    );
  });

  test('Post /rates date_to required field', async () => {
    const res = await request(app)
      .post('/rates')
      .send({
        origin_code: 'CNSGH',
        destination_code: 'GBSOU',
        date_from: '2020-01-01',
        price: '250',
        currency: 'AFN'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: DateTo is required field'
    );
  });

  test('Post /rates price required field', async () => {
    const res = await request(app)
      .post('/rates')
      .send({
        origin_code: 'CNSGH',
        destination_code: 'GBSOU',
        date_from: '2020-01-01',
        date_to: '2020-01-10',
        currency: 'AFN'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: Price is required field'
    );
  });

  test('Post /rates currency required field', async () => {
    const res = await request(app)
      .post('/rates')
      .send({
        origin_code: 'CNSGH',
        destination_code: 'GBSOU',
        date_from: '2020-01-01',
        date_to: '2020-01-10',
        price: '250'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'Validation error: Currency is required field'
    );
  });

  test('Post /rates Invalid currency code', async () => {
    const res = await request(app)
      .post('/rates')
      .send({
        origin_code: 'CNSGH',
        destination_code: 'GBSOU',
        date_from: '2020-01-01',
        date_to: '2020-01-10',
        price: '250',
        currency: 'ABCD'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual(
      'ABCD is not supported or Invalid currency'
    );
  });

  test('Post /rates Low price', async () => {
    const res = await request(app)
      .post('/rates')
      .send({
        origin_code: 'CNSGH',
        destination_code: 'GBSOU',
        date_from: '2020-01-01',
        date_to: '2020-01-10',
        price: '1',
        currency: 'USD'
      })
      .expect(400);

    expect(res.body.error).toEqual(true);
    expect(res.body.statusCode).toEqual(400);
    expect(res.body.message).toEqual('1 USD is very low price.');
  });
});
