const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const UserSchema = require("./User");
const User = mongoose.model("User", UserSchema);
const TodoItemSchema = mongoose.Schema({
  user_id: {
    type: ObjectId,
    ref: User,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
  type: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    require: true,
  },
  outside: {
    type: Boolean,
  },
  notes: [String],
  weather: {
    description: {
      type: String,
    },
    temp: {
      type: Number,
    },
    icon: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: ["coming", "active", "done", "cancelled", "late"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = TodoItemSchema;
