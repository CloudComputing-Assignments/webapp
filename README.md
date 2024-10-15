
---


# Webapp

## Cloud Native Webapp

### Prerequisites
Before you begin, ensure you have met the following requirements:

- **Node.js** installed on your local machine ([Download Node.js](https://nodejs.org/))
- **MySQL** installed and running ([Download MySQL](https://dev.mysql.com/downloads/))

---

### Build and Deploy

To build and deploy the web application locally, follow these steps:

1. **Clone the repository** to your local machine:
    ```bash
    git clone https://github.com/CloudComputing-Assignments/webapp.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd webapp
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Set up the environment variables**:

    - Create a `.env` file in the root directory of the project.
    - Add the following environment variables:

    ```plaintext
    ENVIRONMENT=development
    DB_HOST=localhost
    DB_USER=newUser
    DB_PASSWORD=password
    DB_NAME=database
    DB_PORT=3306
    PORT=3000
    HOSTNAME=localhost
    ```

    - Replace values for `DB_USER`, `DB_NAME`, and `DB_PASSWORD` with your MySQL database credentials.

5. **Run the application**:
    ```bash
    npm start
    ```

6. **Access the web application**:

    - Open your web browser and navigate to [http://localhost:3000](http://localhost:3000) to access the web application.

---