const chapterModel = require("../Models/ChapterModel");
const subjectModel = require("../Models/SubjectModel");
const slugify = require("slugify");

// Create Chapter
const createChapterController = async (req, res) => {
  try {
    const { name, subject } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Chapter name is required" });
    }
    if (!subject) {
      return res.status(400).send({ message: "Subject ID is required" });
    }

    // Check if subject exists
    const existingSubject = await subjectModel.findById(subject);
    if (!existingSubject) {
      return res.status(404).send({ message: "Subject not found" });
    }

    // Check if chapter exists
    const existingChapter = await chapterModel.findOne({ name });
    if (existingChapter) {
      return res.status(400).send({ message: "Chapter already exists" });
    }

    const chapter = await new chapterModel({
      name,
      slug: slugify(name),
      subject,
    }).save();

    res.status(201).send({
      success: true,
      message: "New chapter created successfully",
      chapter,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in creating chapter",
      error,
    });
  }
};

// Update Chapter
const updateChapterController = async (req, res) => {
  try {
    const { name, subject } = req.body;
    const { id } = req.params;

    // Check if subject exists
    const existingSubject = await subjectModel.findById(subject);
    if (!existingSubject) {
      return res.status(404).send({ message: "Subject not found" });
    }

    const chapter = await chapterModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name), subject },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Chapter updated successfully",
      chapter,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating chapter",
      error,
    });
  }
};

const getAllChaptersController = async (req, res) => {
  try {
    const chapters = await chapterModel.find();
    const populatedChapters = await chapterModel.find().populate("subject", "name");

    res.status(200).send({
      success: true,
      message: "List of all chapters",
      chapters: populatedChapters,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).send({
      success: false,
      message: "Error while getting all chapters",
      error,
    });
  }
};


// Get Single Chapter
const getSingleChapterController = async (req, res) => {
  try {
    const chapter = await chapterModel.findOne({ slug: req.params.slug }).populate("subject", "name");
    res.status(200).send({
      success: true,
      message: "Successfully retrieved single chapter",
      chapter,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting chapter",
      error,
    });
  }
};

// Delete Chapter
const deleteChapterController = async (req, res) => {
  try {
    const { id } = req.params;
    const chapter = await chapterModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Chapter deleted successfully",
      chapter,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting chapter",
      error,
    });
  }
};
  

module.exports = {
  createChapterController,
  updateChapterController,
  getAllChaptersController,
  getSingleChapterController,
  deleteChapterController,
};
