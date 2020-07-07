const fs = require('fs')

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


const cleanParams = function (str) {
    return str.replace(/({[A-z0-9_\-]+})/g, '')
}

const interpolate = function (str, params) {
    const keys = Object.keys(params);
    // if no string is given we generate one ( params = {foo:'bar', baz:'wth'} will generate {foo}:{baz})
    // it will provide a unique id for models
    const stringToDecorate = str || keys.sort().map(v => '{' + v + '}').join(':')
    // it will turn path/to/{id} to path/to/123
    const result = keys.reduce((prev, current) => {
        const elm_val = params[current]
        // skip functions
        if (typeof elm_val === 'function') return prev

        if (Array.isArray(elm_val)) {
            return prev.replace(
                new RegExp('{' + current + '}', 'g'),
                '[' + elm_val.map(item => typeof item === 'object' ? interpolate(null, item) : item).join('|') + ']'
            )
        }
        if (typeof elm_val === 'undefined') return prev
        return prev.replace(new RegExp('{' + current + '}', 'g'), elm_val)
    }, stringToDecorate)
    // if params are missing we remove them
    // path/to/123/{anotherId} => path/to/123/
    return cleanParams(result)
}


module.exports = {
    getFileContents,
    writeFileContent,
    createDirectory,
    templatize,
    interpolate,
    fileExists,
    omit
}