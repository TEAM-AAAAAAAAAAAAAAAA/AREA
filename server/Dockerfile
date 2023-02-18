FROM node:18-alpine

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Install dependencies (could be modified/extend)
COPY package.json ./

RUN yarn install

#Bundle app source
COPY ./src ./src
COPY ./prisma ./prisma
COPY ./tsconfig.json ./

#Generate Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

#Build the app
RUN yarn run build

EXPOSE 8080

CMD [ "yarn", "run", "dev" ]
