import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";
import { rolarD20 } from "../services/rollService.js";

export const data = new SlashCommandBuilder()
  .setName("cruzamento")
  .setDescription("Realiza um cruzamento")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setDescription("Tipo de cruzamento")
      .setRequired(true)
      .addChoices(
        { name: "Curto", value: "curto" },
        { name: "Lançamento", value: "lancamento" },
        { name: "Inversão", value: "inversao" }
      )
  );

export async function execute(interaction) {
  try {
    const tipo = interaction.options.getString("tipo");
    const player = await Player.findOne({ discordId: interaction.user.id });

    if (!player) {
      return await interaction.reply({
        content: "❌ Jogador não encontrado no banco de dados.",
        ephemeral: true
      });
    }

    const { valor, resultado } = rolarD20();

    await interaction.reply({
      content: `📤 **Cruzamento (${tipo})**  
🎲 D20: **${valor}**  
📊 Resultado: **${resultado}**`
    });
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "❌ Ocorreu um erro ao executar o comando.",
      ephemeral: true
    });
  }
}
