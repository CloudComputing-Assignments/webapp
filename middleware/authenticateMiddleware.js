const { getUser } = require("../services/userService");
const logger = require('../util/logger')

const authenticateUser = async (req, res, next) => {
  try {
    logger.info('Authenticating user');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.warn('Authorization header missing');
      return res
        .status(401)
        .json({ error: "Authorization header is required" });
    }

    const user = await getUser(authHeader);
    if (user) {
      logger.info('User authenticated successfully', { userId: user.id });
      req.user = user; // Attach authenticated user to the request
      next();
    } else {
      logger.warn('User authentication failed - invalid token');
      res.status(401).send();
    }
  } catch (error) {
    logger.error('Error during user authentication', { error });
    res.status(401).send();
  }
};

module.exports = { authenticateUser };
