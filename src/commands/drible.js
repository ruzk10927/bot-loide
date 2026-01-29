import { SlashCommandBuilder } from "discord.js";
import { rolarD20 } from "../services/rollService.js";

export const data = new SlashCommandBuilder()
  .setName("drible")
  .setDescription("Realiza um drible")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setDescription("Tipo de drible")
      .setRequired(true)
      .addChoices(
        { name: "Pedalada", value: "pedalada" },
        { name: "Chapéu", value: "chapeu" },
        { name: "Elástico", value: "elastico" },
        { name: "Caneta", value: "caneta" },
        { name: "360", value: "360" }
      )
  );

export async function execute(interaction) {
  const tipo = interaction.options.getString("tipo");
  const { valor, resultado } = rolarD20();

  await interaction.reply(
    `🕺 **Drible (${tipo})**  
🎲 D20: **${valor}**  
📊 Resultado: **${resultado}**`
  );
}
