// Запуск игры.

var App = {
  interval: null,

  init: function () {
    State.init();
    UI.init();
    UI.all();

    // Каждую секунду — тик таймера и восстановление энергии
    this.interval = setInterval(function () {
      if (State.data.activeMove) {
        if (State.isFinished()) {
          App.completeMove();
        } else {
          UI.tick();
        }
      } else {
        State.regen();
        UI.character();
      }
    }, 1000);

    // Кнопка сброса
    var resetBtn = document.getElementById('reset');
    resetBtn.addEventListener('click', function () {
      if (confirm('Точно начать заново? Весь прогресс сгорит.')) {
        State.reset();
        UI.all();
        UI.message('Начал с чистого листа', false);
      }
    });
  },

  startMove: function (key) {
    var err = State.start(key);
    if (err) {
      var map = {
        move_not_found:      'Движуха не найдена',
        already_active:      'Уже в деле, братишка',
        not_enough_energy:   'Мало энергии',
        not_enough_authority:'Авторитета не хватает'
      };
      UI.message(map[err] || 'Не получилось', true);
      return;
    }
    UI.all();
  },

  completeMove: function () {
    var reward = State.finish();
    UI.all();
    if (reward) {
      UI.message(
        '«' + reward.name + '» завершено. +' + reward.auth +
        ' авторитета, +' + reward.pap + ' папирос',
        false
      );
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  App.init();
});
