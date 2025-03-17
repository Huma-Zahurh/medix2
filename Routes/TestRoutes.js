const express = require('express');
const { requireSingIn, isAdmin } = require('../Middlewares/AuthMiddlewares');
const route = express.Router();
const {
    createTest,
    getAllTests,
    getTestById,
    updateTest,
    deleteTest,
} = require('../Controllers/TestController');

// Create Test
route.post('/create-test', requireSingIn, isAdmin, createTest);

// Get All Tests
route.get('/get-tests', getAllTests);

// Get single Test
route.get('/get-test/:slug', getTestById);

// Update Test
route.put('/update-test/:id', requireSingIn, isAdmin, updateTest);

// Delete Test
route.delete('/delete-test/:id', requireSingIn, isAdmin, deleteTest);

module.exports = route;