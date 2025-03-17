const Quiz = require('../Models/QuizModel');
const MCQ = require('../Models/McqModel'); 
const Topic = require("../Models/TopicModel")

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const quizController = {

    createQuiz: async (req, res) => {
        try {
            const { user, quizName, numberOfMcqs, duration, selectedSubjects, selectedChapters, selectedTopics } = req.body;
            console.log("req.body:", req.body);

            // Fetch topics and populate mcqs (assuming TopicModel has mcqs)
            const topics = await Topic.find({ _id: { $in: selectedTopics } }).populate('mcqs');

            if (topics.length === 0) {
                return res.status(400).json({ message: 'No topics found.' });
            }

            // Extract and shuffle MCQs from topics
            let allShuffledMcqs = [];
            topics.forEach(topic => {
                if (topic.mcqs && topic.mcqs.length > 0) {
                    const shuffledTopicMcqs = shuffleArray(topic.mcqs);
                    allShuffledMcqs = allShuffledMcqs.concat(shuffledTopicMcqs);
                }
            });

            if (allShuffledMcqs.length === 0) {
                return res.status(400).json({ message: 'No MCQs found in the selected topics.' });
            }

            // Select the required number of MCQs
            const selectedMcqs = allShuffledMcqs.slice(0, numberOfMcqs);

            if(selectedMcqs.length < numberOfMcqs){
                return res.status(400).json({message: "Not enough MCQS found after shuffling and slicing."})
            }

            console.log("Selected MCQs:", selectedMcqs);

            const quiz = new Quiz({
                user,
                quizName,
                numberOfMcqs,
                duration,
                selectedSubjects,
                selectedChapters,
                selectedTopics,
                mcqs: selectedMcqs 
            });

            await quiz.save();

            res.status(201).json({ quizId: quiz._id });
        } catch (error) {
            console.error("Error creating quiz:", error);
            if (error.name === "ValidationError") {
                return res.status(400).json({ message: "Validation error", errors: error.errors });
            }
            res.status(500).json({ message: "Internal server error.", error: error.message });
        }
    },
       
    getStudentQuizzes: async (req, res) => {
        try {
            const userId = req.params.user;
            const quizzes = await Quiz.find({ user: userId });
            res.status(200).json(quizzes);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getQuiz: async (req, res) => {
        try {
            const quizId = req.params.quizId;
            const quiz = await Quiz.findById(quizId);
            res.status(200).json(quiz);
            console.log(quiz);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getMcqs: async (req, res) => {
        try {
            const mcqs = req.params.mcqs.split(',');
            const mcq = await MCQ.find({ _id: { $in: mcqs } });
            res.status(200).json(mcq);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = quizController;