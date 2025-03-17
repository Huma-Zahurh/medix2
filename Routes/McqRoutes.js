const express = require("express");
const { requireSingIn, isAdmin } = require("../Middlewares/AuthMiddlewares");
const {
    addMCQ,
    getAllMCQs,
    getMCQById,
    updateMCQ,
    deleteMCQ
} = require("../Controllers/McqControllers");

const route = express.Router();

// Create MCQ
route.post("/create-mcq", requireSingIn, isAdmin, addMCQ);

// Update MCQ
route.put("/update-mcq/:id", requireSingIn, isAdmin, updateMCQ);

// Get All MCQs
route.get("/get-mcqs", getAllMCQs);

// Get Single MCQ
route.get("/single-mcq/:id", getMCQById);

// Delete MCQ
route.delete("/delete-mcq/:id", requireSingIn, isAdmin, deleteMCQ);


module.exports = route;
