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
    usage: '<round> (optional)',

    execute(message, args) {

        let author = message.author;
        let authorID = author.id;
        let price = 100;
        let emojis = ['🍒', '💸', '🍌', '🍎'];
        let draw = [];
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setFooter('Merci de contacter le bot par message privé en cas de problème.');

        var amount = args[0];

        if (amount === undefined || !Number.isInteger(parseInt(amount))){
            amount = 1;
        }

        if (!db.isValidAccount(authorID)){
            embed.setTitle(`Vous n'avez pas de compte ! Merci de bien vouloir faire ${prefix}register !`);
            return message.channel.send(embed);
        }

        if (db.game.showBalance(authorID) < price * amount) {
            embed.setTitle(`Vous n'avez pas assez de pièces d'or !`);
            return message.channel.send(embed);
        }
        db.game.add(authorID, -price * amount);

        for (let around = 0; around < amount; around++){

            if (draw.length === 3){
                draw = [];
            }

            for (let i = 0; i < 3; i++) {
                draw.push(emojis[rand.int(0, emojis.length)]);
            }
    
            message.channel.send(`[${draw[0]}][${draw[1]}][${draw[2]}]`);
    
            if (draw[0] === draw[1] && draw[1] === draw[2] && draw[0] === emojis[0]) {
                db.game.add(authorID, price*50);
                message.channel.send(`Vous remportez 50 fois le prix de départ (50X${price})`);
            };
    
            if (draw[0] === draw[1] && draw[1]=== draw[2] && draw[0] === emojis[1]) {
                db.game.add(authorID, price*100);
                message.channel.send(`Vous remportez le 100 fois le prix de départ (100X${price})`);
            };
    
            if (draw[0] === draw[1] && draw[1]=== draw[2] && draw[0] === emojis[2]) {
                db.game.add(authorID, price*10);
                message.channel.send(`Vous remportez 10 fois le prix de départ (10x${price})`);
            };
    
            if (draw[0] === draw[1] && draw[1]=== draw[2] && draw[0] === emojis[3]) {
                db.game.add(authorID, price*2);
                message.channel.send(`Vous remportez 2 fois le prix de départ (2x${price})`);
            };
        }
    }
}