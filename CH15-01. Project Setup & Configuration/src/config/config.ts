import { Algorithm } from 'jsonwebtoken';

export type AppConfig = {
  env: string
  port: number
}

export type DatabaseConfig = {
  host: string
  port: number
  username: string
  password: string
  database: string
  synchronized: boolean
}

export type JWTConfig = {
  algorithm: Algorithm
  expires: string
  audience: string
  issuer: string
  secret: string
}

type Config = {
  app: AppConfig
  database: DatabaseConfig
  jwt: JWTConfig
}

export default (): Config => {
  const nodeEnv = process.env.NODE_ENV ?? "development"
  return {
    app: {
      env: nodeEnv,
      port: parseInt(process.env.PORT ?? "3000")
    },
    jwt: {
      algorithm: (process.env.JWT_ALGORITHM ?? "HS256") as Algorithm,
      expires: process.env.JWT_EXPIRES ?? '1h',
      issuer: process.env.JWT_ISSUER ?? 'twitter-api',
      audience: process.env.JWT_AUDIENCE ?? 'twitter-api',
      secret: process.env.JWT_SECRET ?? 'somerandomsecret'
    },
    database: {
      host: process.env.DB_HOST ?? "localhost",
      port: parseInt(process.env.DB_PORT ?? "5432"),
      username: process.env.DB_USERNAME ?? "postgres",
      password: process.env.DB_PASSWORD ?? "postgres",
      database: process.env.DB_NAME ?? "twitter",
      synchronized: nodeEnv == "development"
    }
  }
}