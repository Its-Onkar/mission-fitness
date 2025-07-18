import db from "../db/connection.js";
import app from "./app.js"
import { PORT } from "./config/variables.js";
import './config/variables.js'; 


db.then(() => {
    app.listen(PORT,()=>{
      console.log(`Server is running on port ${PORT}`);
    })
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
