#!/usr/bin/env bash

set -e

. /root/.nvm/nvm.sh
nvm use 17
npm i
npm i -g @ionic/cli
ionic build
ionic capacitor add android
ionic capacitor sync
cd android
./gradlew assembleRelease
[ -d mkdir /app/client/public ] || mkdir -p /app/client/public
cp app/build/outputs/apk/release/app-release-unsigned.apk /app/client/public
