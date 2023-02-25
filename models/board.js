const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const subtaskSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true, trim: true },
  isCompleted: { type: Boolean, require: false },
  taskName: { type: String, require: false},
  boardName: { type: String, required: true },
});

const taskSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true, trim: true },
  dueDate: { type: Date, require: false },
  priority: { type: Number, require: false },
  subtasks: [subtaskSchema],
  boardName: { type: String, required: true },
  bgColor: { type: String, required: false}
});

const boardSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true, trim: true },
  isProtected: { type: Boolean, require: false },
  password: { type: String, require: false },
  dateCreated: { type: Date, require: false },
  bgColor: { type: String, require: false },
  tasks: [taskSchema]
});

subtaskSchema.plugin(uniqueValidator);
taskSchema.plugin(uniqueValidator);
boardSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Board", boardSchema);