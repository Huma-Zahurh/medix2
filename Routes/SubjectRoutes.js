const express = require("express");
const { requireSingIn, isAdmin } = require("../Middlewares/AuthMiddlewares");
const {
  createsubjectController,
  updatesubjectController,
  subjectController,
  singlesubjectController,
  deletesubjectController,
} = require("../Controllers/SubjectControllers");

//Route object

const route = express.Router();

//==================================Routes=======================================
// create subject
route.post("/create-subject", createsubjectController);

//Update subject
route.put(
  "/update-subject/:id",
  requireSingIn,
  isAdmin,
  updatesubjectController
);

// Get all categories
route.get("/get-subject", subjectController);

// single subject
route.get("/single-subject/:slug", singlesubjectController);

//Delete subject
route.delete(
  "/delete-subject/:id",
  requireSingIn,
  isAdmin,
  deletesubjectController
);

module.exports = route;