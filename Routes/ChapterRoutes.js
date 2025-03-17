const express = require("express");
const { requireSingIn, isAdmin } = require("../Middlewares/AuthMiddlewares");
const {
  createChapterController,
  updateChapterController,
  getAllChaptersController,
  getSingleChapterController,
  deleteChapterController,
  getOneChapterController
} = require("../Controllers/ChapterController");

const route = express.Router();

// Create Chapter
route.post("/create-chapter", requireSingIn, isAdmin, createChapterController);

// Update Chapter
route.put("/update-chapter/:id", requireSingIn, isAdmin, updateChapterController);

// Get All Chapters
route.get("/get-chapters", getAllChaptersController);

// Get Single Chapter
route.get("/single-chapter/:slug", getSingleChapterController);

// Delete Chapter
route.delete("/delete-chapter/:id", requireSingIn, isAdmin, deleteChapterController);


module.exports = route;
