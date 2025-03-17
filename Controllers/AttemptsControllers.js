const PreparationAttempt = require("../Models/PreparationAttemptsModel");
const Topic = require("../Models/TopicModel");
const mongoose = require("mongoose");
const TestAttempt = require("../Models/TestAttemptModel");
const Test = require("../Models/TestModel");
const Quiz = require("../Models/QuizModel")
const QuizAttempt = require("../Models/QuizAttemptModel")

// Save Preparation Attempt
const SavePreparationAttempt = async (req, res) => {
    try {
        const { user, topic, attemptedQuestions, startTime, endTime, score, timeTaken } = req.body;

        if (!user) {
            return res.status(400).json({ success: false, message: 'Missing user.' });
        }
        if (!topic) {
            return res.status(400).json({ success: false, message: 'Missing topic.' });
        }
        if (!attemptedQuestions || !Array.isArray(attemptedQuestions) || attemptedQuestions.length === 0) {
            return res.status(400).json({ success: false, message: 'Missing or invalid attemptedQuestions.' });
        }

        if (!startTime) {
            return res.status(400).json({ success: false, message: 'Missing startTime.' });
        }

        if (!endTime) {
            return res.status(400).json({ success: false, message: 'Missing endTime.' });
        }

        if (score === undefined || score === null) {
            return res.status(400).json({ success: false, message: 'Missing score.' });
        }

        if (timeTaken === undefined || timeTaken === null) {
            return res.status(400).json({ success: false, message: 'Missing timeTaken.' });
        }

        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID.' });
        }

        if (!mongoose.Types.ObjectId.isValid(topic)) {
            return res.status(400).json({ success: false, message: 'Invalid topic ID.' });
        }

        const attempt = new PreparationAttempt({
            user,
            topic,
            attemptedQuestions,
            startTime,
            endTime,
            score,
            timeTaken,
        });

        const savedAttempt = await attempt.save();
        return res.status(201).json({ success: true, message: 'Preparation attempt saved successfully.', attempt: savedAttempt });

    } catch (error) {
        console.error('Error saving preparation attempt:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to save preparation attempt.', error: error.message });
    }
};

// Update an existing preparation attempt
const updateAttempt = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { attemptedQuestions } = req.body; 

        if (!mongoose.Types.ObjectId.isValid(attemptId)) {
            return res.status(400).json({ success: false, message: 'Invalid attempt ID.' });
        }

        // Find the existing attempt
        const existingAttempt = await PreparationAttempt.findById(attemptId);

        if (!existingAttempt) {
            return res.status(404).json({ success: false, message: 'Attempt not found.' });
        }

        // Update attemptedQuestions
        if (attemptedQuestions && Array.isArray(attemptedQuestions)) {
            attemptedQuestions.forEach(updatedQuestion => {
                const existingQuestionIndex = existingAttempt.attemptedQuestions.findIndex(
                    q => q.question.toString() === updatedQuestion.question
                );

                if (existingQuestionIndex !== -1) {
                    existingAttempt.attemptedQuestions[existingQuestionIndex].selectedAnswer = updatedQuestion.selectedAnswer;
                } else {
                    console.log(`Warning: Question ${updatedQuestion.question} not found in existing attempt.`);
                }
            });
        }
        // Save the updated attempt
        const updatedAttempt = await existingAttempt.save();
        return res.status(200).json({ success: true, message: 'Attempt updated successfully.', attempt: updatedAttempt });

    } catch (error) {
        console.error('Error updating attempt:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to update attempt.', error: error.message });
    }
};

// Get all attempts of a user
const getPreparationAttempt = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID.' });
        }

        const attempts = await PreparationAttempt.find({ user: userId }).populate('topic'); 
        return res.status(200).json({ success: true, attempts });

    } catch (error) {
        console.error('Error fetching preparation attempts:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to fetch preparation attempts.', error: error.message });
    }
};

// Get attempt by topic slug
const getPreparationAttemptByTopicSlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            console.log("Error: Topic slug is missing.");
            return res.status(400).json({ success: false, message: 'Topic slug is required.' });
        }

        const topic = await Topic.findOne({ slug });

        if (!topic) {
            return res.status(404).json({ success: false, message: 'Topic not found.' });
        }

        const attempt = await PreparationAttempt.findOne({ topic: topic._id, user: req.user._id })
            .populate('attemptedQuestions.question');

        if (!attempt) {
            return res.status(404).json({ success: false, message: 'Attempt not found for this topic.' });
        }

        return res.status(200).json({ success: true, attempt });

    } catch (error) {
        console.error('Error fetching preparation attempt by topic:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to fetch preparation attempt.', error: error.message });
    }
};

