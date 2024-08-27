const { default: mongoose } = require("mongoose");
const TodoItemSchema = require("../schemas/TodoItem");
const TodoItemService = require("../services/TodoItemService");
const LoggerHttp = require("../utils/logger").http;
var TodoItem = mongoose.model("TodoItem", TodoItemSchema);

// La fonction permet d'ajouter une tache

module.exports.addOneTodoItem = async function (req, res) {
  try {
    let new_todoitem = new TodoItem(req.body);
    await new_todoitem.save();
    res.json({ msg: "Todo ajouté avec succés !" });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
};

module.exports.removeTeamMemberFromTask = async function (req, res) {
  try {
    const { todoId, userId } = req.body;

    let updatedTodoItem = await TodoItem.findByIdAndUpdate(todoId, {
      $pull: { team: userId },
    });

    if (!updatedTodoItem) {
      return res.status(404).json({ error: "TodoItem not found" });
    }

    res.json({ msg: "ID removed from team successfully!", updatedTodoItem });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports.addTeamMemberToTask = async function (req, res) {
  try {
    console.log("Backend data:", req.body);

    const { todoItemId, friendId } = req.body;

    const updatedTodoItem = await TodoItem.findByIdAndUpdate(
      todoItemId,
      { $push: { team: friendId } },
      { new: true, useFindAndModify: false }
    );

    if (updatedTodoItem) {
      res.json({ msg: "Friend ID added successfully!", updatedTodoItem });
    } else {
      res.status(404).json({ msg: "TodoItem not found!" });
    }
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
};

module.exports.findOneTodoItem = function (req, res) {
  LoggerHttp(req, res);
  req.log.info("Recherche d'un todo_item par un champ autorisé");
  let fields = req.query.fields;
  if (fields && !Array.isArray(fields)) fields = [fields];
  var opts = { populate: req.query.populate };
  TodoItemService.findOneTodoItem(
    fields,
    req.query.value,
    opts,
    function (err, value) {
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
    }
  );
};

module.exports.findManyTodoItems = function (req, res) {
  req.log.info("recherche plusieurs todo_items");
  let page = req.params.page;
  let pageSize = req.params.pageSize;
  let search = req.params.q;
  var opts = { populate: req.query.populate };
  TodoItemService.findManyTodoItems(
    search,
    page,
    pageSize,
    opts,
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

module.exports.findOneTodoItemById = function (req, res) {
  req.log.info("chercher un todo_item par id");
  var opts = { populate: req.query.populate };
  TodoItemService.findOneTodoItemById(
    req.params.id,
    opts,
    function (err, value) {
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
    }
  );
};

module.exports.findTodoItemsByUserId = async function (req, res) {
  try {
    const data = await TodoItem.find({
      $or: [{ user_id: req.params.id }, { team: req.params.id }],
    })
      .populate("team")
      .populate("user_id");
    res.send(data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching todo items." });
  }
};

// La fonction permet de supprimer une tache
module.exports.deleteOneTodoItem = function (req, res) {
  LoggerHttp(req, res);
  req.log.info("Suppression d'un article");
  TodoItemService.deleteOneTodoItem(req.params.id, null, function (err, value) {
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

module.exports.updateOneTodoItem = function (req, res) {
  LoggerHttp(req, res);
  req.log.info("Modification d'un todo_item");
  TodoItemService.updateOneTodoItem(
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
