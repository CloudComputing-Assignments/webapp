const express = require('express');
const newRouter = express.Router();
const healthzController = require('../controllers/healthzController');
const { rejectPayloadMiddleware, rejectQueryParametersMiddleware } = require('../middleware/middleware');

console.log('healthzRouter.js is running');


newRouter.all("/", healthzController.handleGetRequest);



module.exports = newRouter;