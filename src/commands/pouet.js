const utilities = require('../utilities/utilities.js');
const db = utilities.db;

module.exports = {
    name: 'pouet',
    aliases: ['pouet'],
    description: 'Vous permet de consulter votre compte',
    
    execute(message, args) {
        db.leaderboard();
    }
}