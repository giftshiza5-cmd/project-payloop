const express = require("express");

const { requireAuth } = require("../middleware/auth");
const { db } = require("../services/firebase");

const router = express.Router();

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const snapshot = await db.collection("groups").orderBy("createdAt", "desc").get();
    const groups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ groups });
  } catch (err) {
    next(err);
  }
});

router.get("/:groupId", requireAuth, async (req, res, next) => {
  try {
    const doc = await db.collection("groups").doc(req.params.groupId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ group: { id: doc.id, ...doc.data() } });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { name, photoUrl, description, contractGroupId } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const group = {
      name,
      photoUrl: photoUrl || null,
      description: description || "",
      contractGroupId: contractGroupId ?? null,
      creatorWallet: req.user.walletAddress,
      createdAt: new Date().toISOString(),
    };

    const ref = await db.collection("groups").add(group);
    res.status(201).json({ group: { id: ref.id, ...group } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
