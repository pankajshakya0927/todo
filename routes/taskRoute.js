const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.post("/newTask", taskController.newTask);

module.exports = router;