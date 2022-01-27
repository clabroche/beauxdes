let BASE ="beauxdes"
const pathfs = require('path')
require('dotenv').config()
const stack = [
  {
    label: 'beauxdes-server',
    spawnCmd: 'npm',
    spawnArgs: ['run', 'serve'],
    spawnOptions: {
      cwd: pathfs.resolve(__dirname, 'server'),
      env: Object.assign({
        PORT: '6578',
      }, process.env)
    }
  },
]





module.exports = stack
