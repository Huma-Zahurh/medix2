const express = require("express");
const { requireSingIn, isAdmin } = require("../Middlewares/AuthMiddlewares");
const {
  createtestSessionController,
  updatetestSessionController,
  testSessionController,
  singletestSessionController,
  deletetestSessionController,
} = require("../Controllers/TestSessionControllers");

//Route object

const route = express.Router();

//==================================Routes=======================================
// create testSession
route.post("/create-testSession", createtestSessionController);

//Update testSession
route.put(
  "/update-testSession/:id",
  requireSingIn,
  isAdmin,
  updatetestSessionController
);

// Get all categories
route.get("/get-testSession", testSessionController);

// single testSession
route.get("/single-testSession/:slug", singletestSessionController);

//Delete testSession
route.delete(
  "/delete-testSession/:id",
  requireSingIn,
  isAdmin,
  deletetestSessionController
);

module.exports = route;