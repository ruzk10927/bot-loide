import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("acumular")
  .setDescription("Acumula pontos para playstyles");

export async function execute(interaction) {
  const player = await Player.findOne({ discordId: interaction.user.id });
if (!player) return await interaction.reply("❌ Jogador não encontrado no banco de dados.");

  player.pontos.acumulados += player.pontos.livres;
  player.pontos.livres = 0;
  await player.save();

  await interaction.reply("💾 Pontos acumulados com sucesso.");
}
