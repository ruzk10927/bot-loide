import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";
import { extrairAtributo, possuiPlaystyle } from "../services/fichaParser.js";
import { rolarComAtributo } from "../services/advancedRollService.js";

export const data = new SlashCommandBuilder()
  .setName("passe")
  .setDescription("Realiza um passe")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setRequired(true)
      .addChoices(
        { name: "Normal", value: "normal" },
        { name: "Profundidade", value: "profundidade" }
      )
  );

export async function execute(interaction) {
  const tipo = interaction.options.getString("tipo");
  const player = await Player.findOne({ discordId: interaction.user.id });

  const atributo = extrairAtributo(player.rawFicha, "PASSE", "Passe Curto");
  let bonus = possuiPlaystyle(player.rawFicha, "Passe Incisivo") ? 3 : 0;

  const { base, total, resultado } = rolarComAtributo(atributo, bonus);

  await interaction.reply(
    `🎯 **Passe (${tipo})**
🎲 Base: ${base}
🎯 Total: **${total}**
📊 **${resultado}**`
  );
}
