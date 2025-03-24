module.exports = class BaseError extends Error {
  status;
  errors;
  constructor(status, message, error) {
    super(message);
    this.status = status;
    this.errors = error;
  }

  static Unathorization() {
    return new BaseError(401, "User is not authorized");
  }

  static BadRequest(message, error) {
    return new BaseError(400, message, error);
  }
};
