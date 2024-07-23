const { default: mongoose } = require("mongoose");
const TodoItemSchema = require("../schemas/TodoItem");
const TodoItemService = require("../services/TodoItemService");
const LoggerHttp = require("../utils/logger").http;
var TodoItem = mongoose.model("TodoItem", TodoItemSchema);

// La fonction permet d'ajouter un article

module.exports.addOneTodoItem =async  function (req, res) {
  try {
    console.log(req.body)
    let new_todoitem = new TodoItem(req.body);
    await new_todoitem.save()
    res.json({ msg: "todoitem ajouté avec sucess ! " })
  } catch (e) {
    res.json({ error: e })
  }
};

// La fonction permet d'ajouter plusieurs articles


// La fonction permet de chercher un article par les champs autorisé
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
  let page = req.query.page;
  let pageSize = req.query.pageSize;
  let search = req.query.q;
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
  TodoItemService.findOneTodoItemById(req.params.id, opts, function (err, value) {
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

module.exports.findTodoItemsByUserId = async function (req, res) {
  let data = await TodoItem.find({ user_id: req.params.id })
  res.send({ data: data })
}

// La fonction permet de supprimer un article
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



// La fonction permet de modifier un article
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