// Check if the user has already attempted a topic
const checkAttempted = async (req, res) => {
    try {
        const { slug } = req.params;
        const { userId } = req.query;

        if (!slug || !userId) {
            return res.status(400).json({ success: false, message: 'Topic slug and user ID are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID.' });
        }

        const topic = await Topic.findOne({ slug });
        if (!topic) {
            return res.status(404).json({ success: false, message: 'Topic not found.' });
        }

        const attempt = await PreparationAttempt.findOne({ user: userId, topic: topic._id });

        return res.status(200).json({
            success: true,
            attempted: attempt ? true : false,
            attemptId: attempt ? attempt._id : null
        });

    } catch (error) {
        console.error('Error checking attempt status:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to check attempt status.', error: error.message });
    }
};




// ===============================================


// Test Attempt Controllers

// Save Test Attempt
const saveTestAttempt = async (req, res) => {
    try {
        const { user, test, attemptedQuestions, startTime } = req.body;

        if (!user || !test || !attemptedQuestions || !Array.isArray(attemptedQuestions) || attemptedQuestions.length === 0 || !startTime) {
            return res.status(400).json({ success: false, message: 'Missing or invalid data.' });
        }

        if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(test)) {
            return res.status(400).json({ success: false, message: 'Invalid user or test ID.' });
        }

        const attempt = new TestAttempt({
            user,
            test,
            attemptedQuestions,
            startTime,
        });

        const savedAttempt = await attempt.save();
        return res.status(201).json({ success: true, message: 'Test attempt saved successfully.', attempt: savedAttempt });

    } catch (error) {
        console.error('Error saving test attempt:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to save test attempt.', error: error.message });
    }
};

// Update Test Attempt
const updateTestAttempt = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { attemptedQuestions, endTime, score } = req.body;

        if (!mongoose.Types.ObjectId.isValid(attemptId)) {
            return res.status(400).json({ success: false, message: 'Invalid attempt ID.' });
        }

        const existingAttempt = await TestAttempt.findById(attemptId);

        if (!existingAttempt) {
            return res.status(404).json({ success: false, message: 'Attempt not found.' });
        }

        if (attemptedQuestions && Array.isArray(attemptedQuestions)) {
            attemptedQuestions.forEach(updatedQuestion => {
                const existingQuestionIndex = existingAttempt.attemptedQuestions.findIndex(
                    q => q.question.toString() === updatedQuestion.question
                );

                if (existingQuestionIndex !== -1) {
                    existingAttempt.attemptedQuestions[existingQuestionIndex].selectedAnswer = updatedQuestion.selectedAnswer;
                }
            });
        }

        existingAttempt.endTime = endTime;
        existingAttempt.score = score;

        const updatedAttempt = await existingAttempt.save();
        return res.status(200).json({ success: true, message: 'Test attempt updated successfully.', attempt: updatedAttempt });

    } catch (error) {
        console.error('Error updating test attempt:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to update test attempt.', error: error.message });
    }
};

// Check if the user has already attempted a test
const checkTestAttempted = async (req, res) => {
    try {
        const { slug } = req.params;
        const { userId } = req.query;

        if (!slug || !userId) {
            return res.status(400).json({ success: false, message: 'Test slug and user ID are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID.' });
        }

        const test = await Test.findOne({ slug });
        if (!test) {
            return res.status(404).json({ success: false, message: 'Test not found.' });
        }

        const attempt = await TestAttempt.findOne({ user: userId, test: test._id });

        return res.status(200).json({
            success: true,
            attempted: attempt ? true : false,
            attemptId: attempt ? attempt._id : null
        });

    } catch (error) {
        console.error('Error checking test attempt status:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to check test attempt status.', error: error.message });
    }
};


// Get all attempts of a user for tests
const getTestAttempt = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID.' });
        }

        const attempts = await TestAttempt.find({ user: userId }).populate('test');
        return res.status(200).json({ success: true, attempts });

    } catch (error) {
        console.error('Error fetching test attempts:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to fetch test attempts.', error: error.message });
    }
};

// Get attempt by test slug
const getTestAttemptByTestSlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({ success: false, message: 'Test slug is required.' });
        }

        const test = await Test.findOne({ slug });

        if (!test) {
            return res.status(404).json({ success: false, message: 'Test not found.' });
        }

        const attempt = await TestAttempt.findOne({ test: test._id, user: req.user._id })
            .populate('attemptedQuestions.question');

        if (!attempt) {
            return res.status(404).json({ success: false, message: 'Attempt not found for this test.' });
        }

        return res.status(200).json({ success: true, attempt });

    } catch (error) {
        console.error('Error fetching test attempt by test:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to fetch test attempt.', error: error.message });
    }
};


