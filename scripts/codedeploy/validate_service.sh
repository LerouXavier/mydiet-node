#!/bin/bash

result=$(curl -Is --retry 2 --retry-connrefuse --max-time 2  http://localhost:3030/api/v1/status | head -1)

if [[ "$result" =~ "HTTP/1.1 200 OK" ]]; then
    exit 0
else
    exit 1
fi