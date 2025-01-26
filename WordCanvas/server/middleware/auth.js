const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is provided, return error
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token using JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object (optional)
    req.user = decoded.user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid or expired, return error
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = verifyToken;
