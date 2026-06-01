const express = require("express");

const { requireAuth } = require("../middleware/auth");
const { sendPushNotification } = require("../services/notifications");

const router = express.Router();

router.post("/send", requireAuth, async (req, res, next) => {
  try {
    const { token, title, body, data } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ error: "token, title, and body are required" });
    }

    const messageId = await sendPushNotification({ token, title, body, data });
    res.json({ messageId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
