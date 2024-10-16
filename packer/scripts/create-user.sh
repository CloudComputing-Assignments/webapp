#!/bin/bash

# Create a system group and user
sudo groupadd csye6225
sudo useradd -r -g csye6225 -s /usr/sbin/nologin csye6225

echo "User csye6225 has been created."
