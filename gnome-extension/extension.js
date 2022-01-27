var init = (function () {
  'use strict';

  function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return {
      hours: rhours, minutes: rminutes
    }
  }
  function timeConvertLabel$1(minutes) {
    const converted = timeConvert(minutes);
    return `${converted.hours}h ${converted.minutes}`
  }
  const weekDays$1 = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ];
  var utilTime = {
    timeConvert,
    timeConvertLabel: timeConvertLabel$1,
    weekDays: weekDays$1,
  };

  function logInSystem$2(text) {
    log(text);
  }
  var logger = {logInSystem: logInSystem$2};

  const Soup = imports.gi.Soup;
  function makeRequest$1(method, url = '/', params = {}, headers = {}) {
    return new Promise((res, rej) => {
      let _httpSession = new Soup.Session();
      let message = Soup.Message.new(method, url);
      Object.keys(headers).forEach(key => {
        message.request_headers.append(key, headers[key]);
      });
      _httpSession.queue_message(message, function (_httpSession, message) {
        if (message.status_code !== 200) {
          logInSystem(message);
          return rej(message)
        }      let json = JSON.parse(message.response_body.data);
        res(json);
      });
    })
  }
  var Request = makeRequest$1;

  const { St } = imports.gi;
  const { extensionUtils: ExtensionUtils$1 } = imports.misc;
  const Main$1 = imports.ui.main;
  const PanelMenu = imports.ui.panelMenu;
  const PopupMenu = imports.ui.popupMenu;
  const _ = ExtensionUtils$1.gettext;
  const { timeConvertLabel, weekDays } = utilTime;
  const { logInSystem: logInSystem$1 } = logger;
  const makeRequest = Request;
  const headers = {};
  class Indicator$1 extends PanelMenu.Button {
    _init() {
      super._init(0.0, _('Beaux Dés'));
      this.add_child(new St.Icon({
        icon_name: 'face-smile-symbolic',
        style_class: 'system-status-icon',
      }));
      this.createTimeToggler();
      this.menu.connect('open-state-changed', (menu, open) => {
        if (open) {
          this.createTimeChecker();
        } else {
          this.menu.removeAll();
          this.createTimeToggler();
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
          const times = data.value;
          const { workTime, balanceTime, byDays } = times;
          this.createSeparator(section, 'Semaine');
          section.addAction(`Temps travaillé : ${timeConvertLabel(workTime)}`);
          section.addAction(`Balance              : ${timeConvertLabel(balanceTime)}`);
          this.createSeparator(section, 'Par jour');
          Object.keys(byDays).forEach((day) => {
            const weekDay = weekDays[new Date(day).getDay()];
            section.addAction(`${weekDay} : ${timeConvertLabel(byDays[day].workTime)}`);
          });
          this.createSeparator(section, 'Aujourd\'hui');
          var start = new Date();
          const work = byDays[start.toISOString().substring(0,10)];
          section.addAction(`Temps travaillé : ${timeConvertLabel(work?.workTime)}`);
          section.addAction(`Balance              : ${timeConvertLabel(work?.balanceTime)}`);
          sectionWaiting.destroy();
        })
        .catch(logInSystem$1);
    }
    createTimeToggler() {
      let item = new PopupMenu.PopupMenuItem(_('Pointer/Dépointer'));
      item.connect('activate', async () => {
        await makeRequest('POST', 'http://127.0.0.1:6578/api/times/', {}, headers)
          .then(({text}) => Main$1.notify(text))
          .catch(logInSystem$1);
      });
      this.menu.addMenuItem(item);
    }
    createSeparator(section, text) {
      const title = new PopupMenu.PopupSeparatorMenuItem('\n', text);
      section.addMenuItem(title);
    }
  }
  var Indicator_1 = Indicator$1;

  const GETTEXT_DOMAIN = 'beaux-des';
  const { extensionUtils: ExtensionUtils } = imports.misc;
  const Main = imports.ui.main;
  const { GObject } = imports.gi;
  const Indicator = GObject.registerClass(Indicator_1);
  class Extension$1 {
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
  var Extension_1 = Extension$1;

  const Extension = Extension_1;
  var src = function init(meta) {
    return new Extension(meta.uuid);
  };

  return src;

})();
