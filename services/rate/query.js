const sql = require('sql-template-strings');

exports.getAveragePrice = (
  origin,
  destination,
  dateFrom,
  dateTo,
  is_null = false
) => {
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
        from price2 p 
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
