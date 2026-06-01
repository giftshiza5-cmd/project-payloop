const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (_err) {
    return res.status(401).json({ error: "Invalid bearer token" });
  }
}

module.exports = { requireAuth };
