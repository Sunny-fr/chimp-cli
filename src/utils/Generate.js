const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const {interpolate} = require('../utils/utils')


function log(str) {
    console.log(chalk.yellow(str))
}

class Generate {
    constructor({templatePath = './',targetPath ='./', chimpConfig }) {
        this.templatePath = templatePath
        this.targetPath = targetPath
        this.chimpConfig = chimpConfig || {}
    }

    getFileContents(file) {
        return fs.readFileSync(file, {
            encoding: 'utf8'
        })
    }

    getStructure(root) {
        return new Promise(function (resolve/*, reject*/) {
            const structure = {}
            function walkSync(currentDirPath) {
                fs.readdirSync(currentDirPath).forEach(function (name) {
                    const filePath = path.join(currentDirPath, name);
                    const stat = fs.statSync(filePath);
                    if (stat.isFile()) {
                        structure[filePath] = {type: 'file', path: filePath}
                    } else if (stat.isDirectory()) {
                        structure[filePath] = {type: 'directory', path: filePath}
                        walkSync(filePath);
                    }
                });
            }

            walkSync(root)
            resolve(structure)
        })
    }

    build() {
        const root = this.templatePath
        const base = this.targetPath + '/'
        return this.getStructure(root).then(structure => {
            Object.keys(structure).forEach(  prop=>{
                const item = structure[prop]
                if (item.type === 'directory') {
                    fs.mkdirSync(base + item.path.substr(root.length + 1))
                    log('   | ' + item.path.substr(root.length + 1))
                } else if (item.type === 'file') {
                    const fullPath = base + item.path.substr(root.length + 1)
                    const contents = this.getFileContents(item.path)
                    const pathParts = fullPath.split('.')
                    const isTemplateFile = pathParts[pathParts.length-1] === 'tpl'
                    const newPath = isTemplateFile ? pathParts.slice(0, pathParts.length - 1).join('.') : fullPath
                    fs.writeFileSync(newPath, isTemplateFile ? interpolate(contents, this.chimpConfig) : contents)
                    log('   | -- ' + item.path.substr(root.length + 1))
                }
            }, )
        })
    }
}

module.exports = Generate