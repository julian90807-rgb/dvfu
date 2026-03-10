// Загружает данные преподавателя из data/instructor.csv
// и заполняет элементы с атрибутом data-inst="ключ"
//
// Доступные ключи из CSV:
//   name_full, name_short, role, dept, room, consultations
//
// Вычисляемые ключи (формируются автоматически):
//   room_display       → "Ауд. F305"
//   consult_display    → "Консультации: по субботам, 15:10–16:40"
//   role_dept          → "Старший преподаватель, кафедра теологии ДФиР ШИГН"

(function () {
  var INST_URL = 'https://julian90807-rgb.github.io/dvfu/data/instructor.csv';

  function apply(inst) {
    inst.room_display    = 'Ауд. ' + inst.room;
    inst.consult_display = 'Консультации: ' + inst.consultations;
    inst.role_dept       = inst.role + ', ' + inst.dept;

    document.querySelectorAll('[data-inst]').forEach(function (el) {
      var key = el.getAttribute('data-inst');
      if (inst[key] !== undefined) {
        el.textContent = inst[key];
        if (el.tagName === 'A' && key === 'email') {
          el.href = 'mailto:' + inst[key];
        }
      }
    });
  }

  function parseCSV(text) {
    var inst = {};
    var lines = text.trim().split('\n');
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      var comma = line.indexOf(',');
      var key = line.slice(0, comma).trim();
      var val = line.slice(comma + 1).trim().replace(/^"|"$/g, '');
      inst[key] = val;
    }
    return inst;
  }

  function load() {
    fetch(INST_URL)
      .then(function (r) { return r.text(); })
      .then(function (text) { apply(parseCSV(text)); })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
