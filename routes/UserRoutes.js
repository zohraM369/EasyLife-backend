const express = require("express");
const UserController = require("../controllers/UserController");
const passport = require("../utils/passport");
const Config = require("../config");

// Middlewares
const DatabaseMiddleware = require("../middlewares/database");
const upload = require("../middlewares/upload");
const router = express.Router();
var session = require("express-session");

router.use(
  session({
    secret: Config.secret_cookie,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

router.use(passport.initialize());
router.use(passport.session());

// User Registration and Login
router.post(
  "/register",
  DatabaseMiddleware.checkConnexion,
  UserController.addOneUser
);

router.post(
  "/login",
  DatabaseMiddleware.checkConnexion,
  UserController.loginUser
);

router.post(
  "/verifyCode",
  DatabaseMiddleware.checkConnexion,
  UserController.verifyCode
);

router.post(
  "/send_reset_email",
  DatabaseMiddleware.checkConnexion,
  UserController.sendResetEmail
);

router.post(
  "/reset_password",
  DatabaseMiddleware.checkConnexion,
  UserController.ResetPasswordHandler
);


router.post(
  "/sendEmail",
  DatabaseMiddleware.checkConnexion,
  UserController.sendVerificationEmail
);
// User Updates
router.put(
  "/update_email",
  DatabaseMiddleware.checkConnexion,
  UserController.updateEmail
);

router.put(
  "/update_user_image",
  DatabaseMiddleware.checkConnexion,
  upload.single('profileImage'),
  UserController.updateUserImage
);

router.put(
  "/update_password",
  DatabaseMiddleware.checkConnexion,
  UserController.updatePassword
);

router.put(
  "/update_name",
  DatabaseMiddleware.checkConnexion,
  UserController.updateName
);

router.put(
  "/update_city",
  DatabaseMiddleware.checkConnexion,
  UserController.updateCity
);

// Add Multiple Users
router.post(
  "/users",
  DatabaseMiddleware.checkConnexion,
  UserController.addManyUsers
);

// Find Users by Field or ID
router.get(
  "/user",
  DatabaseMiddleware.checkConnexion,
  UserController.findOneUser
);

router.get(
  "/user/:id",
  DatabaseMiddleware.checkConnexion,
  UserController.findOneUserById
);


router.delete(
  "/delete_user/:id",
  DatabaseMiddleware.checkConnexion,
  UserController.deleteOneUser
);

module.exports = router;
