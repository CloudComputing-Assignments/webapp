packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "ssh_username" {
  type = string
}

variable "DB_DATABASE" {
  type = string
}

variable "DB_HOST" {
  type = string
}

variable "DB_PORT" {
  type = number
}

variable "DB_USERNAME" {
  type = string
}

variable "DB_PASSWORD" {
  type = string
}

source "amazon-ebs" "app-image" {
  ami_name      = "my-webapp-ami-{{timestamp}}"
  instance_type = var.instance_type
  region        = var.aws_region

  # Specify the exact AMI ID here
  source_ami = "ami-0866a3c8686eaeeba" # Replace with your actual AMI ID

  ssh_username = var.ssh_username

  # Specify VPC and subnet
  vpc_id    = "vpc-0f2850e40f574343c"    # Replace with your actual VPC ID
  subnet_id = "subnet-00182ea6332d20830" # Replace with your actual Subnet ID
}



build {
  sources = ["source.amazon-ebs.app-image"]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "file" {
    source      = "./webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    environment_vars = [
      "DB_DATABASE=${var.DB_DATABASE}",
      "DB_USERNAME=${var.DB_USERNAME}",
      "DB_PASSWORD=${var.DB_PASSWORD}",
      "DB_HOST=${var.DB_HOST}",
      "DB_PORT=${var.DB_PORT}",
    ]
    scripts = [
      "scripts/create-user.sh",
      "scripts/setup.sh",
      "scripts/app-setup.sh",
      "scripts/systemd.sh"
    ]
  }
}
