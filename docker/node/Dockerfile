FROM node:18-alpine

RUN apk update

RUN apk add --no-cache make git

RUN npm i -g

RUN npm install -g @nestjs/cli

RUN npm install -g @angular/cli

WORKDIR /www
