import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("acumular")
  .setDescription("Acumula pontos livres para desbloquear playstyles ou distribuir depois");

export async function execute(interaction) {
  const player = await Player.findOne({ discordId: interaction.user.id });

  if (!player) {
    return interaction.reply({
      content: "❌ Jogador não encontrado no banco de dados.",
      ephemeral: true
    });
  }

  if (player.pontos.livres <= 0) {
    return interaction.reply({
      content: "⚠️ Você não tem pontos livres para acumular.",
      ephemeral: true
    });
  }

  player.pontos.acumulados += player.pontos.livres;
  player.pontos.livres = 0;
  await player.save();

  await interaction.reply({
    content: `💾 Pontos acumulados com sucesso! Total acumulado agora: **${player.pontos.acumulados}**`
  });
}
