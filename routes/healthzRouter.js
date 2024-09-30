const express = require('express');
const healthzRouter = express.Router();
const healthzController = require('../controllers/healthzController');
const { rejectPayloadMiddleware, rejectNonGetMiddleware } = require('../middleware/middleware');

console.log('healthzRouter.js is running');
healthzRouter.get('/', rejectPayloadMiddleware, rejectNonGetMiddleware, healthzController.healthz);


module.exports = healthzRouter;