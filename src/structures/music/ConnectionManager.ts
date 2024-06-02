// Import necessary types and functions from @discordjs/voice and discord.js
import {
  VoiceConnection,
  VoiceConnectionStatus,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import ConnectionError from "../../errors/ConnectionError";
import { PlayerManager } from "./PlayerManager";

// Define the ConnectionManager class
export default class ConnectionManager {
  // Private property to hold the voice connection
  private connection?: VoiceConnection;
  // Private readonly property to hold the player manager
  private readonly players: PlayerManager;

  /**
   * Constructor to initialize the ConnectionManager.
   * @param {PlayerManager} players - The manager handling music players for the bot.
   */
  public constructor(players: PlayerManager) {
    this.players = players;
  }

  /**
   * Check if a voice connection exists for the specified guild.
   * @param {string} guildId - The ID of the guild to check the connection for.
   * @returns {boolean} - Returns true if a connection exists, false otherwise.
   */
  public hasConnect(guildId: string): boolean {
    return getVoiceConnection(guildId) !== undefined;
  }

  /**
   * Create a voice connection to a specified voice channel.
   * @param {VoiceBasedChannel} voiceChannel - The voice channel to connect to.
   * @throws {ConnectionError} - Throws an error if a connection already exists.
   */
  public createConnect(
    voiceChannel: VoiceBasedChannel,
  ): void {
    // Check if a connection already exists
    if (this.connection) {
      throw new ConnectionError(
        "A connection already exists.",
      );
    }

    // Join the voice channel and save the connection
    this.connection = joinVoiceChannel({
      guildId: voiceChannel.guild.id,
      channelId: voiceChannel.id,
      adapterCreator:
        voiceChannel.guild.voiceAdapterCreator,
    });

    // Initialize connection events
    this.initializeEvents();
  }

  /**
   * Initialize events for the voice connection.
   * @throws {ConnectionError} - Throws an error if no connection exists.
   */
  private initializeEvents(): void {
    // Ensure a connection exists before initializing events
    if (!this.connection) {
      throw new ConnectionError(
        "You can't initiate events without connectivity.",
      );
    }

    // Bind the Ready event to the onReady handler
    this.connection.on(
      VoiceConnectionStatus.Ready,
      this.onReady.bind(this),
    );

    // Bind the Disconnected event to the onDisconnected handler
    this.connection.on(
      VoiceConnectionStatus.Disconnected,
      this.onDisconnected.bind(this),
    );
  }

  //#region Events

  /**
   * Event handler for the Ready state of the voice connection.
   * Logs a message indicating the connection is ready to play audio.
   */
  private onReady(): void {
    console.log(
      "The connection has entered the Ready state - ready to play audio!",
    );
  }

  /**
   * Event handler for the Disconnected state of the voice connection.
   * Attempts to reconnect or destroys the connection if unable to reconnect.
   */
  private async onDisconnected(): Promise<void> {
    try {
      // Attempt to reconnect to the voice channel
      await Promise.race([
        entersState(
          this.connection!,
          VoiceConnectionStatus.Signalling,
          4_000,
        ),
        entersState(
          this.connection!,
          VoiceConnectionStatus.Connecting,
          4_000,
        ),
      ]);
      // Connection is trying to reconnect, no further action needed
    } catch (error) {
      // If unable to reconnect, delete the player and destroy the connection
      this.players.deletePlayer(
        this.connection!.joinConfig.guildId,
      );
      this.connection!.destroy();
    }
  }
  //#endregion Events
}
