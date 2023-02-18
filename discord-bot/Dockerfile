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

# Install dependencies
RUN yarn install --omit=dev

# Move build files
COPY --from=build-runner /tmp/app/dist /app/dist

# Start bot
CMD [ "yarn", "run", "prod" ]