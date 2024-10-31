const mysql = require('mysql2');
const { sequelize } = require('../config/config')
const client = require('../util/statsD');

async function checkDatabaseConnection(){
    const startTime = Date.now();
    try {
        await sequelize.authenticate();
        console.log('Connected to database');
        return true;
    } catch (error) {
        console.error('Could not connect to database', error);
        return false;
    }finally{
        const duration = Date.now() - startTime;
        client.timing('get.health.dbcheck.duration', duration);
    }
}

module.exports = { checkDatabaseConnection };