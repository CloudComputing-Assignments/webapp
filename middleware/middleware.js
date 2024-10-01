// Middleware to reject payloads in GET requests
const rejectPayloadMiddleware = (req, res, next) => {
    if (req.method === 'GET' && Object.keys(req.body).length > 0) {
      return res.status(400).header('Cache-Control', 'no-cache').send();
    }
    next();
  };
  
  // Middleware to handle syntax errors (e.g., invalid JSON)
  const handleSyntaxError = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).header('Cache-Control', 'no-cache').send();
    }
    next();
  };

  //Middleware to reject query parameters
  const rejectQueryParametersMiddleware = (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
      return res.status(400).header('Cache-Control', 'no-cache').send();
    }
    next();
};
  
  // Export the middleware functions
  module.exports = {
    rejectPayloadMiddleware,
    rejectQueryParametersMiddleware,
    handleSyntaxError
  };
  