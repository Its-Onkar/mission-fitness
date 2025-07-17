import { config } from "dotenv";
config()

export const  {
    MONGO_URI,
    PORT
} = process.env;
