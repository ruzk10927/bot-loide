import { SlashCommandBuilder } from "discord.js";
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
  const tipo = interaction.options.getString("tipo");
  const { valor, resultado } = rolarD20();

  await interaction.reply(
    `📤 **Cruzamento (${tipo})**  
🎲 D20: **${valor}**  
📊 Resultado: **${resultado}**`
  );
}
