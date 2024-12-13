import mongoose from "mongoose";

export const Config = () => {
  const URLSchema = new mongoose.Schema({
    url: String,
    hash: String
  })
  return {
    MONGO_URI: process.env.MONGO_URI || "mongodb://admin:admin@localhost:27017",
    REDIS_URI: process.env.REDIS_URI || "redis://localhost:6379",
    CODE_LENGTH: 6,
    MAX_CODE_LENGTH: 10,
    URLSchema: URLSchema,
    URLModel: mongoose.model('URL', URLSchema)
  }
}