# Courses API service

API for online management application. Its main purpose is to make efficient interaction between students and instructors in college during the period of submission of assignments and for getting appropriate feedback from instructors.

## Pre-reqs
- Docker installed locally. [Debian](https://docs.docker.com/engine/install/debian/) or [Ubuntu](https://docs.docker.com/engine/install/ubuntu/) or other distributive
- Docker Compose installed locally. [installation link](https://docs.docker.com/compose/install/).

## Installation

- Setup environment variables

```sh
cp .env.sample .env
```

- Install dependencies

```bash
$ npm install
```

## Running the app

```bash
# development first run
$ docker-compose up
$ npm run start

# next runs
$ npm run start:dev

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


