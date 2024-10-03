const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController')

// Set no-cache header for all responses
userRouter.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  userRouter.head('*', (req, res) => {
    res.status(405).end();  // Set status to 405 for HEAD requests
});
  
  // Define the allowed routes
  userRouter.get('/self', userController.getUser);
  userRouter.put('/self', userController.updateUser);
  userRouter.post('/', userController.createUser);
  
  // Handle unsupported methods for defined routes
  const allowedMethods = {
    '/self': ['GET', 'PUT'],
    '/': ['POST']
  };
  
  userRouter.use((req, res, next) => {
    const allowed = allowedMethods[req.path];
    if (allowed && !allowed.includes(req.method)) {
      return res.status(405).end();  // Set status to 405 and end response without body
    }
    next();
  });
  
  // Handle undefined routes (return 405 for any others)
  userRouter.all('*', (req, res) => {
    res.status(405).end();  // Set status to 405 and end response without body
  });

module.exports = userRouter;