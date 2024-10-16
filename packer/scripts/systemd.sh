#!/bin/bash

echo "Starting Systemd Setup..."

# Copy systemd service file
echo "Copying the webapp service file to /etc/systemd/system/"
sudo cp /tmp/webapp.service /etc/systemd/system/webapp.service

# Reload systemd to recognize the new service
echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

# Set SELinux to disabled to access env file
echo "Disabling SELinux..."
sudo sed -i 's/^SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
sudo sed -i 's/^SELINUX=permissive/SELINUX=disabled/g' /etc/selinux/config
sudo setenforce 0

# Enable and start the service
echo "Enabling webapp service to start on boot..."
sudo systemctl enable webapp.service

echo "Starting webapp service..."
sudo systemctl start webapp.service

# Check the status of the service
echo "Checking the status of webapp service..."
sudo systemctl status webapp.service

echo "Systemd service setup complete."
