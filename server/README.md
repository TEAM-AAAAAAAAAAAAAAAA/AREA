# AREA Webserver (AKA WebAPI)

![ts](https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555) 
Typescript project with ExpressJS

## Setup

`yarn install`


### Environment setup

Create the following files:
> .env/.dev.env

> .env/.preprod.env

> .env/.prod.env

Copy these keys and set the values for each environment in the .env files you just created:
```
ENV_NAME=
API_PORT=
```

### DB Setup

#### Env setup

Append these keys and set the values for each environment in the .env files you just created:
```
POSTGRES_URI=
```

In order to communicate with the db, prisma needs to be initialized.
you can use the justfile to do so or run each command manually.

#### Using justfile
> You'll need to have just installed on your machine, you can download it [here](https://github.com/casey/just)
First you'll need to generate the prisma client:

##### 1. Generate prisma client

Prisma offers lots of different generators, you can find the list [here](https://www.prisma.io/docs/concepts/components/prisma-schema/generators)

In order to only use the generators that you need, you can provide a list of generators to the `prisma_generate` command.
- `joi` will generate Joi validators for your models
- `dbml` will generate a dbml file that you can use to generate a schema diagram
- `docs` will generate a documentation for your prisma API

```
cd server
just prisma_generate <joi | dbml | docs>
```

##### 2. Migrate the db

Next, you'll need to migrate the db to the latest version.
You can choose to migrate the db for a specific environment

```
just prisma_migrate <prod | preprod | dev>
```

This will create a new migration file in the `prisma/migrations` folder and apply it to the db.

## Run the project

### DEV environment:
`yarn run dev`


### PROD or PREPROD environments

Build: `yarn run build`

Then, depending on the environment you want to build

Prod env: `yarn run prod`

Preprod env: `yarn run preprod`

### How to create a service in 4 SIMPLE steps

1- Create your service class with the members you need

2- Implement the read() method that will parse the incoming json and fill its members

3- Implement the push() method that will format and push your data to the webhook specified in parameter

4- Create transcoders for every service you want to be compatible
