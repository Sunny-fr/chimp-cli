const watch = require('node-watch');

const fileWatcher = ({chimpConfig, onChange }) => {
    const files = [chimpConfig['css-path'], chimpConfig['js-path']]
    console.log('watching theses files:')
    console.log(files.join('\n'))
    watch(files, function(evt, name) {
        console.log('%s changed.', name);
        if (onChange) onChange(name)
    });
}

module.exports = fileWatcher