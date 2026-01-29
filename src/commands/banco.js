import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("banco")
  .setDescription("Consulta saldo bancário do jogador");

export async function execute(interaction) {
  const player = await Player.findOne({ discordId: interaction.user.id });

  if (!player) {
    return await interaction.reply("❌ Jogador não encontrado no banco de dados.");
  }

  const { BRL, EUR, GBP } = player.banco;

  await interaction.reply(
    `💰 **Saldo Bancário**
R$: ${BRL}
€: ${EUR}
£: ${GBP}`
  );
}
