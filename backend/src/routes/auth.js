const express = require("express");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");

const { db } = require("../services/firebase");

const router = express.Router();

function loginMessage(address, nonce) {
  return `PayLoop login\nWallet: ${address}\nNonce: ${nonce}`;
}

router.post("/nonce", async (req, res, next) => {
  try {
    const address = ethers.getAddress(req.body.address || "");
    const nonce = ethers.hexlify(ethers.randomBytes(16));
    await db.collection("walletNonces").doc(address).set({
      nonce,
      createdAt: new Date().toISOString(),
    });

    res.json({ address, nonce, message: loginMessage(address, nonce) });
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const address = ethers.getAddress(req.body.address || "");
    const signature = req.body.signature;
    const nonceDoc = await db.collection("walletNonces").doc(address).get();

    if (!nonceDoc.exists) {
      return res.status(400).json({ error: "Request a nonce first" });
    }

    const message = loginMessage(address, nonceDoc.data().nonce);
    const recovered = ethers.verifyMessage(message, signature);

    if (ethers.getAddress(recovered) !== address) {
      return res.status(401).json({ error: "Signature does not match wallet" });
    }

    await db.collection("walletNonces").doc(address).delete();

    const token = jwt.sign({ walletAddress: address }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.json({ token, walletAddress: address });
  } catch (err) {
    err.status = err.status || 400;
    next(err);
  }
});

module.exports = router;
