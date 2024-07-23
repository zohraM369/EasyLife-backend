// 1ere chose à faire, importer les librairies
const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const Config = require("./config");
const Logger = require("./utils/logger").pino;
const userRoutes = require('./routes/UserRoutes')
const TodoItemRoutes = require('./routes/TodoItemRoutes')
// pour etablir la connection entre back et front (cors policy)
const cors = require('cors')
// Création de notre application express.js
const app = express();
app.use(cors())
// Démarrage de la database
require("./utils/database");

// ajout de module de login
const passport = require("./utils/passport");
/*  passport init  */
app.use(passport.initialize());
// app.use(passort.session())

// Déclaration des controllers pour l'utilisateur

// Déclaration des middlewares
const LoggerMiddleware = require("./middlewares/logger");

// Déclaration des middlewares à express
app.use(bodyParser.json(), LoggerMiddleware.addLogger);

/*--------------------- Création des routes (User - Utilisateur) ---------------------*/

// création du endpoint /login pour connecter un utilisateur

app.use('/', userRoutes)
app.use('/', TodoItemRoutes)



// 2e chose à faire : Créer le server avec app.listen
app.listen(Config.port, () => {
  Logger.info(`Serveur démarré sur le port ${Config.port}.`);
});

module.exports = app;


// pour lancer uniquement le backend taper npm run backend 
