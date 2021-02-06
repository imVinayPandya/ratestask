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

     `docker build -t ratestask:db -f ./docker/Dockerfile.DB ./docker/`

   - To run PostgreSQL database

     `docker run -p 0.0.0.0:5432:5432 --name ratestask-db ratestask:db`

   - Access database using psql

     `PGPASSWORD=ratestask psql -h 127.0.0.1 -U postgres`

     ### OR

     `docker exec -e PGPASSWORD=ratestask -it ratestask-db psql -U postgres`

2. create `.env` file and add values for enviroment variables
   - `cp .env.example .env`
   - don't forget to change its values, if needed.

Note: - for currency exachange OPEN_EXCH_API_ENDPOINT and OPEN_EXCH_APP_ID values I am pushing to github, so you no need to create your own app id.

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
