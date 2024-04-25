import * as dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT ?? 8080
export const NODE_ENV = process.env.NODE_ENV ?? 'development'
export const DATABASE_URL = process.env.DATABASE_URL!
export const SENDPULSE_WHATSAPP_ID = process.env.SENDPULSE_WHATSAPP_ID!
export const SENDPULSE_WHATSAPP_SECRET = process.env.SENDPULSE_WHATSAPP_SECRET!
