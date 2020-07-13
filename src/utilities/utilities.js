;const fs = require('fs');
const { data, dbPath } = require('../../index.js');

const answers = [
    'en tuant un squelette !',
    'en fouillant un squelette !',
    'en pillant un navire de pêche !',
    'en vendant de la contrefaçon !',
    'en kidnappant des poulets !',
    'en pillant une taverne !',
    'en volant une cache de rhum !'
];

module.exports = {
    rand: {
        int: function (min, max) {
            return Math.floor(Math.floor(max - min) * Math.random()) + min;
        },
    
        answer: function () {
            return answers[this.int(0, answers.length)];
        }
    },

    db: {
        register: function (userID) {
            data.users[userID] = {
                balance: 1000000,
                items: {}
            }
            this.write();
        },
    
        showBalance: function (userID) {
            return data.users[userID].balance;
        },

        isValidAccount: function(userID) {
            if(data.users[userID] === undefined) return false;
            return true;
        },
    
        add: function (userID, amount) {
            data.users[userID].balance += amount;
            this.write();
        },

        leaderboard: function () {
            let usersID = Object.keys(data.users);
            let usersBalance = [];
            let leaders = [];
            usersID.forEach(i => {
                usersBalance.push(data.users[i].balance);
            });
            for(let i = 0; i < 10; i++){
                leaders.push(Math.max(...usersBalance));
                usersBalance = usersBalance.filter(balances => balances !== Math.max(...usersBalance))
            }
        },
    
        write: function(){
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), err => {
                if (err) throw err;
            })
        }
    }
}