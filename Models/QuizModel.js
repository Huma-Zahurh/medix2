const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
    },
    quizName: {
        type: String,
        required: true,
    },
    numberOfMcqs: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    selectedSubjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject', // Assuming you have a Subject model
    }],
    selectedChapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter', // Assuming you have a Chapter model
    }],
    selectedTopics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic', // Assuming you have a Topic model
    }],
    mcqs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MCQ', // Assumes your MCQ model is named 'MCQ'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Quiz', QuizSchema);