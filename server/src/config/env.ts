import * as dotenv from 'dotenv'
import crypto from 'crypto';

dotenv.config()
export const env = process.env
export const jwtSecret = crypto.randomBytes(32).toString('hex');