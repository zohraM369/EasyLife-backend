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

const sendLandingEmail = async (data) => {
  const mailOptions = {
    from: data.email,
    to: "chadly_zohra@hotmail.com",
    subject: `Message de ${data.username}`,
    html: `<div> <p>${data.message}</p><p>Numéro Tel: +216 ${data.phone}</p></div>`,
  };
  // envoie email
  let result = await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("noipe error");
    } else {
      console.log("email sent succesuflly");
      res.send("email sent succesuflly");
      console.log(data);
    }
  });

  return true;
};

const sendVerificationCode = async (data) => {
  // Email options
  const mailOptions = {
    from: "admin@gmail.com",
    to: data.email,
    subject: "Alert",
    html: `<div><h1>Veuillez utiliser ce code :  </h1> <p>${data.code}</p></div>`,
  };

  // Send the email
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

const sendResetPasswordEmail = async (data) => {
  const mailOptions = {
    from: "admin@gmail.com",
    to: data.email, // user.email
    subject: "Alert",
    html: `
        <div>
          <h1>Réinitialisation du mot de passe</h1>
          <p>Réinitialisez votre mot de passe en cliquant sur le lien suivant :</p>
          <a href="${process.env.FRONTURL}/reset_password/${data.randomCode}">Cliquez ici</a>
        </div>
      `,
  };

  // envoie email
  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendLandingEmail,
  sendVerificationCode,
  sendResetPasswordEmail,
};
