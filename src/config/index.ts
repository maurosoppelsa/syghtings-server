import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, SERVER_EMAIL_ACCOUNT, SERVER_EMAIL_PASSWORD } = process.env;

// token expires in 14 days
export const TOKEN_EXPIRATION_TIME = process.env.TOKEN_EXPIRATION_TIME || 1209600;

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sygthings-db';

export const SERVER_EMAIL_HOST = process.env.SERVER_EMAIL_HOST || 'smtp.gmail.com';
export const SERVER_EMAIL_PORT = process.env.SERVER_EMAIL_PORT || 465;

export const CRON_JOB_CLEANUP_TIME = process.env.CRON_JOB_TIME || '0 0 */24 * * *'; // runs every 24 hours
