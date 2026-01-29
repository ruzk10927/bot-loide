import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";
import { extrairAtributo, possuiPlaystyle } from "../services/fichaParser.js";
import { rolarComAtributo } from "../services/advancedRollService.js";

export const data = new SlashCommandBuilder()
  .setName("drible")
  .setDescription("Realiza um drible")
  .addStringOption(opt =>
    opt.setName("tipo")
      .setDescription("Escolha o tipo de drible")
      .setRequired(true)
      .addChoices(
        { name: "Pedalada", value: "pedalada" },
        { name: "Caneta", value: "caneta" },
        { name: "Chapéu", value: "chapeu" },
        { name: "Toque Duplo", value: "toque_duplo" },
        { name: "Elástico", value: "elastico" },
        { name: "360", value: "360" }
      )
  );

export async function execute(interaction) {
  const tipo = interaction.options.getString("tipo");
  const player = await Player.findOne({ discordId: interaction.user.id });

  if (!player?.rawFicha) {
    return interaction.reply({ content: "❌ Ficha não integrada.", ephemeral: true });
  }

  const atributo = extrairAtributo(player.rawFicha, "DRIBLE", "Dribles");
  let bonus = 0;

  // Bonus baseado nos playstyles do jogador
  if (possuiPlaystyle(player.rawFicha, "Malvadeza")) bonus += 3;
  if (possuiPlaystyle(player.rawFicha, "Firula") && ["pedalada", "elastico"].includes(tipo)) bonus += 2;

  const { base, total, resultado } = rolarComAtributo(atributo, bonus);

  await interaction.reply(
    `🕺 **Drible (${tipo})**
🎲 Base: ${base}
📈 Modificador: +${Math.floor(atributo / 10)} | Playstyle: +${bonus}
🎯 Resultado Final: **${total}**
📊 **${resultado}**`
  );
}
