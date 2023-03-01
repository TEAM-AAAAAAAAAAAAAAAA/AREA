FROM androidsdk/android-31

RUN <<EOF
apt update
apt upgrade -y
EOF

# ENV NVM_DIR /root/.nvm

RUN <<EOF
curl -o - https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
. /root/.nvm/nvm.sh
nvm install 17
EOF

WORKDIR /app

COPY . .

RUN <<EOF
. /root/.nvm/nvm.sh
nvm use 17
npm i
npm i -g @ionic/cli
ionic build
ionic capacitor add android
ionic capacitor sync
cd android
./gradlew assembleDebug
cd ..
EOF
