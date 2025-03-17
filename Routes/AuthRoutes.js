const express = require("express");
const {
  loginController,
  registerController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getUsersByRoleController,
  getUserById
} = require("../Controllers/AuthControllers");
const { requireSingIn, isAdmin } = require("../Middlewares/AuthMiddlewares");


//Route object
const route = express.Router();

//==================================Routes================================================

// Register post route
route.post("/register", registerController);

// Login post route
route.post("/login", loginController);

//Forgot Password
route.post("/forgot-password", forgotPasswordController);

// Test Route
route.get("/test", requireSingIn, isAdmin, testController);

//Protected user route
route.get("/user-auth", requireSingIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//Protected admin route
route.get("/admin-auth", requireSingIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
route.put("/profile", requireSingIn, updateProfileController);

// Get categorized users (Only Admin)
route.get("/categorized-users", requireSingIn, isAdmin, getUsersByRoleController);

// Get user
route.get("/user/:id", requireSingIn, getUserById);

module.exports = route;