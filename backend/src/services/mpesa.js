const axios = require("axios");

const env = process.env.MPESA_ENV || "sandbox";
const baseUrl =
  env === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const { data } = await axios.get(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  return data.access_token;
}

function normalizePhone(phoneNumber) {
  const digits = String(phoneNumber).replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
}

async function requestStkPush({ phoneNumber, amount }) {
  const accessToken = await getAccessToken();
  const ts = timestamp();
  const shortcode = process.env.MPESA_SHORTCODE;
  const password = Buffer.from(`${shortcode}${process.env.MPESA_PASSKEY}${ts}`).toString("base64");

  const { data } = await axios.post(
    `${baseUrl}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: process.env.MPESA_TRANSACTION_TYPE || "CustomerPayBillOnline",
      Amount: Math.round(Number(amount)),
      PartyA: normalizePhone(phoneNumber),
      PartyB: shortcode,
      PhoneNumber: normalizePhone(phoneNumber),
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: process.env.MPESA_ACCOUNT_REFERENCE || "PayLoop",
      TransactionDesc: "PayLoop group contribution",
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return data;
}

module.exports = { requestStkPush };
