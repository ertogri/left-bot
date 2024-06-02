/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "dotenv";
import SupportServerCommand from "../src/commands/general/SupportServerCommand";
import Embeds from "../src/structures/Embeds"; // Embeds'i ekleyelim

config({ path: ".env" });

describe("SupportServerCommand", () => {
  it("should reply with the support server URL", async () => {
    const client: any = {
      config: {
        supportServerURL: process.env.SUPPORT_SERVER_URL,
      },
    };

    const interaction: any = {
      reply: jest.fn().mockResolvedValue(undefined),
    };

    const supportServerCommand = new SupportServerCommand(
      client,
    );

    await supportServerCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [
        Embeds.linkEmbed(
          "Click and join the help server!",
          client.config.supportServerURL,
        ),
      ],
    });
  });
});
