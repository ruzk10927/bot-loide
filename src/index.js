import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import mongoose from "mongoose";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

async function startBot() {
  try {
    // 1️⃣ Conectar ao MongoDB
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI não definido nas variáveis do Railway!");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Conectado ao MongoDB");

    // 2️⃣ Carregar comandos
    const commandFiles = fs.readdirSync("./src/commands").filter(f => f.endsWith(".js"));
    const commandsData = [];

    for (const file of commandFiles) {
      const command = await import(`./commands/${file}`);
      client.commands.set(command.data.name, command);
      commandsData.push(command.data.toJSON());
    }

    // 3️⃣ Quando o bot estiver pronto
    client.once("ready", async () => {
      console.log(`🤖 ${client.user.tag} online! Registrando comandos...`);

      // Fetch do guild para garantir que o cache não está vazio
      if (!process.env.GUILD_ID) {
        console.warn("⚠️ GUILD_ID não definido. Comandos globais serão necessários.");
      } else {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        if (guild) {
          await guild.commands.set(commandsData);
          console.log("✅ Todos os comandos registrados no servidor!");
        } else {
          console.warn("⚠️ Guild não encontrado, comandos não foram registrados no servidor.");
        }
      }
    });

    // 4️⃣ Listener de interações
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        if (!interaction.replied) {
          await interaction.reply({ content: "❌ Erro ao executar o comando.", ephemeral: true });
        }
      }
    });

    // 5️⃣ Login do bot
    if (!process.env.TOKEN) throw new Error("TOKEN não definido nas variáveis do Railway!");
    await client.login(process.env.TOKEN);
    console.log("🔑 Bot logado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao iniciar o bot:", err);
    process.exit(1);
  }
}

// Iniciar o bot
startBot();
