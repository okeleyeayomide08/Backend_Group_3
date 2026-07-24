function successResponse(res, message, data, statusCode = 200) {
  return res.status(statusCode).json({
    status: "success",
    message: message,
    data: data,
  });
}

function errorResponse(res, message, statusCode = 400) {
  return res.status(statusCode).json({
    status: "error",
    message: message,
  });
}

export { successResponse, errorResponse };
