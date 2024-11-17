// 1ere chose à faire, importer les librairies
const express = require("express");
const path = require("path");

const _ = require("lodash");
const bodyParser = require("body-parser");
const Config = require("./config");
const Logger = require("./utils/logger").pino;
const userRoutes = require("./routes/UserRoutes");
const TodoItemRoutes = require("./routes/TodoItemRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const friendsRoutes = require("./routes/friendsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const landingEmailRoutes = require("./routes/landingEmailRoutes");
require("dotenv").config();

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Création de notre application express.js
const app = express();

// Démarrage de la database
require("./utils/database");

// pour etablir la connection entre back et front (cors policy)
const cors = require("cors");

app.use(cors());

//configuration Swagger
const swaggerOptions = require('./swagger.json')
const swaggerDocs = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerDocs))
// ajout de module de login
const passport = require("./utils/passport");
/*  passport init  */
app.use(passport.initialize());
// app.use(passort.session())

// Déclaration des middlewares
const LoggerMiddleware = require("./middlewares/logger");

// Déclaration des middlewares à express
app.use(bodyParser.json(), LoggerMiddleware.addLogger);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", userRoutes);

app.use("/weather", weatherRoutes);
app.use(
  "/tasks",
  passport.authenticate("jwt", { session: false }),
  TodoItemRoutes
);
app.use(
  "/messages",
  passport.authenticate("jwt", { session: false }),
  messagesRoutes
);
app.use(
  "/friends",
  passport.authenticate("jwt", { session: false }),
  friendsRoutes
);
app.use(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  adminRoutes
);
//
app.use("/", landingEmailRoutes);
app.listen(Config.port, () => {
  Logger.info(`Serveur démarré sur le port ${Config.port}.`);
});

module.exports = app;
