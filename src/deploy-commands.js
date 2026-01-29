import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import "dotenv/config";

const commands = [];
const commandsPath = path.join(process.cwd(), "src", "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  try {
    const command = await import(path.join(commandsPath, file));
    if (command?.data && command?.execute) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`⚠️ Comando ignorado (faltando data ou execute): ${file}`);
    }
  } catch (err) {
    console.error(`❌ Erro ao importar o comando ${file}:`, err);
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("🔁 Registrando slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Slash commands registrados com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao registrar os comandos:", error);
  }
})();
