FROM node:14-alpine

ARG ENV_NAME

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# RUN chown -R daemon:daemon /usr/src/app

# USER daemon

# copy source files
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY .env/.${ENV_NAME}.env .env/.${ENV_NAME}.env

#Install dependencies (could be modified/extend)
RUN yarn install

#Build the app
RUN yarn run build

RUN npx prisma generate --schema=./prisma/schema.prisma

RUN yarn run dbinit:$ENV_NAME

EXPOSE 4000

CMD [ "yarn", "start" ]

RUN rm -rf .env/