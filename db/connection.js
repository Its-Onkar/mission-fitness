import mongoose from 'mongoose';   
import {MONGO_URI} from '../config.js'; 

const db= mongoose.connect(MONGO_URI)


export default db;
