const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    questionText: { type: String, required: true },
    options: { type: [String], required: true, validate: v => v.length >= 2 },
    answer: { type: String, required: true },
    explanation: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const MCQ = mongoose.model('MCQ', mcqSchema);

module.exports = MCQ;
