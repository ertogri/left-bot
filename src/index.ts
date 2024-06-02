import { IntentsBitField } from "discord.js";
import { config } from "dotenv";
import ConfigureError from "./errors/ConfigureError";
import ExtendedClient from "./structures/ExtendedClient";

/**
 * Entry point of the application.
 * Initializes the Discord bot client and starts its operation.
 */
async function main(): Promise<void> {
  // Load the .env file
  config({ path: ".env" });

  // Check the NODE_ENV environment variable
  if (!process.env.NODE_ENV) {
    // Throw an error if NODE_ENV is not set
    throw new ConfigureError("NODE_ENV");
  }

  // Load the appropriate .env file based on the NODE_ENV value
  switch (process.env.NODE_ENV.toLowerCase()) {
    case "development":
      // Load the .env.development file for development environment
      config({ path: ".env.development" });
      break;
    case "test":
      // Load the .env.test file for test environment
      config({ path: ".env.test" });
      break;
    case "production":
      // Load the .env.production file for production environment
      config({ path: ".env.production" });
      break;
    default:
      // Throw an error for invalid NODE_ENV value
      throw new Error("Invalid NODE_ENV value");
  }

  // Check if the Discord bot token is provided in the environment variables.
  if (!process.env.DISCORD_BOT_TOKEN) {
    // If the token is missing, throw a ConfigureError indicating the missing configuration key.
    throw new ConfigureError("DISCORD_BOT_TOKEN");
  }

  // Check if the support server URL is provided in the environment variables.
  if (!process.env.SUPPORT_SERVER_URL) {
    // If the URL is missing, throw a ConfigureError indicating the missing configuration key.
    throw new ConfigureError("SUPPORT_SERVER_URL");
  }

  // Create a new instance of the ExtendedClient with provided client options and configuration.
  const client = new ExtendedClient(
    {
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildVoiceStates,
      ], // Specify the bot's intents (in this case, only Guilds).
    },
    {
      token: process.env.DISCORD_BOT_TOKEN, // Pass the Discord bot token from environment variables.
      supportServerURL: process.env.SUPPORT_SERVER_URL, // Pass the support server URL from environment variables.
    },
  );

  // Initialize the client, setting up event handlers and logging in to Discord.
  await client.initialize();
}

// Call the main function to start the bot.
main();
