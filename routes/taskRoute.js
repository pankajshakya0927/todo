const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.post("/getBoard", taskController.getBoard);
router.post("/updateBoard", taskController.updateBoard);
router.post("/newTask", taskController.newTask);
router.post("/updateTask", taskController.updateTask);
router.post("/deleteTask", taskController.deleteTask);

router.post("/newSubtask", taskController.newSubTask);
router.post("/deleteSubtask", taskController.deleteSubTask);
router.post("/updateSubtask", taskController.updateSubTask);

module.exports = router;