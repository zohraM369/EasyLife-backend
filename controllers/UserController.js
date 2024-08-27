const passport = require("passport");
const UserService = require("../services/UserService");
const LoggerHttp = require("../utils/logger").http;
const UserSchema = require("../schemas/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const LoginEvent = require("../schemas/LoginEvent");
var User = mongoose.model("User", UserSchema);

module.exports.sendResetEmail = async (req, res) => {
  console.log(req.body);
  try {
    let result = await UserService.sendResetPasswordEmail(req.body);
    console.log(result);
    if (result.result) {
      return res.json(result);
    } else {
      return res.json(result);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.json({ msg: "Failed to send verification code" });
  }
};

module.exports.ResetPasswordHandler = async (req, res) => {
  try {
    const result = await UserService.ResetPasswordHandler(req.body);
    if (result.result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({ msg: "Failed to send verification code" });
  }
};

module.exports.sendVerificationEmail = async (req, res) => {
  const { email, code } = req.body;
  console.log(req.body);
  try {
    const result = await UserService.sendVerificationEmail(req.body);
    if (result) {
      return res
        .status(200)
        .json({ msg: "Verification code sent successfully" });
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    return res.status(500).json({ msg: "Failed to send verification code" });
  }
};

// verifier code
module.exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await UserService.verifyCode(email, code);
    if (result) {
      return res
        .status(200)
        .json({ msg: "Verification successful", user: result.user });
    } else {
      return res.status(400).json({ msg: "Invalid verification code" });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).json({ msg: "Failed to verify code" });
  }
};

module.exports.updateEmail = async function (req, res) {
  const { userId, newEmail, password } = req.body;

  if (!userId || !newEmail || !password) {
    return res.json({ error: "User ID, new email, and password are required" });
  }

  try {
    const user = await User.findById(userId);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ error: "Mot de passe incorrecte" });
    }

    const emailTaken = await User.findOne({ email: newEmail });
    if (emailTaken) {
      return res.json({ error: "Addresse E-mail est déja utilisé" });
    }

    user.email = newEmail;
    await user.save();

    res.json({
      message: "image profile a été mis a jour avec succes ! ",
      user: user,
    });
  } catch (error) {
    console.error("Error updating email:", error);
    res.json({ error: "Internal server error" });
  }
};

module.exports.updateName = async function (req, res) {
  const { userId, newName, password } = req.body;

  if (!userId || !newName || !password) {
    return res.json({ error: "User ID, new email, and password are required" });
  }

  try {
    const user = await User.findById(userId);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ error: "Mot de passe incorrecte" });
    }

    user.name = newName;
    await user.save();

    res.json({
      message: "image profile a été mis a jour avec succes ! ",
      user: user,
    });
  } catch (error) {
    console.error("Error updating email:", error);
    res.json({ error: "Internal server error" });
  }
};

module.exports.updateCity = async function (req, res) {
  const { userId, newCity, password } = req.body;

  if (!userId || !newCity || !password) {
    return res.json({ error: "User ID, new email, and city are required" });
  }

  try {
    const user = await User.findById(userId);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ error: "Mot de passe incorrecte" });
    }

    console.log(newCity);
    user.city = newCity;
    await user.save();

    res.json({ message: "Ville a été mis a jour avec succes ! ", user: user });
  } catch (error) {
    console.error("Error updating city:", error);
    res.json({ error: "Internal server error" });
  }
};

