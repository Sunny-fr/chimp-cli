const homedir = require('os').homedir();
const config = {
    "main": ".chimp-config",
    "core": homedir + "/.chimp",
    "access_token_path": homedir + "/.chimp/token"
}

module.exports = config
