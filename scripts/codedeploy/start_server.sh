#!/bin/bash


cd /usr/my-diet-node
npm install

# sudo chmod 755 /usr/my-diet-node/server.js # optional
# this will restart app/server on instance reboot
crontab -l | { cat; echo "@reboot pm2 start /usr/my-diet-node/server.js -i 0 --name \"my-diet-node\""; } | crontab -
pm2 stop my-diet-node

# actually start the server
pm2 start /usr/my-diet-node/server.js -i 0 --name "my-diet-node"