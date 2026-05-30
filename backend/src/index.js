const express = require("express");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "payloop-backend" });
});

app.listen(port, () => {
  console.log(`PayLoop backend listening on port ${port}`);
});
