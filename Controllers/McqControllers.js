const MCQ = require('../Models/McqModel.js');
const Subject = require('../Models/SubjectModel.js');
const Chapter = require('../Models/ChapterModel.js');
const Topic = require('../Models/TopicModel.js');

// ✅ Add an MCQ
 const addMCQ = async (req, res) => {
    try {
        const { subject, chapter, topic, questionText, options, answer, explanation} = req.body;

        // Check if Subject, Chapter, and Topic exist
        const subjectExists = await Subject.findById(subject);
        const chapterExists = await Chapter.findById(chapter);
        const topicExists = await Topic.findById(topic);

        if (!subjectExists || !chapterExists || !topicExists) {
            return res.status(404).json({ message: 'Invalid Subject, Chapter, or Topic' });
        }

        const newMCQ = new MCQ({ subject, chapter, topic, questionText, options, answer, explanation });
        const savedMCQ = await newMCQ.save();

          // Update the topic with the new MCQ ID
          await Topic.findByIdAndUpdate(topic, { $push: { mcqs: savedMCQ._id } });
        res.status(201).json(savedMCQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Get all MCQs (Populating Subject, Chapter, and Topic)
 const getAllMCQs = async (req, res) => {
    try {
        const mcqs = await MCQ.find()
            .populate('subject', 'name')
            .populate('chapter', 'name')
            .populate('topic', 'name');
        res.status(200).json(mcqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get MCQ by ID (Populating Subject, Chapter, and Topic)
 const getMCQById = async (req, res) => {
    try {
        const mcq = await MCQ.findById(req.params.id)
            .populate('subject', 'name')
            .populate('chapter', 'name')
            .populate('topic', 'name');

        if (!mcq) return res.status(404).json({ message: 'MCQ not found' });
        res.status(200).json({
            success: true,
            message: "mcq details",
            mcq,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update an MCQ
 const updateMCQ = async (req, res) => {
    try {
        const updatedMCQ = await MCQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMCQ) return res.status(404).json({ message: 'MCQ not found' });
        res.status(200).json(updatedMCQ);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete an MCQ 
const deleteMCQ = async (req, res) => {
    try {
        const deletedMCQ = await MCQ.findByIdAndDelete(req.params.id);
        if (!deletedMCQ) return res.status(404).json({ message: 'MCQ not found' });

        await Topic.findByIdAndUpdate(deletedMCQ.topic, { $pull: { mcqs: req.params.id } });

        res.status(200).json({ message: 'MCQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addMCQ,
    getAllMCQs,
    getMCQById,
    updateMCQ,
    deleteMCQ
}