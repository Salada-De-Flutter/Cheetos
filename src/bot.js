require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
  if (message.content === '!criarficha') {
    const userId = message.author.id;
    const url = `https://cheetos-gjiw.onrender.com/frontend/ficha.html?user=${userId}`;
    message.reply(`Clique no link para preencher sua ficha: ${url}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
