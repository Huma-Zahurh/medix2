const express = require("express");
const { requireSingIn, isAdmin } = require("../Middlewares/AuthMiddlewares");
const {
    createStudyMaterial,
    getAllStudyMaterials,
    getMaterialById,
    updateMaterial,
    deleteStudyMaterial 
} = require("../Controllers/StudyMaterialControllers");
const {studyMaterialUpload} = require("../Middlewares/Multer");

const route = express.Router();

// Creating Material 
route.post("/create-material", requireSingIn, isAdmin, studyMaterialUpload.single("file"), createStudyMaterial);

// Get all study materials 
route.get("/get-study-material", getAllStudyMaterials);

// Get Single Material
route.get("/single-material/:id", getMaterialById);

//  Update Study Material
route.put("/update-material/:id", requireSingIn, isAdmin , studyMaterialUpload.single('file') , updateMaterial);

// Delete Material
route.delete("/delete-material/:id",  requireSingIn, isAdmin, deleteStudyMaterial); 

module.exports = route;
