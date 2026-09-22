// Движухи: список дел, доступных заключённому.
// sec    — длительность в секундах
// energy — сколько энергии тратится
// min    — минимальный авторитет для доступа
// auth   — награда авторитетом
// pap    — награда папиросами
var MOVES = [
  { key: 'figurka', name: 'Слепить фигурку',    desc: 'Из мякиша. Мелочь, а авторитет капает.',   sec: 60,   energy: 5,  min: 0,  auth: 2,  pap: 1  },
  { key: 'dvor',    name: 'Подмести двор',      desc: 'Работа для шестёрки. Тихо и без риска.',   sec: 180,  energy: 8,  min: 0,  auth: 4,  pap: 2  },
  { key: 'kuhnya',  name: 'Дежурство на кухне', desc: 'Раздача баланды. Зато при своих.',         sec: 300,  energy: 10, min: 1,  auth: 6,  pap: 3  },
  { key: 'stirka',  name: 'Стирка',             desc: 'Чужие вещи, свои деньги.',                 sec: 420,  energy: 11, min: 2,  auth: 7,  pap: 4  },
  { key: 'hleb',    name: 'Протащить хлеб',     desc: 'Через столовую. Главное — не спалиться.',  sec: 300,  energy: 12, min: 3,  auth: 8,  pap: 5  },
  { key: 'bica',    name: 'Качать бицуху',      desc: 'В спортзале, с другом — веселее.',         sec: 600,  energy: 15, min: 5,  auth: 12, pap: 3  },
  { key: 'karty',   name: 'Игра в карты',       desc: 'На интерес. Кто кого обует.',              sec: 900,  energy: 18, min: 8,  auth: 20, pap: 15 },
  { key: 'sluhi',   name: 'Продать слухи',      desc: 'Слухи дороже хлеба.',                      sec: 900,  energy: 16, min: 10, auth: 18, pap: 12 },
  { key: 'radio',   name: 'Починить радио',     desc: 'Механик всегда в цене.',                   sec: 1200, energy: 20, min: 10, auth: 25, pap: 20 },
  { key: 'nakolka', name: 'Набить наколку',     desc: 'Искусство, которое остаётся навсегда.',    sec: 1500, energy: 20, min: 12, auth: 30, pap: 5  },
  { key: 'boy',     name: 'Подпольные бои',     desc: 'Кулак — лучший аргумент.',                 sec: 1800, energy: 25, min: 15, auth: 40, pap: 25 }
];

// Звания по авторитету
var RANKS = [
  { min: 0,    title: 'Шестёрка' },
  { min: 100,  title: 'Мужик' },
  { min: 300,  title: 'Блатной' },
  { min: 700,  title: 'Авторитет' },
  { min: 1500, title: 'Смотрящий' },
  { min: 3000, title: 'Вор в законе' }
];

// Константы
var ENERGY_MAX    = 100;   // максимум энергии
var ENERGY_PER_MIN = 1;    // восстановление энергии за минуту
var SAVE_KEY      = 'tyraga_save';
