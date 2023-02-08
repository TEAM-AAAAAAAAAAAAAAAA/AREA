# AREA Webserver (AKA WebAPI)

![ts](https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555) 
Typescript project with ExpressJS

## Setup

`yarn install`


### Environment setup

Create the following files:
> - .env/.env.dev
> - .env/.env.preprod
> - .env/.env.prod

Copy these keys and set the values for each environment in the .env files you just created:
```
ENV_NAME=
API_PORT=
POSTGRES_URL=
```

## DB Setup

> In order to communicate with the db, prisma needs to be initialized.
> you can use the justfile to do so or run each command manually.

### Using justfile
***

> You'll need to have just installed on your machine, you can download it [here](https://github.com/casey/just)
First you'll need to generate the prisma client:

#### 1. Generate prisma client

Prisma offers lots of different generators, you can find the list [here](https://www.prisma.io/docs/concepts/components/prisma-schema/generators)

In order to only use the generators that you need, you can provide a list of generators to the `prisma_generate` command.
- `joi` will generate Joi validators for your models
- `dbml` will generate a dbml file that you can use to generate a schema diagram
- `docs` will generate a documentation for your prisma API

```
cd server
just prisma_generate <joi | dbml | docs>
```

#### 2. Migrate the db

Next, you'll need to migrate the db to the latest version.
You can choose to migrate the db for a specific environment

> **Note**
> For more information on how to setup the databse, refer the [database README](../database/README.md)


```
just prisma_migrate <prod | preprod | dev>
```
> **Note**
> For more information on how to use prisma migrations, you can check the [official documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)

This will create a new migration file in the `prisma/migrations` folder and apply it to the db.

### Manually
***

#### 1. Generate prisma client

> **Warning**
> Using only the schema located in `./prisma/schema.prisma` will only generate the prisma-js client, if you want to use other generators, you'll need to modify the `./prisma/schema.prisma` file and add the generator you want to use.

```bash
npx dotenv -e .env/.<dev | preprod | prod>test -- npx prisma generate --schema=./prisma/schema.prisma
```

#### 2. Migrate the db

> **Note**
> For more information on how to setup the databse, refer the [database README](../database/README.md)

```bash
npx dotenv -e .env/.<dev | preprod | prod>test -- prisma migrate --schema=./prisma/schema.prisma --name init
```

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

# Create new services and new actions

Service example
- A service must be a class implementing IService with the @area.Service Decorator
- An action must be a method returning void within this service class. It takes all the data stored in your service and posts it to the outgoing webhook/link

```TS
import { nstring, ustring } from "../types/string";
import { area } from "../area/.area";
import { IService } from "./IService";

@area.Service
export class Example implements IService {
    constructor() { this._outgoing = null; }

    // Parse the JSON request body as you like to fill your variables
    read(data: any): void {
        this._text = data.text;
    }

    // Let this function as is
    setOutgoing(outgoing: nstring): void {
        this._outgoing = outgoing;
    }

    // Example action
@   area.Action
    postExample(): void {
        if (!this._outgoing) return;

        fetch(this._outgoing, {
            method: 'POST',
            body: JSON.stringify({example: this._text}),
            headers: {'Content-Type': 'application/json'} 
        }).then();
    }

    _text: ustring;
    _outgoing: nstring;
}
```

After creating a service you must write some transcoders inside the 'transcoders' class in order to make them compatible with the other services, here's an example
```TS
@area.Transcoder(services.Discord.name, services.Teams.name)
static discordToTeams(discord: services.Discord): services.Teams {
    var teams: services.Teams = new services.Teams();
    teams._authorName = discord._authorName;
    teams._message = discord._message;
    return teams;
}
```
It takes a service and returns another one where you copied what you needed
Btw, you need to add @area.Transcoder with the input and output services as a decorator

