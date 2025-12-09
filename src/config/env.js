import dotenv from 'dotenv';
import { user } from 'pg/lib/defaults';

dotenv.config();

export const config = {
    port: process.env.PORT,
    access: process.env.ACCESS_SECRET,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
    databaseURL: process.env.DATABASE_URL,
    nodeENV: process.env.NODE_ENV,

    db: {
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        name: process.env.DB_NAME,
        pass: process.env.DB_PASSWORD,
        host: process.env.DB_HOST
    }
};