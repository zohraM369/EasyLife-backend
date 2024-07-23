const express = require("express");
const TodoItemController = require("../controllers/TodoItemController");

// Déclaration des middlewares
const DatabaseMiddleware = require("../middlewares/database");
const router = express.Router();

// Création du endpoint /user pour l'ajout d'un utilisateur
router.post(
  "/add_todo_item",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.addOneTodoItem
);

router.get('/get_user_todo_items/:id', DatabaseMiddleware.checkConnexion,
  TodoItemController.findTodoItemsByUserId)

// Création du endpoint /user pour la récupération d'un utilisateur par le champ selectionné
router.get(
  "/todo_item",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.findOneTodoItem
);

// Création du endpoint /user pour la récupération d'un utilisateur via l'id
router.get(
  "/todo_item/:id",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.findOneTodoItemById
);

// Création du endpoint /user pour la récupération de plusieurs utilisateurs
router.get(
  "/todo_items_by_filter",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.findManyTodoItems
);

// Création du endpoint /user pour la récupération de plusieurs utilisateurs via l'idS
router.get(
  "/todo_items",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.findManyTodoItems
);

// Création du endpoint /user pour la modification d'un utilisateur
router.put(
  "/todo_item/:id",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.updateOneTodoItem
);



// Création du endpoint /user pour la suppression d'un utilisateur
router.delete(
  "/todo_item/:id",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.deleteOneTodoItem
);



module.exports = router;