// Quiz Attempt Controllers

// Save quiz Attempt
const saveQuizAttempt = async (req, res) => {
    try {
        const { user, quiz, attemptedQuestions, startTime } = req.body;

        if (!user || !quiz || !attemptedQuestions || !Array.isArray(attemptedQuestions) || attemptedQuestions.length === 0 || !startTime) {
            return res.status(400).json({ success: false, message: 'Missing or invalid data.' });
        }

        if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(quiz)) {
            return res.status(400).json({ success: false, message: 'Invalid user or test ID.' });
        }

        const attempt = new QuizAttempt({
            user,
            quiz,
            attemptedQuestions,
            startTime,
        });

        const savedAttempt = await attempt.save();
        return res.status(201).json({ success: true, message: 'Quiz attempt saved successfully.', attempt: savedAttempt });

    } catch (error) {
        console.error('Error saving quiz attempt:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to save quiz attempt.', error: error.message });
    }
};

// Update quiz Attempt
const updateQuizAttempt = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { attemptedQuestions, endTime, score } = req.body;

        if (!mongoose.Types.ObjectId.isValid(attemptId)) {
            return res.status(400).json({ success: false, message: 'Invalid attempt ID.' });
        }

        const existingAttempt = await QuizAttempt.findById(attemptId);

        if (!existingAttempt) {
            return res.status(404).json({ success: false, message: 'Attempt not found.' });
        }

        if (attemptedQuestions && Array.isArray(attemptedQuestions)) {
            attemptedQuestions.forEach(updatedQuestion => {
                const existingQuestionIndex = existingAttempt.attemptedQuestions.findIndex(
                    q => q.question.toString() === updatedQuestion.question
                );

                if (existingQuestionIndex !== -1) {
                    existingAttempt.attemptedQuestions[existingQuestionIndex].selectedAnswer = updatedQuestion.selectedAnswer;
                }
            });
        }

        existingAttempt.endTime = endTime;
        existingAttempt.score = score;

        const updatedAttempt = await existingAttempt.save();
        return res.status(200).json({ success: true, message: 'quiz attempt updated successfully.', attempt: updatedAttempt });

    } catch (error) {
        console.error('Error updating quiz attempt:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to update quiz attempt.', error: error.message });
    }
};

// Check if the user has already attempted a quiz
const checkQuizAttempted = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { userId } = req.query;

        if (!quizId || !userId) {
            return res.status(400).json({ success: false, message: 'quiz ID and user ID are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID.' });
        }

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ success: false, message: 'Invalid quiz ID.' });
        }

        const quiz = await Quiz.findById(quizId); 
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found.' });
        }

        const attempt = await QuizAttempt.findOne({ user: userId, quiz: quiz._id });

        return res.status(200).json({
            success: true,
            attempted: attempt ? true : false,
            attemptId: attempt ? attempt._id : null,
        });
    } catch (error) {
        console.error('Error checking quiz attempt status:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to check quiz attempt status.', error: error.message });
    }
};


// Get all attempts of a user for tests
const getQuizAttempt = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID.' });
        }

        const attempts = await QuizAttempt.find({ user: userId }).populate('quiz');
        return res.status(200).json({ success: true, attempts });

    } catch (error) {
        console.error('Error fetching quiz attempts:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to fetch quiz attempts.', error: error.message });
    }
};

// Get attempt by test slug
const getQuizAttemptByQuizSlug = async (req, res) => {
    try {
        const { quizId } = req.params;

        if (!quizId) {
            return res.status(400).json({ success: false, message: 'quiz slug is required.' });
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ success: false, message: 'quiz not found.' });
        }

        const attempt = await QuizAttempt.findOne({ quiz: quiz._id, user: req.user._id })
            .populate('attemptedQuestions.question');

        if (!attempt) {
            return res.status(404).json({ success: false, message: 'Attempt not found for this quiz.' });
        }

        return res.status(200).json({ success: true, attempt });

    } catch (error) {
        console.error('Error fetching quiz attempt by test:', error.message, error.stack);
        return res.status(500).json({ success: false, message: 'Failed to fetch quiz attempt.', error: error.message });
    }
};



module.exports = {
    SavePreparationAttempt,
    getPreparationAttempt,
    getPreparationAttemptByTopicSlug,
    checkAttempted,
    updateAttempt,
    saveTestAttempt,
    updateTestAttempt,
    checkTestAttempted,
    getTestAttempt,
    getTestAttemptByTestSlug,
    saveQuizAttempt,
    updateQuizAttempt,
    checkQuizAttempted,
    getQuizAttempt,
    getQuizAttemptByQuizSlug
};