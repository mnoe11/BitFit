FROM ubuntu:14.04

ENV DEBIAN_FRONTEND noninteractive

# Ensures that apt is upt to date
RUN apt-get update

RUN apt-get install -y \
    nodejs \
    npm

COPY ./ /BitFit

RUN cd /BitFit; npm install

EXPOSE 8080

CMD nodejs /BitFit/app.js
