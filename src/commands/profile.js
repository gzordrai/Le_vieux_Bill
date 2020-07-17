const Discord = require('discord.js');
const utilities = require('../utilities/utilities.js');
const db = utilities.db;

module.exports = {
    name: 'profile',
    aliases: ['character', 'profil', 'myself', 'account'],
    description: 'Vous permet de consulter votre compte',
    usage: '<@user> (optional)',

    execute(message, args) {

        let embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setFooter('Merci de contacter le bot par message privé en cas de problème.');

        if (args[0]) {
            if (args[0].startsWith('<@!') && args[0].endsWith('>')) {
                let userID = args[0].slice(3, 21);
                let user = message.guild.members.cache.get(userID).user;
                embed.setTitle(`Compte de ${user.username}`)
                .setThumbnail(user.avatarURL({dynamic: true}))
                .addField('Solde', db.game.showBalance(userID));
                message.channel.send(embed);
            }
        } else {
            let author = message.author;
            let authorID = author.id;

            let embed = new Discord.MessageEmbed()
                .setTitle(`Compte de ${author.username}`)
                .setColor('BLUE')
                .setThumbnail(author.avatarURL({dynamic: true}))
                .addField('Solde', db.game.showBalance(authorID))
                .setFooter('Merci de contacter le bot par message privé en cas de problème.');
            message.channel.send(embed);
        }
    }
}