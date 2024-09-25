require('dotenv').config();
const express = require('express');
const { healthz } = require('./controllers/healthzController');
const healthzRouter = require('./routes/healthzRouter');
const app = express();
const port = 3000;
const { rejectNonGetMiddleware, rejectPayloadMiddleware, handleSyntaxError } = require('./middleware/middleware');


// Apply middleware
app.use(express.json());
app.use(rejectNonGetMiddleware);
app.use(rejectPayloadMiddleware);

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/healthz', healthzRouter);

// Error handler for malformed JSON (or any syntax error)
app.use(handleSyntaxError);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
