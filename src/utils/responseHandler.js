// error response handler
const errorResponseHandler = (
  res,
  { statusCode = 500, message = 'Internal server error' }
) => {
  return res.status(statusCode).json({
    status: 'error',
    message: message,
  });
};

// success response handler
const successResponseHandler = (
  res,
  { statusCode = 200, message = 'Success!!', data = null }
) => {
  return res.status(statusCode).json({
    status: 'success',
    message: message,
    data,
  });
};

export { errorResponseHandler, successResponseHandler };
