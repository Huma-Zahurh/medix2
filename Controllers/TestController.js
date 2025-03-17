const Test = require('../Models/TestModel');
const slugify = require('slugify');
const MCQ = require('../Models/McqModel'); 

// Create Test
const createTest = async (req, res) => {
    try {
        const { name, description, subject, chapter, topic, testDuration, testSession } = req.body;

        // Validation
        if (!name || !testDuration) {
            return res.status(400).send({ message: 'Name and Test Duration are required' });
        }

        // Fetch MCQs based on the topic
        const mcqs = await MCQ.find({ topic: topic });
        const mcqIds = mcqs.map((mcq) => mcq._id);

        const test = await new Test({
            name,
            slug: slugify(name),
            description,
            subject,
            chapter,
            topic,
            testDuration,
            testSession,
            mcqs: mcqIds, 
        }).save();

        res.status(201).send({
            success: true,
            message: 'New test created',
            test,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating test',
        });
    }
};

// Get All Tests
const getAllTests = async (req, res) => {
    try {
        const tests = await Test.find()
            .populate('subject', 'name')
            .populate('chapter', 'name')
            .populate('topic', 'name')
            .populate('testSession', 'name')
            .populate('mcqs', 'questionText'); 

        res.status(200).send({
            success: true,
            message: 'List of all Tests',
            tests,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting all Tests',
        });
    }
};

// Get Single Test
const getTestById = async (req, res) => {
    try {
        const test = await Test.findOne({ slug: req.params.slug })
            .populate('subject', 'name')
            .populate('chapter', 'name')
            .populate('topic', 'name')
            .populate('testSession', 'name')
            .populate('mcqs', 'questionText'); 

        if (!test) {
            return res.status(404).send({
                success: false,
                message: 'Test not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Successfully Get single test',
            test,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting test',
        });
    }
};

// Update Test
const updateTest = async (req, res) => {
    try {
        const { name, description, subject, chapter, topic, testDuration, testSession } = req.body;
        const { id } = req.params;

        // Validation
        if (!name || !testDuration) {
            return res.status(400).send({ message: 'Name and Test Duration are required' });
        }

        // Fetch MCQs based on the topic
        const mcqs = await MCQ.find({ topic: topic });
        const mcqIds = mcqs.map((mcq) => mcq._id);

        const test = await Test.findByIdAndUpdate(
            id,
            {
                name,
                slug: slugify(name),
                description,
                subject,
                chapter,
                topic,
                testDuration,
                testSession,
                mcqs: mcqIds, 
            },
            { new: true }
        )
        .populate('mcqs', 'questionText'); 

        res.status(200).send({
            success: true,
            message: 'Test Updated Successfully',
            test,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating test',
        });
    }
};

// Delete Test
const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: 'Test Deleted Successfully',
            test,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while deleting test',
        });
    }
};

module.exports = {
    createTest,
    getAllTests,
    getTestById,
    updateTest,
    deleteTest,
};