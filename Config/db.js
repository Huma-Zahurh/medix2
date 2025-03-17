const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Mongo_URL = process.env.dB_URL;

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(Mongo_URL);
    console.log("Successfully Connected to MongoDB");
  } catch (error) {
    console.log("Failed to Connect with MongoDB", error);
  }
};

module.exports = connectDb;