import { config } from "dotenv";
config()

export const {
    MONGO_URI,
    PORT,
    OPENAI_API_KEY,
    JWT_SECRET,
    EMAIL_USER,
    EMAIL_PASS,
    BASE_URL
} = process.env;
