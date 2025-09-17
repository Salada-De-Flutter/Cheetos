require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

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
  if (message.content === '!ficha') {
    const userId = message.author.id;
    fetch('https://qsjunwuvmwgwkplhkyil.supabase.co/functions/v1/pegar-ficha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discord_id: userId })
    })
      .then(async res => {
        if (!res.ok) throw new Error('Ficha não encontrada');
        return res.json();
      })
      .then(ficha => {
        const embed = new EmbedBuilder()
          .setColor(0x7289da)
          .setTitle(`Ficha de ${ficha.nome || message.author.username}`)
          .setDescription(`ID: ${ficha.discord_id}`)
          .addFields(
            { name: 'Idade', value: String(ficha.idade ?? '—'), inline: true },
            { name: 'Altura', value: ficha.altura ?? '—', inline: true },
            { name: 'Peso', value: ficha.peso ?? '—', inline: true },
            { name: 'Raça', value: ficha.raca ?? '—', inline: true },
            { name: 'Tipo Sanguíneo', value: ficha.tipo_sanguineo ?? '—', inline: true },
            { name: 'Level', value: String(ficha.level ?? '1'), inline: true },
            { name: 'Pontos', value: String(ficha.pontos ?? '0'), inline: true },
            { name: 'Velocidade', value: String(ficha.velocidade ?? '0'), inline: true },
            { name: 'Mentalidade', value: String(ficha.mentalidade ?? '0'), inline: true },
            { name: 'Força', value: String(ficha.forca ?? '0'), inline: true },
            { name: 'Determinação', value: String(ficha.determinacao ?? '0'), inline: true },
            { name: 'Atributo Único', value: ficha.atributo_unico ?? '—', inline: false }
          )
          .setFooter({ text: 'Sistema de Fichas - Cheetos', iconURL: message.client.user.displayAvatarURL() });
        message.reply({ embeds: [embed] });
      })
      .catch(() => {
        message.reply('Nenhuma ficha encontrada. Use !criarficha para criar a sua!');
      });
  }
});

client.login(process.env.DISCORD_TOKEN);
