const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.put('/', taskController.missingTaskId);
router.patch('/', taskController.missingTaskId);
router.delete('/', taskController.missingTaskId);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.replaceTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
