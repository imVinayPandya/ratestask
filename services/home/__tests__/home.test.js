const path = require('path');
const request = require('supertest');
const { describe, expect, test } = require('@jest/globals');

const envPath = path.join(__dirname, '..', '..', '..', '.env');

require('dotenv-safe').config({ path: envPath });

const app = require('../../../app');

describe('Health check api', () => {
  test('Server is running', async () => {
    const res = await request(app).get('/').expect(200);
    const baseApi = res.text === 'Abandon all hope, ye who enter here.';
    expect(baseApi).toBeTruthy();
  });

  test('Check database status', async () => {
    const res = await request(app).get('/health-check').expect(200);
    expect(Object.prototype.hasOwnProperty.call(res.body, 'db')).toBeTruthy();
    expect(!!res.body.db).toBeTruthy();
  });
});

// // To void jest open handle error
// afterAll(async () => {
//   await new Promise((resolve) => setTimeout(() => resolve(), 5000));
// });
