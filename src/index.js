#!/usr/bin/env node

const chalk = require('chalk')
const cliSelect = require('cli-select')
const showWelcomeMessage = require('./messages/welcome')

const cli = () => {

    showWelcomeMessage()

    const deploy = () => require('./deploy')
    const watch = () => require('./watch')
    const simple = () => require('./templates/simple')
    const rollup = () => require('./templates/rollup')

    const dispatch = (task) => {

        switch (task) {
            case 'deploy': {
                return deploy()
            }
            case 'watch': {
                return watch()
            }
            case 'generate simple template': {
                return simple()
            }
            case 'generate rollup template': {
                return rollup()
            }
            default: {
                console.log('')
                console.log('')
                console.log('no available command for ' + task)
                console.log('')
                console.log('')
            }
        }


    }

    const args = process.argv.slice(2)

    if (args.length < 1) {
        console.log('')
        console.log('What do you want to do ?')
        console.log('')
        cliSelect({
            values: ['watch', 'deploy', 'generate simple template', 'generate rollup template'],
            valueRenderer: (value, selected) => {
                if (selected) {
                    return chalk.underline(value)
                }

                return value
            },
        }).then((response) => {
            dispatch(response.value)
        })

        return
    }


    dispatch(args[0])


}

cli()


