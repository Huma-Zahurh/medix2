const jsonwebtoken = require("jsonwebtoken");
const userModel = require("../Models/UserModel");


exports.requireSingIn = (req, res, next) => {
  try {
    const decode = jsonwebtoken.verify(
      req.headers.authorization,
      process.env.JWT_Token
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};


// admin access
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};