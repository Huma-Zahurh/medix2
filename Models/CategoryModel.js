const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        lowercase: true,
      },
    description: {
        type: String,
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    }],
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
    }],
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
    }],
    contentType: {
        type: String,
        enum: ['MCQs', 'Study Material'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);