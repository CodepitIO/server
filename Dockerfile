# Set the base image to Ubuntu
FROM    ubuntu:20.04

# File Author / Maintainer
LABEL org.opencontainers.image.authors="Gustavo Stor"

# Install Node.js and other dependencies
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get -y install curl build-essential vim

RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get -y install nodejs

RUN npm install -g grunt-cli nodemon bower node-gyp

# Define working directory
RUN mkdir -p /www
WORKDIR /www

CMD npm run dev
