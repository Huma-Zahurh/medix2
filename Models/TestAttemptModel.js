const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    },
    attemptedQuestions: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MCQ',
            required: true,
        },
        selectedAnswer: String,
    }],
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
    },
    score: {
        type: Number,
    },
    // Removed timeTaken field
});

module.exports = mongoose.model('TestAttempt', testAttemptSchema);