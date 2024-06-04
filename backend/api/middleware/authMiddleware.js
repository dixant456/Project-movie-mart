const jwt1 = require('jsonwebtoken')
const db = require('../db/db');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verifyToken(token)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(() => res.sendStatus(401));
};

function verifyToken(req, res, next) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    jwt1.verify(
      token.replace("Bearer ", ""),
      process.env.SECRET_KEY || "secretKey",
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Authentication Error" });
  }
}


module.exports = { verifyToken, authenticateToken };