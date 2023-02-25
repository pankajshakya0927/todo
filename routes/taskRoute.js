const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.post("/getBoard", taskController.getBoard);
router.post("/updateBoard", taskController.updateBoard);
router.post("/newTask", taskController.newTask);
router.post("/newSubtask", taskController.newSubTask);
router.post("/isCompleteSubtask", taskController.isCompleteSubtask);

module.exports = router;