class ApiResponse {
  static success(res, message = '', data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static failure(res, message = '', errors = [], statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors ?? [],
    });
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
