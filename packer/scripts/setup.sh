#!/bin/bash

# Update packages
echo "Updating package list..."
sudo apt-get update -y

# Install Node.js
echo "Installing Node.js..."
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash - 
sudo apt-get install -y nodejs unzip