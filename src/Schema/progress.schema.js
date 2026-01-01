import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
    },

    
})