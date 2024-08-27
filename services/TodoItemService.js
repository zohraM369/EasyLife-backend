const _ = require("lodash");
const async = require("async");
const mongoose = require("mongoose");
const TodoItemSchema = require("../schemas/TodoItem");
const ObjectId = mongoose.Types.ObjectId;

var TodoItem = mongoose.model("TodoItem", TodoItemSchema);

TodoItem.createIndexes();

module.exports.addOneTodoItem = async function (data, options, callback) {
  try {
    console.log("donnes du backend",data)
    let new_todoitem = new TodoItem(data);
    await new_todoitem.save()
    callback({ msg: "todoitem ajouté avec sucess ! " })
  } catch (e) {
    callback({ error: e })
  }
};



module.exports.findManyTodoItems = function (q, page, limit, options, callback) {
  page = !page ? 1 : page;
  limit = !limit ? 1 : limit;
  var populate = options && options.populate ? ["user_id"] : [];

  page = !Number.isNaN(page) ? Number(page) : page;
  limit = !Number.isNaN(limit) ? Number(limit) : limit;
  const queryMongo = q
    ? {
      $or: _.map(["title", "description"], (e) => {
        return { [e]: { $regex: `^${q}`, $options: "i" } };
      }),
    }
    : {};
  if (Number.isNaN(page) || Number.isNaN(limit)) {
    callback({
      msg: `format de ${Number.isNaN(page) ? "page" : "limit"} est incorrect`,
      type_error: "no-valid",
    });
  } else {
    TodoItem.countDocuments(queryMongo)
      .then((value) => {
        if (value > 0) {
          const skip = (page - 1) * limit;
          TodoItem.find(queryMongo, null, {
            skip: skip,
            limit: limit,
            populate: populate,
            lean: true,
          }).then((results) => {
            callback(null, {
              count: value,
              results: results,
            });
          });
        } else {
          callback(null, { count: 0, results: [] });
        }
      })
      .catch((e) => {
        console.log(e);
        callback(e);
      });
  }
};

module.exports.findOneTodoItemById = function (todo_item, options, callback) {
  var opts = { populate: options && options.populate ? ["user_id"] : [] };

  if (todo_item && mongoose.isValidObjectId(todo_item)) {
    TodoItem.findById(todo_item, null, opts).populate('team')
      .then((value) => {
        try {
          if (value) {
            callback(null, value.toObject());
          } else {
            callback({
              msg: "Aucun todo_item trouvé.",
              type_error: "no-found",
            });
          }
        } catch (e) { }
      })
      .catch((err) => {
        callback({
          msg: "Impossible de chercher l'élément.",
          type_error: "error-mongo",
        });
      });
  } else {
    callback({ msg: "ObjectId non conforme.", type_error: "no-valid" });
  }
};

module.exports.findOneTodoItem = function (tab_field, value, options, callback) {
  var field_unique = ["title", "description"];
  var opts = {
    populate: options && options.populate ? ["user_id"] : [],
  };

  if (
    tab_field &&
    Array.isArray(tab_field) &&
    value &&
    _.filter(tab_field, (e) => {
      return field_unique.indexOf(e) == -1;
    }).length == 0
  ) {
    var obj_find = [];
    _.forEach(tab_field, (e) => {
      obj_find.push({ [e]: value });
    });
    TodoItem.findOne({ $or: obj_find }, null, opts)
      .then((value) => {
        if (value) callback(null, value.toObject());
        else {
          callback({ msg: "todoitem non trouvé.", type_error: "no-found" });
        }
      })
      .catch((err) => {
        callback({ msg: "Error interne mongo", type_error: "error-mongo" });
      });
  } else {
    let msg = "";
    if (!tab_field || !Array.isArray(tab_field)) {
      msg += "Les champs de recherche sont incorrecte.";
    }
    if (!value) {
      msg += msg
        ? " Et la valeur de recherche est vide"
        : "La valeur de recherche est vide";
    }
    if (
      _.filter(tab_field, (e) => {
        return field_unique.indexOf(e) == -1;
      }).length > 0
    ) {
      var field_not_authorized = _.filter(tab_field, (e) => {
        return field_unique.indexOf(e) == -1;
      });
      msg += msg
        ? ` Et (${field_not_authorized.join(
          ","
        )}) ne sont pas des champs de recherche autorisé.`
        : `Les champs (${field_not_authorized.join(
          ","
        )}) ne sont pas des champs de recherche autorisé.`;
      callback({
        msg: msg,
        type_error: "no-valid",
        field_not_authorized: field_not_authorized,
      });
    } else {
      callback({ msg: msg, type_error: "no-valid" });
    }
  }
};


module.exports.updateOneTodoItem = function (
  todo_item,
  update,
  options,
  callback
) {
  if (todo_item && mongoose.isValidObjectId(todo_item)) {
    TodoItem.findByIdAndUpdate(new ObjectId(todo_item), update, {
      returnDocument: "after",
      runValidators: true,
    })
      .then((value) => {
        try {
          if (value) callback(null, value.toObject());
          else
            callback({
              msg: "todo_item non trouvé.",
              type_error: "no-found",
            });
        } catch (e) {
          callback(e);
        }
      })
      .catch((errors) => {
        console.log(errors)
        if (errors.code === 11000) {
          var field = Object.keys(errors.keyPattern)[0];
          const duplicateErrors = {
            msg: `Duplicate key error: ${field} must be unique.`,
            fields_with_error: [field],
            fields: { [field]: `The ${field} is already taken.` },
            type_error: "duplicate",
          };
          callback(duplicateErrors);
        } else {
          errors = errors["errors"];
          var text = Object.keys(errors)
            .map((e) => {
              return errors[e]["properties"]["message"];
            })
            .join(" ");
          var fields = _.transform(
            Object.keys(errors),
            function (result, value) {
              result[value] = errors[value]["properties"]["message"];
            },
            {}
          );
          var err = {
            msg: text,
            fields_with_error: Object.keys(errors),
            fields: fields,
            type_error: "validator",
          };
          callback(err);
        }
      });
  } else {
    callback({ msg: "Id invalide.", type_error: "no-valid" });
  }
};


module.exports.deleteOneTodoItem = function (todo_item_id, options, callback) {
  if (todo_item_id && mongoose.isValidObjectId(todo_item_id)) {
    TodoItem.findByIdAndDelete(todo_item_id)
      .then((value) => {
        try {
          if (value) callback(null, value.toObject());
          else
            callback({
              msg: "todo_item non trouvé.",
              type_error: "no-found",
            });
        } catch (e) {
          callback(e);
        }
      })
      .catch((e) => {
        callback({
          msg: "Impossible de chercher l'élément.",
          type_error: "error-mongo",
        });
      });
  } else {
    callback({ msg: "Id invalide.", type_error: "no-valid" });
  }
};

