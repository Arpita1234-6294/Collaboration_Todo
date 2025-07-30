// controllers/taskController.js

const Task = require('../models/Task'); 
const User = require('../models/User');
const ActionLog = require('../models/ActionLog');




exports.createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const existingTask = await Task.findOne({ title });
    if (existingTask) return res.status(400).json({ msg: 'Task title must be unique' });

    const task = new Task({ title, description, priority });
    await task.save();

    const log = new ActionLog({
      user: req.userId,
      action: `Created task "${task.title}"`,
      task: task._id
    });
    await log.save();

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUser', 'username email');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, assignedUser, lastModified } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (new Date(lastModified) < new Date(task.lastModified)) {
      return res.status(409).json({ msg: 'Conflict detected', task });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedUser = assignedUser || task.assignedUser;
    task.lastModified = Date.now();

    await task.save();

    const log = new ActionLog({
      user: req.userId,
      action: `Updated task "${task.title}"`,
      task: task._id
    });
    await log.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    await Task.findByIdAndDelete(taskId);

    const log = new ActionLog({
      user: req.userId,
      action: `Deleted task "${task.title}"`,
      task: task._id
    });
    await log.save();

    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Smart Assign logic
exports.smartAssign = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find all users and count active tasks
    const users = await User.find();
    const userTasks = await Promise.all(
      users.map(async (user) => {
        const count = await Task.countDocuments({ assignedUser: user._id, status: { $ne: 'Done' } });
        return { user, count };
      })
    );

    // Find user with fewest tasks
    const leastBusy = userTasks.reduce((prev, curr) => (prev.count < curr.count ? prev : curr));

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    task.assignedUser = leastBusy.user._id;
    await task.save();

    const log = new ActionLog({
      user: req.userId,
      action: `Smart assigned task "${task.title}" to ${leastBusy.user.username}`,
      task: task._id
    });
    await log.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
module.exports = {
  createTask: exports.createTask,
  getAllTasks: exports.getAllTasks,
  updateTask: exports.updateTask,
  deleteTask: exports.deleteTask,
  smartAssign: exports.smartAssign
};

