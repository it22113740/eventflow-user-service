const mongoose = require("mongoose");

const getHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ["disconnected", "connected", "connecting", "disconnecting"][dbState] || "unknown";

  res.status(200).json({
    status: "ok",
    service: process.env.SERVICE_NAME,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
  });
};

module.exports = { getHealth };
