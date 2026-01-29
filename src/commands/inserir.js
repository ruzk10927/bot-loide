import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("inserir")
  .setDescription("Insere dinheiro no banco do jogador")
  .addUserOption(o => o.setName("jogador").setDescription("Jogador alvo").setRequired(true))
  .addStringOption(o => o.setName("moeda").setDescription("Escolha a moeda (BRL, EUR, GBP)").setRequired(true))
  .addIntegerOption(o => o.setName("valor").setDescription("Valor a inserir").setRequired(true));

export async function execute(interaction) {
  const user = interaction.options.getUser("jogador");
  const moeda = interaction.options.getString("moeda").toUpperCase();
  const valor = interaction.options.getInteger("valor");

  const player = await Player.findOne({ discordId: user.id });
  if (!player) {
    return interaction.reply({ content: "❌ Jogador não encontrado.", ephemeral: true });
  }

  // Verifica se a moeda é válida
  if (!["BRL", "EUR", "GBP"].includes(moeda)) {
    return interaction.reply({ content: "❌ Moeda inválida. Use BRL, EUR ou GBP.", ephemeral: true });
  }

  // Inicializa a moeda caso não exista
  if (!player.banco[moeda]) player.banco[moeda] = 0;

  player.banco[moeda] += valor;
  await player.save();

  await interaction.reply(`💸 ${valor} ${moeda} inseridos para ${user.username}.`);
}
