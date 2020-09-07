#!/usr/bin/env node
const http = require('http')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const fileWatcher = require('./watch/file-watcher')
const {configExistAndValid} = require('./core/management')
const {getRecipe, updateRecipe} = require('./api/chimp')
const {templatize, getFileContents, writeFileContent} = require('./utils/utils')
const config = require('./config')


const PORT = 3310
const addCors = (req, res) => {
    const HEADERS_ACCESS_LIST = 'Content-Type'
    res.setHeader('Access-Control-Allow-Origin', '*') //req.headers.origin || '*'
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', HEADERS_ACCESS_LIST)
    res.setHeader('Access-Control-Expose-Headers', HEADERS_ACCESS_LIST)
}


const backupScriptAndDeployLiveReloadToRecipe = ({chimpConfig, SERVER}) => {
    const {token} = chimpConfig.token
    const id = chimpConfig['recipe-slug']
    console.log('getting recipe script content from server')
    return getRecipe({token, id})
        .then(recipe => {
            console.log('saving recipe script to disk')
            writeFileContent('./recipe-backup.js', recipe.js)
            const content = getFileContents( __dirname + '/watch/recipe-file-helper.js')
            const parsed = templatize(content, {SERVER})
            const updated = {
                ...recipe,
                js: parsed
            }
            console.log('updating recipe server script ')
            return updateRecipe({recipe: updated, token, id})

        })
}


const nodeClientCache = {
    content: null
}

const getNodeClientAsText = () => {
    try {
        if(nodeClientCache.content){
            return nodeClientCache.content
        }
        const clientPath = '../node_modules/socket.io-client/dist/socket.io.slim.js'
        const realPath = path.resolve(__dirname, clientPath)
        const content = fs.readFileSync(realPath, {content:'ut8'})
        return nodeClientCache.content = content
    } catch (e) {
        console.log('cant get socket client')
        console.log(e)
    }

}

function start() {

    const SERVER = `http://localhost:${PORT}`
    const startServer = (chimpConfig) => {
        const server = http.createServer(function (req, res) {
            const lastPath = req.url.split('/').pop()
            const send404 = () => {
                res.writeHead(404);
                res.end(JSON.stringify({message: 'not found'}));
            }

            if(req.url === '/socket-io/client') {
                addCors(req, res)
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                return res.end(getNodeClientAsText());
            }
            if(lastPath === 'js') {
                const content = getFileContents(chimpConfig['js-path'])
                addCors(req, res)
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                return res.end(content);
            }

            if(lastPath === 'css') {
                const content = getFileContents(chimpConfig['css-path'])
                addCors(req, res)
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                return res.end(content);
            }

            if(req.url === '/chimp-watcher.js') {
                const content = getFileContents(__dirname + '/watch/client-watcher.js')
                const parsed = templatize(content, {SERVER})
                addCors(req, res)
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                return res.end(parsed);

            }

            if(req.url === '/live-reload') {
                addCors(req, res)
                res.writeHead(200, { 'Content-Type': 'application/json' });
                const content = getFileContents( __dirname + '/watch/recipe-file-helper.js')
                const parsed = templatize(content, {SERVER})
                return res.end(JSON.stringify({
                    slug: chimpConfig['recipe-slug'],
                    source: parsed
                }));
            }
            else {
                send404()
            }

        })
        const io = require('socket.io')(server, {
            serveClient: false,
            // below are engine.IO options
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
            pingInterval: 10000,
            pingTimeout: 5000,
            transports: ['websocket', 'polling']
        })

        server.listen(PORT)

        console.clear()
        console.log('')
        console.log('')
        console.log(chalk.yellow('serving : ', SERVER ))
        console.log('')
        console.log('')

        //
        // console.log('')
        // console.log('')
        // console.log(chalk.green('PASTE THIS IN YOUR RECIPE SCRIPT  : '))
        // console.log(chalk.green('START '))
        // console.log('')
        // const content = getFileContents( __dirname + '/watch/recipe-file-helper.js')
        // const parsed = templatize(content, {SERVER})
        // console.log(parsed)
        // console.log('')
        // console.log(chalk.green('END '))



        //backupScriptAndDeployLiveReloadToRecipe({chimpConfig, SERVER})





        fileWatcher({
            chimpConfig, onChange: (name) => {
                io.sockets.emit('reload')
                console.log('reload requested', 'file', name)
            }
        })
    }


    configExistAndValid({config})
        .then(chimpConfig => {
            return startServer(chimpConfig)
        })
        .catch(e => {
            console.log('Main error')
            console.log(e)
        })



}

start()