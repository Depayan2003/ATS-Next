console.log("ENV:", process.env.MONGODB_URL);
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDb() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URL is missing");
    throw new Error("Database not configured");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
