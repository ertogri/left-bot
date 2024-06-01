/**
 * The ConfigureError class represents a specific type of error related to configuration issues.
 * This class includes a detailed error message associated with a specific configuration key.
 */
export default class ConfigureError extends Error {
  /**
   * @param key The configuration key that is missing or causing the error.
   */
  public constructor(key: string) {
    // Constructs an error message dynamically using the provided configuration key.
    // For example, it could generate a message like "Config error: Missing value for key 'API_KEY'".
    super(`Config error: Missing value for key '${key}'`);

    // Sets the name of the error to "ConfigureError".
    // This helps in identifying the type of error and is useful during debugging.
    this.name = "ConfigureError";

    // TypeScript's built-in Error class supports the Error.captureStackTrace method in some environments.
    // This method captures the stack trace at the point where the error was created.
    // This line will only execute if the environment supports Error.captureStackTrace.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConfigureError);
    }
  }
}
