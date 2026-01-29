import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";
import { extrairAtributo, possuiPlaystyle } from "../services/fichaParser.js";
import { rolarComAtributo } from "../services/advancedRollService.js";

export const data = new SlashCommandBuilder()
  .setName("chute")
  .setDescription("Realiza um chute")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setRequired(true)
      .addChoices(
        { name: "Colocado", value: "colocado" },
        { name: "Bomba", value: "bomba" },
        { name: "Trivela", value: "trivela" }
      )
  );

export async function execute(interaction) {
  const tipo = interaction.options.getString("tipo");

  // Busca o jogador no banco
  const player = await Player.findOne({ discordId: interaction.user.id });
  if (!player) {
    return await interaction.reply({
      content: "❌ Jogador não encontrado no banco de dados.",
      ephemeral: true
    });
  }

  // Verifica se a ficha foi integrada
  if (!player.rawFicha) {
    return await interaction.reply({
      content: "❌ Ficha não integrada.",
      ephemeral: true
    });
  }

  // Extrai o atributo Finalização (valor padrão 50 caso não exista)
  const atributo = extrairAtributo(player.rawFicha, "FINALIZAÇÃO", "Finalização");

  // Calcula bônus de playstyle
  let bonus = 0;
  if (possuiPlaystyle(player.rawFicha, "Chute Colocado") && tipo === "colocado") bonus += 2;
  if (possuiPlaystyle(player.rawFicha, "Trivela") && tipo === "trivela") bonus += 2;

  // Rola com atributo e bônus
  const { base, total, resultado } = rolarComAtributo(atributo, bonus);

  // Responde ao usuário
  await interaction.reply(
    `⚽ **Chute (${tipo})**
🎲 Base: ${base}
📈 Modificador: +${Math.floor(atributo / 10)} | Playstyle: +${bonus}
🎯 Resultado Final: **${total}**
📊 **${resultado}**`
  );
}
