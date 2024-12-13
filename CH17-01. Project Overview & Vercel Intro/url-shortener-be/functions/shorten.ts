import mongoose from 'mongoose'
import redis from 'ioredis'
import { createHash, randomBytes } from 'crypto';
import { Config } from '../config/config';
import { newResponse } from '../helper/response';

const config = Config()
const redisClient = new redis(config.REDIS_URI)
mongoose.connect(config.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
})

/**
 * 
 * Request:
 * {
 *  "url": "<url-to-shorten>"
 * }
 * 
 * Response:
 * {
 *  "code": 200,
 *  "data": "<shortened-url>",
 *  "message": "Success"
 * }
 * 
 * @param req {Request}
 */


export async function POST(req: Request) {
  const body = await req.json();
  const url = body.url;

  // Database -> MongoDB 
  // Cache -> Redis

  // 1. Hash the URL
  // 2. Check to database if the hash exists
  // 3. If it exists, compare the URL
  // 4. If url is the same, return the hash
  // 5. If url is different, append random string to the hash
  // 6. If hash length < Max Length, Back to point 2
  // 7. If hash length >= Max Length, return error

  const hasher = createHash('sha256')
  let hashCode = hasher.update(url).digest('base64url').substring(0, config.CODE_LENGTH)

  do {
    const urlFromCache = await redisClient.get(hashCode)
    if (urlFromCache != null) {
      if (urlFromCache == url) {
        return newResponse(req, { code: 200, data: hashCode })
      }
    }

    const urlExists = await config.URLModel.findOne({ hash: hashCode })
    if (!urlExists) {
      await config.URLModel.create({ url: url, hash: hashCode })
      await redisClient.set(hashCode, url)
      return newResponse(req, { code: 200, data: hashCode })
    }

    if (urlExists.url == url) {
      return newResponse(req, { code: 200, data: hashCode })
    }

    hashCode = hashCode + randomBytes(2).toString('base64url').charAt(0)
  } while (hashCode.length < config.MAX_CODE_LENGTH)

  return newResponse(req, { code: 500, message: "overflow" })
}


export function OPTIONS(req: Request) {
  return new Response("OK", { status: 200 })
}