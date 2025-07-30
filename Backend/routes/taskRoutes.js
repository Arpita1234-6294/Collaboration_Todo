const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, taskController.createTask);
router.get('/', verifyToken, taskController.getAllTasks);
router.put('/:taskId', verifyToken, taskController.updateTask);
router.delete('/:taskId', verifyToken, taskController.deleteTask);
router.put('/smart-assign/:taskId', verifyToken, taskController.smartAssign);

module.exports = router;
