const { db } = require('../utilities/utilities.js');

module.exports = {
    name: 'warn',
    description: "Vous permet d'ajouter ou de supprimer un warn a un utilisateur",
    aliases: ['beware'],
    args: true,
    usage: 'add <@user> <reason> / delete <@user> <#number>',

    execute(message, args) {

        let userID;

        if (!message.member.permissions.has('ADMINISTRATOR'))
            return message.channel.send(`Vous n'avez pas la permission d'executer cette commande !`);

        switch (args[0]) {
            case 'add':

                if (args[1] === undefined || args[2] === undefined)
                    return message.channel.send(`Argument manquant !`);

                if (!args[1].startsWith('<@!') && !args[1].endsWith('>'))
                    return message.channel.send(`Argument invalide !`);
                userID = args[1].slice(3, 21);
                
                if (!db.isValidAccount(userID)) {
                    db.register(userID);
                }

                db.warn.add(userID, message.content.split(' ').slice(3).join(' '));
                message.channel.send(`Warn ajouté a <@${userID}>`);
            break;

            case 'delete':

                if (args[1] === undefined || args[2] === undefined)
                    return message.channel.send(`Argument manquant !`);

                if (!args[1].startsWith('<@') && !args[1].endsWith('>'))
                    return message.channel.send(`Argument invalide !`);
                userID = args[1].slice(3, 21);
                
                if (!db.isValidAccount(userID))
                    return message.channel.send(`Cette personne n'a pas de warn !`);

                if (!args[2].startsWith('#'))
                    return message.channel.send(`Argument invalide !`);
                
                if(db.warn.delete(userID, args[2]) === false)
                    return message.channel.send(`Le warn ${args[2]} n'existe pas !`);
                
                message.channel.send(`Warn retiré a <@${userID}>`);
            break;
        }
    },
};