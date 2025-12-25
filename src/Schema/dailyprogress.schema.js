import mongoose from 'mongoose';

const dailyProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    water: {
        type: Number,
        default: 0,
        min: 0,
        max: 20
    },
    sleep: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    energy: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    mood: {
        type: String,
        default: '',
        maxlength: 10
    },
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Ensure one record per user per day
dailyProgressSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyProgress', dailyProgressSchema);