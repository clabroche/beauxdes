const Extension = require('./Extension')

module.exports = function init(meta) {
  return new Extension(meta.uuid);
}
