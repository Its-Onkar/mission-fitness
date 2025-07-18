import { config } from "dotenv";
config()

export const  {
    MONGO_URI,
    PORT
    , OPENAI_API_KEY,
} = process.env;
