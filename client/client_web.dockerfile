WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install

COPY . /app

WORKDIR /app

RUN yarn install && yarn cache clean

CMD [ "yarn", "start" ]
