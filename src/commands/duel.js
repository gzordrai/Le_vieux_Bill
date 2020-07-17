const utilities = require('../utilities/utilities.js');
const db = utilities.db;
const rand = utilities.rand;

module.exports = {
    name: 'duel',
    description: 'Vous permet de defier une personne en duel',
    aliases: ['fight', 'contest', 'combat'],
    args: true,
    usage: '@user <amount>',
    cooldown: 60,
    execute(message, args) {

        let authorID = message.author.id;
        let userMention = message.mentions.users.first();

        if(!userMention)
            return message.reply(`aucun utilisateur mentionné !`);

        let userMentionID = userMention.id;
        
        if(!db.isValidAccount(authorID) || !db.isValidAccount(userMentionID))
            return message.reply(`un utilisateur n'a pas de compte !`);

        if(args[1] === undefined)
            return message.reply(`aucune mise a été spécifé !`);

        let stake = parseInt(args[1]);

        if(!Number.isInteger(stake))
            return message.reply(`la mise est invalide !`);
        
        if(stake <= 0)
            return message.reply(`montant de la mise invalide !`);

        if(db.game.showBalance(authorID) < stake ||
        db.game.showBalance(userMentionID) < stake)
            return message.reply(`Un utilisateur n'a pas assez de pièces d'or`);

        message.delete();

        message.channel.send(`${userMention}, <@${authorID}> vous défie en duel pour ${stake} pièces d'or !`)
        .then(message => {

            message.react('✅');
            message.react('❌');

            let filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === userMention.id;
            message.awaitReactions(filter, {maxEmojis: 1, time: 60000, errors: ['time']})
            .then(collected => {

                if(collected.first() === undefined)
                    return message.channel.send(`<@${authorID}> merci de ne pas abuser de ton pouvoir en supprimant les messages !`)

                if(collected.first().emoji.name === '❌'){
                    message.delete();
                    message.channel.send(`<@${authorID}>, ${userMention} refuse votre duel !`)
                    .then(message => {
                        message.delete({timeout: 60000})
                    })
                    return;
                }

                message.delete();

                message.channel.send(`<@${authorID}>, ${userMention} a accepté le duel !`)
                .then(message => {

                    db.game.add(authorID, -stake);
                    db.game.add(userMentionID, -stake);

                    setTimeout(function() {
                        message.edit('Pan pan ! 2 Coups de feu ont été tirés !');
                    }, 2000);
                    
                    setTimeout(function() {
                        
                        stake = stake*2
                        let authorValue = rand.int(0, 20);
                        let userMentionValue = rand.int(0, 20);

                        if(authorValue < userMentionValue){
                            message.channel.send(`<@${authorID}> a gagné en tirant en ${authorValue}ms ! Son adversaire est mort en tirant en ${userMentionValue}ms !`);
                            message.channel.send(`Il gagne donc ${stake} pièces d'or !`);
                            db.game.add(authorID, stake);
                        }

                        if(authorValue > userMentionValue){
                            message.channel.send(`${userMention} a gagné en tirant en ${userMentionValue}ms ! Son adversaire est mort en tirant en ${authorValue}ms !`);
                            message.channel.send(`Il gagne donc ${stake} pièces d'or !`);
                            db.game.add(userMentionID, stake);
                        }

                        if(authorValue === userMentionValue){
                            message.channel.send(`Les deux duellistes sont morts ! Un squellette a ramassé les pièces d'or !`);
                        }
                    }, 2000);

                })
            })

        })
        .catch(err => {
            console.log(err);
            message.channel.send(`<@${OwnerID}>, <@${UsermentionID}> refuse votre duel !`);

        })
    },
};