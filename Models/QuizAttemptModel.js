const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
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
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);