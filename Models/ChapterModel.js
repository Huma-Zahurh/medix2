const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject", 
    required: true,
  },
});

const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
