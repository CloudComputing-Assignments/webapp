require('dotenv').config();
const express = require('express');
const healthzRouter = require('./routes/healthzRouter');
const userRouter = require('./routes/userRouter');
const app = express();
const port = 3000;
const { handleSyntaxError } = require('./middleware/middleware');
const { sequelize } = require('./config/config'); // Adjust the path as necessary
const imageRouter = require('./routes/imageRouter');
const newRouter = require('./routes/newRouter');
const { User } = require('./model/User');


sequelize.sync({ force: false })
  .catch((error) => {
    // Handle the error (optional: rethrow it or handle appropriately)
    throw error;
  });

// Apply middleware
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/healthz', healthzRouter);
app.use('/cicd', newRouter);
app.use('/v1/user', userRouter);

// Error handler for malformed JSON (or any syntax error)
app.use(handleSyntaxError);

// Start server
const startServer = () => {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  return server;
};

if(require.main == module){
  startServer();
}

module.exports = { app, startServer };