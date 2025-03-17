const Category = require('../Models/CategoryModel');
const MCQ = require('../Models/McqModel');
const StudyMaterial = require('../Models/StudyMaterialModel');
const slugify = require('slugify');

// Create Category
const createCategory = async (req, res) => {
    try {
        const { name, description, subjects, chapters, topics, contentType } = req.body;

        // Validation
        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }
        if (!contentType) {
            return res.status(400).send({ message: 'Content Type is required' });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: 'Category Already Exists',
            });
        }

        const category = await new Category({
            name,
            slug: slugify(name),
            description,
            subjects,
            chapters,
            topics,
            contentType,
        }).save();

        res.status(201).send({
            success: true,
            message: 'New category created',
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating category',
        });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    try {
        const { name, description, subjects, chapters, topics, contentType } = req.body;
        const { id } = req.params;

        // Validation
        if (!name) {
            return res.status(400).send({ message: 'Name is required' });
        }
        if (!contentType) {
            return res.status(400).send({ message: 'Content Type is required' });
        }

        const category = await Category.findByIdAndUpdate(
            id,
            {
                name,
                slug: slugify(name),
                description,
                subjects,
                chapters,
                topics,
                contentType,
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: 'Category Updated Successfully',
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in updating category',
        });
    }
};

// Get All Categories
const getAllCategories = async (req, res) => {
    try {
        let query = Category.find();

        if (req.query.contentType) {
            query = query.where('contentType').equals(req.query.contentType);
        }

        const categories = await query
            .populate('subjects', 'name')
            .populate('chapters', 'name')
            .populate('topics', 'name');

        res.status(200).send({
            success: true,
            message: 'List of all Categories',
            categories,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting all Categories',
        });
    }
};


// Get Single Category
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug })
            .populate({
                path: 'subjects',
                select: 'name _id', 
            })
            .populate({
                path: 'chapters',
                select: 'name _id subject', 
                populate: {
                    path: 'subject',
                    select: '_id', 
                },
            })
            .populate({
                path: 'topics',
                select: 'name slug _id chapter', 
                populate: {
                    path: 'chapter',
                    select: '_id', 
                },
            });

        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Successfully Get single category',
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting category',
        });
    }
};


// Delete Category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: 'Category Deleted Successfully',
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while deleting category',
        });
    }
};

module.exports = {
    createCategory,
    updateCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory,
};