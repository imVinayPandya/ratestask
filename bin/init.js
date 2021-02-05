/**
 * This is file is just to create DB function
 * bcz I want to avoid manual steps for basic setup
 */
const db = require('../utils/db');
const logger = require('../utils/logger');

const dbInit = async () =>
  db
    .query(
      `
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
        $$ LANGUAGE plpgsql;
    `
    )
    .catch(error => {
      logger.error(`Error while creating db function 'get_all_port'`);
      logger.error(error);
      process.exit(1);
    });

(async () => {
  await dbInit().then(() => logger.info('dbInit() success'));
})();
