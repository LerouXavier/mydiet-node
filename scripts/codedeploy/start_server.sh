#!/bin/bash

pm2 update

# install NPM dependencies
cd /usr/mydiet-user-node/
npm install

sudo chown -hR ec2-user:adm /usr/mydiet-user-node/

# sudo chmod 755 /usr/mydiet-user-node/server.js # optional
# this will restart app/server on instance reboot
crontab -l | { cat; echo "@reboot pm2 start /usr/mydiet-user-node/server.js --name \"mydiet-user-node\""; } | crontab -
pm2 stop mydiet-user-node

# actually start the server
pm2 start /usr/mydiet-user-node/server.js --name "mydiet-user-node"