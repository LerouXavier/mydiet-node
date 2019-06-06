#!/bin/bash
isExistApp=`pm2 pid mydiet-user-node`
if [[ ! -z  $isExistApp ]]; then
 pm2 stop mydiet-user-node
fi