import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";

export const data = new SlashCommandBuilder()
  .setName("ver_ficha")
  .setDescription("Mostra a ficha completa do jogador")
  .addUserOption(opt =>
    opt.setName("jogador")
      .setDescription("Jogador alvo")
      .setRequired(true)
  );

export async function execute(interaction) {
  try {
    const user = interaction.options.getUser("jogador");
    const player = await Player.findOne({ discordId: user.id });

    if (!player) {
      return interaction.reply({
        content: "❌ Jogador não encontrado no banco de dados.",
        ephemeral: true
      });
    }

    if (!player.rawFicha) {
      return interaction.reply({
        content: "❌ Ficha não integrada para este jogador.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `📄 **Ficha de ${user.username}**\n\`\`\`\n${player.rawFicha}\n\`\`\``
    });
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "❌ Ocorreu um erro ao tentar exibir a ficha.",
      ephemeral: true
    });
  }
}
