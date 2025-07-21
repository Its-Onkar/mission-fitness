  
import mongoose, { Schema } from 'mongoose';
const userschema = new Schema({
    userName: {
        unique:true,
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }


}, {
    timestamps: true
})

const User = mongoose.model('User', userschema);

export default User;
