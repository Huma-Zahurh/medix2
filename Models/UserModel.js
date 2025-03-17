const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    Phone: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        required: true,
    },
    subscriptions: [{
        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subscription',
        },
        action: {
            type: String,
            enum: ['assigned', 'default_assigned'], // simplified actions
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        expirationDate: {
            type: Date,
        },
        active: {
            type: Boolean,
            default: true,
        }
    }],
});

module.exports = mongoose.model("users", userSchema);