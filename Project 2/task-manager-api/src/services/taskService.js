const { randomUUID } = require('crypto');
const tasks = require('../data/tasks');

const findTaskIndex = (id) => {
  return tasks.findIndex((task) => task.id === id);
};

const generateUniqueId = () => {
  let id = randomUUID();

  while (findTaskIndex(id) !== -1) {
    id = randomUUID();
  }

  return id;
};

const parseDueDate = (dueDate) => {
  if (!dueDate) {
    return null;
  }

  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

const buildTaskPayload = (taskData) => {
  return {
    title: taskData.title.trim(),
    description: taskData.description ?? '',
    status: taskData.status,
    priority: taskData.priority,
    dueDate: parseDueDate(taskData.dueDate),
  };
};

const getAllTasks = async () => {
  return tasks.map((task) => ({ ...task }));
};

const getTaskById = async (id) => {
  const task = tasks.find((item) => item.id === id);
  return task ? { ...task } : null;
};

const createTask = async (taskData) => {
  const now = new Date().toISOString();
  const payload = buildTaskPayload(taskData);

  const newTask = {
    id: generateUniqueId(),
    ...payload,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  return { ...newTask };
};

const replaceTask = async (id, taskData) => {
  const index = findTaskIndex(id);

  if (index === -1) {
    return null;
  }

  const now = new Date().toISOString();
  const payload = buildTaskPayload(taskData);

  const replacedTask = {
    id: tasks[index].id,
    ...payload,
    createdAt: tasks[index].createdAt,
    updatedAt: now,
  };

  tasks[index] = replacedTask;
  return { ...replacedTask };
};

const updateTask = async (id, taskData) => {
  const index = findTaskIndex(id);

  if (index === -1) {
    return null;
  }

  const existingTask = tasks[index];
  const updatedTask = {
    ...existingTask,
    updatedAt: new Date().toISOString(),
  };

  if (taskData.title !== undefined) {
    updatedTask.title = taskData.title.trim();
  }

  if (taskData.description !== undefined) {
    updatedTask.description = taskData.description;
  }

  if (taskData.status !== undefined) {
    updatedTask.status = taskData.status;
  }

  if (taskData.priority !== undefined) {
    updatedTask.priority = taskData.priority;
  }

  if (taskData.dueDate !== undefined) {
    updatedTask.dueDate = parseDueDate(taskData.dueDate);
  }

  tasks[index] = updatedTask;
  return { ...updatedTask };
};

const deleteTask = async (id) => {
  const index = findTaskIndex(id);

  if (index === -1) {
    return null;
  }

  const [deletedTask] = tasks.splice(index, 1);
  return { ...deletedTask };
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  replaceTask,
  updateTask,
  deleteTask,
};
