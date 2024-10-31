#!/bin/bash

# 1. Install the CloudWatch agent
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

# Install the downloaded package
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Clean up the downloaded .deb file
sudo rm amazon-cloudwatch-agent.deb

# 2. Move the systemd service file
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service

# 3. Move the CloudWatch config file
sudo mv /tmp/cloudwatch-config.json /opt/cloudwatch-config.json

# 4. Move the rsyslog config file
sudo mv /tmp/csye6225.conf /etc/rsyslog.d/csye6225.conf


# reload systemctl daemon
sudo systemctl daemon-reload
sudo systemctl restart rsyslog.service

# sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
#     -a fetch-config \
#     -m ec2 \
#     -c file:/opt/cloudwatch-config.json \
#     -s