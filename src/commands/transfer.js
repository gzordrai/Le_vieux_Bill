const utilities = require('../utilities/utilities.js');
const db = utilities.db;

module.exports = {
    name: 'transfert',
    description: 'pouet',
    aliases: ['transfert'],
    args: true,
    usage: '<@user> <montant>',
    cooldown: 0,
    execute(message, args) {

        let author = message.author;
        let authorID = author.id;

        if (args[1] === undefined)
            return message.channel.send(`Argument manquant !`);

        let amount = parseInt(args[1]);

        if (!args[0].startsWith('<@!') && !args[0].endsWith('>'))
            return message.channel.send(`Argument invalide !`);
        userID = args[0].slice(3, 21);

        if(!Number.isInteger(amount))
            return message.reply(`Le montant est invalide !`);

        db.game.add(authorID, -amount);
        db.game.add(userID, amount);

        message.channel.send(`Transfert réussi !`);
    },
};