const mongoose = require("mongoose");

const utils = require("../utilities/utils");
const Board = require("../models/board");

exports.getBoard = (req, res) => {
    if (!req.body || req.body.name === null) {
        utils.sendErrorResponse(res, 400, "Validation Error", "Invalid board name");
    } else {
        Board.findOne({ name: req.body.name }, (err, board) => {
            if (err) utils.sendErrorResponse(res, 500, err.name, err.message);

            if (board) {
                utils.sendSuccessResponse(res, 200, "Board fetched succesfully!", board);
            } else {
                // create a board if it doesn't exist
                const board = new Board(req.body);
                board.save((err, board) => {
                    if (err) {
                        utils.sendErrorResponse(res, 400, err.name, err.message);
                    } else {
                        utils.sendSuccessResponse(res, 201, "New board created succesfully!", board);
                    }
                });
            }
        });
    }
}

exports.updateBoard = (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) utils.sendErrorResponse(res, 400, "Bad Request", "Invalid object id received. Cannot update board.");

    Board.updateMany({ _id: req.body._id }, req.body, (err, task) => {
        if (err) {
            utils.sendErrorResponse(res, 400, err.name, err.message);
        } else {
            utils.sendSuccessResponse(res, 200, "Board updated succesfully!", null);
        }
    });
}

exports.newTask = (req, res) => {
    if (!req.body || req.body.name === null) {
        utils.sendErrorResponse(res, 400, "Validation Error", "Invalid task name");
    } else {
        Board.findOneAndUpdate({ name: req.body.boardName, 'tasks.name': { $ne: req.body.name } }, { $push: { tasks: req.body } }, (err, results) => {
            if (err) {
                utils.sendErrorResponse(res, 500, err.name, err.message)
            } else {
                utils.sendSuccessResponse(res, 201, "Task created succesfully!", null);
            }
        })
    }
};

exports.newSubTask = (req, res) => {
    if (!req.body || req.body.name === null) {
        utils.sendErrorResponse(res, 400, "Validation Error", "Invalid task name");
    } else {
        Board.updateOne({ name: req.body.boardName, tasks: { $elemMatch: { name: req.body.taskName, 'subtasks.name': { $ne: req.body.name } } } },
            { $push: { "tasks.$.subtasks": req.body } }, (err, results) => {
                if (err) {
                    utils.sendErrorResponse(res, 500, err.name, err.message)
                } else {
                    utils.sendSuccessResponse(res, 201, "Task created succesfully!", null);
                }
            })
    }
};

exports.isCompleteSubtask = (req, res) => {
    if (!req.body || req.body.name === null) {
        utils.sendErrorResponse(res, 400, "Validation Error", "Invalid task name");
    } else {
        Board.updateOne({ name: req.body.boardName, tasks: { $elemMatch: { name: req.body.taskName, "subtasks.name": req.body.name } } },
            {
                "$set": {
                    "tasks.$[outer].subtasks.$[inner].isCompleted": req.body.isCompleted
                }
            },
            {
                "arrayFilters": [
                    { "outer.name": req.body.taskName },
                    { "inner.name": req.body.name }
                ]
            }, (err, results) => {
                if (err) {
                    utils.sendErrorResponse(res, 500, err.name, err.message)
                } else {
                    utils.sendSuccessResponse(res, 201, "Task updated succesfully!", null);
                }
            })
    }
};
