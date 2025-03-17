const xlsx = require('xlsx');
const Subject = require('../Models/SubjectModel');
const Chapter = require('../Models/ChapterModel');
const Topic = require('../Models/TopicModel');
const MCQ = require('../Models/McqModel');
const slugify = require('slugify');

const importFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, message: 'Please upload an Excel file.' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        if (!data || data.length === 0) {
            return res.status(400).send({ success: false, message: 'Excel file is empty or invalid.' });
        }

        for (const [index, row] of data.entries()) {
            try {
                const subjectName = row.Subject;
                const chapterName = row.Chapter;
                const topicName = row.Topic;
                const questionText = row.Question;
                const options = [row.Option1, row.Option2, row.Option3, row.Option4];
                const answer = row.Answer;
                const explanation = row.Explanation;

                // Validation
                if (!subjectName || !chapterName || !topicName || !questionText || !options || !answer) {
                    return res.status(400).send({ success: false, message: `Missing required data in row ${index + 2}.` });
                }

                if (!Array.isArray(options) || options.length < 2) {
                    return res.status(400).send({ success: false, message: `Invalid options in row ${index + 2}.` });
                }

                // Subject Processing
                let subject = await Subject.findOne({ name: subjectName });
                if (!subject) {
                    subject = new Subject({ name: subjectName, slug: slugify(subjectName) });
                    await subject.save();
                }

                // Chapter Processing
                let chapter = await Chapter.findOne({ name: chapterName, subject: subject._id });
                if (!chapter) {
                    chapter = new Chapter({ name: chapterName, slug: slugify(chapterName), subject: subject._id });
                    await chapter.save();
                }

                // Topic Processing
                let topic = await Topic.findOne({ name: topicName, chapter: chapter._id, subject: subject._id });
                if (!topic) {
                    topic = new Topic({ name: topicName, slug: slugify(topicName), chapter: chapter._id, subject: subject._id });
                    await topic.save();
                }

                // Check if MCQ already exists
                const existingMCQ = await MCQ.findOne({
                    questionText: questionText,
                    subject: subject._id,
                    chapter: chapter._id,
                    topic: topic._id,
                });

                if (!existingMCQ) {
                    // Create MCQ
                    const mcq = new MCQ({
                        subject: subject._id,
                        chapter: chapter._id,
                        topic: topic._id,
                        questionText: questionText,
                        options: options,
                        answer: answer,
                        explanation: explanation,
                    });
                    const savedMCQ = await mcq.save();

                    // Update Topic with MCQ ID
                    await Topic.findByIdAndUpdate(topic._id, { $push: { mcqs: savedMCQ._id } });
                }
            } catch (rowError) {
                console.error(`Error processing row ${index + 2}:`, rowError);
                return res.status(500).send({ success: false, message: `Error processing row ${index + 2}: ${rowError.message}` });
            }
        }

        res.status(200).send({ success: true, message: 'Data imported successfully.' });
    } catch (error) {
        console.error('Import Error:', error);
        res.status(500).send({ success: false, message: 'Server error: ' + error.message });
    }
};

module.exports = { importFromExcel };