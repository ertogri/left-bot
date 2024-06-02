/**
 * Error class for connection errors. Throws this error when a connection already exists.
 */
export default class ConnectionError extends Error {
  /**
   * Creates a new instance of ConnectionError.
   * @param message The error message (optional). Default message is "A connection already exists.".
   */
  constructor(message: string) {
    // Calls the constructor of the superclass (Error).
    super(`Connection Error - ${message}`);

    // Sets the name of the error.
    this.name = "ConnectionError";

    // Captures the stack trace to include stack information.
    Error.captureStackTrace(this, ConnectionError);
  }
}
