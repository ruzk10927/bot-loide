import { SlashCommandBuilder } from "discord.js";
import Player from "../models/Player.js";
import { calcularTreino } from "../services/trainingService.js";

export const data = new SlashCommandBuilder()
  .setName("treino")
  .setDescription("Realiza uma sessão de treino")
  .addStringOption(opt =>
    opt.setName("foco")
      .setDescription("Foco do treino")
      .setRequired(true)
      .addChoices(
        { name: "Ritmo", value: "ritmo" },
        { name: "Finalização", value: "finalizacao" },
        { name: "Passe", value: "passe" },
        { name: "Drible", value: "drible" },
        { name: "Defesa", value: "defesa" },
        { name: "Físico", value: "fisico" }
      )
  );

export async function execute(interaction) {
  const foco = interaction.options.getString("foco");
  const player = await Player.findOne({ discordId: interaction.user.id });

  if (!player) {
    return interaction.reply({ content: "❌ Ficha não integrada.", ephemeral: true });
  }

  if (player.treinosSemana >= 3) {
    return interaction.reply({ content: "🚑 Limite semanal atingido.", ephemeral: true });
  }

  const { resultado, nota, pontos } = calcularTreino();
  const obrigatorios = Math.floor(pontos / 2);
  const livres = pontos - obrigatorios;

  player.pontos.livres += livres;
  player.treinosSemana += 1;
  await player.save();

  await interaction.reply(
    `🏋️ **Treino de ${foco.toUpperCase()}**  
🎲 Rolagem: ${resultado}  
📊 Nota: **${nota}**  
⭐ Pontos ganhos: **${pontos}**  
🔒 ${obrigatorios} pontos aplicados no foco  
🎁 ${livres} pontos livres`
  );
}
