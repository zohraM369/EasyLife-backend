const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const MessageSchema = mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "User"
    },
    content: {
        type: String
    },
    recipientId: {
        type: ObjectId,
        ref: "User"
    }
    ,
   created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});


module.exports = MessageSchema;
