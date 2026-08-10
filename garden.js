(() => {
  const today = document.getElementById('today');
  const clock = document.getElementById('clock');
  const date = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short'
  }).format(new Date());
  today.textContent = date.charAt(0).toUpperCase() + date.slice(1);

  function updateClock() {
    clock.textContent = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  const stageNames = {
    1: 'germinando',
    2: 'crescendo',
    3: 'florescendo'
  };

  function slug(name) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  document.querySelectorAll('.muda[data-stage]').forEach((muda) => {
    const name = muda.querySelector('.muda-copy strong').textContent.replace('↗', '').trim();
    const saved = Number(localStorage.getItem(`terrario-stage-${slug(name)}`));
    const stage = saved >= 1 && saved <= 3 ? saved : Number(muda.dataset.stage);
    const description = stageNames[stage];
    muda.dataset.stage = String(stage);
    muda.querySelector('.muda-copy small').textContent = `estágio ${stage} · ${description}`;
    muda.setAttribute('aria-label', `${muda.getAttribute('aria-label').split(',')[0]}, muda ${description}`);
  });

  const timer = document.getElementById('timer');
  const timerToggle = document.getElementById('timerToggle');
  const timerReset = document.getElementById('timerReset');
  const timerProgress = document.getElementById('timerProgress');
  const pomodoroState = document.getElementById('pomodoroState');
  const durationButtons = [...document.querySelectorAll('[data-minutes]')];
  const pomodoroCard = document.querySelector('.pomodoro');
  const baseTitle = document.title;

  let totalSeconds = 25 * 60;
  let remainingSeconds = totalSeconds;
  let deadline = 0;
  let intervalId = null;
  let audioContext = null;

  function prepareAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioContext) audioContext = new AudioContext();
    if (audioContext.state === 'suspended') audioContext.resume();
  }

  function playCompletionChime() {
    if (!audioContext) return;
    [0, .26].forEach((delay, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + delay;
      oscillator.type = 'sine';
      oscillator.frequency.value = index === 0 ? 660 : 880;
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(.16, start + .03);
      gain.gain.exponentialRampToValueAtTime(.0001, start + .34);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + .36);
    });
  }

  function announceCompletion() {
    pomodoroCard.classList.add('done');
    document.title = 'Pomodoro concluído — Terrário';
    playCompletionChime();
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
  }

  function renderTimer() {
    timer.textContent = formatTime(remainingSeconds);
    const elapsed = totalSeconds - remainingSeconds;
    timerProgress.style.width = `${Math.min(100, elapsed / totalSeconds * 100)}%`;
  }

  function stopTimer(state = 'pausado') {
    window.clearInterval(intervalId);
    intervalId = null;
    deadline = 0;
    pomodoroState.textContent = state;
    timerToggle.textContent = remainingSeconds === 0 ? '↻' : '▶';
    timerToggle.setAttribute('aria-label', remainingSeconds === 0 ? 'Reiniciar Pomodoro' : 'Iniciar Pomodoro');
  }

  function tick() {
    remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    renderTimer();
    if (remainingSeconds === 0) {
      stopTimer('ciclo concluído');
      announceCompletion();
    }
  }

  function startTimer() {
    if (remainingSeconds === 0) remainingSeconds = totalSeconds;
    prepareAudio();
    pomodoroCard.classList.remove('done');
    document.title = baseTitle;
    deadline = Date.now() + remainingSeconds * 1000;
    pomodoroState.textContent = 'em foco';
    timerToggle.textContent = 'Ⅱ';
    timerToggle.setAttribute('aria-label', 'Pausar Pomodoro');
    intervalId = window.setInterval(tick, 250);
  }

  function pauseTimer() {
    remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    renderTimer();
    stopTimer();
  }

  function resetTimer() {
    window.clearInterval(intervalId);
    intervalId = null;
    remainingSeconds = totalSeconds;
    pomodoroCard.classList.remove('done');
    document.title = baseTitle;
    pomodoroState.textContent = 'pronto';
    timerToggle.textContent = '▶';
    timerToggle.setAttribute('aria-label', 'Iniciar Pomodoro');
    renderTimer();
  }

  timerToggle.addEventListener('click', () => {
    if (intervalId) pauseTimer();
    else startTimer();
  });

  timerReset.addEventListener('click', resetTimer);

  durationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      totalSeconds = Number(button.dataset.minutes) * 60;
      durationButtons.forEach((item) => item.classList.toggle('active', item === button));
      resetTimer();
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && intervalId) tick();
  });

  const taxiWidget = document.querySelector('.taxi-widget');
  const taxiStatus = document.getElementById('taxiStatus');
  const taxiSummary = document.getElementById('taxiSummary');
  const taxiValue = document.getElementById('taxiValue');
  const taxiMeter = document.getElementById('taxiMeter');
  const taxiMeterTrack = taxiMeter.parentElement;
  const taxiTasks = document.getElementById('taxiTasks');
  const taxiGauge = document.getElementById('taxiGauge');
  const taxiSources = document.getElementById('taxiSources');
  const taxiRefresh = document.getElementById('taxiRefresh');
  const taxiEndpoints = ['http://127.0.0.1:3000', 'http://127.0.0.1:3001'];
  let activeTaxiEndpoint = null;

  function renderTaxiSources(sources) {
    const items = sources.slice(0, 3).map((source) => {
      const item = document.createElement('span');
      const usage = Number.isFinite(source.usagePercent) ? ` · ${Math.round(source.usagePercent)}%` : '';
      item.className = 'taxi-source';
      item.textContent = `${source.name}${usage}`;
      return item;
    });
    taxiSources.replaceChildren(...items);
  }

  function renderTaxiTasks(conversations) {
    const recent = Array.isArray(conversations) ? conversations.slice(0, 3) : [];
    if (!recent.length) {
      taxiTasks.replaceChildren();
      taxiTasks.hidden = true;
      return;
    }

    const rows = recent.map((conversation) => {
      const row = document.createElement('div');
      const title = document.createElement('span');
      const meta = document.createElement('span');
      row.className = 'taxi-task';
      title.className = 'taxi-task-title';
      title.textContent = conversation.title || '';
      meta.className = 'taxi-task-meta';
      [conversation.tokens, conversation.age].filter(Boolean).forEach((value) => {
        const item = document.createElement('span');
        item.textContent = value;
        meta.appendChild(item);
      });
      row.append(title, meta);
      return row;
    });

    taxiTasks.replaceChildren(...rows);
    taxiTasks.hidden = false;
  }

  function renderTaxiWidget(data) {
    const sources = Array.isArray(data.sources) ? data.sources : [];
    const primary = sources.find((source) => Number.isFinite(source.usagePercent)) || sources[0];
    const usage = Number.isFinite(primary?.usagePercent) ? Math.max(0, Math.min(100, primary.usagePercent)) : 0;
    taxiWidget.classList.remove('offline');
    taxiStatus.textContent = sources.length ? `${data.status || 'Ativo'} · agora` : 'sem fontes';
    taxiSummary.textContent = primary
      ? `${primary.name} · ${primary.cycleLabel}`
      : 'Abra o Taxímetro para conectar uma fonte.';
    taxiValue.textContent = Number.isFinite(primary?.usagePercent) ? `${Math.round(usage)}%` : '—';
    taxiMeter.style.width = `${usage}%`;
    taxiMeterTrack.setAttribute('aria-valuenow', String(Math.round(usage)));
    taxiGauge.style.setProperty('--usage', String(usage));
    renderTaxiSources(sources);
    renderTaxiTasks(primary?.conversations);
  }

  function renderTaxiOffline() {
    const openLink = document.createElement('a');
    openLink.className = 'taxi-source';
    openLink.href = 'http://127.0.0.1:3000';
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.textContent = 'abrir Taxímetro ↗';
    taxiWidget.classList.add('offline');
    taxiStatus.textContent = 'serviço local desligado';
    taxiSummary.textContent = 'Inicie o Taxímetro neste Mac para ver os dados.';
    taxiValue.textContent = '—';
    taxiMeter.style.width = '0%';
    taxiMeterTrack.setAttribute('aria-valuenow', '0');
    taxiGauge.style.setProperty('--usage', '0');
    taxiSources.replaceChildren(openLink);
    renderTaxiTasks([]);
  }

  async function requestTaxiWidget(endpoint, fresh) {
    const controller = new AbortController();
    // A primeira leitura do Codex inicializa a sessão local e pode levar alguns segundos.
    const timeout = window.setTimeout(() => controller.abort(), 25_000);
    try {
      const response = await fetch(`${endpoint}/api/widget${fresh ? '?fresh=1' : ''}`, {
        cache: 'no-store',
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Taxímetro indisponível');
      return await response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function loadTaxiWidget(fresh = false) {
    taxiRefresh.disabled = true;
    taxiStatus.textContent = 'atualizando…';
    const endpoints = activeTaxiEndpoint
      ? [activeTaxiEndpoint, ...taxiEndpoints.filter((endpoint) => endpoint !== activeTaxiEndpoint)]
      : taxiEndpoints;
    for (const endpoint of endpoints) {
      try {
        const data = await requestTaxiWidget(endpoint, fresh);
        activeTaxiEndpoint = endpoint;
        renderTaxiWidget(data);
        taxiRefresh.disabled = false;
        return;
      } catch (error) {
        // Tenta a próxima porta local antes de mostrar o estado desconectado.
      }
    }
    renderTaxiOffline();
    taxiRefresh.disabled = false;
  }

  taxiRefresh.addEventListener('click', () => loadTaxiWidget(true));
  loadTaxiWidget();
  window.setInterval(loadTaxiWidget, 5 * 60 * 1000);

  const projectView = document.getElementById('projectView');
  const projectFrame = document.getElementById('projectFrame');
  const projectViewTitle = document.getElementById('projectViewTitle');
  const closeProject = document.getElementById('closeProject');
  const openMenuButton = document.getElementById('openMenu');
  const closeMenuButton = document.getElementById('closeMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const projectMenu = document.getElementById('projectMenu');
  let lastProjectTrigger = null;

  function showMenu() {
    document.body.classList.add('menu-open');
    openMenuButton.setAttribute('aria-expanded', 'true');
    projectMenu.setAttribute('aria-hidden', 'false');
    closeMenuButton.focus();
  }

  function hideMenu({ restoreFocus = true } = {}) {
    document.body.classList.remove('menu-open');
    openMenuButton.setAttribute('aria-expanded', 'false');
    projectMenu.setAttribute('aria-hidden', 'true');
    if (restoreFocus) openMenuButton.focus();
  }

  function openProject(trigger) {
    const name = trigger.dataset.title || trigger.querySelector('.muda-copy strong').textContent.trim();
    lastProjectTrigger = trigger.classList.contains('menu-project') ? openMenuButton : trigger;
    hideMenu({ restoreFocus: false });
    projectViewTitle.textContent = name;
    projectFrame.title = name;
    if (projectFrame.dataset.project !== trigger.dataset.project) {
      projectFrame.dataset.project = trigger.dataset.project;
      projectFrame.src = trigger.dataset.url;
    }
    document.body.classList.add('project-open');
    projectView.setAttribute('aria-hidden', 'false');
    closeProject.focus();
  }

  function closeProjectView() {
    document.body.classList.remove('project-open');
    projectView.setAttribute('aria-hidden', 'true');
    lastProjectTrigger?.focus();
  }

  document.querySelectorAll('.muda[data-project]').forEach((muda) => {
    muda.addEventListener('click', () => openProject(muda));
  });

  document.querySelectorAll('.menu-project[data-project]').forEach((item) => {
    item.addEventListener('click', () => openProject(item));
  });

  document.querySelectorAll('.menu-project[target="_blank"],.menu-tool[target="_blank"]').forEach((item) => {
    item.addEventListener('click', () => hideMenu({ restoreFocus: false }));
  });

  projectFrame.addEventListener('load', () => {
    if (projectFrame.dataset.project !== 'novela') return;
    try {
      const frameWindow = projectFrame.contentWindow;
      const frameDocument = projectFrame.contentDocument;
      if (typeof frameWindow.showProject === 'function') frameWindow.showProject('novela');
      frameDocument.querySelectorAll('header,.drawer,.drawer-backdrop,.terrario-home,footer,.project-frame')
        .forEach((element) => { element.style.display = 'none'; });
      frameDocument.body.classList.remove('home-mode', 'voltinha-mode', 'drawer-open');
      frameDocument.querySelector('main').style.display = 'block';
    } catch (error) {
      // O projeto segue acessível mesmo quando o navegador restringe ajustes no iframe.
    }
  });

  closeProject.addEventListener('click', closeProjectView);
  openMenuButton.addEventListener('click', showMenu);
  closeMenuButton.addEventListener('click', () => hideMenu());
  menuBackdrop.addEventListener('click', () => hideMenu());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('project-open')) {
      closeProjectView();
    } else if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
      hideMenu();
    }
  });

  renderTimer();
})();
