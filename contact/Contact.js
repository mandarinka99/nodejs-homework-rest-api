const mongoose = require("mongoose");

const { Schema, SchemaTypes } = mongoose;

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: (value) => value.includes("@"),
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
});

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
