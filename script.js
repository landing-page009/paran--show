(function () {
  var DATA_PERMITIDA = '2026-10-12';
  var sim = document.getElementById('sim');
  var nao = document.getElementById('nao');
  var telaPergunta = document.getElementById('tela-pergunta');
  var telaData = document.getElementById('tela-data');
  var telaSucesso = document.getElementById('tela-sucesso');
  var card = document.querySelector('.card');

  var toques = 0;
  var solto = false;
  var baseSim = sim.offsetWidth || 144;

  function crescerSim() {
    toques++;
    var limite = Math.min(card.clientWidth * 0.85, Math.min(window.innerWidth, window.innerHeight) * 0.7);
    var tam = Math.min(baseSim * Math.pow(1.22, toques), Math.max(limite, baseSim));
    sim.style.setProperty('--tam', tam + 'px');
  }

  function sobrepoe(a, b, folga) {
    return !(a.right + folga < b.left || a.left - folga > b.right ||
             a.bottom + folga < b.top || a.top - folga > b.bottom);
  }

  function fugir() {
    var w = nao.offsetWidth, h = nao.offsetHeight, margem = 12;
    var atual = nao.getBoundingClientRect();

    if (!solto) {
      nao.style.left = atual.left + 'px';
      nao.style.top = atual.top + 'px';
      nao.classList.add('solto');
      void nao.offsetWidth;
      solto = true;
    }

    var maxX = Math.max(margem, window.innerWidth - w - margem);
    var maxY = Math.max(margem, window.innerHeight - h - margem);
    var simRect = sim.getBoundingClientRect();
    var distMin = Math.max(window.innerWidth, window.innerHeight) * 0.25;
    var escolhido = null;

    for (var i = 0; i < 40; i++) {
      var x = margem + Math.random() * (maxX - margem);
      var y = margem + Math.random() * (maxY - margem);
      var longe = Math.hypot(x - atual.left, y - atual.top) > distMin;
      var cand = { left: x, top: y, right: x + w, bottom: y + h };
      var livre = !sobrepoe(cand, simRect, 8);
      escolhido = { x: x, y: y };
      if (longe && livre) break;
    }
    nao.style.left = escolhido.x + 'px';
    nao.style.top = escolhido.y + 'px';
  }

  // Passar o mouse ou focar com o teclado: foge
  nao.addEventListener('pointerenter', function (e) {
    if (e.pointerType !== 'touch') fugir();
  });
  nao.addEventListener('focus', fugir);

  // Apertar (mouse ou dedo): Sim cresce e o Não foge
  nao.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    crescerSim();
    fugir();
  });
  // Teclado (Enter/Espaço dispara click sem ponteiro)
  nao.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.detail === 0) { crescerSim(); fugir(); }
  });

  window.addEventListener('resize', function () {
    if (!solto) return;
    var r = nao.getBoundingClientRect();
    var x = Math.min(Math.max(12, r.left), Math.max(12, window.innerWidth - r.width - 12));
    var y = Math.min(Math.max(12, r.top), Math.max(12, window.innerHeight - r.height - 12));
    nao.style.left = x + 'px';
    nao.style.top = y + 'px';
  });

  // Sim: vai para a tela de data
  sim.addEventListener('click', function () {
    nao.hidden = true;
    telaPergunta.hidden = true;
    telaData.hidden = false;
    document.getElementById('data').focus({ preventScroll: true });
  });

  // Data: só 12/10/2026 vale
  var campo = document.getElementById('data');
  var aviso = document.getElementById('aviso');
  var enviar = document.getElementById('enviar');

  campo.addEventListener('input', function () {
    if (campo.value === DATA_PERMITIDA) {
      aviso.textContent = '';
      enviar.disabled = false;
    } else {
      enviar.disabled = true;
      if (campo.value) {
        aviso.textContent = 'Só dá para marcar no dia 12/10/2026.';
        campo.value = '';
      }
    }
  });

  document.getElementById('form-data').addEventListener('submit', function (e) {
    e.preventDefault();
    if (campo.value !== DATA_PERMITIDA) {
      aviso.textContent = 'Selecione o dia 12/10/2026 para continuar.';
      return;
    }
    telaData.hidden = true;
    telaSucesso.hidden = false;
  });
})();
