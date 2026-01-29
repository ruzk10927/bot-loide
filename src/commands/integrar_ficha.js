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
  try {
    const user = interaction.options.getUser("jogador");
    const ficha = interaction.options.getString("ficha");

    const player = await Player.findOne({ discordId: user.id });

    if (player) {
      player.rawFicha = ficha;
      await player.save();
    } else {
      await Player.create({
        discordId: user.id,
        rawFicha: ficha,
        pontos: { livres: 0 },
        banco: { BRL: 0, EUR: 0, GBP: 0 },
        playstyles: []
      });
    }

    await interaction.reply({
      content: `📄 Ficha de ${user.username} integrada com sucesso.`,
      ephemeral: true
    });
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "❌ Ocorreu um erro ao integrar a ficha.",
      ephemeral: true
    });
  }
}
