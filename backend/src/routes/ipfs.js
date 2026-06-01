const express = require("express");

const { requireAuth } = require("../middleware/auth");
const { uploadJsonToIpfs } = require("../services/ipfs");

const router = express.Router();

router.post("/receipts", requireAuth, async (req, res, next) => {
  try {
    const { receipt } = req.body;

    if (!receipt) {
      return res.status(400).json({ error: "receipt payload is required" });
    }

    const result = await uploadJsonToIpfs({
      ...receipt,
      walletAddress: req.user.walletAddress,
      storedAt: new Date().toISOString(),
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
