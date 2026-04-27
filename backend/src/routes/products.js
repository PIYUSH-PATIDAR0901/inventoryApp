import { Router } from "express";
import { Product } from "../models/Product.js";

export const productRouter = Router();

productRouter.get("/", async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const filter = q
      ? { $text: { $search: q } }
      : {};
    const sort = q ? { score: { $meta: "textScore" } } : { updatedAt: -1 };
    const query = Product.find(filter);
    if (q) {
      query.select({ score: { $meta: "textScore" } });
    }
    const items = await query.sort(sort).lean();
    res.json(items);
  } catch (e) {
    next(e);
  }
});

productRouter.get("/:id", async (req, res, next) => {
  try {
    const doc = await Product.findById(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

productRouter.post("/", async (req, res, next) => {
  try {
    const body = normalizeBody(req.body);
    const doc = await Product.create(body);
    res.status(201).json(doc.toObject());
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "SKU already exists" });
    }
    if (e.name === "ValidationError") {
      return res.status(400).json({ message: firstValidationMessage(e) });
    }
    next(e);
  }
});

productRouter.put("/:id", async (req, res, next) => {
  try {
    const body = normalizeBody(req.body, { partial: true });
    const doc = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!doc) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(doc);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "SKU already exists" });
    }
    if (e.name === "ValidationError") {
      return res.status(400).json({ message: firstValidationMessage(e) });
    }
    next(e);
  }
});

productRouter.delete("/:id", async (req, res, next) => {
  try {
    const doc = await Product.findByIdAndDelete(req.params.id).lean();
    if (!doc) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

function normalizeBody(input, opts = {}) {
  const partial = Boolean(opts.partial);
  const name = input.name != null ? String(input.name).trim() : undefined;
  const sku = input.sku != null ? String(input.sku).trim().toUpperCase() : undefined;
  const quantity =
    input.quantity !== undefined && input.quantity !== ""
      ? Number(input.quantity)
      : undefined;
  const price =
    input.price !== undefined && input.price !== "" ? Number(input.price) : undefined;
  const category =
    input.category != null ? String(input.category).trim() : undefined;
  const description =
    input.description != null ? String(input.description).trim() : undefined;

  const out = {};
  if (!partial || name !== undefined) out.name = name;
  if (!partial || sku !== undefined) out.sku = sku;
  if (!partial || quantity !== undefined) out.quantity = quantity;
  if (!partial || price !== undefined) out.price = price;
  if (!partial || category !== undefined) out.category = category ?? "";
  if (!partial || description !== undefined) out.description = description ?? "";

  return out;
}

function firstValidationMessage(err) {
  const first = Object.values(err.errors || {})[0];
  return first?.message || "Invalid data";
}
