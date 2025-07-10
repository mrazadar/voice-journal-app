// src/errors/customErrors.ts

/**
 * Base custom HTTP error class.
 * All other custom errors extend this to include a `statusCode` property,
 * which will be used by the global error handler to set the HTTP response status.
 */
export class HttpError extends Error {
  public statusCode: number; // Public property to hold the HTTP status code

  /**
   * Creates an instance of HttpError.
   * @param message A human-readable description of the error.
   * @param statusCode The HTTP status code associated with the error (e.g., 400, 401, 404, 500).
   */
  constructor(message: string, statusCode: number) {
    super(message); // Call the parent Error constructor with the message
    this.statusCode = statusCode; // Assign the custom status code

    // Ensure proper prototype chain for instanceof checks
    // This is crucial when extending built-in classes in TypeScript/JavaScript
    // as Babel or older TypeScript targets might break the prototype chain.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/**
 * Represents a 400 Bad Request error.
 * This error indicates that the client sent an invalid request,
 * often due to validation failures, missing required fields, or incorrect data format.
 */
export class BadRequestError extends HttpError {
  /**
   * Creates an instance of BadRequestError.
   * @param message An optional custom message for the bad request. Defaults to 'Bad Request'.
   */
  constructor(message: string = "Bad Request") {
    super(message, 400); // Calls HttpError constructor with message and 400 status
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Represents a 401 Unauthorized error.
 * This error indicates that the request has not been authenticated or
 * the authentication credentials provided are invalid.
 * (Note: Use 403 Forbidden if the user is authenticated but lacks necessary permissions).
 */
export class UnauthorizedError extends HttpError {
  /**
   * Creates an instance of UnauthorizedError.
   * @param message An optional custom message for unauthorized access. Defaults to 'Unauthorized'.
   */
  constructor(message: string = "Unauthorized") {
    super(message, 401); // Calls HttpError constructor with message and 401 status
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Represents a 403 Forbidden error.
 * This error indicates that the user is authenticated but does not have the
 * necessary permissions to access the resource or perform the action.
 * (Note: Use 401 Unauthorized if the user is not authenticated at all).
 */
export class ForbiddenError extends HttpError {
  /**
   * Creates an instance of ForbiddenError.
   * @param message An optional custom message for forbidden access. Defaults to 'Forbidden'.
   */
  constructor(message: string = "Forbidden") {
    super(message, 403); // Calls HttpError constructor with message and 403 status
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Represents a 404 Not Found error.
 * This error indicates that the requested resource could not be found on the server.
 */
export class NotFoundError extends HttpError {
  /**
   * Creates an instance of NotFoundError.
   * @param message An optional custom message for resource not found. Defaults to 'Resource not found'.
   */
  constructor(message: string = "Resource not found") {
    super(message, 404); // Calls HttpError constructor with message and 404 status
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Represents a 409 Conflict error.
 * This error indicates a conflict with the current state of the target resource,
 * often used for unique constraint violations (e.g., trying to create a user with an email that already exists).
 */
export class ConflictError extends HttpError {
  /**
   * Creates an instance of ConflictError.
   * @param message An optional custom message for a conflict. Defaults to 'Conflict'.
   */
  constructor(message: string = "Conflict") {
    super(message, 409); // Calls HttpError constructor with message and 409 status
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Represents a 500 Internal Server Error (or a specific type of it).
 * While the global error handler will catch generic Errors as 500s,
 * you might define specific 500-level errors if you need more granularity,
 * though often a generic 500 is sufficient for internal issues.
 */
export class InternalServerError extends HttpError {
  /**
   * Creates an instance of InternalServerError.
   * @param message An optional custom message for internal server error. Defaults to 'Internal Server Error'.
   */
  constructor(message: string = "Internal Server Error") {
    super(message, 500); // Calls HttpError constructor with message and 500 status
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
