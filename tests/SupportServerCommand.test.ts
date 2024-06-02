import {
  ChatInputCommandInteraction,
  InteractionReplyOptions,
} from "discord.js";
import { config } from "dotenv";
import { MockProxy, mock } from "jest-mock-extended";
import SupportServerCommand from "../src/commands/general/SupportServerCommand";
import Embeds from "../src/structures/Embeds";
import ExtendedClient from "../src/structures/ExtendedClient";
import { PlayerManager } from "../src/structures/music/PlayerManager";

config({ path: ".env.test" });

describe("SupportServerCommand", () => {
  let command: SupportServerCommand;
  let client: MockProxy<ExtendedClient>;
  let players: MockProxy<PlayerManager>;
  let interaction: MockProxy<ChatInputCommandInteraction>;

  beforeEach(() => {
    client = mock<ExtendedClient>();
    players = mock<PlayerManager>();
    interaction = mock<ChatInputCommandInteraction>();

    // Define readonly property config on the client mock
    Object.defineProperty(client, "config", {
      value: {
        supportServerURL: process.env.SUPPORT_SERVER_URL,
      },
      writable: false,
    });

    command = new SupportServerCommand(client, players);
  });

  it("should reply with the support server link", async () => {
    // Arrange
    const supportServerURL = process.env.SUPPORT_SERVER_URL;
    const embed = Embeds.linkEmbed(
      "Click and join the help server!",
      supportServerURL,
    );

    const replyOptions: InteractionReplyOptions = {
      embeds: [embed],
      ephemeral: true,
    };

    // Act
    await command.execute(interaction);

    // Assert
    expect(interaction.reply).toHaveBeenCalledWith(
      replyOptions,
    );
  });
});
