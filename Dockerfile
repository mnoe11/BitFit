FROM ubuntu:14.04

ENV DEBIAN_FRONTEND noninteractive

# Prepares for MongoDb installation
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list

# Ensures that apt is upt to date
RUN apt-get update

RUN apt-get install -y \
    nodejs \
    npm \
    mongodb-org

# Create the MongoDB data directory
RUN mkdir -p /data/db

# Starts the MongoDb server
RUN mongod &

COPY ./ /BitFit

RUN cd /BitFit; npm install

EXPOSE 8080

CMD mongod & nodejs /BitFit/app.js
