ARG ARCH=
FROM ${ARCH}node:17 AS builder
WORKDIR /server
RUN apt-get update -y && apt-get upgrade -y && \
    apt-get install -y build-essential vim
RUN npm install -g grunt-cli nodemon bower node-gyp
ADD . /server
RUN npm install && bower install --allow-root
RUN  cd /server && grunt prod

FROM ${ARCH}node:17-alpine
LABEL org.opencontainers.image.authors="Gustavo Stor"
WORKDIR /server
COPY --from=builder /server /server
CMD node main.js