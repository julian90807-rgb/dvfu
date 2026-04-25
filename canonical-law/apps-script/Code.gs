// ── Каноническое право — данные рейтинга ────────────────────────────────────
// Деплой: Расширения → Apps Script → Развернуть → Новое развёртывание
//   Тип: Веб-приложение | Выполнять как: Я | Доступ: Все

const SS_ID = '1009x0bC-P9QjsCFFO_mhxaDUstbOKiTal3JlLscDfIA';

// ── doGet: отдаёт данные трёх листов как JSON ─────────────────────────────────

function doGet() {
  const ss = SpreadsheetApp.openById(SS_ID);
  const data = {
    attendance: sheetToRows(ss.getSheetByName('Посещение')),
    seminars:   sheetToRows(ss.getSheetByName('Семинары')),
    tests:      sheetToRows(ss.getSheetByName('Тесты')),
    updated:    new Date().toISOString()
  };
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Преобразует лист в массив объектов [{ФИО: '...', 'Лек 1': '1', ...}]
function sheetToRows(sheet) {
  if (!sheet) return [];
  const vals = sheet.getDataRange().getValues();
  if (vals.length < 2) return [];
  const headers = vals[0];
  const rows = [];
  for (let i = 1; i < vals.length; i++) {
    if (!vals[i][0]) continue;
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      const v = vals[i][j];
      row[String(headers[j])] = (v === '' || v === null || v === undefined) ? '' : String(v);
    }
    rows.push(row);
  }
  return rows;
}

// ── setup: запустить ОДИН РАЗ для создания листов и импорта данных ────────────
// После запуска setup() проверьте листы в Sheet, затем можно удалить эту функцию.

function setup() {
  const ss = SpreadsheetApp.openById(SS_ID);

  const students = [
    'Белова Алиса Николаевна',
    'Богатырь Дарья Сергеевна',
    'Егорова Алёна Игоревна',
    'Кондратьев Александр Степанович',
    'Корнейчик Михаил Сергеевич',
    'Николаенко Таисия Алексеевна',
    'Новикова Арина Романовна',
  ];

  buildSheet(ss, 'Посещение',
    ['ФИО','Лек 1','Лек 2','Лек 3','Лек 4','Лек 5','Сем 1','Сем 2','Сем 3','Сем 4','Сем 5'],
    students,
    [[1,1,1,1,1,1,1,1,'',''],
     [1,1,1,1,0,1,1,0,'',''],
     [1,1,1,1,0,1,1,0,'',''],
     [0,0,0,1,1,0,1,1,'',''],
     [1,1,1,0,0,1,0,0,'',''],
     [0,0,1,1,0,1,1,0,'',''],
     [1,1,1,1,1,0,1,1,'','']]
  );

  buildSheet(ss, 'Семинары',
    ['ФИО','Сем 1','Сем 2','Сем 3','Сем 4','Сем 5'],
    students,
    [[2,2,2,'',''],
     [0,2,0,'',''],
     [2,2,0,'',''],
     [0,2,2,'',''],
     [2,0,0,'',''],
     [0,2,0,'',''],
     [0,0,2,'','']]
  );

  buildSheet(ss, 'Тесты',
    ['ФИО','Тест 1','Тест 2','Тест 3','Тест 4','Тест 5','Контрольная'],
    students,
    [[1,1,1,'','',''],
     [1,1,0,'','',''],
     [1,1,0,'','',''],
     [0,1,1,'','',''],
     [1,0,0,'','',''],
     [1,1,0,'','',''],
     [0,1,1,'','','']]
  );

  SpreadsheetApp.getUi().alert('Листы созданы: Посещение, Семинары, Тесты.');
}

function buildSheet(ss, name, headers, students, data) {
  let sh = ss.getSheetByName(name);
  if (sh) ss.deleteSheet(sh);
  sh = ss.insertSheet(name);

  sh.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#1a2f58')
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  for (let i = 0; i < students.length; i++) {
    const row = [students[i]].concat(data[i]);
    sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
  }

  sh.setFrozenRows(1);
  sh.setFrozenColumns(1);
  sh.autoResizeColumn(1);

  // Validation: 0/1 for attendance, 0/2 for seminars, 0/1 for tests
  if (name === 'Посещение' || name === 'Тесты') {
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['0', '1', ''], true).build();
    sh.getRange(2, 2, students.length, headers.length - 1).setDataValidation(rule);
  }
  if (name === 'Семинары') {
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['0', '1', '2', ''], true).build();
    sh.getRange(2, 2, students.length, headers.length - 1).setDataValidation(rule);
  }
}
