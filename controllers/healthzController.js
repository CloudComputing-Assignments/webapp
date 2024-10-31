const healthzService = require("../services/healthzService");
const logger = require('../util/logger');
const client = require('../util/statsD');

const handleGetRequest = async (req, res) => {
  res.setHeader("Cache-control", "no-cache,no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");

  client.increment('get.health.check');

  const startTime = Date.now();

  logger.info('Health check endpoint accessed');
  if (req.method === "GET") {
    try {
      if (
        Object.keys(req.query).length > 0 ||
        req.headers["content-length"]?.length > 0 ||
        Object.keys(req.body).length > 0 ||
        Object.keys(req.params).length > 0
      ) {
        logger.warn('Bad request: unexpected query parameters, headers, body, or params in GET request');
        res.status(400).send();
        return;
      }

      logger.info('Checking database connection...');
      // Await the result of the database connection check
      const dbConnected = await healthzService.checkDatabaseConnection();

      // Check if the database connection was successful
      if (!dbConnected) {
        logger.error('Database connection failed');
        res.status(503).send(); // Return 503 if not connected
        return;
      }

      logger.info('Database connected successfully');
      res.status(200).send(); // Return 200 if connected
    } catch (err) {
      logger.error(`Error during health check: ${err.message}`);
      res.status(503).send(); // Return 503 on any error
    } finally{
      const duration = Date.now() - startTime;
      client.timing('get.health.check.duration', duration);
    }
  } else {
    logger.warn(`Method not allowed: ${req.method} request received on health check endpoint`);
    res.status(405).send(); // Return 405 if not a GET request
  }
};

module.exports = { handleGetRequest };
