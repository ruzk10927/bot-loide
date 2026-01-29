import { SlashCommandBuilder } from "discord.js";
import { rolarD20 } from "../services/rollService.js";

export const data = new SlashCommandBuilder()
  .setName("desarme")
  .setDescription("Realiza um desarme")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setDescription("Tipo de desarme")
      .setRequired(true)
      .addChoices(
        { name: "Carrinho", value: "carrinho" },
        { name: "Dividida", value: "dividida" }
      )
  );

export async function execute(interaction) {
  const tipo = interaction.options.getString("tipo");
  const { valor, resultado } = rolarD20();

  await interaction.reply(
    `🛡️ **Desarme (${tipo})**  
🎲 D20: **${valor}**  
📊 Resultado: **${resultado}**`
  );
}
