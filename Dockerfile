# Set the base image to Ubuntu
FROM    ubuntu:14.04

# File Author / Maintainer
MAINTAINER Gustavo Stor

# Install Node.js and other dependencies
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash - && \
    apt-get -y install nodejs git-all build-essential vim supervisor
RUN mkdir -p /var/log/supervisor

RUN npm install -g grunt-cli nodemon bower pm2 node-gyp

# Define working directory
RUN mkdir -p /www
WORKDIR /www

COPY supervisord.dev.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord"]
