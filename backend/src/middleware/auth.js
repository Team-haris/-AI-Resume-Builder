const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ ok: false, message: "Access denied. No token provided." });
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts[0] !== "Bearer" || !tokenParts[1]) {
    return res.status(401).json({ ok: false, message: "Access denied. Invalid token format." });
  }

  const token = tokenParts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ai_resume_builder_jwt_secret_key_2026");
    req.user = decoded; // Attach user info (id, email)
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: "Invalid or expired token." });
  }
}

module.exports = authMiddleware;
