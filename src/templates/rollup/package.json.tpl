{
  "name": "{recipe-slug}",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.js",
  "scripts": {
    "start": "chimp",
    "chimp:watch": "rollup -c ./rollup.config.js && chimp watch",
    "chimp:deploy": "rollup -c ./rollup.config.js && chimp deploy",
    "rollup:watch": "rollup  -c ./rollup.config.js -w",
    "rollup:bundle": "rollup -c ./rollup.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/core": "^7.10.0",
    "animate.css": "^4.1.0",
    "rollup": "^2.6.1",
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-peer-deps-external": "^2.2.2",
    "rollup-plugin-sass": "^1.2.2"
  },
  "devDependencies": {
    "rollup-plugin-babel": "^4.4.0",
    "rollup-plugin-node-resolve": "^5.2.0",
    "rollup-plugin-postcss": "^3.1.1",
    "rollup-plugin-terser": "^6.1.0"
  }
}
