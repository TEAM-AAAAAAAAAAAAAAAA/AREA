FROM node:18-alpine as build-runner

WORKDIR /tmp/app

#Install dependencies (could be modified/extend)
COPY package.json ./

RUN yarn install

#Bundle app source
COPY ./src ./src
COPY ./prisma ./prisma
COPY ./tsconfig.json ./

#Generate Prisma Client
RUN npx prisma generate --schema=./prisma/schema.prisma

#Build the app
RUN yarn run build

FROM node:18-alpine as prod-runner

WORKDIR /app

COPY --from=build-runner /tmp/app/package.json /app/package.json

RUN yarn install --omit=dev

COPY --from=build-runner /tmp/app/prisma /app/prisma

RUN npx prisma generate --schema=./prisma/schema.prisma

COPY --from=build-runner /tmp/app/dist /app/dist

EXPOSE 8080

CMD ["yarn", "run", "prod"]

