const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const {
  respondWithValidationErrors,
  validateRouteId,
} = require('../utils/validationHelper');
const taskService = require('../services/taskService');
const {
  normalizeTaskInput,
  validateCreateTask,
  validateReplaceTask,
  validateUpdateTask,
} = require('../validators/taskValidator');

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getAllTasks();
  return ApiResponse.success(res, 'Tasks retrieved successfully', tasks);
});

const getTaskById = asyncHandler(async (req, res) => {
  const idErrorResponse = validateRouteId(res, req.params.id);
  if (idErrorResponse) {
    return idErrorResponse;
  }

  const task = await taskService.getTaskById(req.params.id);

  if (!task) {
    return ApiResponse.failure(res, 'Task not found', [], 404);
  }

  return ApiResponse.success(res, 'Task retrieved successfully', task);
});

const createTask = asyncHandler(async (req, res) => {
  const body = normalizeTaskInput(req.body);
  const validationResponse = respondWithValidationErrors(res, validateCreateTask(body));

  if (validationResponse) {
    return validationResponse;
  }

  const task = await taskService.createTask(body);
  return ApiResponse.success(res, 'Task created successfully', task, 201);
});

const missingTaskId = asyncHandler(async (req, res) => {
  return ApiResponse.failure(res, 'Validation failed', ['Task ID is required'], 400);
});

const replaceTask = asyncHandler(async (req, res) => {
  const idErrorResponse = validateRouteId(res, req.params.id);
  if (idErrorResponse) {
    return idErrorResponse;
  }

  const body = normalizeTaskInput(req.body);
  const validationResponse = respondWithValidationErrors(res, validateReplaceTask(body));

  if (validationResponse) {
    return validationResponse;
  }

  const task = await taskService.replaceTask(req.params.id, body);

  if (!task) {
    return ApiResponse.failure(res, 'Task not found', [], 404);
  }

  return ApiResponse.success(res, 'Task replaced successfully', task);
});

const updateTask = asyncHandler(async (req, res) => {
  const idErrorResponse = validateRouteId(res, req.params.id);
  if (idErrorResponse) {
    return idErrorResponse;
  }

  const body = normalizeTaskInput(req.body);
  const validationResponse = respondWithValidationErrors(res, validateUpdateTask(body));

  if (validationResponse) {
    return validationResponse;
  }

  const task = await taskService.updateTask(req.params.id, body);

  if (!task) {
    return ApiResponse.failure(res, 'Task not found', [], 404);
  }

  return ApiResponse.success(res, 'Task updated successfully', task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const idErrorResponse = validateRouteId(res, req.params.id);
  if (idErrorResponse) {
    return idErrorResponse;
  }

  const task = await taskService.deleteTask(req.params.id);

  if (!task) {
    return ApiResponse.failure(res, 'Task not found', [], 404);
  }

  return ApiResponse.noContent(res);
});

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  missingTaskId,
  replaceTask,
  updateTask,
  deleteTask,
};
