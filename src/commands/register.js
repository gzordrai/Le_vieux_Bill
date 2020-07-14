const Discord = require('discord.js');
const { prefix } = require('../../config/config.js');
const utilities = require('../utilities/utilities.js');
const db = utilities.db;

module.exports = {
    name: 'register',
    description: 'Vous permet de créer un compte',
    aliases: ['archives', 'log', 'record', 'annals'],
    args: false,
    execute(message, args) {

        let author = message.author
        let authorID = author.id;
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setFooter('Merci de contacter le bot par message privé en cas de problème.');

        if(db.isValidAccount(authorID)){
            embed.setTitle(`Il semblerait que vous possedez déja un compte ${author.username} !`);
            return message.channel.send(embed);
        }

        db.register(authorID);
        embed.setColor('GREEN')
            .setTitle(`Votre compte a été créé avec succès ${author.username}, vous reçevez 100 pièces d'or pour l'ouverture de votre compte !`);;
        message.channel.send(embed)
    },
};