const userModel = require("../Models/UserModel")
const { hashPass, comparePass } = require("../Utils/AuthUtils");
const jsonwebtoken = require("jsonwebtoken");
const Subscription = require("../Models/SubscriptionModel");
const { calculateExpirationDate } = require("../Controllers/SubscriptionController"); 

//========================Register===========================
const registerController = async (req, res) => {
  try {
      const { name, email, Phone, city, occupation, password, question } = req.body;

      // Validations
      if (!name || !email || !password || !Phone || !city || !occupation || !question) {
          return res.status(400).send({ message: "All fields are required" });
      }

      // Existing user
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
          return res.status(200).send({
              success: false,
              message: "This email address has already been registered.",
          });
      }

      // Register password
      const hashedPass = await hashPass(password);

      // Find the default subscription
      const defaultSubscription = await Subscription.findOne({ isDefault: true });

      let subscriptions = [];
      let categoryIds = []; // Initialize categoryIds

      if (defaultSubscription) {
          // Calculate expiration date using the function
          const expirationDate = await calculateExpirationDate(defaultSubscription._id);

          subscriptions = [{
              subscriptionId: defaultSubscription._id,
              action: 'default_assigned',
              date: new Date(),
              expirationDate: expirationDate,
              active: true,
          }];

          // Fetch the subscription document to get the categories
          const subscriptionDocument = await Subscription.findById(defaultSubscription._id);

          if (subscriptionDocument && subscriptionDocument.categories) {
              categoryIds = subscriptionDocument.categories;
          }
      }

      const user = await userModel.create({
          name,
          email,
          Phone,
          city,
          occupation,
          password: hashedPass,
          question,
          subscriptions: subscriptions,
          categories: categoryIds,
      });

      res.status(201).send({
          success: true,
          message: "User Registered Successfully.",
          user,
      });

  } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, error: "Error in registration", error: error.message });
  }
};
  
  //================================LOGIN====================================

const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email && !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid Email and Password",
        });
      }
      // check user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email is not registered",
        });
      }
      const match = await comparePass(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }
      // Token
      const token = await jsonwebtoken.sign(
        { _id: user._id },
        process.env.JWT_Token
      );
      res.status(200).send({
        success: true,
        message: "Login Successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.Phone,
          city: user.city,
          occupation: user.occupation,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, error: "Error in Login", error });
    }
  };


  //========================= Forget Password route===========================

const forgotPasswordController = async (req, res) => {
    try {
      const { email, question, newPassword } = req.body;
      if (!email) {
        res.status(400).send({ message: "Emai is required" });
      }
      if (!question) {
        res.status(400).send({ message: "Answer of the question is required" });
      }
      if (!newPassword) {
        res.status(400).send({ message: "New Password is required" });
      }
      //check
      const user = await userModel.findOne({ email, question });
      //validation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Wrong Email Or Answer",
        });
      }
      const hashed = await hashPass(newPassword);
      await userModel.findByIdAndUpdate(user._id, { password: hashed });
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, error: "Something went wrong", error });
    }
  };
  
  //========================= Test route===========================
const testController = (req, res) => {
    res.send("protected route");
  };

  
  //update prfole
const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, city, Phone , occupation , question } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPass(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          Phone: Phone || user.Phone,
          city: city || user.city,
          occupation: occupation || user.occupation,
          question:  question || user.question,
          email: email || user.email,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };
  
  // Get all users categorized by role (Admin only)
const getUsersByRoleController = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select("-password")
      .populate({
        path: "subscriptions.subscriptionId",
      });

    const admins = users.filter((user) => user.role === 1);
    const students = users.filter((user) => user.role === 0);

    res.status(200).json({
      success: true,
      message: "Users categorized successfully",
      data: {
        admins,
        students,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error,
    });
  }
};

  
  const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).populate('subscriptions.subscriptionId');
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: "Error in getting user" });
    }
};

  module.exports = {
    loginController,
    registerController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getUsersByRoleController,
    getUserById
  };
