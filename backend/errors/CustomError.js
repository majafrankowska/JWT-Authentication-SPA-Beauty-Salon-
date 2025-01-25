class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends CustomError {
  constructor(message) {
    super(message, 400); 
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404); 
  }
}

class ConflictError extends CustomError {
  constructor(message) {
    super(message, 409); 
  }
}

class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message, 401); 
  }
}

class ForbiddenError extends CustomError {
  constructor(message) {
    super(message, 403); 
  }
}

class InternalServerError extends CustomError {
  constructor(message) {
    super(message, 500); 
  }
}

module.exports = {
  CustomError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  InternalServerError,
};
