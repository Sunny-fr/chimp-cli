const config = require('../config')
const {configExistAndValid} = require('../core/management')
const Generate = require('../utils/Generate')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

function start() {
    configExistAndValid({config, slugOnly: true})
        .then(chimpConfig => {
            let packagePath = path.dirname(require.resolve('./simple/.chimp-cfg'));


            console.log('')
            console.log('')
            console.log(chalk.green(' Generating Files for Simple Template... '))
            console.log('')
            console.log('')


            new Generate({
                templatePath: packagePath,
                targetPath: process.cwd(),
                chimpConfig
            }).build().then(() => {
                fs.unlinkSync(process.cwd() + '/.chimp-config')
                fs.renameSync('.chimp-cfg', '.chimp-config')

                console.log('')
                console.log('')
                console.log(chalk.green('   --- I T \' S  D O N E ---'  ))
                console.log(chalk.green('         happy coding !'))
                console.log(chalk.green(''))
                console.log(chalk.green(' You can now run again : chimp '))
                console.log(chalk.green(' and choose the option of watching or deploying '))
                console.log(chalk.green(' you recipe ! '))
                console.log('')
                console.log('')
                })
        })
        .catch(e => {
            console.log('Main error')
            console.log(e)
        })
}

start()