import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("distribuir")
  .setDescription("Distribui pontos livres em um foco")
  .addStringOption(opt =>
    opt.setName("foco")
      .setDescription("Foco")
      .setRequired(true)
  )
  .addIntegerOption(opt =>
    opt.setName("pontos")
      .setDescription("Quantidade de pontos")
      .setRequired(true)
  );

export async function execute(interaction) {
  const foco = interaction.options.getString("foco");
  const pontos = interaction.options.getInteger("pontos");

  const player = await Player.findOne({ discordId: interaction.user.id });

  if (player.pontos.livres < pontos) {
    return interaction.reply({ content: "❌ Pontos insuficientes.", ephemeral: true });
  }

  player.pontos.livres -= pontos;
  await player.save();

  await interaction.reply(`✅ ${pontos} pontos distribuídos em **${foco}**.`);
}
