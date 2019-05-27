#!/bin/bash
isExistApp=`pm2 pid my-diet-node`
if [[ ! -z  $isExistApp ]]; then
 pm2 stop my-diet-node
fi

# isExistApp=`pgrep pm2`
# if [[ -n  $isExistApp ]]; then
#     # sudo pm2 kill
#     echo 'yo'
#     # you can remove the crontab as well
# fi