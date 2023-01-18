FROM node:14-alpine

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#Install dependencies (could be modified/extend)
COPY package*.json ./
RUN yarn install

#Bundle app source
COPY ../client_web .

#Build the app
RUN yarn run build

EXPOSE 8081
CMD [ "yarn", "start:web" ]