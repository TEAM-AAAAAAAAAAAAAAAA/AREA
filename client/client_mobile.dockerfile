FROM androidsdk/android-31

USER root

RUN ls

RUN apt update

RUN apt upgrade -y

# ENV NVM_DIR /root/.nvm

RUN curl -o - https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

RUN . /root/.nvm/nvm.sh && nvm install 17

WORKDIR /app

COPY . .

RUN . /root/.nvm/nvm.sh && nvm use 17

RUN . /root/.nvm/nvm.sh && npm i

RUN . /root/.nvm/nvm.sh && npm i -g @ionic/cli

RUN . /root/.nvm/nvm.sh && ionic build

RUN . /root/.nvm/nvm.sh && ionic capacitor add android

RUN . /root/.nvm/nvm.sh && ionic capacitor sync

RUN . /root/.nvm/nvm.sh && cd ./android && ./gradlew init

RUN . /root/.nvm/nvm.sh && cd ./android && ./gradlew assembleRelease --debug
