const { St } = imports.gi;
const { extensionUtils: ExtensionUtils } = imports.misc;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const _ = ExtensionUtils.gettext;
const { timeConvertLabel, weekDays } = require('./utilTime')
const { logInSystem } = require('./logger')
const makeRequest = require('./Request')
const headers = {}

class Indicator extends PanelMenu.Button {
  _init() {
    super._init(0.0, _('Beaux Dés'));
    this.add_child(new St.Icon({
      icon_name: 'face-smile-symbolic',
      style_class: 'system-status-icon',
    }));
    this.createTimeToggler()
    this.menu.connect('open-state-changed', (menu, open) => {
      if (open) {
        this.createTimeChecker()
      } else {
        this.menu.removeAll()
        this.createTimeToggler()
      }
    });
  }
  async createTimeChecker() {
    const section = new PopupMenu.PopupMenuSection();
    this.menu.addMenuItem(section);

    const sectionWaiting = new PopupMenu.PopupSeparatorMenuItem('Chargement...');
    section.addMenuItem(sectionWaiting);
    await makeRequest('GET', 'http://127.0.0.1:6578/api/times/remaining', {}, headers)
      .then((data) => {
        const times = data.value
        const { workTime, balanceTime, byDays } = times

        this.createSeparator(section, 'Semaine');
        section.addAction(`Temps travaillé : ${timeConvertLabel(workTime)}`);
        section.addAction(`Balance              : ${timeConvertLabel(balanceTime)}`);

        this.createSeparator(section, 'Par jour');
        Object.keys(byDays).forEach((day) => {
          const weekDay = weekDays[new Date(day).getDay()]
          section.addAction(`${weekDay} : ${timeConvertLabel(byDays[day].workTime)}`);
        })

        this.createSeparator(section, 'Aujourd\'hui');
        var start = new Date();
        const work = byDays[start.toISOString().substring(0,10)]
        section.addAction(`Temps travaillé : ${timeConvertLabel(work?.workTime)}`);
        section.addAction(`Balance              : ${timeConvertLabel(work?.balanceTime)}`);

        sectionWaiting.destroy()
      })
      .catch(logInSystem)
  }
  createTimeToggler() {
    let item = new PopupMenu.PopupMenuItem(_('Pointer/Dépointer'));
    item.connect('activate', async () => {
      await makeRequest('POST', 'http://127.0.0.1:6578/api/times/', {}, headers)
        .then(({text}) => Main.notify(text))
        .catch(logInSystem)
    });
    this.menu.addMenuItem(item);
  }
  createSeparator(section, text) {
    const title = new PopupMenu.PopupSeparatorMenuItem('\n', text);
    section.addMenuItem(title);
  }
}
module.exports = Indicator

