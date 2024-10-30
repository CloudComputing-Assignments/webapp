const { getUser } = require("../services/userService");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Authorization header is required" });
    }

    const user = await getUser(authHeader);
    req.user = user; // Attach authenticated user to the request
    next();
  } catch (error) {
    res.status(401).send();
  }
};

module.exports = { authenticateUser };
