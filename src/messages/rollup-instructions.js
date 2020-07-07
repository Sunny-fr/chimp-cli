
const boxen = require('boxen')
const chalk = require("chalk");

const greeting = chalk.white(' 🐵  \n Rollup + Sass Template instructions/options ' +
    '\n \n A. Activate live reload and Watch: ' + chalk.yellow('npm run chimp:watch') +
    '\n B. Bundle and deploy: ' + chalk.yellow('npm run chimp:deploy') +
    '\n C. Watch and recompile JS/SASS bundle: ' + chalk.yellow('npm run rollup:watch') +
    '\n D. Bundle (compile JS and SASS): ' + chalk.yellow('npm run rollup:bundle') +
    '\n ' +
    '\n Use A. and C. simultaneously' +
    '\n to activate full live reload while developing !' )

const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#18acff',
    backgroundColor: '#555555',
}

const rollupInstruction = () => console.log(boxen(greeting, boxenOptions))
module.exports = rollupInstruction