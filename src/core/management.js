const prompt = require('prompt')
const {getToken, revokeToken, getRecipe, updateRecipe} = require('../api/chimp')
const {writeFileContent, getFileContents} = require('../utils/utils')
const {fileExists, createDirectory} = require('../utils/utils')
const showSuccessMessage = require('../messages/success')


const authProperties = [
    {
        name: 'username',
    },
    {
        name: 'password',
        hidden: true
    },
]
const properties = [
    {
        name: 'recipe-slug',
        message: 'The id of the recipe, check the last part of the URL',
    },
    {
        name: 'js-path',
        message: 'Path to your JavaScript file to be uploaded',
    },
    {
        name: 'css-path',
        message: 'Path to your CSS file to be uploaded',
    },
]


function authentificationPrompt() {
    return new Promise((resolve, reject) => {
        prompt.start()
        prompt.get(authProperties, function (err, result) {
            if (err) {
                return onErr(err)
            }
            resolve(result)
        })

        function onErr(err) {
            //console.log(err)
            reject(err)
            return 1
        }
    })

}

function configManagement({onComplete, slugOnly = false}) {

    prompt.start()

    const props = slugOnly ? properties.slice(0,1) : properties
    prompt.get(props, function (err, result) {
        if (err) {
            return onErr(err)
        }
        if (onComplete) return onComplete(result)

        // console.log('Command-line input received:')
        // console.log('  slug: ' + result['recipe-slug'])
        // console.log('  js path: ' + result['js-path'])
        // console.log('  css path: ' + result['css-path'])
    })

    function onErr(err) {
        console.log(err)
        return 1
    }
}


const writeConfig = ({result, config}) => {
    return writeFileContent(config.main, JSON.stringify(result, null, 2))
}

const isConfigValid = (config) => {
    return properties
        .every(property => {
        return !!config[property.name]
    })
}

const getAccessToken = ({config}) => {
    const contents = getFileContents(config.access_token_path)
    try {
        return JSON.parse(contents);
    }catch (e) {
        return {}
    }
}

function configExistAndValid({config, slugOnly = false}) {
    const exists = fileExists(config.main)
    if (!exists) {
        console.log(' - No chimp config file has been found ')
        console.log(' - Creating a new one')
        console.log(' ')
        return new Promise((resolve) => {
            configManagement({
                slugOnly,
                onComplete: (result) => {
                    writeConfig({result, config})
                    return resolve(result)
                }
            })
        })
    }
    const chimpConfig = JSON.parse(getFileContents(config.main))
    //console.log('config  exist')
    if (isConfigValid(chimpConfig)) {
        //console.log('config is valid')
        return Promise.resolve(chimpConfig)
    }
    return Promise.reject('--- \n \n config is not valid \n \n delete ' + config.main + ' file and run the command again.\n \n ' )
}


const saveToken = ({token, config}) => {
    //console.log('--- saving token to config')
    const accessToken = {
        ...token
    }

    if(!fileExists(config.core)) {
        //console.log('--- create config directory')
        createDirectory(config.core)
    }

    writeFileContent(config.access_token_path, JSON.stringify(accessToken, null, 2))
    return accessToken
}

const hasAuthToken = ({config}) => {
    return fileExists(config.access_token_path)
}

const checkTokenValidity = ({/*chimpConfig, */ config}) => {
    if(!hasAuthToken({config})) return Promise.reject('no access token found')
    return new Promise((resolve, reject) => {
        const accessToken = getAccessToken({config})
        if(!accessToken.expires || !accessToken.token) {
            return reject('missing access token')
        }
        const time = accessToken.expires * 1000
        const now = new Date().getTime()
        const remaining = time - now
        if (remaining < 0) {
            return reject('token has expired')
        }
        return resolve(accessToken)
    })
}

const authentication = ({chimpConfig, config}) => {
    return checkTokenValidity({chimpConfig, config})
        .then(accessToken => {
            return {
                config,
                chimpConfig,
                token: accessToken.token
            }
        }).catch(() => {
            //console.log(e)
            return authentificationPrompt()
                .then((result) => {
                    return getToken({username: result.username, password: result.password})
                })
                .then(token => {
                    const accessToken = saveToken({token, config})
                    return {
                        config,
                        chimpConfig,
                        token: accessToken.token
                    }
                })
        })
}

const recipeHandling = ({chimpConfig, config, token}) => {
    const id = chimpConfig['recipe-slug']
    return getRecipe({token, id})
        .then(recipe => {
            console.log('--- getting js content from disk')
            const jsContent = getFileContents(chimpConfig['js-path'])
            console.log('--- getting css content from disk')
            const cssContent = getFileContents(chimpConfig['css-path'])
            const updated = {
                ...recipe,
                js: jsContent || '',
                css: cssContent || ''
            }
            return updateRecipe({recipe: updated, token, id})
        })

        .catch(e => {
            console.log(e)
            return revokeToken({token: token})
                .catch(() => {
                    return saveToken({token: null, config})
                })
        })
}

function start({config}) {
    configExistAndValid({config})
        .then(chimpConfig => {
            return authentication({chimpConfig, config})
        })
        .then(({chimpConfig, config, token}) => {
            return recipeHandling({chimpConfig, config, token})
        })
        .then(() => {
            return showSuccessMessage()
        })
        .catch(e => {
            console.log('Main error')
            console.log(e)
        })
}

module.exports = {
    start,
    configExistAndValid
}
