const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: { type: String, require: true },
  dueDate: { type: Date, require: false },
  priority: { type: Number, require: false },
  subtasks: { type: Array, require: false}
});

module.exports = mongoose.model("Task", schema);