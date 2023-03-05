FROM node:18-alpine as build-runner

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm install

COPY public ./public

COPY src ./src

COPY capacitor.config.json ./

COPY capacitor.config.ts ./

COPY ionic.config.json ./

COPY tsconfig.json ./

RUN npm run build

FROM node:18-alpine as prod-runner

WORKDIR /app

COPY --from=build-runner /app/package.json /app/package.json

COPY --from=build-runner /app/package-lock.json /app/package-lock.json

COPY --from=build-runner /app/build /app/build

RUN npm install

CMD [ "npm", "run", "prod" ]
