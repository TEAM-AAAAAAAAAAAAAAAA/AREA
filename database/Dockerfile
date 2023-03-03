FROM node:14-alpine as build-runner

#Create app directory
WORKDIR /tmp/app

# copy source files
COPY package.json yarn.lock ./

#Install dependencies (could be modified/extend)
RUN yarn install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY entrypoint.sh ./

RUN npx prisma generate

#Build the app
RUN yarn run build

FROM node:14-alpine as prod-runner

WORKDIR /app

COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/yarn.lock /app/yarn.lock
COPY --from=build-runner /tmp/app/src /app/src

#Install dependencies (could be modified/extend)
RUN yarn install --omit=dev

COPY --from=build-runner /tmp/app/prisma /app/prisma
COPY --from=build-runner /tmp/app/tsconfig.json /app/tsconfig.json

RUN npx prisma generate

COPY --from=build-runner /tmp/app/entrypoint.sh /app/entrypoint.sh
COPY --from=build-runner /tmp/app/dist /app/dist

EXPOSE 4000

ENTRYPOINT [ "./entrypoint.sh" ]

CMD [ "yarn", "run", "prod" ]