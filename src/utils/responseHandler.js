// error response handler
const errorResponseHandler = (res, { statusCode = 500, message = "Internal server error" }) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

// success response handler
const successResponseHandler = (res, { statusCode = 200, message = "Success!!", payload = {} }) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    payload,
  });
};

export { errorResponseHandler, successResponseHandler };
