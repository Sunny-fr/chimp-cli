
const boxen = require('boxen')
const chalk = require("chalk");

const greeting = chalk.white(' 🐵  \n It\'s done! \n Happy Coding!')

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#18acff',
    backgroundColor: '#555555',
}

const showSuccessMessage = () => console.log(boxen(greeting, boxenOptions))
module.exports = showSuccessMessage