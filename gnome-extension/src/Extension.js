const GETTEXT_DOMAIN = 'beaux-des';
const { extensionUtils: ExtensionUtils } = imports.misc;
const Main = imports.ui.main;
const { GObject } = imports.gi;

const Indicator = GObject.registerClass(require('./Indicator'));

class Extension {
  constructor(uuid) {
    this._uuid = uuid;
    ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
  }

  enable() {
    this._indicator = new Indicator();
    Main.panel.addToStatusArea(this._uuid, this._indicator);
  }

  disable() {
    this._indicator.destroy();
    this._indicator = null;
  }
}

module.exports = Extension