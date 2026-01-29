import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";
import { extrairAtributo, possuiPlaystyle } from "../services/fichaParser.js";
import { rolarComAtributo } from "../services/advancedRollService.js";

export const data = new SlashCommandBuilder()
  .setName("passe")
  .setDescription("Realiza um passe")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setDescription("Escolha o tipo de passe")
      .setRequired(true)
      .addChoices(
        { name: "Normal", value: "normal" },
        { name: "Profundidade", value: "profundidade" }
      )
  );

export async function execute(interaction) {
  try {
    const tipo = interaction.options.getString("tipo");
    const player = await Player.findOne({ discordId: interaction.user.id });

    if (!player) {
      return interaction.reply({ content: "❌ Jogador não encontrado no banco de dados.", ephemeral: true });
    }

    if (!player.rawFicha) {
      return interaction.reply({ content: "❌ Ficha não integrada.", ephemeral: true });
    }

    // Seleciona atributo baseado no tipo de passe
    const atributo = tipo === "profundidade"
      ? extrairAtributo(player.rawFicha, "PASSE", "Passe Longo")
      : extrairAtributo(player.rawFicha, "PASSE", "Passe Curto");

    if (atributo === undefined) {
      return interaction.reply({ content: "❌ Atributo de Passe não encontrado na ficha.", ephemeral: true });
    }

    let bonus = possuiPlaystyle(player.rawFicha, "Passe Incisivo") ? 3 : 0;

    const { base, total, resultado } = rolarComAtributo(atributo, bonus);

    await interaction.reply(
      `🎯 **Passe (${tipo})**
🎲 Base: ${base}
📈 Modificador: +${Math.floor(atributo / 10)} | Playstyle: +${bonus}
🎯 Total: **${total}**
📊 **${resultado}**`
    );
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "❌ Ocorreu um erro ao executar o passe.",
      ephemeral: true
    });
  }
}
