const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const utilities = require('../utilities/utilities.js');
const db = utilities.db;

module.exports = {
    name: 'collect',
    description: "Vous permet de récupérer une petite quantité de pièce d'or",
    aliases: ['amass', 'stock'],
    args: false,
    cooldown: 7200,
    execute(message, args) {

        let authorID = message.author.id;
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setFooter('Merci de contacter le bot par message privé en cas de problème.');

        if(!db.isValidAccount(authorID)){
            embed.setTitle(`Vous n'avez pas de compte ! Merci de bien vouloir faire ${prefix}register !`);
            return message.channel.send(embed);
        }

        let reward = 40;
        db.add(authorID, reward);
        embed.setTitle(`Vous avez récupéré ${reward} pièces d'or en vendant un vieux coffre !`)
            .setColor('GREEN');
        message.channel.send(embed);
    },
};