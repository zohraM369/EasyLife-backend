/* Connexion à la base de donnée */
require("../utils/database");
const mongoose = require("mongoose");

// describe("AdminController", () => {
//   require("./controllers/AdminController.test");
// });

describe("MessageController", () => {
  require("./controllers/MessagesController.test");
});

describe("FriendsController", () => {
  require("./controllers/FriendsController.test");
});

describe("TasksController", () => {
  require("./controllers/TasksController.test");
});

describe("todoItemsServices", () => {
  require("./services/TodoItemService.test");
});

// describe("AdminServices", () => {
//   require("./services/AdminServices.test");
// });

describe("MessagesServices", () => {
  require("./services/MessagesServices.test");
});

// describe("UserController", () => {
//   require("./controllers/UserController.test");
// });

// describe("UserService", () => {
//   require("./services/UserService.test");
// });

describe("FriendsServices", () => {
  require("./services/FriendsServices.test");
});

describe("weatherServices", () => {
  require("./services/weatherService.test");
});

// describe("emailServices", () => {
//   require("./services/emailService.test");
// });

describe("API - Mongo", () => {
  it("Puger la db", () => {
    if (process.env.npm_lifecycle_event == "test")
      mongoose.connection.db.dropDatabase();
  });
});
