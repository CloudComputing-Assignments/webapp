#!/bin/bash

echo "Starting application setup..."

# Creating the application directory and adjusting permissions
echo "Creating the application directory and adjusting permissions"
sudo mkdir -p /home/csye6225

# Copy the application files
echo "Copying the application files"
sudo cp /tmp/webapp.zip /home/csye6225/webapp.zip

# Navigate to the application directory
echo "Navigating to the application directory"
cd /home/csye6225/

# Unzip the application files
echo "Unzipping the application files"
sudo unzip webapp.zip -d .

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
sudo npm install
sudo npm uninstall bcrypt
sudo npm install bcrypt

# Create .env file in the webapp folder
echo "Creating .env file"
cat <<EOT > /home/csye6225/webapp/.env
DB_HOST=$DB_HOST
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD
DB_DATABASE=$DB_DATABASE
PORT=$DB_PORT
NODE_ENV=production
EOT

# Change ownership and permissions for the .env file
sudo chown csye6225:csye6225 /home/csye6225/webapp/.env
sudo chmod 600 /home/csye6225/webapp/.env  # Read/write only by owner

echo "Node.js application setup complete."
