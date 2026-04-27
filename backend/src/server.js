import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./db.js";
import { productRouter } from "./routes/products.js";

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/products", productRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

await connectDb();

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
