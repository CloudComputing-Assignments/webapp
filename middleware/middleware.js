// Middleware to reject payloads in GET requests
const rejectPayloadMiddleware = (req, res, next) => {
    if (req.method === 'GET' && Object.keys(req.body).length > 0) {
      return res.status(400).header('Cache-Control', 'no-cache').send('Bad Request: Payload not allowed');
    }
    next();
  };
  
  // Middleware to block all non-GET requests
  const rejectNonGetMiddleware = (req, res, next) => {
    if (req.method !== 'GET') {
      return res.status(405).header('Cache-Control', 'no-cache').send('Method Not Allowed');
    }
    next();
  };
  
  // Middleware to handle syntax errors (e.g., invalid JSON)
  const handleSyntaxError = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).header('Cache-Control', 'no-cache').send('Bad Request: Invalid JSON');
    }
    next();
  };
  
  // Export the middleware functions
  module.exports = {
    rejectPayloadMiddleware,
    rejectNonGetMiddleware,
    handleSyntaxError
  };
  