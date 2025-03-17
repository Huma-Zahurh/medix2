const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
    },
    testDuration: {
        type: Number, // Duration in minutes
        required: true,
    },
    testSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestSession', // Assuming you have a TestSession model
    },
    mcqs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MCQ',
    }],
    slug: {
        type: String,
        lowercase: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);