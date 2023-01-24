FROM node:14-alpine

#Create app directory
RUN mkdir /app/
WORKDIR /app/

#Install dependencies (could be modified/extend)
COPY package*.json ./
RUN yarn install

#Bundle app source
COPY . ./client
WORKDIR /app/client/

#Build the app
#RUN npx ionic init "AREA" --type=react
RUN npx cap add android
RUN npx cap add ios
RUN npx ionic build

#CMD [ "yarn", "start:mobile" ]