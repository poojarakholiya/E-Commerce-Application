const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  let errRes = {};

  error.message = err.message;

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);

    errRes = {
      status: 'error',
      statusCode: 400,
      message: messages,
    };

    return res.status(400).json(errRes);
  }

  // Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    errRes = {
      status: 'error',
      statusCode: 400,
      message: `Invalid ${err.path}: ${err.value}`,
    };

    return res.status(400).json(errRes);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    errRes = {
      status: 'error',
      statusCode: 409,
      message: `Duplicate field value entered for '${field}': ${err.keyValue[field]}`,
    };

    return res.status(409).json(errRes);
  }

   if (err.code === 'LIMIT_FILE_SIZE') {
    errRes = {
      status: 'error',
      statusCode: 400,
      message: "File too large. Max size allowed is 2MB.",
    };

    return res.status(400).json(errRes);
  }

  errRes = {
    status: 'error',
    statusCode: error.statusCode || 500,
    message: error.statusCode ? err.message : 'Internal Server Error',
  };

  return res.status(error.statusCode || 500).json(errRes);
};

module.exports = errorHandler;
