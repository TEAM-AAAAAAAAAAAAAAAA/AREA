import * as dotenv from 'dotenv'
import crypto from 'crypto';

dotenv.config()
export const env = process.env
export const jwtSecret = process.env?.JWT_SECRET || crypto.randomBytes(32).toString('hex');
export const mailSecret = crypto.randomBytes(32).toString('hex');