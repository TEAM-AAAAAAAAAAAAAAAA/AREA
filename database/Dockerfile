FROM node:14-alpine

#Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy source files
COPY package.json ./
COPY yarn.lock ./

#Install dependencies (could be modified/extend)
RUN yarn install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

COPY entrypoint.sh ./
ENTRYPOINT [ "./entrypoint.sh" ]

RUN npx prisma generate

#Build the app
RUN yarn run build

EXPOSE 4000

CMD [ "yarn", "run", "dev" ]