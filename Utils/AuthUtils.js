const bcrypt = require("bcrypt");

exports.hashPass = async (password) => {
  try {
    console.log(password);
    const saltRounds = 12;
    const hashedPass = await bcrypt.hash(password, saltRounds);
    return hashedPass;
  } catch (error) {
    console.log(error);
  }
};

exports.comparePass = async (password, hashedPass) => {
  return bcrypt.compare(password, hashedPass);
};