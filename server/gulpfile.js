const { series, watch, parallel } = require('gulp')
const spawn = require('child_process').spawn
const killport = require('kill-port')
let node

function server(done) {
  if (node) {
    node.kill()
  }
  killport(process.env.PORT || 6578)
  node = spawn('node', ['./bin/www'], { stdio: 'inherit' })
  done()
}

function varEnv(done) {
  done()
}
function watchFiles() {
  watch('./src/**/*.js', server)
}

const reload = parallel( watchFiles, server)
exports.default = series(varEnv, reload)