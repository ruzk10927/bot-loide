import { Client, GatewayIntentBits } from 'discord.js';
import mongoose from 'mongoose';
import 'dotenv/config';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 MongoDB conectado');

    await client.login(process.env.DISCORD_TOKEN);
  } catch (err) {
    console.error('❌ Erro ao iniciar o bot:', err);
  }
}

start();
