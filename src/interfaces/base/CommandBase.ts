import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import { PlayerManager } from "../../structures/music/PlayerManager";

/**
 * Base class for commands.
 * Commands represent various actions that can be executed by the Discord bot in response to user input.
 * This abstract class provides common functionality and properties for all commands.
 */
export default abstract class CommandBase {
  // Reference to the ExtendedClient instance for interacting with Discord.
  protected readonly client: ExtendedClient;
  protected readonly players: PlayerManager;
  public abstract readonly data: SlashCommandBuilder;
  public voiceChannel: boolean;

  /**
   * Constructs a new instance of the CommandBase class.
   * @param client The ExtendedClient instance representing the Discord bot client.
   */
  protected constructor(
    client: ExtendedClient,
    players: PlayerManager,
  ) {
    // Initialize the client property with the provided ExtendedClient instance.
    this.client = client;
    this.players = players;
    this.voiceChannel = false;
  }

  public abstract execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void>;
}
