#!/usr/bin/env bash

set -ex

. /root/.nvm/nvm.sh
nvm use 17
npm i
npm i -g @ionic/cli
ionic build
ionic capacitor add android
ionic capacitor sync
cd android
./gradlew assembleRelease
ls app/build/outputs/apk/release/app-release-unsigned.apk
