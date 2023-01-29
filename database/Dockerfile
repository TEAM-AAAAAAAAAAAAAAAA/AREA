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

EXPOSE 4000