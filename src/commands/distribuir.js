import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("distribuir")
  .setDescription("Distribui pontos livres em um foco")
  .addStringOption(opt =>
    opt.setName("foco")
      .setDescription("Foco para distribuir os pontos (ex: ritmo, finalizacao)")
      .setRequired(true)
  )
  .addIntegerOption(opt =>
    opt.setName("pontos")
      .setDescription("Quantidade de pontos a distribuir")
      .setRequired(true)
  );

export async function execute(interaction) {
  const foco = interaction.options.getString("foco").toLowerCase();
  const pontos = interaction.options.getInteger("pontos");

  const player = await Player.findOne({ discordId: interaction.user.id });
  if (!player) {
    return interaction.reply({ content: "❌ Jogador não encontrado.", ephemeral: true });
  }

  if (!player.pontos?.livres || player.pontos.livres < pontos) {
    return interaction.reply({ content: "❌ Pontos insuficientes.", ephemeral: true });
  }

  // Verifica se o foco existe nos atributos
  const focoObj = player.atributos[foco];
  if (!focoObj) {
    return interaction.reply({ content: "❌ Foco inválido.", ephemeral: true });
  }

  // Distribuição aleatória entre os sub-atributos
  const subAttrs = Object.keys(focoObj);
  let remaining = pontos;

  while (remaining > 0) {
    const randAttr = subAttrs[Math.floor(Math.random() * subAttrs.length)];
    focoObj[randAttr].value += 1;
    remaining--;
  }

  player.pontos.livres -= pontos;
  await player.save();

  await interaction.reply(`✅ **${pontos}** pontos distribuídos no foco **${foco.toUpperCase()}**. Pontos livres restantes: **${player.pontos.livres}**.`);
    }
