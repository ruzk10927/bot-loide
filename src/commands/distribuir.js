import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("distribuir")
  .setDescription("Distribui pontos livres em um foco")
  .addStringOption(opt =>
    opt.setName("foco")
      .setDescription("Foco para distribuir os pontos (ex: RITMO, FINALIZAÇÃO)")
      .setRequired(true)
  )
  .addIntegerOption(opt =>
    opt.setName("pontos")
      .setDescription("Quantidade de pontos a distribuir")
      .setRequired(true)
  );

export async function execute(interaction) {
  const foco = interaction.options.getString("foco").toUpperCase();
  const pontos = interaction.options.getInteger("pontos");

  const player = await Player.findOne({ discordId: interaction.user.id });

  if (!player) {
    return interaction.reply({ content: "❌ Jogador não encontrado.", ephemeral: true });
  }

  if (!player.pontos?.livres || player.pontos.livres < pontos) {
    return interaction.reply({ content: "❌ Pontos insuficientes.", ephemeral: true });
  }

  // Inicializa o foco se ainda não existir
  if (!player.atributos[foco]) player.atributos[foco] = 0;

  player.atributos[foco] += pontos;
  player.pontos.livres -= pontos;

  await player.save();

  await interaction.reply(`✅ **${pontos}** pontos distribuídos em **${foco}**. Agora você tem **${player.pontos.livres}** pontos livres restantes.`);
}
