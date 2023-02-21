const mongoose = require("mongoose");

const utils = require("../utilities/utils");
const Task = require("../models/task");

exports.newTask = (req, res, next) => {
    if (!req.body || req.body.name === null) {
        utils.sendErrorResponse(res, 400, "Validation Error", "Invalid task name");
    } else {
        const task = new Task(req.body);

        if (!req.body._id) {
            // insert
            task.save((err, result) => {
                if (err) {
                    utils.sendErrorResponse(res, 400, err.name, err.message);
                } else {
                    utils.sendSuccessResponse(res, 201, "New task created succesfully!", null);
                }
            });
        } else {
            // update
            if (!mongoose.Types.ObjectId.isValid(req.body._id)) utils.sendErrorResponse(res, 400, "Bad Request", "Invalid object id received. Cannot update task.");

            task.findOneAndUpdate({ _id: card._id}, card, { runValidators: true }, (err, result) => {
                if (err) {
                    utils.sendErrorResponse(res, 400, err.name, err.message);
                } else {
                    utils.sendSuccessResponse(res, 200, "Task updated succesfully!", null);
                }
            });
        }
    }
};