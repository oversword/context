const packageJson = require('../package.json')

delete packageJson.scripts;
delete packageJson.devDependencies;
packageJson.main = 'index.js'

console.log(JSON.stringify(packageJson, null, '\t'))