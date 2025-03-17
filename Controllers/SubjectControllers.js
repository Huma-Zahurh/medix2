const subjectModel = require("../Models/SubjectModel");
const slugify = require("slugify");

const createsubjectController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingsubject = await subjectModel.findOne({ name });
    if (existingsubject) {
      return res.status(200).send({
        success: false,
        message: "subject Already Exists",
      });
    }
    const subject = await new subjectModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New subject created",
      subject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating subject",
    });
  }
};

//updating subject
const updatesubjectController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const subject = await subjectModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "subject Updated Successfully",
      subject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updating subject",
    });
  }
};

// getting all categories
const subjectController = async (req, res) => {
  try {
    const subject = await subjectModel.find();
    res.status(200).send({
      success: true,
      message: "List of all Categories",
      subject,
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

//Getting single subject
const singlesubjectController = async (req, res) => {
  try {
    const subject = await subjectModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Successfully Get single subject",
      subject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting subject",
    });
  }
};

// Delete subject
const deletesubjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await subjectModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "subject Deleted Successfully",
      subject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting subject",
    });
  }
};

module.exports = {
  createsubjectController,
  updatesubjectController,
  subjectController,
  singlesubjectController,
  deletesubjectController,
};