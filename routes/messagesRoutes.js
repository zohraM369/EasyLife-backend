const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messagesController");

router.post("/create_message", messageController.createMessage);
router.get("/get_user_messages/:userId", messageController.getMessagesByUserId);
router.get("/get_people_chat/:id/:x", messageController.getPeopleChat);

router.get(
  "/get_people_talked_with/:id",
  messageController.getPeopleTalkedWith
);

router.delete("/delete_message/:messageId", messageController.deleteMessage);
module.exports = router;
