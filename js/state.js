// Состояние игры и логика. Хранится в localStorage.

var State = {
  data: null,

  // Создать нового персонажа
  create: function () {
    var now = Date.now();
    this.data = {
      name: 'Заключённый',
      authority: 0,
      papirosy: 0,
      energy: ENERGY_MAX,
      energyMax: ENERGY_MAX,
      lastEnergyAt: now,
      activeMove: null
    };
    this.save();
  },

  // Загрузить или создать
  init: function () {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        this.data = JSON.parse(raw);
        return;
      }
    } catch (e) {}
    this.create();
  },

  // Сохранить
  save: function () {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (e) {}
  },

  // Сброс
  reset: function () {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    this.create();
  },

  // Восстановление энергии по времени
  regen: function () {
    var now = Date.now();
    var minutes = Math.floor((now - this.data.lastEnergyAt) / 60000);
    if (minutes > 0) {
      this.data.energy = Math.min(
        this.data.energyMax,
        this.data.energy + minutes * ENERGY_PER_MIN
      );
      this.data.lastEnergyAt = now;
      this.save();
    }
  },

  // Текущее звание
  rank: function () {
    var result = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) {
      if (this.data.authority >= RANKS[i].min) result = RANKS[i];
    }
    return result;
  },

  // Следующее звание
  nextRank: function () {
    for (var i = 0; i < RANKS.length; i++) {
      if (this.data.authority < RANKS[i].min) return RANKS[i];
    }
    return null;
  },

  // Найти движуху по ключу
  findMove: function (key) {
    for (var i = 0; i < MOVES.length; i++) {
      if (MOVES[i].key === key) return MOVES[i];
    }
    return null;
  },

  // Можно ли начать движуху
  canStart: function (move) {
    if (this.data.activeMove) return false;
    if (this.data.energy < move.energy) return false;
    if (this.data.authority < move.min) return false;
    return true;
  },

  // Начать движуху
  start: function (key) {
    var move = this.findMove(key);
    if (!move) return 'move_not_found';
    if (this.data.activeMove) return 'already_active';
    if (this.data.energy < move.energy) return 'not_enough_energy';
    if (this.data.authority < move.min) return 'not_enough_authority';

    var now = Date.now();
    this.data.energy -= move.energy;
    this.data.lastEnergyAt = now;
    this.data.activeMove = {
      key: key,
      finishesAt: now + move.sec * 1000
    };
    this.save();
    return null;
  },

  // Завершить движуху
  finish: function () {
    if (!this.data.activeMove) return null;

    var move = this.findMove(this.data.activeMove.key);
    if (!move) {
      this.data.activeMove = null;
      this.save();
      return null;
    }

    this.data.authority += move.auth;
    this.data.papirosy += move.pap;
    this.data.activeMove = null;
    this.save();

    return { name: move.name, auth: move.auth, pap: move.pap };
  },

  // Проверить, закончилась ли движуха
  isFinished: function () {
    if (!this.data.activeMove) return false;
    return Date.now() >= this.data.activeMove.finishesAt;
  }
};
