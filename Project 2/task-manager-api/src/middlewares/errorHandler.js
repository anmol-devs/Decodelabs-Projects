const ApiResponse = require('../utils/ApiResponse');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return ApiResponse.failure(res, 'Invalid JSON payload', ['Request body contains malformed JSON'], 400);
  }

  if (err.type === 'entity.parse.failed') {
    return ApiResponse.failure(res, 'Invalid JSON payload', ['Request body contains malformed JSON'], 400);
  }

  console.error(err);
  return ApiResponse.failure(res, 'Internal Server Error', [], 500);
};

module.exports = errorHandler;
