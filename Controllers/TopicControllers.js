const Topic = require("../Models/TopicModel");
const Subject = require("../Models/SubjectModel");
const Chapter = require("../Models/ChapterModel");
const slugify = require("slugify");

// Create Topic
const createTopicController = async (req, res) => {
  try {
    const { name, subject, chapter, mcqs , studyMaterial } = req.body;

    if (!name || !subject || !chapter) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if Subject and Chapter exist
    const existingSubject = await Subject.findById(subject);
    const existingChapter = await Chapter.findById(chapter);

    if (!existingSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    if (!existingChapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // Check if Topic Already Exists
    const existingTopic = await Topic.findOne({ name, chapter });
    if (existingTopic) {
      return res.status(400).json({ message: "Topic already exists in this chapter" });
    }

    const topic = await new Topic({
      name,
      slug: slugify(name),
      subject,
      chapter,
      mcqs: mcqs || [],
      studyMaterial:  studyMaterial || []
    }).save();

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      topic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating topic", error });
  }
};

// Update Topic
const updateTopicController = async (req, res) => {
  try {
    const { name, subject, chapter, mcqs } = req.body;
    const { id } = req.params;

    const topic = await Topic.findByIdAndUpdate(
      id,
      { name, slug: slugify(name), subject, chapter, mcqs: mcqs || [] },
      { new: true }
    );

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({
      success: true,
      message: "Topic updated successfully",
      topic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating topic", error });
  }
};

// Get All Topics
const getAllTopicsController = async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("subject", "name") 
      .populate("chapter", "name")
      .populate({
        path: "mcqs", 
        model: "MCQ",
        select: "questionText options answer explanation", 
    })
    .populate({
      path: "studyMaterial", 
      model: "StudyMaterial",
      select: "title description subject chapter topic file_url", 
  });

    res.status(200).json({
      success: true,
      message: "List of all topics",
      topics,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching topics", error });
  }
};

// Get Single Topic
const getSingleTopicController = async (req, res) => {
  try {
      const { slug } = req.params; 
      const topic = await Topic.findOne({ slug: slug }) 
          .populate("subject", "name")
          .populate("chapter", "name");

      if (!topic) {
          return res.status(404).json({ message: "Topic with this slug not found" }); 
      }

      res.status(200).json({
          success: true,
          message: "Topic details",
          topic,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching topic", error });
  }
};

// Delete Topic
const deleteTopicController = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findByIdAndDelete(id);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
      topic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting topic", error });
  }
};

module.exports = {
  createTopicController,
  updateTopicController,
  getAllTopicsController,
  getSingleTopicController,
  deleteTopicController,
};
