const Discord = require('discord.js');
const utilities = require('../utilities/utilities.js');
const db = utilities.db;

module.exports = {
    name: 'leaderboard',
    aliases: [''],
    description: '',
    args: false,
    usage: '',
    
    execute(message) {

        let leaders = db.leaderboard();
        let username;
        let embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle('Leaderboard')
        .setFooter('Merci de contacter le bot par message privé en cas de problème.');

        for(let i = 0; i < 10; i++){
            username = message.guild.members.cache.get(leaders[i][0]).user.username;
            embed.addField(`${i + 1}. ${username}`, `Solde: ${leaders[i][1]} pièces d'or`);
        }

        message.channel.send(embed);
    }
}