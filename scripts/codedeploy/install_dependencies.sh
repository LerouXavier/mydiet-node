#!/bin/bash

# update yum just in case
yum update -y

# get node into yum
curl --silent --location https://rpm.nodesource.com/setup_10.x | bash -

# install node and npm in one line
yum install -y nodejs

# install make sure the latest pm2 is running
npm i -g pm2@latest

iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3030