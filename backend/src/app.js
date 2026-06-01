require("dotenv").config();

const cors = require("cors");
const express = require("express");

const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/groups");
const ipfsRoutes = require("./routes/ipfs");
const mpesaRoutes = require("./routes/mpesa");
const notificationRoutes = require("./routes/notifications");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "payloop-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/ipfs", ipfsRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

module.exports = app;
