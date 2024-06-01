/**
 * The IExtendedClientConfig interface represents the configuration options required by the ExtendedClient class.
 * It includes properties such as token for bot authentication and supportServerURL for the URL of the support server.
 */
export interface IExtendedClientConfig {
  token: string; // The bot token used for authentication
  supportServerURL: string; // The URL of the support server
}
