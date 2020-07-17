const Discord = require('discord.js');
const { prefix } = require('../../config/config.js');
const utilities = require('../utilities/utilities.js');
const db = utilities.db;
const rand = utilities.rand;

module.exports = {
    name: 'daily',
    description: "Vous permet de récupérer une quantité moyenne de pièce d'or",
    aliases: ['quotidian', 'diurnal', 'routine'],
    args: false,
    cooldown: 86400,
    execute(message, args) {

        let authorID = message.author.id;
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setFooter('Merci de contacter le bot par message privé en cas de problème.');

        if(!db.isValidAccount(authorID)){
            embed.setTitle(`Vous n'avez pas de compte ! Merci de bien vouloir faire ${prefix}register !`);
            return message.channel.send(embed);
        }

        let reward = rand.int(0, 200);
        db.game.add(authorID, reward);
        embed.setTitle(`Vous avez récupéré ${reward} pièces d'or ${rand.answer()}`)
            .setColor('GREEN');
        message.channel.send(embed);
    },
};