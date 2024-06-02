import { Colors, EmbedBuilder } from "discord.js"; // Import necessary modules from discord.js

/**
 * The Embeds class provides predefined EmbedBuilder structures for different types of messages.
 */
export default class Embeds {
  /**
   * Returns a default embed with a simple message and a white background.
   * @param {string} message - The message to be included in the embed.
   * @returns {EmbedBuilder} - An EmbedBuilder with a white color and the specified message.
   */
  public static defaultEmbed(
    message: string,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(Colors.White)
      .setDescription(`**▫️ ${message} **`);
  }

  /**
   * Creates an embed with a clickable title and URL.
   * @param {string} title - The clickable title in the embed.
   * @param {string} url - The URL to navigate to when the title is clicked.
   * @returns {EmbedBuilder} - An EmbedBuilder with a white color and a clickable title.
   */
  public static linkEmbed(
    title: string,
    url: string,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(Colors.White)
      .setDescription(`**🏳️ [${title}](${url})**`);
  }

  /**
   * Creates an embed with a warning message.
   * @param {string} warn_message - The warning message to be displayed in the embed.
   * @returns {EmbedBuilder} - An EmbedBuilder with a white color and a warning message.
   */
  public static warnEmbed(
    warn_message: string,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(Colors.White)
      .setDescription(`**❕ ${warn_message}**`);
  }

  /**
   * Creates an embed with an error message.
   * @param {string} error_message - The error message to be displayed in the embed.
   * @returns {EmbedBuilder} - An EmbedBuilder with a white color and an error message.
   */
  public static errorEmbed(
    error_message: string,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(Colors.White)
      .setDescription(`**❔ ${error_message} **`);
  }

  /**
   * Creates an embed displaying the title of the currently playing song.
   * @param {string} title - The title of the song to be displayed in the embed.
   * @returns {EmbedBuilder} - An EmbedBuilder with a white color, the song title, and a "Now Playing" title.
   */
  public static nowPlayingEmbed(
    title: string,
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(Colors.White)
      .setDescription(`**▫️ \`${title} \`**`)
      .setTitle("Now Playing");
  }
}
