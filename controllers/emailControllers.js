// bib de l'envoie de l'email
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "nourhb58@gmail.com",
    pass: "MWDYR8NzHBpO1jgK",
  },
});

const sendLandingEmail = async (req, res) => {
  // Email options
  const mailOptions = {
    from: req.body.email,
    to: "chadly_zohra@hotmail.com",
    subject: `Message de ${req.body.username}`,
    html: `<div> <p>${req.body.message}</p><p>Numéro Tel: +216 ${req.body.phone}</p></div>`,
  };

  // envoie email
  await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("noipe error");
    } else {
      console.log("email sent succesuflly");
      res.send("email sent succesuflly");
    }
  });

  return true;
};
module.exports = { sendLandingEmail };
