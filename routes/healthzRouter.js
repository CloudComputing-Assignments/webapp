const express = require('express');
const healthzRouter = express.Router();
const healthzController = require('../controllers/healthzController');
const { rejectPayloadMiddleware, rejectQueryParametersMiddleware } = require('../middleware/middleware');

console.log('healthzRouter.js is running');
healthzRouter.get('/', rejectPayloadMiddleware, rejectQueryParametersMiddleware, healthzController.healthz);

healthzRouter.all('/', (req, res) => {
    return res.status(405).header('Cache-Control', 'no-cache').send();
});


module.exports = healthzRouter;