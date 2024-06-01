import type { Config } from "jest";

// Define the Jest configuration object.
const config: Config = {
  preset: "ts-jest", // Use the ts-jest preset for TypeScript support in Jest.
  testEnvironment: "node", // Set the test environment to Node.js.
  testMatch: ["**/tests/**/*.test.ts"], // Define the pattern for test file matching.
};

export default config;
