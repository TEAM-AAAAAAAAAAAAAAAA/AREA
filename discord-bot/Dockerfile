## build runner
FROM node:lts-alpine as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json .

# Install dependencies
RUN yarn install

# Move source files
COPY src ./src
COPY tsconfig.json   .

# Build project
RUN yarn run build

## production runner
FROM node:lts-alpine as prod-runner

# Set work directory
WORKDIR /app

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json

COPY prisma/schema.prisma .

# Install dependencies
RUN yarn install --omit=dev

RUN npx prisma generate

# Move build files
COPY --from=build-runner /tmp/app/dist /app/dist

ARG BOT_TOKEN
ARG ENV_NAME
ARG API_PORT
ARG SEND_GRID_API_KEY
ARG POSTGRES_URL
ARG API_URL

ENV BOT_TOKEN = ${BOT_TOKEN}
ENV ENV_NAME = ${ENV_NAME}
ENV API_PORT = ${API_PORT}
ENV SEND_GRID_API_KEY = ${SEND_GRID_API_KEY}
ENV POSTGRES_URL = ${POSTGRES_URL}
ENV API_URL = ${API_URL}

# Start bot
CMD [ "yarn", "run", "prod" ]
