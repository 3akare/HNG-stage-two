const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Authentication failed",
        statusCode: 400,
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Invalid token",
      statusCode: 400,
    });
  }
};
