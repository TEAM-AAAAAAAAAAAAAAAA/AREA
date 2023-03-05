FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm i

CMD ["sh", "start_web.sh"]

