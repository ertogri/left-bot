/**
 * Extend the global NodeJS ProcessEnv interface to include custom environment variables.
 * This ensures that TypeScript recognizes additional environment variables.
 */
declare global {
  namespace NodeJS {
    /**
     * Augment the ProcessEnv interface with custom environment variables.
     */
    interface ProcessEnv {
      /**
       * Environment mode variable.
       * This variable should specify the mode in which the application is running (e.g., "development", "production").
       * Ensure that this variable is set appropriately based on your deployment environment.
       */
      NODE_ENV: "developement" | "test" | "production";
      /**
       * Discord bot token used for authentication.
       * Ensure this variable is set in the environment.
       */
      DISCORD_BOT_TOKEN: string;
      /**
       * The ID of the test guild where commands will be registered during testing.
       * This variable is optional and should only be set in the test environment.
       */
      TEST_GUILD_ID?: string;
      /**
       * The URL of the support server where users can get assistance or report issues.
       * Ensure this variable is set in the environment.
       */
      SUPPORT_SERVER_URL: string;
    }
  }
}

/**
 * Ensure the TypeScript declaration is recognized as a module.
 * Export an empty object to indicate that this file is a module.
 */
export {};
