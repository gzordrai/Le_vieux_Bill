//Load Discord library and bot config
const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token, dbPath, channelName} = require('./config/config.js');
const rand = require('./src/utilities/utilities.js').rand;
module.exports = {
  data: JSON.parse(fs.readFileSync(dbPath, 'utf8')),
  dbPath: dbPath
}

//Create a client and make a commands list
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.name, command);
  console.log(`${file} has been loaded !`)
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {

  //Verify if the author of the message is not the bot and if the message starts with the prefix
  if (!message.content.startsWith(prefix) ||
    message.author.bot) return;

  //Remove the prefix from the beginning of the message
  const args = message.content.slice(prefix.length).split(' ');
  const commandName = args.shift().toLowerCase();

  //Aliases part
  //Verify if the command has been declared or if an command alias is included
  const command = client.commands.get(commandName) ||
  client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  //Args part
  //Verify if the command take an argument and if the argument has been declared
  if (command.args && !args.length) {
    let reply = `Vous n'avez fourni aucun argument !`;
    if (command.usage) {
      reply += `\nLa bonne utilisation serait: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  //Cooldown part
  //Verify if the command has been declared in cooldown collection
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  //Retrieves the date of the command and checks if the command has a cooldown property, if not the cooldown is 3 seconds
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  
  //Verify if in the command collection has author ID
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    //Verify if the coolddown of the command is respected
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`merci de patienter ${timeLeft.toFixed(1)} seconde(s) avant de refaire la comande \`${prefix}${command.name}\`.`);
    }
  }

  //Set the author ID and the date of the command in the command collection and delete it when the time is reached
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  //Try to execute the command, if an error has occurred the command execution is canceled
  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error);
    message.reply("Une erreur est survenue pendant l'exécution de la commande ! Merci de bien vouloir contacter un responsable");
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {

  var newStateChannelID = newState.channelID;// ID du nouveau channel
  var oldStateChannelID = oldState.channelID;// ID de l'ancien channel

  switch(newStateChannelID){
      case '679064329684779056':// Créer Sloop
          CreateShip(newState, 4, 'Sloop')
      break;

      case '673601916583936038':// Créer Brigantin
          CreateShip(newState, 5, 'Brigantin')
      break;

      case '679063311693905942':// Créer Galion
          CreateShip(newState, 6,'Galion')
      break;
  }

  if(oldStateChannelID === null || oldStateChannelID === undefined)return;
  let oldStateChannel = oldState.channel;
  if(oldStateChannel.parentID !== '581155233875623949')return;
  if(oldStateChannel.members.size !== 0)return;
  if(oldStateChannelID === '679064329684779056' || oldStateChannelID === '673601916583936038' || oldStateChannelID === '679063311693905942' || oldStateChannelID === '729320569899712583')return;
  oldStateChannel.delete();

  function CreateShip(newState, UserNumbrer, name) {// Fonction de création des channels vocaux
      newState.channel.guild.channels.create(`${name} ${channelName[rand.int(0, 8)]}`,{
          type: 'voice',
          parent: '581155233875623949',
          userLimit: UserNumbrer,
      })
      .then(VoiceChannel => {
          let VoiceID = VoiceChannel.id;
          newState.member.voice.setChannel(VoiceID);
      });
  }

});

//Client connection
client.login(token);