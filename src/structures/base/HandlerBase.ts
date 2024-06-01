import ExtendedClient from "../ExtendedClient";

/**
 * Base class for handlers.
 * Handlers are responsible for handling various events or commands in the Discord bot.
 * This abstract class provides common functionality and properties for all handlers.
 */
export default abstract class HandlerBase {
  // Reference to the ExtendedClient instance for interacting with Discord.
  protected readonly client: ExtendedClient;

  /**
   * Constructs a new instance of the HandlerBase class.
   * @param client The ExtendedClient instance representing the Discord bot client.
   */
  protected constructor(client: ExtendedClient) {
    // Initialize the client property with the provided ExtendedClient instance.
    this.client = client;
  }
}
