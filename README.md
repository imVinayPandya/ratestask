- If you are looking for "What I did in this task?", than please look into [WHAT_I_DID.md](WHAT_I_DID.md)
- Best practice says that ".env file and secret credential should not be commited to git" but i have commit .env.example file with some initial value so it will be very easy for you to run this solution.

# Setup Instructions

## Prerequisite

1. Node.js (LTS version recommended)
2. Yarn to install dependencies
3. Docker and Docker Compose (If you want to run docker containers)
4. PostgreSQL Database (You can user docker)

## How to run this project?

There are two ways to run this project

1. Using npm script
2. Using docker-compose

## 1. Run project with npm script

First open root directory of this project in terminal and follow below steps to run the project

1. You need to start database

   - To build docker image

     `docker build -t ratestask:db -f ./docker/Dockerfile.DB .`

   - To run PostgreSQL database

     `docker run -p 5432:5432 --name ratestask-db ratestask:db`

   - Access database using psql

     `PGPASSWORD=ratestask psql -h 127.0.0.1 -U postgres`

     ### OR

     `docker exec -e PGPASSWORD=ratestask -it ratestask-db psql -U postgres`

2. create `.env` file and add values for enviroment variables
   - `cp .env.example .env`
   - don't forget to change its values, if needed.

Note: for currency exachange OPEN_EXCH_API_ENDPOINT and OPEN_EXCH_APP_ID values I am pushing to github, so you no need to create your own app id.

2. After starting database, start Node.js server

   - `yarn install` to install module dependencies
   - `yarn start` to run Node.js server with nodemon

3. Now you can access api on PORT which you have defined in `.env` file
   Example: http://localhost:8000/

### 2. Run project with docker-compose

First open root directory of this project in terminal and follow below steps to run the project

1. Important point, before running docker-compose command.
   You need to update your `DB_HOST` in .env file to `ratestask-db`. Or you can remove `DB_HOST` from .env file, I have already passed `DB_HOST` env from `docker-compose.yml` file.

2. Using docker-compose you can run both Database and Api in single command.

   `docker-compose up --build`

3. Now you can access api on PORT which you have defined in `.env` file
   Example: http://localhost:8000/

## How to run test case and linting?

### GOTCHA:

- Before running test case, you have to run node js server along with database. Because my code is creating One DB function and Database indexing before starting API server. Without that function test cases will fail. I know this is not the way..... :( I want to use original db file which I got from your task repo and Latter on when you start Node.js server first thing it will do is that Create Indexes and DB function, so you can run my code with latest database file.
- Integration test required database (In future we can run test with temporary database, using postgresql's docker container)

I have written Integration Test Cases for API and Eslint, Prettier for code formatting.

You can run `yarn test`, it will run test case as well as linting.

- If you just want to run test case independently run `yarn test:int`
- If you want to run linting independently run
  - `yarn test:prettier` for prettier
  - `yarn lint` for Eslint

## CURL commands for testing api

### GET /rates_null

```sh
curl --location --request GET 'http://127.0.0.1:8000/rates_null?date_from=2016-01-01&date_to=2016-01-10&origin=CNSGH&destination=north_europe_main'

```

### GET /rates

```sh
curl --location --request GET 'http://127.0.0.1:8000/rates_null?date_from=2016-01-01&date_to=2016-01-10&origin=CNSGH&destination=north_europe_main'

```

### POST /rates

```sh
curl --location --request POST 'http://127.0.0.1:8000/rates' \
--header 'Content-Type: application/json' \
--data-raw '{
    "origin_code": "cnsgh",
    "destination_code": "gbsou",
    "date_from": "2020-01-01",
    "date_to": "2020-01-10",
    "price": "10",
    "currency": "USD"
}'
```
