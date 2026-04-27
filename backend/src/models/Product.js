import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", sku: "text", category: "text" });

export const Product = mongoose.model("Product", productSchema);
