FROM node:14-alpine

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy source files
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY prisma ./
COPY src ./
COPY .env .env/

#Install dependencies (could be modified/extend)
RUN yarn install


#Build the app
RUN yarn run build

RUN npx prisma generate --schema=./src/prisma/schema.prisma

RUN npx dotenv -e .env/.dev.env -- npx prisma migrate dev --schema=./src/prisma/schema.prisma


EXPOSE 4000
CMD [ "yarn", "start:apollo" ]