import { SlashCommandBuilder } from "discord.js";
import { rolarD20 } from "../services/rollService.js";

export const data = new SlashCommandBuilder()
  .setName("chute")
  .setDescription("Realiza um chute")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setDescription("Tipo de chute")
      .setRequired(true)
      .addChoices(
        { name: "Colocado", value: "colocado" },
        { name: "Bomba", value: "bomba" },
        { name: "Cavadinha", value: "cavadinha" },
        { name: "Rasteiro", value: "rasteiro" },
        { name: "Trivela", value: "trivela" },
        { name: "De Letra", value: "letra" }
      )
  );

export async function execute(interaction) {
  const tipo = interaction.options.getString("tipo");
  const { valor, resultado } = rolarD20();

  await interaction.reply(
    `⚽ **Chute (${tipo})**  
🎲 D20: **${valor}**  
📊 Resultado: **${resultado}**`
  );
}
