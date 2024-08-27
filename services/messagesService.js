const { default: mongoose } = require("mongoose");
const messageSchema = require("../schemas/Message");
var Message = mongoose.model("Message", messageSchema);

class MessageService {
  async createMessage(messageData) {
    try {
      const newChatModel = new Message(messageData);
      let result = await newChatModel.save();
      return result;
    } catch (error) {
      console.log(error);
      return {
        message: " erreur lors de la creation de messages",
        error: error,
      };
    }
  }

  async getMessagesByUserId(id) {
    let result = await Message.find({
      $or: [
        {
          user_id: id,
        },
        {
          recipientId: id,
        },
      ],
    });

    return result;
  }

  async getPeopleChat(id, x) {
    let result = Message.find({
      $or: [
        {
          $and: [{ user_id: id }, { recipientId: x }],
        },
        {
          $and: [{ recipientId: id }, { user_id: x }],
        },
      ],
    })

      .populate("user_id")
      .populate("recipientId");
    // .distinct("sender")

    return result;
  }

  // chercher les users amis soit avec descution ou sans

  async getPeopleTalkedWith(id) {
    let data = Message.find({
      $or: [
        {
          user_id: id,
        },
        { recipientId: id },
      ],
    })

      .populate("user_id")
      .populate("recipientId");
    // .distinct("sender")

    return data;
  }

  async deleteMessage(messageId) {
    const result = await Message.findOneAndDelete({ _id: messageId });
    return result;
  }
}

module.exports = new MessageService();
