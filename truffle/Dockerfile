FROM node:8.0.0-alpine

RUN apk add -t .gyp --no-cache git python g++ make \
    && npm install -g truffle \
    && apk del .gyp

RUN mkdir -p /dapp
WORKDIR /dapp

ENTRYPOINT []
