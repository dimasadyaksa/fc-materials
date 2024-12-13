import Redis from "ioredis"
import { Config } from "../config/config"
import mongoose from 'mongoose'
import { newResponse } from "../helper/response"
import { urlToHttpOptions } from "url"

const config = Config()
const redisClient = new Redis(config.REDIS_URI)
mongoose.connect(config.MONGO_URI)


export async function POST(req: Request) {
  const body = await req.json()
  const hashCode = body.hashCode

  const urlFromCache = await redisClient.get(hashCode)
  if (urlFromCache) {
    return newResponse(req, { code: 200, data: urlFromCache })
  }

  const urlFromDB = await config.URLModel.findOne({ hash: hashCode })
  if (urlFromDB) {
    return newResponse(req, { code: 200, data: urlFromDB.url })
  }

  return newResponse(req, { code: 404, message: "not found" })
}

export function OPTIONS(req: Request) {
  return new Response("OK", { status: 200 })
}