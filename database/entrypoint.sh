#!/bin/sh

npx prisma migrate deploy

if [[ "$ENV_NAME" == "dev" ]]; then
  npx prisma db seed
fi

exec "$@"