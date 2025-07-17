import db from "../db/connection";
import app from "./app.js"
import { PORT } from "../config.js";


db.then(() => {
    app.listen(PORT,()=>{
      console.log(`Server is running on port ${PORT}`);
    })
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
