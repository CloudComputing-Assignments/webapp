#!/bin/bash

# packer recommended - wait for ec2 instance to fully setup
sleep 30

echo "Starting application setup..."

# Creating the application directory and adjusting permissions
echo "Creating the application directory and adjusting permissions"
sudo mkdir -p /home/csye6225

# Copy the application files
echo "Copying the application files"
sudo cp /tmp/webapp.zip /home/csye6225/webapp.zip
if [ $? -eq 0 ]; then
    echo "Files copied successfully"
else
    echo "Failed to copy files."
    exit 1
fi

# Navigate to the application directory
echo "Navigating to the application directory"
cd /home/csye6225/
if [ $? -eq 0 ]; then
    echo "Moved to application directory successfully"
else
    echo "Failed to enter directory."
    exit 1
fi

# Unzip the application files
echo "Unzipping the application files"
sudo unzip webapp.zip -d .
if [ $? -eq 0 ]; then
    echo "Unzipped successfully"
else
    echo "Failed to unzip."
    exit 1
fi

# Change ownership and permissions for the application files
echo "Changing Permissions"
sudo chown -R csye6225:csye6225 /home/csye6225/webapp
# sudo chmod 500 /home/csye6225/webapp/index.js  # Restrict execution permission to the owner

# Remove the zip file
echo "Removing the zip file"
sudo rm -f webapp.zip

# Install Node.js dependencies for the application
echo "Installing Node.js dependencies."
cd /home/csye6225/webapp
if [ $? -eq 0 ]; then
    echo "Moved to directory successfully"
else
    echo "Failed to enter directory."
    exit 1
fi
sudo npm install
sudo npm uninstall bcrypt
sudo npm install bcrypt


# Change ownership and permissions for the .env file
# sudo chown csye6225:csye6225 /home/csye6225/webapp/.env
# sudo chmod 600 /home/csye6225/webapp/.env  # Read/write only by owner
echo "Node.js application setup complete."