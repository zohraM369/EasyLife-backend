const mongoose = require("mongoose");
const Logger = require("./logger").pino;
const Config = require("../config");

mongoose.connection.on("connected", () =>
  Logger.info("connecté a la base de donné")
);

mongoose.connection.on("open", () =>
  Logger.info("connection a la base de donné")
);

mongoose.connection.on("disconnected", () =>
  Logger.error("deconnecté a la base de donné")
);

mongoose.connection.on("reconnected", () =>
  Logger.info("reconnection a la base de donné")
);

mongoose.connection.on("disconnecting", () =>
  Logger.error("deconnection a la base de donné")
);

mongoose.connection.on("close", () =>
  Logger.info("connection a la base de donné est fermé")
);

mongoose.connect(
  `${Config.url_database}/${
    process.env.npm_lifecycle_event == "test"
      ? "easy_life_test"
      : "easy_life_prod"
  }`
);
