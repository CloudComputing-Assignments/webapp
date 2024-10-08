# webapp

Cloud Native Webapp
Prerequisites
Before you begin, ensure you have met the following requirements:

Node.js installed on your local machine (Download Node.js)
mySQL installed and running (Download mySQL)
Build and Deploy
To build and deploy the web application locally, follow these steps:

Clone the repository to your local machine:

git clone https://github.com/CloudComputing-Assignments/webapp.git
Navigate to the project directory:

cd webapp
Install dependencies:

npm install
Set up the environment variables:

Create a .env file in the root directory of the project and add the following environment variables:

ENVIRONMENT=development
DB_HOST=localhost
DB_USER=newUser
DB_PASSWORD=password
DB_NAME=database
DB_PORT=3306
PORT=3000
HOSTNAME=localhost

Replace values for DB_USER, DB_NAME and DB_PASSWORD with your mySQL database credentials.

Run the application:

npm start
Open your web browser and navigate to http://localhost:3000 to access the web application.