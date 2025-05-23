const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/admin", auth(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

router.get("/user", auth(["user", "admin"]), (req, res) => {
  res.json({ message: "Welcome User!" });
});

module.exports = router;