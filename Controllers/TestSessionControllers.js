const testSessionModel = require("../Models/TestSessionModel");
const slugify = require("slugify");

const createtestSessionController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingtestSession = await testSessionModel.findOne({ name });
    if (existingtestSession) {
      return res.status(200).send({
        success: false,
        message: "testSession Already Exists",
      });
    }
    const testSession = await new testSessionModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New testSession created",
      testSession,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating testSession",
    });
  }
};

//updating testSession
const updatetestSessionController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const testSession = await testSessionModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "testSession Updated Successfully",
      testSession,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating testSession",
    });
  }
};

// getting all categories
const testSessionController = async (req, res) => {
  try {
    const testSession = await testSessionModel.find();
    res.status(200).send({
      success: true,
      message: "List of all Categories",
      testSession,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all Categories",
    });
  }
};

//Getting single testSession
const singletestSessionController = async (req, res) => {
  try {
    const testSession = await testSessionModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Successfully Get single testSession",
      testSession,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting testSession",
    });
  }
};

// Delete testSession
const deletetestSessionController = async (req, res) => {
  try {
    const { id } = req.params;
    const testSession = await testSessionModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "testSession Deleted Successfully",
      testSession,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting testSession",
    });
  }
};

module.exports = {
  createtestSessionController,
  updatetestSessionController,
  testSessionController,
  singletestSessionController,
  deletetestSessionController,
};