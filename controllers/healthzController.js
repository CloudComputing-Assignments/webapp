const healthzService = require('../services/healthzService');

async function healthz(req, res){
    try{
        const isDatabaseConnected = await healthzService.checkDatabaseConnection();
        console.log('isDatabaseConnected: ', isDatabaseConnected);

        if(isDatabaseConnected){
            res.status(200).header('Cache-Control', 'no-cache').send();
        }else{
            console.error('Database is not connected');
            res.status(503).header('Cache-Control', 'no-cache').send();
        }
    }
    catch{
        console.error('Error checking database connection: ', error);
        res.status(503).header('Cache-Control', 'no-cache').send();
    }
}

module.exports = { healthz };