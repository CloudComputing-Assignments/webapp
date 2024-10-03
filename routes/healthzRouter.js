const express = require('express');
const healthzRouter = express.Router();
const healthzController = require('../controllers/healthzController');
const { rejectPayloadMiddleware, rejectQueryParametersMiddleware } = require('../middleware/middleware');

console.log('healthzRouter.js is running');


healthzRouter.all("/", healthzController.handleGetRequest);



module.exports = healthzRouter;