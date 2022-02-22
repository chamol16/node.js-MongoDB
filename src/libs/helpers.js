const bcrypt = require("bcryptjs");
const helpers = {};

//sign up
helpers.encryptPassword = async (password) => {
  //getSalt() = creates a hash
  const salt = await bcrypt.genSalt(10);
  //hash() = needs a hash to create encrypted data
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

//sign in
helpers.matchPassword = async function (password, savedPassword) {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (error) {
    console.log(error);
  }
  //compare: compares the input password with DB password(this)
};

module.exports = helpers;