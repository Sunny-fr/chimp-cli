const fs = require('fs')
//const path = require('path')

//const inquirer = require('inquirer')



function templatize(s, d) {
    for (let p in d)
        s = s.replace(new RegExp('---' + p + '---', 'g'), d[p])
    return s
}

function log(str) {
    console.log(str)
    //console.log(chalk.yellow(str))
}

function getFileContents(file) {
    return fs.readFileSync(file, {encoding: 'utf8'})
}

function writeFileContent(fullPath, contents) {
    return fs.writeFileSync(fullPath, contents, {encoding: 'utf8'})
}
function fileExists(fullPath) {
    return fs.existsSync(fullPath)
}
function createDirectory(fullPath) {
    return fs.mkdirSync(fullPath, {recursive: true})
}
const omit = (props, prop) => {
    const omitted = typeof prop === 'string' ? [prop] : prop
    return Object.keys(props).reduce((state, current) => omitted.includes(current) ? state : {
        ...state,
        [current]: props[current]
    }, {})
}


module.exports = {
    getFileContents,
    writeFileContent,
    createDirectory,
    templatize,
    fileExists,
    omit
}