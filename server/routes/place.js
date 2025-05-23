const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Place = require("../models/place");
const auth = require("../middleware/auth");

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Submit a new place
router.post("/places", auth(["user", "admin"]), upload.array("photos", 5), async (req, res) => {
  const { name, type, position, description, facilities } = req.body;

  try {
    const newPlace = new Place({
      name,
      type,
      description,
      position: JSON.parse(position), // if sent as JSON string
      facilities: facilities ? JSON.parse(facilities) : [],
      photos: req.files.map((file) => `/uploads/${file.filename}`),
    });

    await newPlace.save();
    res.status(201).json({ message: "Place submitted for approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all places (for logged-in users to see approved + pending)
router.get("/places/all", auth(["user", "admin"]), async (req, res) => {
  try {
    const places = await Place.find(); // fetch all places
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all approved places
router.get("/places/approved", async (req, res) => {
  try {
    const places = await Place.find({ status: "approved" });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all pending places (admin only)
router.get("/places/pending", auth(["admin"]), async (req, res) => {
  try {
    const places = await Place.find({ status: "pending" });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all rejected places (admin only)
router.get("/places/rejected", auth(["admin"]), async (req, res) => {
  try {
    const places = await Place.find({ status: "rejected" });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Approve a place (admin only)
router.put("/places/:id/approve", auth(["admin"]), async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json({ message: "Place approved", place });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/places/:id/reject", auth(["admin"]), async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!place) return res.status(404).json({ message: "Place not found" });
    res.json({ message: "Place Rejected", place });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;