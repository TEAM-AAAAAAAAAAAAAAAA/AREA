# AREA Webserver (AKA WebAPI)

![ts](https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555) 
Typescript project with ExpressJS

### Setup

`yarn install`

##### Environment setup

Create the following files:
> .env/.dev.env

> .env/.preprod.env

> .env/.prod.env

Copy these keys and set the values for each environment in the .env files you just created:
```
ENV_NAME=
API_PORT=
```


### Run the project

##### DEV environment:
`yarn run dev`


##### PROD or PREPROD environments

Build: `yarn run build`

Then, depending on the environment you want to build

Prod env: `yarn run prod`

Preprod env: `yarn run preprod`

### How to create a service in 4 SIMPLE steps

1- Create your service class with the members you need

2- Implement the read() method that will parse the incoming json and fill its members

3- Implement the push() method that will format and push your data to the webhook specified in parameter

4- Create transcoders for every service you want to be compatible
