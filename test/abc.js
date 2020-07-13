const fs = require('fs');
const filePath = './database.json';
const fileContents = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContents);

class User {
    //constructeur
    constructor(baseBalance) {
        this.balance = baseBalance;
        this.cooldown = {
            collect: 0,
            daily: 0,
            duel: 0,
        }
        this.items = {
            shovel: 0
        }
    }

    addMoney(amount) {
        this.balance += amount;
    }

    getMoney() {
        return this.balance;
    }

    setMoney(amount) {
        this.balance = amount;
    }

    write() {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), err => {
            if (err) throw err;
        })
    }
}

module.exports = User;

data[18] = new User(500);
data[18].write();