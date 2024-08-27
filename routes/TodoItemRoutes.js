const express = require("express");
const TodoItemController = require("../controllers/TodoItemController");

// Déclaration des middlewares
const DatabaseMiddleware = require("../middlewares/database");
const router = express.Router();

// Création du endpoint /user pour l'ajout d'une tache
router.post(
  "/add_task",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.addOneTodoItem
);

router.post(
  "/add_team_member_to_task",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.addTeamMemberToTask
);

router.put(
  "/remove_team_member_from_task",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.removeTeamMemberFromTask
);

router.get(
  "/get_user_tasks/:id",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.findTodoItemsByUserId
);

// Création du endpoint /task pour la récupération d'une tache par le champ selectionné
router.get(
  "/get_task",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.findOneTodoItem
);

// Création du endpoint /task pour la récupération d'une tache via l'id
router.get(
  "/get_task_by_id/:id",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.findOneTodoItemById
);

// Création du endpoint /task pour la récupération de plusieurs taches
router.get(
  "/get_tasks_by_filter",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.findManyTodoItems
);

// Création du endpoint /task pour la récupération de plusieurs taches via l'idS
router.get(
  "/get_many_tasks/:page/:pageSize/:q",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.findManyTodoItems
);

// Création du endpoint /task pour la modification d'une tache
router.put(
  "/update_task/:id",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.updateOneTodoItem
);

// Création du endpoint /task pour la suppression d'une tache
router.delete(
  "/delete_task/:id",
  DatabaseMiddleware.checkConnexion,
  TodoItemController.deleteOneTodoItem
);

module.exports = router;
