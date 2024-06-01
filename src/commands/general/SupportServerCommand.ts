import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import ExtendedClient from "../../structures/ExtendedClient";
import CommandBase from "../../structures/base/CommandBase";

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
      content: `Support Server, ${this.client.config.supportServerURL}`, // Set the reply content
    });
  }
}

export default SupportServerCommand; // Export the SupportServerCommand class
