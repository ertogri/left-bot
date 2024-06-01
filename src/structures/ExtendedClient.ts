import {
  Client,
  Events,
  type ClientOptions,
} from "discord.js";
import type { IExtendedClientConfig } from "../interfaces/IExtendedClientConfig";
import InteractionHandler from "./handlers/InteractionHandler";

/**
 * ExtendedClient class extends the Discord.js Client class with additional configuration and functionality.
 */
export default class ExtendedClient extends Client {
  // The config property holds additional configuration specific to the extended client.
  public readonly config: IExtendedClientConfig;
  private readonly InteractionHandler: InteractionHandler;

  /**
   * Constructs an instance of the ExtendedClient.
   * @param options Options for the Discord.js Client.
   * @param config Extended configuration options including the bot token.
   */
  public constructor(
    options: ClientOptions,
    config: IExtendedClientConfig,
  ) {
    // Call the superclass constructor with the provided client options.
    super(options);
    // Initialize the config property with the provided extended configuration.
    this.config = config;

    // Initialize the InteractionHandler instance with the client and interaction options.
    // The interaction options include the storage location and test guild ID.
    this.InteractionHandler = new InteractionHandler(this, {
      // Determine the storage location based on the environment (development, test, or production).
      storageLocation:
        process.env.NODE_ENV === "developement" || // Check if the environment is development
        process.env.NODE_ENV === "test" // Check if the environment is test
          ? "guild" // If true, set storage location to "guild"
          : "public", // If false, set storage location to "public"
      testGuildId: process.env.TEST_GUILD_ID, // Set the test guild ID from environment variables
    });
  }

  /**
   * Initializes the extended client by setting up event handlers and logging in to Discord.
   */
  public async initialize(): Promise<void> {
    // Initialize the InteractionHandler to load commands and set up interaction events.
    await this.InteractionHandler.initialize();
    // Set up event handlers for the client.
    this.initializeEvents();
    // Log in to Discord using the token from the config.
    await this.login(this.config.token);
  }

  /**
   * Sets up event handlers for the client.
   */
  private initializeEvents(): void {
    // Bind the 'onReady' method to the 'ClientReady' event.
    // This ensures that the 'onReady' method is called once when the client is ready.
    this.once(Events.ClientReady, this.onReady.bind(this));
  }

  //#region Client Events

  /**
   * Handles the 'ClientReady' event.
   * This method is called once when the client is ready.
   */
  private async onReady(): Promise<void> {
    // Register commands with Discord when the client is ready.
    await this.InteractionHandler.registerCommands();
    // Log a message to the console indicating that the bot is ready.
    console.log("Bot Is Ready!");
  }

  //#endregion
}
