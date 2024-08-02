const express = require("express");
const UserController = require("../controllers/UserController");
const bodyParser = require("body-parser");
// Déclaration des middlewares
const Config = require("../config");
const router = express.Router();
const passport = require("../utils/passport");
const DatabaseMiddleware = require("../middlewares/database");
const LoggerMiddleware = require("../middlewares/Logger");
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

// passport init
// Création du endpoint /user pour l'ajout d'un utilisateur
router.post(
  "/register",
  DatabaseMiddleware.checkConnexion,
  UserController.addOneUser
);
// Déclaration des middlewares à express
//router.use(bodyParser.json(), LoggerMiddleware.addLogger);
router.post(
  "/login",
  DatabaseMiddleware.checkConnexion,
  UserController.loginUser
);

// Création du endpoint /user pour l'ajout de plusieurs utilisateurs
router.post(
  "/users",
  DatabaseMiddleware.checkConnexion,
  UserController.addManyUsers
);

// Création du endpoint /user pour la récupération d'un utilisateur par le champ selectionné
router.get(
  "/user",
  DatabaseMiddleware.checkConnexion,
  passport.authenticate("jwt", { session: false }),
  UserController.findOneUser
);
// Création du endpoint /user pour la récupération d'un utilisateur via l'id
router.get(
  "/user/:id",
  DatabaseMiddleware.checkConnexion,
  passport.authenticate("jwt", { session: false }),
  UserController.findOneUserById
);

// Création du endpoint /user pour la récupération de plusieurs utilisateurs
router.get(
  "/users_by_filter",
  DatabaseMiddleware.checkConnexion,
  passport.authenticate("jwt", { session: false }),
  UserController.findManyUsers
);

// Création du endpoint /user pour la récupération de plusieurs utilisateurs via l'idS
router.get(
  "/users",
  DatabaseMiddleware.checkConnexion,
  passport.authenticate("jwt", { session: false }),
  UserController.findManyUsersById
);
// Création du endpoint /user pour la modification d'un utilisateur
router.put(
  "/user/:id",
  DatabaseMiddleware.checkConnexion,
  passport.authenticate("jwt", { session: false }),
  UserController.updateOneUser
);

// Création du endpoint /user pour la modification de plusieurs utilisateurs
router.put(
  "/users",
  DatabaseMiddleware.checkConnexion,
  passport.authenticate("jwt", { session: false }),
  UserController.updateManyUsers
);

// Création du endpoint /user pour la suppression d'un utilisateur
router.delete(
  "/user/:id",
  DatabaseMiddleware.checkConnexion,
  passport.authenticate("jwt", { session: false }),
  UserController.deleteOneUser
);

// Création du endpoint /user pour la suppression de plusieurs utilisateurs
router.delete(
  "/users",
  DatabaseMiddleware.checkConnexion,
  passport.authenticate("jwt", { session: false }),
  UserController.deleteManyUsers
);

module.exports = router;
