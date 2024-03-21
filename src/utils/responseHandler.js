// error response handler
const errorResponse = (
  res,
  { statusCode = 500, message = 'Internal server error' }
) => {
  return res.status(statusCode).json({
    status: 'error',
    message: message,
  });
};

// success response handler
const successResponse = (
  res,
  { statusCode = 200, message = 'Success!!', data = null }
) => {
  return res.status(statusCode).json({
    status: 'success',
    message: message,
    data,
  });
};

export { errorResponse, successResponse };
