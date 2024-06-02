// Import necessary types and classes from discord.js and local modules
import { VoiceBasedChannel } from "discord.js";
import ConnectionManager from "./ConnectionManager";
import { PlayerManager } from "./PlayerManager";

// Define the Player class
export default class Player {
  // Private readonly property to hold the connection manager
  private readonly connectionManager: ConnectionManager;
  // Private readonly property to hold the player manager
  private readonly players: PlayerManager;

  /**
   * Constructor to initialize the Player.
   * @param {PlayerManager} players - The manager handling music players for the bot.
   */
  public constructor(players: PlayerManager) {
    this.players = players;
    this.connectionManager = new ConnectionManager(
      this.players,
    );
  }

  /**
   * Connect to a specified voice channel.
   * @param {VoiceBasedChannel} voiceChannel - The voice channel to connect to.
   */
  public connect(voiceChannel: VoiceBasedChannel): void {
    this.connectionManager.createConnect(voiceChannel);
  }

  /**
   * Check if a voice connection exists for the specified guild.
   * @param {string} guildId - The ID of the guild to check the connection for.
   * @returns {boolean} - Returns true if a connection exists, false otherwise.
   */
  public hasConnect(guildId: string): boolean {
    return this.connectionManager.hasConnect(guildId);
  }
}
