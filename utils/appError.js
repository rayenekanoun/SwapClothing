class AppError extends Error {
    constructor(message,statusCode,errors) {
      super(message);
      if(errors) this.errors = errors;
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;