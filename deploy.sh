#!/bin/bash
set -e

BUILD_ARGS=""

if [ "$1" = "--no-cache" ]; then
    BUILD_ARGS="--no-cache"
fi

git pull
docker compose build $BUILD_ARGS
docker compose up -d --force-recreate
docker image prune -f
echo "Deployment complete"
