FROM node:17 AS builder
WORKDIR /www
RUN apt-get update -y && apt-get upgrade -y && \
    apt-get install -y build-essential vim
RUN npm install -g grunt-cli nodemon bower node-gyp
ADD . /www
RUN npm install && bower install --allow-root
RUN  cd /www && grunt prod

FROM node:17-alpine
LABEL org.opencontainers.image.authors="Gustavo Stor"
WORKDIR /www
COPY --from=builder /www /www
CMD node main.js