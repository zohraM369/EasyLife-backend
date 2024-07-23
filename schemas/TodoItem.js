
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const TodoItemSchema = mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: "User"

  },
  title: {
    type: String

  },
  description: {
    type: String

  },
  start_date: {
    type: String

  },
  end_date: {
    type: String

  },
  start_time: {
    type: String

  },
  end_time: {
    type: String

  },
  completed: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ["indoor", "outdoor"]
  },
  weather: {
    type: String
  },
  status: {
    type: String,
    enum: ["coming", "active", "done", "cancelled"]
  },
  created_at: {
    type: Date,
    default: Date.now(),

  },
  updated_at: {
    type: Date,
    default: Date.now(),

  },
});




module.exports = TodoItemSchema;
