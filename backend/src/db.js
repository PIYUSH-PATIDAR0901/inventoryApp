import mongoose from "mongoose";

const defaultLocalUri = "mongodb://127.0.0.1:27017/inventory";

export async function connectDb() {
  const uri = (process.env.MONGODB_URI || "").trim() || defaultLocalUri;
  if (!(process.env.MONGODB_URI || "").trim()) {
    console.warn(
      "MONGODB_URI missing in .env — using local default:",
      defaultLocalUri
    );
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}
