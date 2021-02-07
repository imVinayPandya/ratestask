/**
 * This is file is just to create DB function
 * bcz I want to avoid manual steps for basic setup
 */
const pRetry = require('p-retry');
const db = require('../utils/db');
const logger = require('../utils/logger');

const createDbIndexes = async () => {
  const query = `
    CREATE INDEX IF NOT EXISTS ports_parent_slug_idx ON public.ports (parent_slug);

    CREATE INDEX IF NOT EXISTS prices_orig_code_idx ON public.prices (orig_code);
    CREATE INDEX IF NOT EXISTS prices_dest_code_idx ON public.prices (dest_code);
    CREATE INDEX IF NOT EXISTS prices_day_idx ON public.prices ("day");

    CREATE INDEX IF NOT EXISTS regions_parent_slug_idx ON public.regions (parent_slug);
    `;
  return db.query(query).catch(error => {
    logger.error(`Error while creating database index`);
    throw error;
  });
};

const getAllPortDbFunc = async () => {
  const db_function = `
    create or replace function get_all_port (value text) 
    returns table(_code text) as $$
        begin
            RETURN QUERY

            with recursive recursive_port_codes as (
                -- non recursive term
                select 
                    r.slug, 
                    r.parent_slug 
                from
                    regions r
                where 
                    slug = $1
                union
                -- recursive term
                select
                    r2.slug,
                    r2.parent_slug
                from 
                    regions r2
                inner join recursive_port_codes p on
                    p.slug = r2.parent_slug 			
            ), all_ports as (
                select code from ports where parent_slug in (select distinct slug from recursive_port_codes)
            )
                
            select * from all_ports;
        END;
    $$ LANGUAGE plpgsql;`;
  return db.query(db_function).catch(error => {
    logger.error(`Error while creating db function 'get_all_port'`);
    throw error;
  });
};

const dbInit = async () => {
  logger.info('Creating DB indexes........');
  await createDbIndexes();
  logger.info('Creating DB function........');
  await getAllPortDbFunc();
};

const onFailedAttempt = error =>
  logger.warn(
    `DBInit() Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
  );

(async () => {
  // if there is any error while running dbInit() script, we will retry to run it for 15 times/seconds.
  // possible gotcha for docker-compose: ref https://docs.docker.com/compose/startup-order/
  await pRetry(dbInit, { onFailedAttempt, retries: 15 });
  logger.info('dbInit() success');
})();
