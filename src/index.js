import { Client, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`🤖 Online como ${client.user.tag}`);
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🍃 MongoDB conectado");

    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error("❌ Erro ao iniciar o bot:", err);
    process.exit(1);
  }
}

start();
