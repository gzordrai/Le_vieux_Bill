class User {
    //constructeur
    constructor(ID, baseBalance) {
        this.ID = ID;
        this.balance = baseBalance;
    }

    //ajoute (ou retire si amount est negatif) de l'argent a l'utilisateur
    addMoney(amount) {
        this.balance += amount;
    }

    //retourne l'argent de l'utilisateur
    getMoney() {
        return this.balance;
    }

    //definis l'argent de l'utilisateur
    setMoney(amount) {
        this.balance = amount;
    }

    //retourne l'ID de l'utilisateur
    getID() {
        return this.ID;
    }
    //pas de setID() pcque l'ID ne changeras jamais et on a donc pas besoin d'y toucher
}

//definition de la bdd
var data = {};

//des IDs random sur lesquels travailler
const IDs = [2, 24, 31, 0];

//creation des objets
IDs.forEach(ID => {
    data[ID] = new User(ID, 500);
});

//ajout d'un autre objet avec moins de money
data[37] = new User(37, 25);

for (const userID in data) {
    console.log(data[userID]);
}

data[2].addMoney(50) //modification juste d'un objet avec sa methode
data[24].setMoney(-5) //modification d'un autre objet

console.log("apres modif:")
for (const userID in data) {
    console.log(data[userID]);
}