const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject", 
    required: true,
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter", 
    required: true,
  },
  mcqs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MCQ',
  }],
  studyMaterial: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyMaterial',
  }]
});

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);
module.exports = Topic;
