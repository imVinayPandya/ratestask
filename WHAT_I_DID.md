I have created api solution while keeping production ready app in my mind.

- API validation
- Error handling
- DB Performance Tuning
- Dockerization for production
- Lint
- Logger
- Integration Test cases
- Code comments
- separation of concerns
- Raw query instead of ORM
- Git hook for checking Linting
- Dynamic configuration using .env and config.js
- Easy to migrate any service into Microservice

## DB Performance Tuning

- Created Index for following tables

  1. prices: day, dest_code, orig_code
  2. ports: parent_slug
  3. regiond: parent_slug

  This was the query performance improvments, before and after indexing.

```
-------------------------------------------------------------
|    Records        |    Before          |       After      |
-------------------------------------------------------------
|       10          |     11-15ms        |      8-10ms      |
-------------------------------------------------------------
|       20          |     13-17ms        |     11-16ms      |
-------------------------------------------------------------
```

Queries for creating indexes

```
CREATE INDEX ports_parent_slug_idx ON public.ports (parent_slug);


CREATE INDEX prices_orig_code_idx ON public.prices (orig_code);
CREATE INDEX prices_dest_code_idx ON public.prices (dest_code);
CREATE INDEX prices_day_idx ON public.prices ("day");


CREATE INDEX regions_parent_slug_idx ON public.regions (parent_slug);
```
