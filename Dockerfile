# Set the base image to Ubuntu
FROM    ubuntu:14.04

# File Author / Maintainer
MAINTAINER Gustavo Stor

# Install Node.js and other dependencies
RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash - && \
    apt-get -y install nodejs git-all build-essential vim

RUN npm install -g grunt-cli nodemon bower pm2 forever

ENV wd www

# Define working directory
RUN mkdir -p /${wd}
WORKDIR /${wd}
ADD . /${wd}

RUN g++ /${wd}/cpp/matchProblems.cpp -o /${wd}/cpp/matchProblems --std=c++0x

CMD /bin/bash
