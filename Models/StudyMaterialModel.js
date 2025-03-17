const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  file_url: { type: String, required: true }, 
  created_at: { type: Date, default: Date.now },
});

 const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);

 module.exports = StudyMaterial
