// Отрисовка интерфейса.

var UI = {
  el: {},

  init: function () {
    this.el.msgOk      = document.getElementById('msg-ok');
    this.el.msgErr     = document.getElementById('msg-err');
    this.el.timerBox   = document.getElementById('timer-box');
    this.el.timerName  = document.getElementById('timer-name');
    this.el.timerValue = document.getElementById('timer-value');
    this.el.avatar     = document.getElementById('avatar');
    this.el.charName   = document.getElementById('char-name');
    this.el.charRank   = document.getElementById('char-rank');
    this.el.energyVal  = document.getElementById('energy-val');
    this.el.energyBar  = document.getElementById('energy-bar');
    this.el.authVal    = document.getElementById('auth-val');
    this.el.authBar    = document.getElementById('auth-bar');
    this.el.papVal     = document.getElementById('pap-val');
    this.el.papBar     = document.getElementById('pap-bar');
    this.el.moves      = document.getElementById('moves');
  },

  // Показать сообщение
  message: function (text, isError) {
    var box = isError ? this.el.msgErr : this.el.msgOk;
    box.textContent = text;
    box.classList.remove('hidden');
    setTimeout(function () {
      box.classList.add('hidden');
    }, 3000);
  },

  // Персонаж
  character: function () {
    State.regen();
    var d = State.data;
    var rank = State.rank();
    var next = State.nextRank();
    var initial = d.name.charAt(0).toUpperCase();

    this.el.avatar.textContent = initial;
    this.el.charName.textContent = d.name;

    if (next) {
      this.el.charRank.textContent =
        rank.title + ' · До «' + next.title + '»: ' + (next.min - d.authority);
    } else {
      this.el.charRank.textContent = rank.title + ' · Максимум';
    }

    // Энергия
    var ePct = Math.max(0, Math.min(100, d.energy / d.energyMax * 100));
    this.el.energyVal.textContent = Math.floor(d.energy) + ' / ' + d.energyMax;
    this.el.energyBar.style.width = ePct + '%';

    // Авторитет
    var aMax = next ? next.min : Math.max(100, d.authority);
    var aPct = Math.max(0, Math.min(100, d.authority / aMax * 100));
    this.el.authVal.textContent = d.authority;
    this.el.authBar.style.width = aPct + '%';

    // Папиросы
    var pMax = 500;
    var pPct = Math.max(0, Math.min(100, d.papirosy / pMax * 100));
    this.el.papVal.textContent = d.papirosy;
    this.el.papBar.style.width = pPct + '%';
  },

  // Список движух
  moves: function () {
    var html = '';
    var busy = !!State.data.activeMove;

    for (var i = 0; i < MOVES.length; i++) {
      var m = MOVES[i];
      var can = State.canStart(m);
      var locked = (State.data.energy < m.energy) || (State.data.authority < m.min);

      html += '<div class="move' + (locked ? ' locked' : '') + '">';
      html += '<div class="move-head">';
      html += '<span class="move-name">' + m.name + '</span>';
      html += '<span class="move-time">' + Math.round(m.sec / 60) + ' мин</span>';
      html += '</div>';
      html += '<div class="move-desc">' + m.desc + '</div>';
      html += '<div class="move-meta">';
      html += '<span>Энергия ' + m.energy + '</span>';
      html += '<span>Авторитет +' + m.auth + '</span>';
      html += '<span>Папиросы +' + m.pap + '</span>';
      if (m.min > 0) html += '<span>Нужно ' + m.min + ' авт.</span>';
      html += '</div>';
      html += '<button class="btn" data-move="' + m.key + '"' + (can ? '' : ' disabled') + '>';
      if (busy) html += 'Занят';
      else if (locked) html += 'Недоступно';
      else html += 'Начать';
      html += '</button>';
      html += '</div>';
    }

    this.el.moves.innerHTML = html;

    // Навешиваем обработчики
    var buttons = this.el.moves.querySelectorAll('button[data-move]');
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].addEventListener('click', function () {
        var key = this.getAttribute('data-move');
        App.startMove(key);
      });
    }
  },

  // Таймер
  timer: function () {
    if (!State.data.activeMove) {
      this.el.timerBox.classList.add('hidden');
      return;
    }

    var move = State.findMove(State.data.activeMove.key);
    this.el.timerBox.classList.remove('hidden');
    this.el.timerName.textContent = move ? move.name : '—';
    this.tick();
  },

  // Тик таймера
  tick: function () {
    if (!State.data.activeMove) return;
    var remain = Math.max(0, State.data.activeMove.finishesAt - Date.now());
    var total = Math.ceil(remain / 1000);
    var min = Math.floor(total / 60);
    var sec = total % 60;
    this.el.timerValue.textContent =
      (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
  },

  // Отрисовать всё
  all: function () {
    this.character();
    this.timer();
    this.moves();
  }
};
