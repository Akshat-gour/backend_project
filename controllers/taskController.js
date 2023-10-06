import asyncHandler from 'express-async-handler'
import Task from '../models/taskModel.js'

function validateTittle(inputString) {
    if (typeof inputString !== 'string' || inputString.trim() === '') {
        return false;
    }
    if (inputString.length < 3 || inputString.length > 100) {
        return false;
    }
    if (!/^[a-zA-Z]+$/.test(inputString)) {
       return false;
    }
    return true;
}
function validateDescription(inputString) {
    if (typeof inputString !== 'string' || inputString.trim() === '') {
        return false;
    }
    if (inputString.length < 3 || inputString.length > 500) {
        return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(inputString)) {
       return false;
    }
    return true;
}
function validateStatus(inputString) {
    const allowedValues = ["not_started", "in_progress", "completed"];
    if (allowedValues.includes(inputString)) 
        return true;   
    return false;
}

// @desc    Create new task
// @route   POST /api/task
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, dueDate } = req.body

    if (!validateTittle(title)) {
        res.status(400).json({ error: 'Title not valid' })
    } 
    else if (!validateDescription(description)) {
        res.status(400).json({ error: 'Description not valid' })
    }
    else if (!validateStatus(status)) {
        res.status(400).json({ error: 'Status not valid'})
    }
    else {
        const task = new Task({
            title,
            description,
            status,
            dueDate,
            user: req.user._id,
        })

        const taskcreated = await task.save()

        res.status(201).json(taskcreated)
    }
})

// @desc    Fetch all my task
// @route   GET /api/task
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user._id })
    res.json(tasks)
})

// @desc    Delete a task
// @route   DELETE /api/task/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndRemove(req.params.id);

        if (deletedTask) {
            res.json({ message: 'Task deleted' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
})

// @desc    Edit a task
// @route   Put /api/task/:id
// @access  Private
const editTask = asyncHandler(async (req, res) => {
    const { title, description, status, dueDate } = req.body
    try {
      const task = await Task.findById(req.params.id);
      task.tittle = title ? title: task.title;
      task.description = description ? description : task.description;
      task.status = status ? status : task.status;
      task.dueDate = dueDate ? dueDate : task.dueDate;
      await task.save();

      return res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

export { createTask, getTasks, deleteTask, editTask }
