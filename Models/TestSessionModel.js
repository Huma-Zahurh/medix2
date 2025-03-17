const mongoose = require("mongoose");

const testSessionSchema = new mongoose.Schema({
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
const TestSession = mongoose.models.testSession || mongoose.model("TestSession", testSessionSchema);
module.exports = TestSession;