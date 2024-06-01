/**
 * The IInteractionOptions interface represents the options for interacting with commands.
 * It includes properties such as storageLocation for specifying where to store the commands
 * and testGuildId for specifying the ID of the test guild when storageLocation is set to "guild".
 */
export default interface IInteractionOptions {
  storageLocation: "guild" | "public"; // Specifies where to store the commands: guild or public
  testGuildId?: string; // The ID of the test guild when storageLocation is set to "guild"
}
