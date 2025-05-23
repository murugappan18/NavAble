const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role check
      if (roles.length && !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient rights" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = auth;