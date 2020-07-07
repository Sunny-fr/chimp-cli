const config = require('../config')
const {configExistAndValid} = require('../core/management')
const Generate = require('../utils/Generate')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const execSync = require('child_process').execSync
const showSuccess = require('../messages/success')


function start() {
    configExistAndValid({config})
        .then(chimpConfig => {
            let packagePath = path.dirname(require.resolve('./rollup/.chimp-cfg'));


            console.log('')
            console.log('')
            console.log(chalk.green(' Generating Files for Rollup + Sass Template... '))
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
                console.log(chalk.green(' Installing dependencies '))
                console.log(chalk.green(' running npm install for you '))
                console.log(chalk.green(' '))
                console.log(chalk.green(' please wait... '))
                console.log('')
                console.log('')

                execSync('npm install',{stdio:[0,1,2]})

                console.log('')
                console.log('')

                showSuccess()

                console.log('')
                console.log('')
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