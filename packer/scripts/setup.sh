#!/bin/bash

# Update packages
echo "Updating package list..."
sudo apt-get update -y

# Install Node.js
echo "Installing Node.js..."
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash - 
sudo apt-get install -y nodejs unzip

# Install MySQL
echo "Installing MySQL..."
sudo apt-get install -y mysql-server

# Start MySQL and enable it to start on boot
sudo systemctl start mysql
sudo systemctl enable mysql

# Check MySQL status
if sudo systemctl status mysql | grep -q "running"; then
    echo "MySQL is running."
else
    echo "MySQL failed to start."
    exit 1
fi


sudo mysql --execute="CREATE DATABASE ${DB_DATABASE};"
if [ $? -eq 0 ]; then
    echo "Database ${DB_DATABASE} created successfully."
else
    echo "Failed to create database ${DB_DATABASE}."
    exit 1
fi

sudo mysql --execute="CREATE USER '${DB_USERNAME}'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';"
if [ $? -eq 0 ]; then
    echo "User ${DB_USERNAME} created successfully."
else
    echo "Failed to create user ${DB_USERNAME}."
    exit 1
fi

sudo mysql --execute="GRANT ALL PRIVILEGES ON ${DB_DATABASE}.* TO '${DB_USERNAME}'@'localhost';"
if [ $? -eq 0 ]; then
    echo "Privileges granted to user ${DB_USERNAME} on database ${DB_DATABASE}."
else
    echo "Failed to grant privileges to user ${DB_USERNAME}."
    exit 1
fi

sudo mysql --execute="FLUSH PRIVILEGES;"
if [ $? -eq 0 ]; then
    echo "Privileges flushed successfully."
else
    echo "Failed to flush privileges."
    exit 1
fi

