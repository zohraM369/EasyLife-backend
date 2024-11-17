const { first } = require("lodash");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "/uploads/default_user_image.png",
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 72, // Pour supporter le hachage bcrypt
    validate: {
      validator: function (v) {
        // Vérifie uniquement si le mot de passe est encore en texte clair
        return (
          v.length <= 12 &&
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(
            v
          )
        );
      },
      message: (props) =>
        `Password must be between 8 and 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.`,
    },
    select: false, // Optionnel : exclure le mot de passe des requêtes utilisateur
  },

  lastLogin: {
    type: Date,
    default: null,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  token: {
    type: String,
  },
  city: {
    type: String,
    default: "paris",
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  verificationCode: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetCode: {
    type: String,
    default: "",
  },
});

module.exports = UserSchema;
