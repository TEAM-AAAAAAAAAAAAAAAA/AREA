# AREA DB

> ![](https://badgen.net/badge/icon/graphql?icon=graphql&label)
> ![](https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555)

> Typescript project with GraphQL and Apollo

## ENV

```
ENV_NAME = dev
APOLLO_HOST = localhost
APOLLO_PORT = 4000
POSTGRESQL_URI = postgresql://postgres:azer@localhost:5432/postgres
```

## POSTGRESQL

### SETUP

All the setup commands can be launched from the justfile at the root of the `database` folder

```bash
just -l
Available recipes:
    prisma_migrate env # Migrate database schema to desired DB with specified environment (possible values are: prod, preprod and dev)
    prisma_schema_gen  # Generate a new prisma schema that will be used inside the code
    prisma_studio env  # Launch and open prisma studio in specified environment (possible values are: prod, preprod and dev)
```

1. `prisma_schema_gen <prod|preprod|dev>`

2. `prisma_migrate <prod|preprod|dev>`


### .env files

```bash
❯ tree -a .env/
.env/
├── .env.dev
├── .env.preprod
└── .env.prod
```

### .env variables

.env.dev example:
```bash
ENV_NAME = dev
APOLLO_HOST = localhost
APOLLO_PORT = 4000
POSTGRES_URL = postgresql://postgres:azer@localhost:5432/postgres
```

## Prisma

### Generate prisma schema in prisma client (only for seeding the db)
```bash
npx prisma generate --schema=./prisma/schema.prisma
```

