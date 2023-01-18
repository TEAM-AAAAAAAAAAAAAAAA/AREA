# AREA DB

![](https://badgen.net/badge/icon/graphql?icon=graphql&label) Typescript project with GraphQL and Apollo

## ENV

### .env files

```bash
❯ tree -a .env/
.env/
├── .dev.env
├── .preprod.env
└── .prod.env
```

### .env variables

.dev.env example:
```bash
ENV_NAME = <dev|preprod|prod>
APOLLO_HOST = localhost
APOLLO_PORT = 4000
MONGODB_URI= mongodb://localhost:27017/
```

## Prisma

### Generate prisma schema in prisma client (only for seeding the db)
```bash
npx prisma generate --schema=./prisma/schema.prisma
```

> Requires a mongodb instance to be running on localhost
