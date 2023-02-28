FROM node:18

USER root

RUN apt update -y && apt install default-jdk -y

WORKDIR /app

COPY . .

RUN npm i

RUN npm i -g @ionic/cli  \
    && ionic build  \
    && ionic capacitor add android  \
    && cd android  \
    && ionic capacitor sync  \
    && ./gradlew assembleDebug


#CMD [ "/bin/cp", "-r", "android", "/app/client"]
