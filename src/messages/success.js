
const boxen = require('boxen')
const chalk = require("chalk");

const greeting = chalk.white.bold('ITS DONE !!')

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'yellow',
    backgroundColor: '#555555'
}

const showSuccessMessage = () => console.log(boxen(greeting, boxenOptions))
module.exports = showSuccessMessage