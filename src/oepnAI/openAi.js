import { OpenAI } from 'openai';

import { OPENAI_API_KEY } from '../config/variables.js';
export const openAi = new OpenAI({
    apiKey: OPENAI_API_KEY
})

