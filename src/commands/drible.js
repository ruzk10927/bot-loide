import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";
import { extrairAtributo, possuiPlaystyle } from "../services/fichaParser.js";
import { rolarComAtributo } from "../services/advancedRollService.js";

export const data = new SlashCommandBuilder()
  .setName("drible")
  .setDescription("Realiza um drible")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setRequired(true)
      .addChoices(
        { name: "Pedalada", value: "pedalada" },
        { name: "Caneta", value: "caneta" }
      )
  );

export async function execute(interaction) {
  const tipo = interaction.options.getString("tipo");
  const player = await Player.findOne({ discordId: interaction.user.id });

  const atributo = extrairAtributo(player.rawFicha, "DRIBLE", "Dribles");
  let bonus = possuiPlaystyle(player.rawFicha, "Malvadeza") ? 3 : 0;

  const { base, total, resultado } = rolarComAtributo(atributo, bonus);

  await interaction.reply(
    `🕺 **Drible (${tipo})**
🎲 Base: ${base}
🎯 Total: **${total}**
📊 **${resultado}**`
  );
}
