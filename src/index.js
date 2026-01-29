import "dotenv/config";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

/* ===== Carregar comandos ===== */
const commandsPath = path.resolve("src/commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

/* ===== MongoDB ===== */
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB conectado");

    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error("❌ Erro ao iniciar o bot:", err);
  }
}

client.once("ready", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

/* ===== Interações ===== */
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Erro ao executar o comando.",
      ephemeral: true,
    });
  }
});

start();
