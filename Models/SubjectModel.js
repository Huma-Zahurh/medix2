const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});
const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
module.exports = Subject;