const Discord = require('discord.js');
const utilities = require('../utilities/utilities.js');
const db = utilities.db;

module.exports = {
    name: 'leaderboard',
    aliases: ['lead', 'scoring', 'classification', 'grading', 'ranking'],
    description: 'Vous permet de consulter la liste des 10 membres les plus riches',
    args: false,
    usage: '',
    
    execute(message) {

        let leaders = db.game.leaderboard();
        let username;
        let embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle('Leaderboard')
        .setFooter('Merci de contacter le bot par message privé en cas de problème.');

        for(let i = 0; i < 10; i++){
            let user = message.guild.members.cache.get(leaders[i][0])
            if (user !== undefined){
                username = message.guild.members.cache.get(leaders[i][0]).user.username;
                embed.addField(`${i + 1}. ${username}`, `Solde: ${leaders[i][1]}`);
            } else {
                console.log(`${leaders[i][0]} is not in the guild !`);
            }
        }

        message.channel.send(embed);
    }
}