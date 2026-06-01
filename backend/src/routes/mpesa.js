const express = require("express");

const { requireAuth } = require("../middleware/auth");
const { contributeToVault } = require("../services/blockchain");
const { db } = require("../services/firebase");
const { requestStkPush } = require("../services/mpesa");
const { sendPushNotification } = require("../services/notifications");

const router = express.Router();

function readCallbackMetadata(items = []) {
  return items.reduce((acc, item) => {
    acc[item.Name] = item.Value;
    return acc;
  }, {});
}

router.post("/stkpush", requireAuth, async (req, res, next) => {
  try {
    const { phoneNumber, amount, groupId, contractGroupId, notificationToken } = req.body;

    if (!phoneNumber || !amount || contractGroupId === undefined) {
      return res.status(400).json({
        error: "phoneNumber, amount, and contractGroupId are required",
      });
    }

    const stk = await requestStkPush({ phoneNumber, amount });
    const contribution = {
      amount: Number(amount),
      phoneNumber,
      groupId: groupId || null,
      contractGroupId: Number(contractGroupId),
      walletAddress: req.user.walletAddress,
      notificationToken: notificationToken || null,
      merchantRequestId: stk.MerchantRequestID,
      checkoutRequestId: stk.CheckoutRequestID,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await db.collection("mpesaContributions").doc(stk.CheckoutRequestID).set(contribution);

    res.status(202).json({
      checkoutRequestId: stk.CheckoutRequestID,
      merchantRequestId: stk.MerchantRequestID,
      customerMessage: stk.CustomerMessage,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/callback", async (req, res, next) => {
  try {
    const callback = req.body.Body?.stkCallback;
    if (!callback) {
      return res.status(400).json({ error: "Invalid M-Pesa callback payload" });
    }

    const checkoutRequestId = callback.CheckoutRequestID;
    const contributionRef = db.collection("mpesaContributions").doc(checkoutRequestId);
    const contributionDoc = await contributionRef.get();

    if (!contributionDoc.exists) {
      await contributionRef.set({
        checkoutRequestId,
        status: "unknown",
        callback,
        updatedAt: new Date().toISOString(),
      });
      return res.json({ received: true });
    }

    const contribution = contributionDoc.data();
    const metadata = readCallbackMetadata(callback.CallbackMetadata?.Item);

    if (callback.ResultCode !== 0) {
      await contributionRef.update({
        status: "failed",
        resultCode: callback.ResultCode,
        resultDescription: callback.ResultDesc,
        updatedAt: new Date().toISOString(),
      });
      return res.json({ received: true });
    }

    const chain = await contributeToVault({
      groupId: contribution.contractGroupId,
      amountKes: metadata.Amount || contribution.amount,
    });

    const update = {
      status: "confirmed",
      mpesaReceiptNumber: metadata.MpesaReceiptNumber || null,
      phoneNumber: metadata.PhoneNumber || contribution.phoneNumber,
      transactionDate: metadata.TransactionDate || null,
      chainTxHash: chain.hash,
      updatedAt: new Date().toISOString(),
    };

    await contributionRef.update(update);

    if (contribution.notificationToken) {
      await sendPushNotification({
      token: contribution.notificationToken,
      title: "Contribution confirmed",
        body: `Your KES ${metadata.Amount || contribution.amount} PayLoop contribution is on-chain.`,
      data: { checkoutRequestId, chainTxHash: chain.hash },
      });
    }

    res.json({ received: true, chainTxHash: chain.hash });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
