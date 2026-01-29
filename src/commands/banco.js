import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("banco")
  .setDescription("Consulta saldo bancário");

export async function execute(interaction) {
  const player = await Player.findOne({ discordId: interaction.user.id });

  await interaction.reply(
    `💰 **Saldo Bancário**
R$: ${player.banco.BRL}
€: ${player.banco.EUR}
£: ${player.banco.GBP}`
  );
}
