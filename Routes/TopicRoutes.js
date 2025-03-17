const express = require("express");
const { requireSingIn, isAdmin } = require("../Middlewares/AuthMiddlewares");
const {
  createTopicController,
  updateTopicController,
  getAllTopicsController,
  getSingleTopicController,
  deleteTopicController,
} = require("../Controllers/TopicControllers");

const router = express.Router();

// Create Topic
router.post("/create-topic", requireSingIn, isAdmin, createTopicController);

// Update Topic
router.put("/update-topic/:id", requireSingIn, isAdmin, updateTopicController);

// Get All Topics
router.get("/get-topics", getAllTopicsController);

// Get Single Topic
router.get("/single-topic/:slug", getSingleTopicController);

// Delete Topic
router.delete("/delete-topic/:id", requireSingIn, isAdmin, deleteTopicController);

module.exports = router;
