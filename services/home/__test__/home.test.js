const createConnectionPool = require('@databases/pg');
const { sql } = require('@databases/pg');

let db;

beforeAll(() => {
  db = createConnectionPool({
    user: 'vinay',
    password: '123',
    host: 'localhost',
    database: 'xeneta',
    port: 5432,
    bigIntMode: 'bigint',
  });
});

describe('Health check api', function () {
  test('SELECT NOW()', async () => {
    expect(await db.query(sql`SELECT NOW()`)).toEqual([
      { now: expect.any(Date) },
    ]);
  });
});
