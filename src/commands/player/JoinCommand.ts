// Import necessary types and classes from discord.js and local modules
import {
  CacheType,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import CommandBase from "../../interfaces/base/CommandBase";
import Embeds from "../../structures/Embeds";
import ExtendedClient from "../../structures/ExtendedClient";
import { PlayerManager } from "../../structures/music/PlayerManager";

// Define the JoinCommand class that extends CommandBase
export default class JoinCommand extends CommandBase {
  // Declare a public readonly property for the command data
  public readonly data: SlashCommandBuilder;

  /**
   * Constructor to initialize the JoinCommand.
   * @param {ExtendedClient} client - The extended Discord client.
   * @param {PlayerManager} players - The manager handling music players for the bot.
   */
  public constructor(
    client: ExtendedClient,
    players: PlayerManager,
  ) {
    // Call the parent constructor with the client and player manager
    super(client, players);

    // Initialize the slash command with a name and description
    this.data = new SlashCommandBuilder()
      .setName("join") // Set the command name to "join"
      .setDescription("Join the voice channel."); // Set the command description

    // Indicate that this command requires the user to be in a voice channel
    this.voiceChannel = true;
  }

  /**
   * Execute the join command.
   * @param {ChatInputCommandInteraction<CacheType>} interaction - The interaction object representing the command.
   * @returns {Promise<void>}
   */
  public async execute(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<void> {
    // Check if a player instance exists for the guild, if not, create one
    if (!this.players.hasPlayer(interaction.guildId!)) {
      this.players.createPlayer(interaction.guildId!);
    }

    // Retrieve the player instance for the guild
    const player = this.players.getPlayer(
      interaction.guildId!,
    );

    // Check if the bot is already connected to a voice channel in this guild
    if (player.hasConnect(interaction.guildId!)) {
      // If the bot is already connected, reply with an error message
      await interaction.reply({
        embeds: [
          Embeds.errorEmbed(
            "The bot is already connected to a voice channel.",
          ),
        ],
        ephemeral: true, // Make the reply visible only to the user who issued the command
      });
      return; // Exit the method early since the bot is already connected
    }

    // Attempt to connect the bot to the voice channel of the user who issued the command
    try {
      player.connect(
        (interaction.member as GuildMember).voice!.channel!,
      );

      // Reply with a success message indicating the bot has joined the channel
      await interaction.reply({
        embeds: [Embeds.defaultEmbed("Joined.")],
      });
    } catch (error) {
      // Log any errors that occur during the connection process
      console.error(error);

      // Reply with an error message if there was an issue connecting to the voice channel
      await interaction.reply({
        embeds: [
          Embeds.errorEmbed(
            "An error occurred while connecting to the voice channel.",
          ),
        ],
        ephemeral: true,
      });
    }
  }
}
