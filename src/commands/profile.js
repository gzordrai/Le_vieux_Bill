const Discord = require('discord.js');
const utilities = require('../utilities/utilities.js');
const db = utilities.db;

module.exports = {
    name: 'profile',
    aliases: ['character', 'profil', 'myself', 'account'],
    description: 'Vous permet de consulter votre compte',
    
    execute(message, args) {

        let author = message.author;
        let authorID = author.id;

        let embed = new Discord.MessageEmbed()
            .setTitle(`Compte de ${author.username}`)
            .setColor('BLUE')
            .setThumbnail(author.avatarURL({dynamic: true}))
            .addField('Solde', db.showBalance(authorID))
            .setFooter('Merci de contacter le bot par message privé en cas de problème.');
        
        message.channel.send(embed);
    }
}