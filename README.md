# Welcome to Northcoders News API

## Introduction

This API project ([https://quarki-nc-news.herokuapp.com/api/](https://quarki-nc-news.herokuapp.com/api/)) has been built for the purpose of accessing data programatically. 
This data will be accessed from the following front-end project:  ()

The API has available the following endpoints:
> * GET /api
> * GET /api/topics
> * GET /api/users
> * GET /api/articles
> * GET /api/articles/:article_id
> * PATCH /api/articles/:articles_id
> * GET /api/articles/:article_id/comments
> * POST /api/articles/:article_id/comments
> * DELETE /api/comments/:comment_id

**Note**: `GET /api/articles` endpoint accepts the following queries:
* *sortBy*, which sorts the articles by any valid column (defaults to `date`)
* *order*, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
* *topic*, which filters the articles by the topic value specified in the query

## Installation

Below are some guidelines to locally install the project on your computer.

### Initial setup

The project can be cloned running the following command: `git clone https://github.com/aasaezm/NC-Back-end-project.git`.

It can also be forked first by clicking in `Fork` on the right hand side on the top of the page.

### Minimum requirements

Minimum version of Node.js: `16.13.1`

Minimum version of Postgres: `12.9`



### Dependencies
The necessary dependencies to run the project need to be installed using npm package manager running the command: `npm install`. The following dependencies should have now been installed:

**Development dependencies**

  * express
  * dotenv
  * pg
  * pg-format

**Testing dependencies**
  * jest
  * supertest
  * jest-extended
  
### Creating .env files
Please, bear in mind that after cloning this repo you won't have access to the necessary environment variables. Therefore, in order to successfully connect locally to the two databases, two `.env` files must be created.

Within the `.env.development` and `.env.test` files you need to add `PGDATABASE=<database_name_here>` with the correct database name.
>Development database name: *nc_news*

>Test database name: *nc_news_test* 

### Seeding local database

In order to seed the databases, the following commands need to be run:
```
npm run setup-dbs
npm run seed
```
### Running tests
The following command will run the tests:

`npm test app`

**Note**: Test dependencies are assumed to have already been installed after running `npm install` when installing the development dependencies.
