const express = require('express');
const imageRouter = express.Router();
const imageController = require('../controllers/imageController');
const { authenticateUser } = require('../middleware/authenticateMiddleware');
const multer = require('multer');
const upload = multer({ dest: __dirname + '/uploads/' });

// Set no-cache header for all responses
imageRouter.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Define routes for image handling
imageRouter.get("/", authenticateUser, imageController.findImage);
imageRouter.post("/", authenticateUser, upload.single('file'), imageController.postImage);
imageRouter.delete("/", authenticateUser, imageController.destroyImage);

// Handle HEAD requests
imageRouter.head('/', (req, res) => {
    res.status(405).end(); // Acknowledge the HEAD request
});

// Middleware to handle unsupported methods for defined routes
imageRouter.use((req, res, next) => {
    if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
        console.error(`Method ${req.method} not allowed on ${req.path}`);
        return res.status(405).send();
    }
    next();
});

module.exports = imageRouter;
