import { config } from "dotenv";
config()

export const variables = {
    MONGO_URI,
    PORT
} = process.env;
