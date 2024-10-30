const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const imageRouter = require("./imageRouter");
const { authenticateUser } = require('../middleware/authenticateMiddleware');

// Set no-cache header for all responses
userRouter.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache");
  next();
});

userRouter.head("*", (req, res) => {
  res.status(405).end(); // Set status to 405 for HEAD requests
});

// Define the allowed routes
userRouter.get("/self", authenticateUser, userController.getUser);
userRouter.put("/self", authenticateUser, userController.updateUser);
userRouter.use("/self/pic", imageRouter);
userRouter.post("/", userController.createUser);

// Handle unsupported methods for defined routes
const allowedMethods = {
  "/self": ["GET", "PUT"],
  "/": ["POST"],
};

userRouter.use((req, res, next) => {
  const allowed = allowedMethods[req.path];
  if (allowed && !allowed.includes(req.method)) {
    return res.status(405).end(); // Set status to 405 and end response without body
  }
  next();
});

module.exports = userRouter;
