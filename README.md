# AREA Global building of the project

### Environment setup

At the root of the repository you must create .env file containing the following properties : 

``` yaml
POSTGRES_PASSWORD=
POSTGRES_USER=
POSTGRES_URL=
POSTGRES_DB=
```
These variable will be used by the docker-compose to build different services used in the Area project like the db for example:

```yaml
    db:
      image: postgres
      restart: always
      environment:
        POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        POSTGRES_USER: ${POSTGRES_USER}
        POSTGRES_DB: ${POSTGRES_DB}
```
It is a way to give the user the possibility to customise his own variables and to configure them according to his environment

### Building Area Project

The entire build of the application and its internal services will be applied by the docker-compose up command :

```shell
docker-compose up -d
```
_(-d used to run containers in background)_

For the convenience and accessibility of the project's developers, a bash script `start-docker.sh` is available to launch the containers independently, or all together if needed (note that this script is aimed at developers and therefore the background launch functionality is disabled to access the various errors and logs of the different services)
For more information on this script I will let you launch the help flag of this one 
```shell
./start-docker.sh help
```

### Area Project service details

The area project contains 5 services : 

- `server` It is the heart of the application and is used to make the different services interact
- `client_web` It is used to give the user the possibility to have a graphical view and the opportunity to manually configure the interactions between the services of his choice
- `client_mobile` More or less the same as the client_web but on mobile, thus adding access possibilities for the user
- `Apollo` It allows you to make personalized queries, very practical when you need very precise information from the database
- `Postgres` Used as the main server storage location for all services and users

Note that each part of the project contains its own environment variables distributed in each corresponding folder in an .env folder containing at least :
- `.env.dev`
- `.env.preprod`
- `.env.prod`

### Developer tools

There is also a small bash script `tool-docker.sh` available for the developers of the project, allowing the complete or focused cleaning of the different resources stored in docker, for more information I will let you enter the command
```shell
./tool-docker.sh help
```