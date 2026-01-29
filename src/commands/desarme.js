import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";
import { rolarComAtributo } from "../services/advancedRollService.js";
import { extrairAtributo, possuiPlaystyle } from "../services/fichaParser.js";

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
  const player = await Player.findOne({ discordId: interaction.user.id });

  if (!player) {
    return interaction.reply({ content: "❌ Jogador não encontrado no banco de dados.", ephemeral: true });
  }

  if (!player.rawFicha) {
    return interaction.reply({ content: "❌ Ficha não integrada.", ephemeral: true });
  }

  // Determina o atributo baseado no tipo de desarme
  let atributo;
  if (tipo === "carrinho") atributo = extrairAtributo(player.rawFicha, "DEFESA", "Carrinho");
  if (tipo === "dividida") atributo = extrairAtributo(player.rawFicha, "DEFESA", "Dividida em Pé");

  if (atributo === undefined) {
    return interaction.reply({ content: `❌ Atributo de ${tipo} não encontrado na ficha.`, ephemeral: true });
  }

  let bonus = 0;
  if (possuiPlaystyle(player.rawFicha, "Carrinho Limpo") && tipo === "carrinho") bonus += 2;
  if (possuiPlaystyle(player.rawFicha, "Antecipação") && tipo === "dividida") bonus += 2;

  const { base, total, resultado } = rolarComAtributo(atributo, bonus);

  await interaction.reply(
    `🛡️ **Desarme (${tipo})**  
🎲 Base: ${base}  
📈 Modificador: +${Math.floor(atributo / 10)} | Playstyle: +${bonus}  
🎯 Resultado Final: **${total}**  
📊 **${resultado}**`
  );
}
