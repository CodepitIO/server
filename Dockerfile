# Set the base image to Ubuntu
FROM    ubuntu:14.04

# File Author / Maintainer
MAINTAINER Gustavo Stor

# Install Node.js and other dependencies
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash - && \
    apt-get -y install nodejs git-all build-essential

# Provides cached layer for node_modules
# ADD paickage.json /tmp/package.json
# RUN cd /tmp && npm install
# RUN mkdir -p /site && cp -a /tmp/node_modules /site/

# Define working directory
RUN mkdir -p /site
WORKDIR /site
# ADD . /site

#RUN cd /site && \
#    npm run bower && \
#    npm run grunt

CMD /bin/bash
