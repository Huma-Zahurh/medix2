const mongoose = require('mongoose');

const preparationAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    topic: { // Consistent name for related entity
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    },
    attemptedQuestions: [ // More general name than attemptedMcqs
        {
            question: { // More general name than mcq
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MCQ',
                required: true,
            },
            selectedAnswer: String,
        },
    ],
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    timeTaken: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('PreparationAttempt', preparationAttemptSchema);