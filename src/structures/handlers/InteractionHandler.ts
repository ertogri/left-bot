import {
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  Events,
  GuildMember,
  Interaction,
} from "discord.js";
import fs from "fs";
import path from "path";
import RegisterCommandsError from "../../errors/RegisterCommandsError";
import IInteractionOptions from "../../interfaces/IInteractionHandler";
import CommandBase from "../../interfaces/base/CommandBase";
import HandlerBase from "../../interfaces/base/HandlerBase";
import Embeds from "../Embeds";
import ExtendedClient from "../ExtendedClient";
import { PlayerManager } from "../music/PlayerManager";

/**
 * The InteractionHandler class manages the interaction with commands.
 * It loads commands from files, registers them based on specified options,
 * and handles incoming interactions.
 */
export default class InteractionHandler extends HandlerBase {
  private readonly commands: Collection<
    string,
    CommandBase
  >;
  private readonly options: IInteractionOptions;
  private readonly players: PlayerManager;

  /**
   * Constructs a new InteractionHandler instance.
   * @param client The ExtendedClient instance.
   * @param options The options for interacting with commands.
   */
  public constructor(
    client: ExtendedClient,
    options: IInteractionOptions,
  ) {
    // Call the constructor of the base class (HandlerBase)
    super(client);

    // Initialize the commands collection and options
    this.commands = new Collection();
    this.options = options;

    this.players = new PlayerManager();
  }

  /**
   * Loads commands from files and returns them as a collection.
   * @returns A collection of loaded commands.
   */
  private async loadedCommands(): Promise<
    Collection<string, CommandBase>
  > {
    // Define the path to the commands folder
    const foldersPath = path.join(
      __dirname,
      "..",
      "..",
      "commands",
    );

    try {
      // Read the command folders
      const commandFolders = fs.readdirSync(foldersPath);

      // Iterate through each command folder
      for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        try {
          // Read the command files
          const commandFiles = fs
            .readdirSync(commandsPath)
            .filter(
              (file) =>
                file.endsWith(".ts") ||
                file.endsWith(".js"),
            );

          // Iterate through each command file
          for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            try {
              // Import and instantiate the command
              const command: CommandBase = new (
                await import(filePath)
              ).default(this.client, this.players);

              // Add the command to the collection
              this.commands.set(command.data.name, command);
            } catch (importError) {
              console.error(
                `Error importing command from ${filePath}:`,
                importError,
              );
            }
          }
        } catch (readDirError) {
          console.error(
            `Error reading directory ${commandsPath}:`,
            readDirError,
          );
          process.exit(1);
        }
      }
    } catch (readDirError) {
      console.error(
        `Error reading directory ${foldersPath}:`,
        readDirError,
      );
      process.exit(1);
    }

    return this.commands;
  }

  /**
   * Registers the loaded commands based on the specified options.
   */
  public async registerCommands() {
    // Check if there are commands to register
    if (this.commands.size === 0) {
      console.warn("There is no command data");
      return;
    }

    // Convert commands to command data array
    const commandDataArray = this.commands.map((command) =>
      command.data.toJSON(),
    );

    // Register commands based on the storage location option
    if (this.options.storageLocation) {
      // If storage location is specified as "guild"
      if (!this.options.testGuildId) {
        throw new RegisterCommandsError(
          "test guild id is undefined",
        );
      }
      const testGuild = this.client.guilds.cache.get(
        this.options.testGuildId,
      );

      if (!testGuild) {
        throw new RegisterCommandsError(
          "Test guild not found.",
        );
      }

      return await testGuild.commands.set(commandDataArray);
    } else {
      // If storage location is not specified, register commands globally
      return await this.client.application?.commands.set(
        commandDataArray,
      );
    }
  }

  /**
   * Initializes event listeners for interactions.
   */
  private initializeEvents() {
    this.client.on(
      Events.InteractionCreate,
      this.onInteractionCreate.bind(this),
    );
  }

  /**
   * Checks if the member is in a voice channel.
   * @param interaction The interaction object.
   * @returns True if the member is in a voice channel, false otherwise.
   */
  private checkMemberVoiceChannel(
    interaction: Interaction<CacheType>,
  ): boolean {
    const memberVoiceChannel = (
      interaction.member as GuildMember
    ).voice.channel;

    return !!memberVoiceChannel;
  }

  /**
   * Checks if the bot and the member are in the same voice channel.
   * @param interaction The interaction object.
   * @returns True if both are in the same voice channel, false otherwise.
   */
  private areInSameVoiceChannel(
    interaction: Interaction<CacheType>,
  ): boolean {
    const meVoiceChannel =
      interaction.guild?.members.me?.voice.channel;
    const memberVoiceChannel = (
      interaction.member as GuildMember
    ).voice.channel;

    if (meVoiceChannel) {
      if (memberVoiceChannel?.id !== meVoiceChannel.id) {
        if (meVoiceChannel.members.size === 1) {
          return true;
        }
        return false;
      }
    }
    return true;
  }

  //#region Events

  /**
   * Handles incoming interactions.
   * @param interaction The interaction object.
   */
  private async onInteractionCreate(
    interaction: Interaction<CacheType>,
  ) {
    // Check if the interaction is a command
    if (!interaction.isCommand()) return;

    // Get the command from the collection based on the command name
    const command = this.commands.get(
      interaction.commandName,
    )!;

    // Voice channel check
    if (command.voiceChannel) {
      //#region in member voice channel
      const inMemberVoiceChannel =
        this.checkMemberVoiceChannel(interaction);
      if (!inMemberVoiceChannel) {
        await interaction.reply({
          embeds: [
            Embeds.errorEmbed(
              "You need to be in a voice channel to use this command.",
            ),
          ],
          ephemeral: true,
        });
        return;
      }
      //#endregion
      const inAreInSameVoiceChannel =
        this.areInSameVoiceChannel(interaction);

      if (!inAreInSameVoiceChannel) {
        await interaction.reply({
          ephemeral: true,
          embeds: [
            Embeds.warnEmbed(
              "You need to be in the same voice channel to use this command.",
            ),
          ],
        });
        return;
      }
    }

    try {
      // Execute the command
      command.execute(
        interaction as ChatInputCommandInteraction,
      );
    } catch (err) {
      // Log and reply with a failure message if an error occurs
      console.error(err);
      await interaction.reply({ content: "Failed." });
    }
  }

  //#endregion

  /**
   * Initializes the interaction handler by loading commands and initializing event listeners.
   */
  public async initialize() {
    // Load commands
    await this.loadedCommands();
    // Initialize event listeners
    this.initializeEvents();
  }
}
