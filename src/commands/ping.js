import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Verifica se o bot está online");

export async function execute(interaction) {
  await interaction.reply("🏓 Pong! Bot Loide está online.");
}
