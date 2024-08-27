const messageService = require("../services/messagesService");

const createMessage = async (req, res) => {
  try {
    const messageData = {
      user_id: req.body.user_id,
      content: req.body.content,
      recipientId: req.body.recipientId,
    };
    const message = await messageService.createMessage(messageData);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessagesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await messageService.getMessagesByUserId(userId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPeopleChat = async (req, res) => {
  try {
    let data = await messageService.getPeopleChat(req.params.id, req.params.x);
    res.status(200).json(data);
  } catch (error) {
    res.json({ error: error });
  }
};

const getPeopleTalkedWith = async (req, res) => {
  try {
    let data = await messageService.getPeopleTalkedWith(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    res.json({ error: error });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    await messageService.deleteMessage(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMessage,
  deleteMessage,
  getPeopleChat,
  getMessagesByUserId,
  getPeopleTalkedWith,
};
