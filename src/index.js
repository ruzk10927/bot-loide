import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import mongoose from "mongoose";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Conectar ao MongoDB
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI não definido nas variáveis de ambiente.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch(err => {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  });

// Função para carregar comandos
async function loadCommands() {
  const commandsData = [];
  const commandFiles = fs.readdirSync("./src/commands").filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    try {
      const command = await import(`./commands/${file}`);
      if (!command.data || !command.execute) {
        console.warn(`⚠️ Comando ${file} ignorado: exportação incompleta`);
        continue;
      }
      console.log(`✅ Carregando comando: ${command.data.name}`);
      client.commands.set(command.data.name, command);
      commandsData.push(command.data.toJSON());
    } catch (err) {
      console.error(`❌ Erro ao carregar comando ${file}:`, err);
    }
  }

  return commandsData;
}

// Registrar comandos na inicialização
client.once("ready", async () => {
  console.log(`${client.user.tag} online! Registrando comandos...`);

  const commandsData = await loadCommands();

  if (!process.env.GUILD_ID) {
    console.error("❌ GUILD_ID não definido nas variáveis de ambiente.");
    return;
  }

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (guild) {
    try {
      await guild.commands.set(commandsData);
      console.log("✅ Todos os comandos registrados no servidor!");
    } catch (err) {
      console.error("❌ Erro ao registrar comandos no servidor:", err);
    }
  }
});

// Evento de interação
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`❌ Erro ao executar o comando ${interaction.commandName}:`, err);
    await interaction.reply({ content: "❌ Erro ao executar o comando.", ephemeral: true });
  }
});

// Login
if (!process.env.TOKEN) {
  console.error("❌ TOKEN não definido nas variáveis de ambiente.");
  process.exit(1);
}

client.login(process.env.TOKEN);
