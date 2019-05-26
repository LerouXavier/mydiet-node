#!/bin/bash

# update yum just in case
yum update -y

# get node into yum
curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -

# install node and npm in one line
yum install -y nodejs

# install pm2 to restart node app
npm i -g pm2@3.5.0

# install NPM dependencies
cd /usr/my-diet-node
npm install