FROM androidsdk/android-31

USER root

SHELL [ "/bin/bash", "-c" ]

RUN apt update  \
    && apt upgrade -y  \
    && curl -o - https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash \
    && . /root/.nvm/nvm.sh  \
    && nvm install 17

WORKDIR /app

COPY . .

CMD [ "./build-apk.sh" ]
