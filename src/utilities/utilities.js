const fs = require('fs');
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
                warn: {
                    warnNumber: 0,
                },
                game: {
                    balance: 100,
                    items: {}
                }
            }
            this.write();
        },

        isValidAccount: function(userID) {
            if(data.users[userID] === undefined) return false;
            return true;
        },
    
        write: function(){
            fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), err => {
                if (err) throw err;
            })
        },
        
        warn: {
            add: function (userID, reason) {
                let warnNumber = data[userID].warn.warnNumber + 1;
                data[userID].warn.warnNumber = warnNumber;
                data[userID].warn['#' + warnNumber] = {
                    reason: reason,
                    date: new Date()
                }
                this.write();
            },
    
            delete: function (userID, warnNumber) {
                if (data[userID].warn[warnNumber] === undefined)
                    return false;
                delete data[userID].warn[warnNumber];
                data[userID].warn.warnNumber--;
                this.write();
                return true;
            },

            write: function(){
                fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), err => {
                    if (err) throw err;
                })
            },
        },

        game: {
            showBalance: function (userID) {
                return data.users[userID].game.balance;
            },

            add: function (userID, amount) {
                data.users[userID].game.balance += amount;
                this.write();
            },
    
            leaderboard: function () {
                let usersID = Object.keys(data.users);
                let usersInfo = {};
                let balances = [];
                let leaders = [];
                usersID.forEach(ID => {
                    usersInfo[data.users[ID].game.balance] = ID;
                })
                let usersBalance = Object.keys(usersInfo);
                usersBalance.forEach(balance => {
                    balances.push(parseInt(balance));
                })
                balances = balances.slice(balances.length - 10).reverse();
                for(let i = 0; i < 10; i++){
                    leaders.push([usersInfo[balances[i]], balances[i]])
                }
                return leaders;
            },

            write: function(){
                fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), err => {
                    if (err) throw err;
                })
            },
        },
    }
}