module.exports.updatePassword = async function (req, res) {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.json({
      error: "User ID, old password, and new password are required",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.json({ error: "Mot de passe actuel incorrecte" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({
      message: "image profile a été mis a jour avec succes ! ",
      user: user,
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.json({ error: "Internal server error" });
  }
};

module.exports.updateUserImage = async function (req, res) {
  const { user_id } = req.body;
  try {
    let user = await User.findOne({ _id: user_id });
    if (!user) {
      return res.json({ error: "address _id n'existe pas " });
    }

    if (req.file) {
      user.image = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({
        message: "image profile a été mis a jour avec succes ! ",
        user: user,
      });
    } else {
      res.status(400).json({ error: "Invalid file type or file too large" });
    }
  } catch (e) {
    res.status(500).json({ erreur: e });
  }
};

// la fonction pour gerer l'authentificationdepuis passport
module.exports.loginUser = async function (req, res, next) {
  passport.authenticate(
    "login",
    { badRequestMessage: "Les champs sont manquants." },
    async function (err, user) {
      if (err) {
        res.statusCode = 401;
        return res.send({
          msg: "Le nom d'utilisateur ou le mot de passe n'est pas correct",
          type_error: "no-valid-login",
        });
      }
      req.logIn(user, async function (err) {
        if (err) {
          res.statusCode = 500;
          return res.send({
            msg: "Probleme d'authentification sur le serveur.",
            type_error: "internal",
          });
        } else {
          let newLoginEvent = new LoginEvent({
            userId: user._id,
            loginTime: Date.now(),
          });
          await newLoginEvent.save();
          return res.send({ msg: "connecté avec succes", user: user });
        }
      });
    }
  )(req, res, next);
};

module.exports.addOneUser = async function (req, res) {
  const { name, email, password } = req.body;

  // Check if any of the required fields are empty or null
  if (!name || !email || !password) {
    return res.status(405).json({
      error: "Name, email, and password are required and cannot be empty.",
    });
  }

  try {
    // Check if the user already exists
    let user = await User.findOne({ email: email });

    if (user) {
      return res.status(405).json({ error: "Email already in use." });
    } else {
      let newUser = new User(req.body);

      // Generate a salt and hash the password
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Server error while generating salt." });
        }

        bcrypt.hash(password, salt, async (err, hashedPassword) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "Server error while hashing password." });
          }

          // Assign the hashed password to the new user
          newUser.password = hashedPassword;

          // Save the new user to the database
          await newUser.save();

          // Return a success message
          res.json({ msg: "Account created successfully!" });
        });
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// La fonction permet d'ajouter plusieurs utilisateurs
module.exports.addManyUsers = function (req, res) {
  req.log.info("Création de plusieurs utilisateurs");
  UserService.addManyUsers(req.body, null, function (err, value) {
    if (err) {
      res.statusCode = 405;
      res.send(err);
    } else {
      res.statusCode = 201;
      res.send(value);
    }
  });
};

// La fonction permet de chercher un utilisateur
module.exports.findOneUserById = function (req, res) {
  req.log.info("Recherche d'un utilisateur par son id");
  UserService.findOneUserById(req.params.id, null, function (err, value) {
    if (err && err.type_error == "no-found") {
      res.statusCode = 404;
      res.send(err);
    } else if (err && err.type_error == "no-valid") {
      res.statusCode = 405;
      res.send(err);
    } else if (err && err.type_error == "error-mongo") {
      res.statusCode = 500;
      res.send(err);
    } else {
      res.statusCode = 200;
      res.send(value);
    }
  });
};

// La fonction permet de chercher un utilisateur par les champs autorisé
module.exports.findOneUser = function (req, res) {
  LoggerHttp(req, res);
  req.log.info("Recherche d'un utilisateur par un champ autorisé");
  let fields = req.query.fields;
  if (fields && !Array.isArray(fields)) fields = [fields];
  UserService.findOneUser(fields, req.query.value, null, function (err, value) {
    if (err && err.type_error == "no-found") {
      res.statusCode = 404;
      res.send(err);
    } else if (err && err.type_error == "no-valid") {
      res.statusCode = 405;
      res.send(err);
    } else if (err && err.type_error == "error-mongo") {
      res.statusCode = 500;
      res.send(err);
    } else {
      res.statusCode = 200;
      res.send(value);
    }
  });
};

// La fonction permet de chercher plusieurs utilisateurs
module.exports.findManyUsersById = function (req, res) {
  LoggerHttp(req, res);
  req.log.info("Recherche de plusieurs utilisateurs", req.query.id);
  var arg = req.query.id;
  if (arg && !Array.isArray(arg)) arg = [arg];
  UserService.findManyUsersById(arg, null, function (err, value) {
    if (err && err.type_error == "no-found") {
      res.statusCode = 404;
      res.send(err);
    } else if (err && err.type_error == "no-valid") {
      res.statusCode = 405;
      res.send(err);
    } else if (err && err.type_error == "error-mongo") {
      res.statusCode = 500;
      res.send(err);
    } else {
      res.statusCode = 200;
      res.send(value);
    }
  });
};
module.exports.findManyUsers = function (req, res) {
  req.log.info("recherche plusieurs utilistaeurs");
  let page = req.query.page;
  let pageSize = req.query.pageSize;
  let search = req.query.q;
  UserService.findManyUsers(
    search,
    page,
    pageSize,
    null,
    function (err, value) {
      if (err && err.type_error == "no-valid") {
        res.statusCode = 405;
        res.send(err);
      } else if (err && err.type_error == "error-mongo") {
        res.statusCode = 500;
        res.send(err);
      } else {
        res.statusCode = 200;
        res.send(value);
      }
    }
  );
};

// La fonction permet de supprimer un utilisateur
module.exports.deleteOneUser = function (req, res) {
  LoggerHttp(req, res);
  req.log.info("Suppression d'un utilisateur");
  UserService.deleteOneUser(req.params.id, null, function (err, value) {
    res.statusCode = 200;
    res.send(value);
  });
};

// La fonction permet de supprimer plusieurs utilisateurs
// module.exports.deleteManyUsers = function (req, res) {
//   LoggerHttp(req, res);
//   req.log.info("Suppression de plusieurs utilisateur");
//   var arg = req.query.id;
//   if (arg && !Array.isArray(arg)) arg = [arg];
//   UserService.deleteManyUsers(arg, null, function (err, value) {
//     if (err && err.type_error == "no-found") {
//       res.statusCode = 404;
//       res.send(err);
//     } else if (err && err.type_error == "no-valid") {
//       res.statusCode = 405;
//       res.send(err);
//     } else if (err && err.type_error == "error-mongo") {
//       res.statusCode = 500;
//     } else {
//       res.statusCode = 200;
//       res.send(value);
//     }
//   });
// };

// La fonction permet de modifier un utilisateur
module.exports.updateOneUser = function (req, res) {
  LoggerHttp(req, res);
  req.log.info("Modification d'un utilisateur");
  UserService.updateOneUser(
    req.params.id,
    req.body,
    null,
    function (err, value) {
      if (err && err.type_error == "no-found") {
        res.statusCode = 404;
        res.send(err);
      } else if (
        err &&
        (err.type_error == "no-valid" ||
          err.type_error == "validator" ||
          err.type_error == "duplicate")
      ) {
        res.statusCode = 405;
        res.send(err);
      } else if (err && err.type_error == "error-mongo") {
        res.statusCode = 500;
      } else {
        res.statusCode = 200;
        res.send(value);
      }
    }
  );
};

// La fonction permet de modifier plusieurs utilisateurs
module.exports.updateManyUsers = function (req, res) {
  LoggerHttp(req, res);
  req.log.info("Modification de plusieurs utilisateurs");
  var arg = req.query.id;
  if (arg && !Array.isArray(arg)) arg = [arg];
  var updateData = req.body;
  UserService.updateManyUsers(arg, updateData, null, function (err, value) {
    if (err && err.type_error == "no-found") {
      res.statusCode = 404;
      res.send(err);
    } else if (
      err &&
      (err.type_error == "no-valid" ||
        err.type_error == "validator" ||
        err.type_error == "duplicate")
    ) {
      res.statusCode = 405;
      res.send(err);
    } else if (err && err.type_error == "error-mongo") {
      res.statusCode = 500;
    } else {
      res.statusCode = 200;
      res.send(value);
    }
  });
};
