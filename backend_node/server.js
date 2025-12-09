import express from "express";
const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(4000, () => console.log("Node backend OK : 4000"));
