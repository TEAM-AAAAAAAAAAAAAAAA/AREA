#!/usr/bin/env bash

cp /app/client/app-release-unsigned.apk /app/public/client.apk
npx ionic serve -p 8081
