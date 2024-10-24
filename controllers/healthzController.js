const healthzService = require("../services/healthzService");

const handleGetRequest = async (req, res) => {
  res.setHeader("Cache-control", "no-cache,no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "GET") {
    try {
      if (
        Object.keys(req.query).length > 0 ||
        req.headers["content-length"]?.length > 0 ||
        Object.keys(req.body).length > 0 ||
        Object.keys(req.params).length > 0
      ) {
        res.status(400).send();
        return;
      }

      // Await the result of the database connection check
      const dbConnected = await healthzService.checkDatabaseConnection();

      // Check if the database connection was successful
      if (!dbConnected) {
        res.status(503).send(); // Return 503 if not connected
        return;
      }

      res.status(200).send(); // Return 200 if connected
    } catch (err) {
      res.status(503).send(); // Return 503 on any error
    }
  } else {
    res.status(405).send(); // Return 405 if not a GET request
  }
};

module.exports = { handleGetRequest };
