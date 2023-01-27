FROM node:14-alpine

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy source files
COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

#Install dependencies (could be modified/extend)
RUN yarn install

#Build the app
RUN yarn run build

RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npx dotenv -e .env/.dev.env -- npx prisma migrate dev --name db_init --schema=../database/prisma/schema.prisma

RUN npm run dev

EXPOSE 4000

#set environement variables
ENV $(cat .env | xargs)

CMD [ "yarn", "start" ]