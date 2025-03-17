const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    imageUrl: String,
});

module.exports = mongoose.model('Banner', bannerSchema);