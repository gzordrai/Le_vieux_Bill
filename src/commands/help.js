const Discord = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    aliases: ['commands', 'aid', 'assist', 'heal', 'support'],
    description: 'Vous permet de consulter la liste des commandes',
    
    execute(message, args) {

        const { commands } = message.client;
        let embed = new Discord.MessageEmbed()
            .setFooter('Merci de contacter le bot par message privé en cas de problème.')
            .setColor('BLUE');

        if(!args.length){

            let commandsList = commands.map(command => command.name);
            embed.setTitle('Liste des commandes')
            .setDescription(`Pour plus d'information sur une commande: \n${prefix}help [command name]`);

            commandsList.forEach(command => {

                if(command === 'help') return;
                let commandDescription = commands.get(command).description;
                embed.addField(command, commandDescription);

            });

            return message.channel.send(embed);

        }

        let commandName = args[0].toLowerCase();
        let command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));
        embed.setTitle(`Informations sur ${prefix}${commandName}`);

        if(!command)
            return message.channel.send(`Cette commmande n'existe pas !`);

        if(command.aliases){
            embed.addField('Alias:', command.aliases.join(', '));
        }

        if(command.description){
            embed.addField('Description:', command.description);
        }

        if(command.usage){
            embed.addField('Usage:', command.usage);
        }

        if(command.cooldown){
            embed.addField('Cooldown:', `${command.cooldown}s`);
        }

        message.channel.send(embed);

    },
};