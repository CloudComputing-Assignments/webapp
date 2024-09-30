require('dotenv').config();
const express = require('express');
const { healthz } = require('./controllers/healthzController');
const healthzRouter = require('./routes/healthzRouter');
const userRouter = require('./routes/userRouter');
const app = express();
const port = 3000;
const { handleSyntaxError } = require('./middleware/middleware');
const { sequelize } = require('./config/config'); // Adjust the path as necessary

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Error creating database tables:', error);
  });

// Apply middleware
app.use(express.json());

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/healthz', healthzRouter);
app.use('/v1/user', userRouter);

// Error handler for malformed JSON (or any syntax error)
app.use(handleSyntaxError);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
