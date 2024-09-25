const express = require('express');
const healthzRouter = express.Router();
const healthzController = require('../controllers/healthzController');

console.log('healthzRouter.js is running');
healthzRouter.get('/', healthzController.healthz);

module.exports = healthzRouter;