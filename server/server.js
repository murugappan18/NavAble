const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const placeRoutes = require("./routes/place");

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", placeRoutes);
app.use("/uploads", express.static("uploads")); // Serve static files from the uploads directory

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));