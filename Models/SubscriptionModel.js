const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    durationUnit: {
        type: String,
        enum: ['days', 'months'],
        required: true,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
    testSessions: [{ // Add test sessions
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestSession',
    }],
    price: {
        type: Number,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);