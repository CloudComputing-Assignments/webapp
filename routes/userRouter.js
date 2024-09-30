const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController')

userRouter.get('/self', userController.getUser);
// userRouter.put('/self', userController.updateUser);
userRouter.post('/', userController.createUser);

module.exports = userRouter;