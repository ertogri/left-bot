import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import CommandBase from "../../interfaces/base/CommandBase";
import Embeds from "../../structures/Embeds";
import ExtendedClient from "../../structures/ExtendedClient";

/**
 * Represents a command to retrieve the support server link.
 * Inherits from the CommandBase class.
 */
class SupportServerCommand extends CommandBase {
  /**
   * Represents the command's data, built using the SlashCommandBuilder class.
   */
  public readonly data: SlashCommandBuilder;

  /**
   * Constructs a new SupportServerCommand instance.
   * @param client The ExtendedClient instance.
   */
  public constructor(client: ExtendedClient) {
    // Call the constructor of the base class (CommandBase)
    super(client);

    // Initialize the data field with a new SlashCommandBuilder instance
    this.data = new SlashCommandBuilder()
      .setName("support-server") // Set the command name
      .setDescription("Get the link to the support server"); // Set the command description
  }

  /**
   * Executes the command logic.
   * @param interaction The ChatInputCommandInteraction representing the interaction.
   */
  public async execute(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    // Reply to the interaction with the support server link
    await interaction.reply({
      embeds: [
        Embeds.linkEmbed(
          "Click and join the help server!",
          this.client.config.supportServerURL,
        ),
      ],
    });
  }
}

export default SupportServerCommand; // Export the SupportServerCommand class
