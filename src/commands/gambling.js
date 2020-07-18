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
        let emojis = ['💸', '🍒', '🍌', '🍎'];
        let draw = [];
        let amount = args[0];
        let embed = new Discord.MessageEmbed()
            .setColor('RED')
            .setFooter('Merci de contacter le bot par message privé en cas de problème.');

        if (amount === undefined || !Number.isInteger(parseInt(amount))){
            amount = 1;
        }

        if(!db.isValidAccount(authorID)){
            embed.setTitle(`Vous n'avez pas de compte ! Merci de bien vouloir faire ${prefix}register !`);
            return message.channel.send(embed);
        }

        if(db.game.showBalance(authorID) < price * amount) {
            embed.setTitle(`Vous n'avez pas assez de pièces d'or !`);
            return message.channel.send(embed);
        }

        db.game.add(authorID, -price * amount);

        for(let around = 0; around < amount; around++) {

            if(draw.length === 3) {
                draw = [];
            }

            for(let i = 0; i < 3; i++) {
                draw.push(rand.int(0, emojis.length));
            }

            if(draw[0] === draw[1] && draw[0] === draw[2]) {

                let pourcentage = rand.int(1, 100);
                let reply = `Vous avez remporter `;

                switch(pourcentage) {
                    case 1:
                        db.game.add(authorID, price * 100);
                        message.channel.send(`[${emojis[0]}][${emojis[0]}][${emojis[0]}]`);
                        reply += '100 fois le prix de départ';
                    break;
                    case pourcentage > 1 && pourcentage <= 6:
                        db.game.add(authorID, price * 50);
                        message.channel.send(`[${emojis[1]}][${emojis[1]}][${emojis[1]}]`);
                        reply += '50 fois le prix de départ';
                    break;
                    case pourcentage > 6 && pourcentage <= 16:
                        db.game.add(authorID, price * 10);
                        message.channel.send(`[${emojis[2]}][${emojis[2]}][${emojis[2]}]`);
                        reply += '10 fois le prix de départ';
                    break;
                    case pourcentage > 16:
                        db.game.add(authorID, price * 2);
                        message.channel.send(`[${emojis[3]}][${emojis[3]}][${emojis[3]}]`);
                        reply += '2 fois le prix de départ';
                    break;
                }

                message.channel.send(reply);

            } else {
                message.channel.send(`[${emojis[draw[0]]}][${emojis[draw[1]]}][${emojis[draw[2]]}]`);
            }
        }
    }
}