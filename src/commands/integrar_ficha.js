import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("integrar_ficha")
  .setDescription("Integra ou substitui a ficha completa de um jogador")
  .addUserOption(opt =>
    opt.setName("jogador")
      .setDescription("Jogador alvo")
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName("ficha")
      .setDescription("Ficha completa do jogador")
      .setRequired(true)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser("jogador");
  const ficha = interaction.options.getString("ficha");

  await Player.findOneAndUpdate(
    { discordId: user.id },
    { rawFicha: ficha },
    { upsert: true }
  );

  await interaction.reply({
    content: `📄 Ficha de ${user.username} integrada com sucesso.`,
    ephemeral: true
  });
}
