FROM node:14-alpine

#Create app directory
RUN mkdir /app/
WORKDIR /app/

#Install dependencies (could be modified/extend)
COPY package*.json ./
RUN yarn install

#Bundle app source
COPY . .

#Build the app
RUN npx ionic capacitor add android
