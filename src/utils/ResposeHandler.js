const customErrorHandler = (err, req, res, next) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err;
    res.status(statusCode).json({ success: false, error: message });
  };

  export default customErrorHandler