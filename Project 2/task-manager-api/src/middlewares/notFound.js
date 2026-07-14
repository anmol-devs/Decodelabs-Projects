const ApiResponse = require('../utils/ApiResponse');

const notFound = (req, res) => {
  return ApiResponse.failure(res, 'Route not found', [], 404);
};

module.exports = notFound;
