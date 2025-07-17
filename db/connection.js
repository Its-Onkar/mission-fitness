import mongoose from 'mongoose';   
import {MONGO_URI} from '../src/config/variables.js '; 

const db= mongoose.connect(MONGO_URI)


export default db;
