const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const taskSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true, trim: true },
  dueDate: { type: Date, require: false },
  priority: { type: Number, require: false },
  subtasks: { type: Array, require: false},
  boardName: { type: String, required: true },
});

const boardSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true, trim: true },
  isProtected: { type: Boolean, require: false },
  password: { type: String, require: false },
  dateCreated: { type: Date, require: false },
  tasks: [taskSchema]
});

taskSchema.plugin(uniqueValidator);
boardSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Board", boardSchema);