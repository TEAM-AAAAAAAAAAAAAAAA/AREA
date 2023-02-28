FROM node:14-alpine

#Create app directory
WORKDIR /app

#Install dependencies (could be modified/extend)
COPY package.json /app/
RUN npm i

#Bundle app source
COPY . ./app

CMD [ "npm", "build" ]
