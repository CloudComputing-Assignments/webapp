const mysql = require('mysql2');
const { sequelize } = require('../config/config')

async function checkDatabaseConnection(){
    try {
        await sequelize.authenticate();
        console.log('Connected to database');
        return true;
    } catch (error) {
        console.error('Could not connect to database', error);
        return false;
    }
}

module.exports = { checkDatabaseConnection };