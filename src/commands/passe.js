import { SlashCommandBuilder } from "discord.js";
import { rolarD20 } from "../services/rollService.js";

export const data = new SlashCommandBuilder()
  .setName("passe")
  .setDescription("Realiza um passe")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setDescription("Tipo de passe")
      .setRequired(true)
      .addChoices(
        { name: "Normal", value: "normal" },
        { name: "Trivela", value: "trivela" },
        { name: "De Letra", value: "letra" },
        { name: "Profundidade", value: "profundidade" },
        { name: "De Primeira", value: "primeira" }
      )
  );

export async function execute(interaction) {
  const tipo = interaction.options.getString("tipo");
  const { valor, resultado } = rolarD20();

  await interaction.reply(
    `🎯 **Passe (${tipo})**  
🎲 D20: **${valor}**  
📊 Resultado: **${resultado}**`
  );
}
