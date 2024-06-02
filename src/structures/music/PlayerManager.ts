import PlayerError from "../../errors/PlayerError";
import Player from "./Player";

/**
 * The PlayerManager class handles the management of players within a guild.
 * It provides methods for creating, retrieving, and manipulating player objects.
 */
export class PlayerManager {
  private players: Map<string, Player>;

  /**
   * Constructs a new instance of the PlayerManager class.
   * Initializes an empty map to store player objects.
   */
  constructor() {
    this.players = new Map<string, Player>();
  }

  /**
   * Creates a new player for the specified guild.
   * @param guildId The ID of the guild for which to create a player.
   * @throws PlayerError if a player for the specified guild already exists.
   */
  public createPlayer(guildId: string): void {
    // Check if a player already exists for the guild
    if (this.players.has(guildId)) {
      // Throw a PlayerError with a descriptive message
      throw new PlayerError(
        "A player is already registered for this guild.",
      );
    }

    // Create a new player and associate it with the guild ID
    this.players.set(guildId, new Player(this));
  }

  /**
   * Retrieves the player associated with the specified guild ID.
   * @param guildId The ID of the guild for which to retrieve the player.
   * @returns The player associated with the specified guild ID.
   * @throws PlayerError if no player is registered for the specified guild.
   */
  public getPlayer(guildId: string): Player {
    const player = this.players.get(guildId);

    if (!player) {
      throw new PlayerError(
        "No player is registered for this guild.",
      );
    }
    return player;
  }

  /**
   * Checks if a player is registered for the specified guild.
   * @param guildId The ID of the guild to check for player registration.
   * @returns True if a player is registered for the specified guild, false otherwise.
   */
  public hasPlayer(guildId: string): boolean {
    return this.players.has(guildId);
  }

  /**
   * Deletes the player associated with the specified guild ID.
   * @param guildId The ID of the guild for which to delete the player.
   * @throws PlayerError if no player is registered for the specified guild.
   */
  public deletePlayer(guildId: string): void {
    // Check if a player exists for the guild
    if (!this.players.has(guildId)) {
      // Throw a PlayerError with a descriptive message
      throw new PlayerError(
        "No player is registered for this guild.",
      );
    }

    // Delete the player associated with the guild ID
    this.players.delete(guildId);
  }
}
