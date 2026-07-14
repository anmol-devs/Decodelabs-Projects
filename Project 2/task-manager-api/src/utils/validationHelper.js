const ApiResponse = require('./ApiResponse');
const { validateTaskId } = require('../validators/taskValidator');

const respondWithValidationErrors = (res, errors) => {
  if (errors.length > 0) {
    return ApiResponse.failure(res, 'Validation failed', errors, 400);
  }

  return null;
};

const validateRouteId = (res, id) => {
  return respondWithValidationErrors(res, validateTaskId(id));
};

module.exports = {
  respondWithValidationErrors,
  validateRouteId,
};
