const express = require('express');
const path = require('path');
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();

// Servir arquivos estáticos da pasta frontend
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// (Opcional) Rota para a raiz
app.get('/', (req, res) => {
  res.send('API do bot rodando!');
});

// Iniciar o bot Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

client.login(process.env.DISCORD_TOKEN);

// Iniciar o servidor Express na porta do Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Iniciar o bot do Discord de forma organizada
  require('./src/bot');
});
