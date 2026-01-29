import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import mongoose from "mongoose";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URL);

// Carregar todos os comandos
const commandFiles = fs.readdirSync("./src/commands").filter(f => f.endsWith(".js"));
const commandsData = [];

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commandsData.push(command.data.toJSON());
}

// Registrar comandos na inicialização
client.once("ready", async () => {
  console.log(`${client.user.tag} online! Registrando comandos...`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID); // teste em servidor específico
  if (guild) {
    await guild.commands.set(commandsData);
    console.log("Todos os comandos registrados no servidor!");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "❌ Erro ao executar o comando.", ephemeral: true });
  }
});

client.login(process.env.TOKEN);
