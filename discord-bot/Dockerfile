#FROM node:18
#
#SHELL ["/bin/bash", "-c"]
#
## Set temp directory
#WORKDIR /app
#
## Move package.json
#COPY package.json yarn.lock ./
#
## Install dependencies
#RUN yarn install
#
## Move source files
#COPY src ./src
#COPY tsconfig.json   .
#COPY ./prisma ./prisma
#
## Apply the prisma schema to the current db
#RUN npx prisma generate --schema=./prisma/schema.prisma
#
#RUN npx tsc
#
#CMD ["yarn", "run", "prod"]

FROM node:18 as build-runner

SHELL ["/bin/bash", "-c"]

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Move source files
COPY src ./src
COPY tsconfig.json   .
COPY ./prisma ./prisma

# Apply the prisma schema to the current db
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN yarn run build

FROM node:18 as prod-runner

WORKDIR /app

COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/yarn.lock /app/yarn.lock

RUN yarn install --omit=dev

COPY --from=build-runner /tmp/app/prisma /app/prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

COPY --from=build-runner /tmp/app/tsconfig.json /app/tsconfig.json
COPY --from=build-runner /tmp/app/dist /app/dist

CMD ["yarn", "run", "prod"]

