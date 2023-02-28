FROM node:14-alpine

WORKDIR /app

COPY package.json /app/
RUN npm i

CMD [ "npm", "build" ]
