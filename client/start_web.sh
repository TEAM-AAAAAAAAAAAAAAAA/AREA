#!/usr/bin/env bash

cp /app/client/app-release-unsigned.apk /app/build/client.apk
npx serve -s build -l 8081