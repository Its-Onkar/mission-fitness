import mongoose from 'mongoose';

const workoutPhotoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    analysis: {
        description: String,
        form: String,
        progress: String,
        suggestions: String
    },
    tags: [{
        type: String
    }],
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

workoutPhotoSchema.index({ user: 1, date: -1 });

export default mongoose.model('WorkoutPhoto', workoutPhotoSchema);