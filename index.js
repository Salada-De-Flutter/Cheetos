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
// Rota para receber o pong da Edge Function
app.post('/pong', (req, res) => {
  console.log('Recebido pong da Edge Function:', new Date().toISOString());
  // Reinicia o timer keep alive
  startKeepAlive();
  res.status(200).send('pong recebido');
});

// Função para iniciar o ciclo keep alive
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let keepAliveTimeout = null;
function startKeepAlive() {
  if (keepAliveTimeout) clearTimeout(keepAliveTimeout);
  // Timer aleatório entre 1 e 4 minutos
  const next = Math.floor(Math.random() * 180000) + 60000;
  console.log(`Próximo ping para Edge Function em ${Math.round(next/1000)} segundos.`);
  keepAliveTimeout = setTimeout(async () => {
    try {
      // Chame sua Edge Function de ping aqui
  await fetch('https://qsjunwuvmwgwkplhkyil.supabase.co/functions/v1/keep-alive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pong_url: 'https://cheetos-gjiw.onrender.com/pong' })
      });
      console.log('Ping enviado para Edge Function.');
    } catch (e) {
      console.log('Erro ao enviar ping para Edge Function:', e.message);
      // Tenta novamente em 1 minuto
      keepAliveTimeout = setTimeout(startKeepAlive, 60000);
    }
  }, next);
}

// Iniciar o bot Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

// Iniciar o servidor Express na porta do Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  startKeepAlive();
  require('./src/bot');
});
