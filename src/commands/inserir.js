import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("inserir")
  .setDescription("Insere dinheiro no banco do jogador")
  .addUserOption(o => o.setName("jogador").setRequired(true))
  .addStringOption(o => o.setName("moeda").setRequired(true))
  .addIntegerOption(o => o.setName("valor").setRequired(true));

export async function execute(interaction) {
  const user = interaction.options.getUser("jogador");
  const moeda = interaction.options.getString("moeda");
  const valor = interaction.options.getInteger("valor");

  const player = await Player.findOne({ discordId: user.id });
  player.banco[moeda] += valor;
  await player.save();

  await interaction.reply(`💸 ${valor} ${moeda} inseridos para ${user.username}.`);
}
