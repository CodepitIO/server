# Set the base image to Ubuntu
FROM    ubuntu:14.04

# File Author / Maintainer
MAINTAINER Gustavo Stor

# Install Node.js and other dependencies
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash - && \
    apt-get -y install nodejs git-all build-essential

RUN npm install -g grunt-cli nodemon bower pm2 forever

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install

# Define working directory
RUN mkdir -p /site
WORKDIR /site
ADD . /site
RUN cp -a /tmp/node_modules /site/ && rm -rf /tmp

RUN cd /site && \
    bower install --allow-root && \
    grunt all

CMD /bin/bash
