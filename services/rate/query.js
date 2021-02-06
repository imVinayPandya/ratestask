/**
 * DB queries for rate controller
 */
const sql = require('sql-template-strings');

/**
 * Insert series of rates in database using DateFrom to DateTo
 * @param {String} originCode Origin Port Code
 * @param {String} destinationCode Destination Port Code
 * @param {Number} price Price of shipping
 * @param {String} dateFrom From Date in YYYY-MM-DD format
 * @param {String} dateTo To Date in YYYY-MM-DD format
 */
exports.insertRates = (originCode, destinationCode, price, dateFrom, dateTo) =>
  // @NOTE: Are we storing duplicate values in this table for same day and same price?
  // if no then we can create unique key and we can user UPSERT instead of INSERT
  // we can use orig_code, dest_code, day for creating unique key
  sql`
    insert into prices(orig_code, dest_code, price, day)
    -- generate series of rows date_from to date_to
    select ${originCode}, ${destinationCode}, ${price}, series.day
    from (
      select
        to_char(day::DATE, 'YYYY-MM-DD')::DATE as day
      from 
        generate_series(${dateFrom}::DATE , ${dateTo}::DATE, interval '1 day') day
    ) series
    returning *
  `;

/**
 *
 * @param {String} origin Origin code or Origin slug
 * @param {String} destination Destination code or Destination slug
 * @param {String} dateFrom From Date in YYYY-MM-DD format
 * @param {String} dateTo To Date in YYYY-MM-DD format
 * @param {Boolean} is_null If you want to return null for days on which there are less than 3 prices in total for average_price
 */
exports.getAveragePrice = (
  origin,
  destination,
  dateFrom,
  dateTo,
  is_null = false
) => {
  // ref: https://www.postgresqltutorial.com/postgresql-recursive-query/
  // ref: https://dzone.com/articles/understanding-recursive-queries-in-postgres

  // check if user want to return null for average_price
  const dynamic_query = is_null
    ? sql`case
            when count(*) < 3 then null
            else round(avg(p.price), 2)::FLOAT
        end as average_price`
    : sql`round(avg(p.price), 2)::FLOAT as average_price`;

  const query = sql`
        select 
            TO_CHAR(p."day"::DATE, 'YYYY-MM-DD') as day,
        `;
  // We can not use string interpolation for dynamic_query
  // bcz sql-template-strings consider string interpolation as a bind parameter for sql query
  query.append(dynamic_query);
  query.append(sql`
        from prices p 
            where 
            (p.orig_code = ${origin} or p.orig_code in (select get_all_port(${origin})))
            and (p.dest_code  = ${destination} or p.dest_code in (select get_all_port(${destination})))
            and p."day"  >= ${dateFrom}
            and p."day" < ${dateTo}
        group by p."day"
        order by p."day" asc;  
    `);

  return query;
};
