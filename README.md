# AREWAFLIX API

## Installation

```bash
# install dependencies
yarn install
```

## Running the app

### Start Docker and run the following command

```bash
# start docker
docker-compose up
```

### Migrations

<b>Database Synchronization is disabled in favour of Migrations</b>

```bash
# Use npm to run the following commands
# generate new migration
npm run migration:generate -- db/migrations/NewMigration

# run migration
npm run migration:run
```

### Running the app

### Running the email server

```
# run after docker container started

http://localhost:5000

```

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

## Test

```bash
# unit tests
yarn test

# test coverage
yarn test:cov
```

## API Documentation

```bash
# Swagger UI
http://localhost:3000/docs
```

## Stay in touch

- Author - [Marvellous Solomon](https://github.com/marvel6)
- Author - [Wisdom Dakoh](https://github.com/dakohhh)
- Website - [Arewa Flix](https://arewaflix)
