/*const fs = require('fs');
const filePath = './database.json';
const fileContents = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(fileContents);
const User = require('./abc.js');

data[18].addMoney(500);
data[18].write();*/

const test = require('./poll.js').test;
console.log(test.test1, test.test2, test.test3, test.test4);