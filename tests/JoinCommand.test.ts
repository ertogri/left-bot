import {
  ChatInputCommandInteraction,
  ClientOptions,
  GuildMember,
  IntentsBitField,
  VoiceChannel,
} from "discord.js";
import { config } from "dotenv";
import JoinCommand from "../src/commands/player/JoinCommand";
import Embeds from "../src/structures/Embeds";
import ExtendedClient from "../src/structures/ExtendedClient";
import { PlayerManager } from "../src/structures/music/PlayerManager";

config({ path: ".env.test" });

// Mock classes
jest.mock("../src/structures/ExtendedClient");
jest.mock("../src/structures/music/PlayerManager");
jest.mock("../src/structures/Embeds");

describe("JoinCommand", () => {
  let client: ExtendedClient;
  let players: PlayerManager;
  let command: JoinCommand;

  beforeEach(() => {
    const clientOptions: ClientOptions = {
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildVoiceStates,
      ],
    };

    const config = {
      token: process.env.BOT_TOKEN!,
      supportServerURL: process.env.SUPPORT_SERVER_URL,
    };

    client = new ExtendedClient(clientOptions, config);
    players = new PlayerManager();
    command = new JoinCommand(client, players);

    jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should join the voice channel", async () => {
    const interaction = {
      guildId: "123",
      member: {
        voice: {
          channel: {} as VoiceChannel,
        },
      } as GuildMember,
      reply: jest.fn(),
    } as unknown as ChatInputCommandInteraction;

    players.hasPlayer = jest.fn().mockReturnValue(false);
    players.createPlayer = jest.fn();
    players.getPlayer = jest.fn().mockReturnValue({
      hasConnect: jest.fn().mockReturnValue(false),
      connect: jest.fn(),
    });

    await command.execute(interaction);

    expect(players.createPlayer).toHaveBeenCalledWith(
      "123",
    );
    expect(players.getPlayer).toHaveBeenCalledWith("123");
    expect(
      players.getPlayer("123").connect,
    ).toHaveBeenCalledWith(
      (interaction.member as GuildMember).voice.channel,
    );
    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [Embeds.defaultEmbed("Joined.")],
    });
  });

  it("should reply with an error if bot is already connected", async () => {
    const interaction = {
      guildId: "123",
      member: {
        voice: {
          channel: {} as VoiceChannel,
        },
      } as GuildMember,
      reply: jest.fn(),
    } as unknown as ChatInputCommandInteraction;

    players.hasPlayer = jest.fn().mockReturnValue(true);
    players.getPlayer = jest.fn().mockReturnValue({
      hasConnect: jest.fn().mockReturnValue(true),
    });

    await command.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [
        Embeds.errorEmbed(
          "The bot is already connected to a voice channel.",
        ),
      ],
      ephemeral: true,
    });
  });

  it("should reply with an error if connection fails", async () => {
    const interaction = {
      guildId: "123",
      member: {
        voice: {
          channel: {} as VoiceChannel,
        },
      } as GuildMember,
      reply: jest.fn(),
    } as unknown as ChatInputCommandInteraction;

    players.hasPlayer = jest.fn().mockReturnValue(false);
    players.createPlayer = jest.fn();
    players.getPlayer = jest.fn().mockReturnValue({
      hasConnect: jest.fn().mockReturnValue(false),
      connect: jest.fn().mockImplementation(() => {
        throw new Error("Connection failed");
      }),
    });

    await command.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith({
      embeds: [
        Embeds.errorEmbed(
          "An error occurred while connecting to the voice channel.",
        ),
      ],
      ephemeral: true,
    });
  });
});
