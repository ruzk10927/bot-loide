import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import "dotenv/config";

const commands = [];
const commandsPath = path.join(process.cwd(), "src", "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.data.toJSON());
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
    console.error(error);
  }
})();
