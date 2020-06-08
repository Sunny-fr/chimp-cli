const boxen = require('boxen')
const chalk = require("chalk");

const greeting = chalk.white.bold(' 🐵 Welcome chimp cli 🐵️ ')

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#18acff',
    backgroundColor: '#555555'
}

const showWelcomeMessage = () => console.log(boxen(greeting, boxenOptions))
module.exports = showWelcomeMessage