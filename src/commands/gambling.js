const Discord = require('discord.js');
const { prefix } = require('../../config/config.js');
const utilities = require('../utilities/utilities.js');
const rand = utilities.rand;
const db = utilities.db;

module.exports = {
    name: 'gambling',
    description: "Vous permet de jouer à la machine a sous (coût: 100)",
    aliases: ['bet', 'speculate'],
    args: false,

    execute(message) {

        let author = message.author;
        let authorID = author.id;
        let price = 100;
        let emojis = ['🍒', '💸', '🍌', '🍎'];
        let draw = [];
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setFooter('Merci de contacter le bot par message privé en cas de problème.');

        if(!db.isValidAccount(authorID)){
            embed.setTitle(`Vous n'avez pas de compte ! Merci de bien vouloir faire ${prefix}register !`);
            return message.channel.send(embed);
        }

        if (db.game.showBalance(authorID) < price) {
            embed.setTitle(`Vous n'avez pas assez de pièces d'or !`);
            return message.channel.send(embed);
        }
        db.game.add(authorID, -price);

        for (let i = 0; i < 3; i++) {
            draw.push(emojis[rand.int(0, emojis.length)]);
        }

        message.channel.send(`[${draw[0]}][${draw[1]}][${draw[2]}]`);

        if (draw[0] === draw[1] && draw[1]=== draw[2] && draw[0] === emojis[0]) {
            db.game.add(authorID, price*50);
            message.channel.send(`Vous remportez le bouble du prix de départ (2X${price})`);
        };

        if (draw[0] === draw[1] && draw[1]=== draw[2] && draw[0] === emojis[1]) {
            db.game.add(authorID, price*100);
            message.channel.send(`Vous remportez le 10 fois le prix de départ (10X${price})`);
        };

        if (draw[0] === draw[1] && draw[1 ]=== draw[2] && draw[0] === emojis[2]) {
            db.game.add(authorID, price*10);
            message.channel.send(`Vous remportez le prix de départ (${price})`);
        };

        if (draw[0] === draw[1] && draw[1 ]=== draw[2] && draw[0] === emojis[3]) {
            db.game.add(authorID, price*2);
            message.channel.send(`Vous perdez encore un fois le prix de départ ${price}`);
        };
    }
}