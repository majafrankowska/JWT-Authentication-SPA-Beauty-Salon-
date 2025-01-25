const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository"); 
const SessionRepository = require("../repositories/SessionRepository");

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access token is required or has an invalid format" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) reject(err);
        else resolve(decodedToken);
      });
    });

    const user = await UserRepository.getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = await SessionRepository.getSessionByToken(token);
    if (!session) {
      return res.status(403).json({ message: "Session not found or token expired" });
    }

    const currentTime = new Date();
    if (new Date(session.token_expires_at) < currentTime) {
      await SessionRepository.deleteSessionByUserId(user.id);
      return res.status(403).json({ message: "Token expired, please login again" });
    }

    req.user = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,  
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired, please login again" });
    }
    console.error("Authentication error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = authenticateToken;