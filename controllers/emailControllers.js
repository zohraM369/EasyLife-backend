const emailServices = require("../services/emailServices.js");

const sendLandingEmail = async (req, res) => {
  // Email options
  let result = await emailServices.sendLandingEmail;
  return result;
};
module.exports = { sendLandingEmail };
