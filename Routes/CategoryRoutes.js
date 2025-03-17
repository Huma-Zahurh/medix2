const express = require('express');
const { requireSingIn, isAdmin } = require("../Middlewares/AuthMiddlewares");
const route = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require('../Controllers/CategoryControllers');

// Create Category
route.post('/create-category', requireSingIn, isAdmin, createCategory);

// Get All Categories
route.get('/get-categories', getAllCategories); 

// Get single Category
route.get('/get-category/:slug', getCategoryById);

// Update Category
route.put('/update-category/:id', requireSingIn, isAdmin, updateCategory);

// Delete Category
route.delete('/delete-category/:id', requireSingIn, isAdmin, deleteCategory);

module.exports = route;