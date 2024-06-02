/**
 * The PlayerError class represents a specific type of error related to player management issues.
 * This class includes a detailed error message associated with player creation or manipulation.
 */
export default class PlayerError extends Error {
  /**
   * Constructs a new PlayerError instance with the specified error message.
   * @param message The error message describing the player management error.
   */
  public constructor(message: string) {
    // Constructs an error message dynamically using the provided message.
    super(`Error during player management: ${message}`);

    // Sets the name of the error to "PlayerError".
    // This helps in identifying the type of error and is useful during debugging.
    this.name = "PlayerError";

    // If the environment supports capturing stack traces, captures the stack trace at the point where the error was created.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PlayerError);
    }
  }
}
