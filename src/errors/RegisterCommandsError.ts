/**
 * The RegisterCommandsError class represents a specific type of error related to command registration issues.
 * This class includes a detailed error message associated with the registration process.
 */
export default class RegisterCommandsError extends Error {
  /**
   * Constructs a new RegisterCommandsError instance with the specified error message.
   * @param message The error message describing the registration error.
   */
  public constructor(message: string) {
    // Constructs an error message dynamically using the provided message.
    super(`Error during command registration: ${message}`);

    // Sets the name of the error to "RegisterCommandsError".
    // This helps in identifying the type of error and is useful during debugging.
    this.name = "RegisterCommandsError";

    // If the environment supports capturing stack traces, captures the stack trace at the point where the error was created.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RegisterCommandsError);
    }
  }
}
