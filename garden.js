(() => {
  'use strict';

  const STORAGE = {
    projects: 'terrario-projects-v2',
    notes: 'terrario-prototype-notes',
    activeProject: 'terrario-active-project',
    timeTotals: 'terrario-time-totals'
  };

  const RADAR_ENDPOINT = 'https://terrario-api.alanferreiras.workers.dev/radar';
  const TAXIMETER_ENDPOINTS = ['http://127.0.0.1:3001', 'http://127.0.0.1:3000'];
  const TASK_COLORS = { done: '#68c487', doing: '#6fb7ee', todo: '#f0a160', none: '#9da6a1' };
  const SIGNAL_ICONS = { mail: '💌', attention: '⚠️', update: '✨', deadline: '⏰' };

  const INITIAL_PROJECTS = [
    {
      id: 'novelinha', name: 'Novelinha', url: 'novela.html', notionUrl: '', kind: 'project',
      phase: 'development', location: 'panel', tasks: { todo: 8, doing: 4, done: 6, none: 2 }
    },
    {
      id: 'voltinha', name: 'Voltinha', url: 'https://alanferreiras-web.github.io/voltinha/', notionUrl: '',
      kind: 'application', phase: 'completed', location: 'panel', signal: { kind: 'mail', label: 'Nova edição pronta' }
    },
    {
      id: 'banca', name: 'Banca', url: 'https://alanferreiras-web.github.io/bancafeiras/', notionUrl: '',
      kind: 'application', phase: 'completed', location: 'panel'
    },
    {
      id: 'leader-assessment', name: 'Leader Assessment',
      url: 'https://app.notion.com/p/3bfd5bc30a1b819fb0f5fc18d3229821?pvs=204',
      notionUrl: 'https://app.notion.com/p/3bfd5bc30a1b819fb0f5fc18d3229821?pvs=204',
      kind: 'project', phase: 'development', location: 'panel', tasks: { todo: 2, doing: 0, done: 0, none: 6 },
      integrationUrl: 'https://terrario-api.alanferreiras.workers.dev/projects/leader-assessment'
    },
    {
      id: 'iorguti', name: 'Iorguti',
      url: 'https://app.notion.com/p/3bfd5bc30a1b81fe90dff5c8a83db9cc?pvs=204',
      notionUrl: 'https://app.notion.com/p/3bfd5bc30a1b81fe90dff5c8a83db9cc?pvs=204',
      kind: 'project', phase: 'development', location: 'panel',
      integrationUrl: 'https://terrario-api.alanferreiras.workers.dev/projects/iorguti'
    },
    {
      id: 'trendices', name: 'Trendices',
      url: 'https://app.notion.com/p/3bfd5bc30a1b81429e41e08720ae9e56?pvs=204',
      notionUrl: 'https://app.notion.com/p/3bfd5bc30a1b81429e41e08720ae9e56?pvs=204',
      kind: 'project', phase: 'development', location: 'panel',
      integrationUrl: 'https://terrario-api.alanferreiras.workers.dev/projects/trendices'
    },
    {
      id: 'kollab', name: 'Kollab',
      url: 'https://app.notion.com/p/3bfd5bc30a1b81f8b34aff292a251cd9?pvs=204',
      notionUrl: 'https://app.notion.com/p/3bfd5bc30a1b81f8b34aff292a251cd9?pvs=204',
      kind: 'project', phase: 'development', location: 'panel',
      integrationUrl: 'https://terrario-api.alanferreiras.workers.dev/projects/kollab'
    }
  ];

  const elements = {
    shell: document.getElementById('terrarioShell'),
    clock: document.getElementById('clock'),
    today: document.getElementById('today'),
    projectRefresh: document.getElementById('projectRefresh'),
    projectRefreshLabel: document.getElementById('projectRefreshLabel'),
    projectsGrid: document.getElementById('projectsGrid'),
    panelCount: document.getElementById('panelCount'),
    focusContent: document.getElementById('focusContent'),
    focusStatus: document.getElementById('focusStatus'),
    pomodoroProject: document.getElementById('pomodoroProject'),
    openMenu: document.getElementById('openMenu'),
    closeMenu: document.getElementById('closeMenu'),
    menuBackdrop: document.getElementById('menuBackdrop'),
    projectMenu: document.getElementById('projectMenu'),
    projectMenuList: document.getElementById('projectMenuList'),
    applicationMenuList: document.getElementById('applicationMenuList'),
    createProject: document.getElementById('createProject'),
    noteDrawer: document.getElementById('noteDrawer'),
    noteProjectName: document.getElementById('noteProjectName'),
    projectNote: document.getElementById('projectNote'),
    closeNotes: document.getElementById('closeNotes'),
    modalBackdrop: document.getElementById('projectModalBackdrop'),
    projectForm: document.getElementById('projectForm'),
    projectName: document.getElementById('projectName'),
    projectUrl: document.getElementById('projectUrl'),
    projectNotion: document.getElementById('projectNotion'),
    projectImage: document.getElementById('projectImage'),
    imagePreview: document.getElementById('imagePreview'),
    projectPhaseField: document.getElementById('projectPhaseField'),
    projectSubmit: document.getElementById('projectSubmit'),
    radarStatus: document.getElementById('radarStatus'),
    radarToday: document.getElementById('radarToday'),
    radarTomorrow: document.getElementById('radarTomorrow')
  };

  let projects = loadProjects();
  let notes = readJson(STORAGE.notes, {});
  let timeTotals = readJson(STORAGE.timeTotals, {});
  let activeProjectId = localStorage.getItem(STORAGE.activeProject) || null;
  let noteProjectId = null;
  let editingId = null;
  let draftImage = '';
  let projectSync = {};

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function loadProjects() {
    const stored = readJson(STORAGE.projects, null);
    if (!Array.isArray(stored)) return structuredClone(INITIAL_PROJECTS);
    const migrated = stored.map(migrateProject).filter(Boolean);
    const byId = new Map(migrated.map((project) => [project.id, project]));
    INITIAL_PROJECTS.forEach((canonical) => {
      const current = byId.get(canonical.id);
      byId.set(canonical.id, current ? {
        ...canonical,
        ...current,
        url: current.url && !current.url.includes('example.com') ? current.url : canonical.url,
        notionUrl: current.notionUrl || canonical.notionUrl,
        integrationUrl: canonical.integrationUrl || current.integrationUrl
      } : structuredClone(canonical));
    });
    return [...byId.values()].filter((project) => !['projeto-concluido', 'arquivo', 'rascunho'].includes(project.id));
  }

  function migrateProject(project) {
    if (!project || !project.id || !project.name || !project.url) return null;
    const kind = project.kind || (project.type === 'ready' ? 'application' : 'project');
    const phase = project.phase || (project.type === 'completed' || kind === 'application' ? 'completed' : 'development');
    return { ...project, kind, phase, location: project.location === 'menu' ? 'menu' : 'panel' };
  }

  function saveProjects() {
    localStorage.setItem(STORAGE.projects, JSON.stringify(projects));
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  function initials(name) {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'PNG';
  }

  function safeTasks(tasks) {
    if (!tasks) return null;
    const values = ['todo', 'doing', 'done', 'none'].map((key) => Number(tasks[key]));
    if (values.some((value) => !Number.isFinite(value) || value < 0)) return null;
    return { todo: values[0], doing: values[1], done: values[2], none: values[3] };
  }

  function taskTotal(tasks) {
    const safe = safeTasks(tasks);
    return safe ? safe.todo + safe.doing + safe.done + safe.none : null;
  }

  function developmentGradient(tasks, colors = {}) {
    const safe = safeTasks(tasks);
    const total = taskTotal(safe);
    if (!safe || !total) return `conic-gradient(${TASK_COLORS.none} 0 100%)`;
    const gap = Math.min(1.6, 100 / total);
    const parts = [];
    let cursor = 0;
    [['done', safe.done], ['doing', safe.doing], ['todo', safe.todo], ['none', safe.none]].forEach(([key, count]) => {
      if (count <= 0) return;
      const end = cursor + count / total * 100;
      const colorEnd = Math.max(cursor, end - gap);
      parts.push(`${colors[key] || TASK_COLORS[key]} ${cursor}% ${colorEnd}%`, `transparent ${colorEnd}% ${end}%`);
      cursor = end;
    });
    return `conic-gradient(${parts.join(', ')})`;
  }

  function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    return [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60]
      .map((value) => String(value).padStart(2, '0')).join(':');
  }

  function projectState(project) {
    if (project.kind === 'application') return project.signal?.label || 'Aplicação';
    if (project.phase === 'completed') return 'Projeto concluído';
    const sync = projectSync[project.id]?.status;
    const total = taskTotal(project.tasks);
    const summary = total === null ? null : `${total} ${total === 1 ? 'tarefa' : 'tarefas'}`;
    if (sync === 'loading') return 'atualizando tarefas…';
    if (sync === 'error') return summary ? `${summary} · dados anteriores` : 'erro ao atualizar';
    if (sync === 'empty') return 'sem dados do Notion';
    if (!project.integrationUrl && project.notionUrl) return 'aguardando conexão com Notion';
    return summary ? `${summary} · em desenvolvimento` : 'sem dados de tarefas';
  }

  function projectCardHtml(project, { compact = false, showFocus = true } = {}) {
    const visual = project.kind === 'application' ? 'ready' : project.phase;
    const image = project.image
      ? `<img src="${escapeHtml(project.image)}" alt="">`
      : `<span class="project-placeholder">${escapeHtml(initials(project.name))}</span>`;
    const background = project.kind === 'project' && project.phase === 'development'
      ? ` style="background:${escapeHtml(developmentGradient(project.tasks, project.taskColors))}"`
      : '';
    const signal = project.signal
      ? `<span class="project-signal" data-tooltip="${escapeHtml(project.signal.label)}" aria-label="${escapeHtml(project.signal.label)}"><span aria-hidden="true">${SIGNAL_ICONS[project.signal.kind] || '•'}</span></span>`
      : '';
    const completed = project.kind === 'project' && project.phase === 'completed'
      ? '<span class="project-complete-mark" aria-label="Projeto concluído"><span aria-hidden="true">✅</span></span>'
      : '';
    const focus = project.kind === 'project' && showFocus
      ? `<button class="icon-button focus-action" type="button" data-action="focus" data-project-id="${escapeHtml(project.id)}" data-tooltip="Trabalhar agora" aria-label="Trabalhar agora em ${escapeHtml(project.name)}"><span aria-hidden="true">▶</span></button>`
      : '';
    return `<article class="project-cell${compact ? ' compact' : ''}" data-project-id="${escapeHtml(project.id)}">
      <div class="project-interaction">
        <button class="project-main-action" type="button" data-action="open" data-project-id="${escapeHtml(project.id)}" aria-label="Abrir link de ${escapeHtml(project.name)}">
          <span class="project-ring ${visual}${project.signal ? ' has-signal' : ''}"${background}><span class="project-glass">${image}</span></span>${signal}${completed}
        </button>
        <div class="project-actions" aria-label="Ações de ${escapeHtml(project.name)}">
          ${focus}
          <button class="icon-button" type="button" data-action="open" data-project-id="${escapeHtml(project.id)}" data-tooltip="Abrir link" aria-label="Abrir link de ${escapeHtml(project.name)}"><span aria-hidden="true">↗</span></button>
          <button class="icon-button" type="button" data-action="notes" data-project-id="${escapeHtml(project.id)}" data-tooltip="Bloquinho de notas" aria-label="Abrir Bloquinho de notas de ${escapeHtml(project.name)}"><span aria-hidden="true">▤</span></button>
          <button class="icon-button" type="button" data-action="edit" data-project-id="${escapeHtml(project.id)}" data-tooltip="Editar" aria-label="Editar ${escapeHtml(project.name)}"><span aria-hidden="true">✎</span></button>
        </div>
      </div>
      <div class="project-name">${escapeHtml(project.name)}</div><div class="project-state">${escapeHtml(projectState(project))}</div>
    </article>`;
  }

  function activeProject() {
    const project = projects.find((item) => item.id === activeProjectId);
    return project?.kind === 'project' ? project : null;
  }

  function renderProjects() {
    const active = activeProject();
    const visible = projects.filter((project) => project.location === 'panel' && project.id !== active?.id);
    elements.projectsGrid.innerHTML = visible.map((project) => projectCardHtml(project)).join('');
    elements.panelCount.textContent = `${visible.length} no painel`;

    elements.focusStatus.textContent = active ? 'em foco' : 'livre';
    elements.pomodoroProject.textContent = active ? `· ${active.name}` : '· sem projeto';
    elements.focusContent.innerHTML = active
      ? `<div class="focus-content">${projectCardHtml(active, { compact: true, showFocus: false })}<div class="focus-time-summary"><small>Tempo acumulado</small><strong>${formatDuration(timeTotals[active.id])}</strong><button class="text-button dark-text-button" type="button" data-action="clear-focus">encerrar foco</button></div></div>`
      : '<div class="focus-empty"><span aria-hidden="true">▶</span><strong>Nenhum projeto em foco</strong><small>Clique no play de uma muda para começar.</small></div>';

    const orderedProjects = projects.filter((project) => project.kind === 'project')
      .sort((a, b) => (a.phase === b.phase ? a.name.localeCompare(b.name, 'pt-BR') : a.phase === 'development' ? -1 : 1));
    const applications = projects.filter((project) => project.kind === 'application').sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    elements.projectMenuList.innerHTML = orderedProjects.map(drawerProjectHtml).join('');
    elements.applicationMenuList.innerHTML = applications.map(drawerProjectHtml).join('');
  }

  function drawerProjectHtml(project) {
    const visual = project.kind === 'application' ? 'ready' : project.phase;
    const image = project.image ? `<img src="${escapeHtml(project.image)}" alt="">` : escapeHtml(initials(project.name));
    const label = project.kind === 'application' ? 'Aplicação' : project.phase === 'completed' ? 'Concluído' : 'Em desenvolvimento';
    const focus = project.kind === 'project'
      ? `<button class="drawer-focus" type="button" data-action="focus" data-project-id="${escapeHtml(project.id)}" data-tooltip="Trabalhar agora" aria-label="Trabalhar agora em ${escapeHtml(project.name)}">▶</button>` : '';
    return `<div class="drawer-project"><span class="drawer-thumbnail ${visual}" aria-hidden="true">${image}</span>
      <button class="drawer-link" type="button" data-action="open" data-project-id="${escapeHtml(project.id)}"><span>${escapeHtml(project.name)}</span><small>${label}${project.location === 'menu' ? ' · somente menu' : ''}</small></button>
      ${focus}<button class="drawer-edit" type="button" data-action="edit" data-project-id="${escapeHtml(project.id)}" data-tooltip="Editar" aria-label="Editar ${escapeHtml(project.name)}">✎</button></div>`;
  }

  function getProject(id) {
    return projects.find((project) => project.id === id);
  }

  function openProject(project) {
    if (!project?.url) return;
    window.open(project.url, '_blank', 'noopener,noreferrer');
    hideMenu(false);
  }

  function setFocus(project) {
    if (!project || project.kind !== 'project' || project.id === activeProjectId) return;
    const current = activeProject();
    if (timerRunning && current && !window.confirm(`Encerrar a sessão de ${current.name} e trabalhar em ${project.name}?`)) return;
    if (timerRunning && current) resetTimer();
    activeProjectId = project.id;
    localStorage.setItem(STORAGE.activeProject, activeProjectId);
    renderProjects();
    hideMenu(false);
  }

  function clearFocus() {
    const current = activeProject();
    if (timerRunning && current && !window.confirm(`Encerrar a sessão de ${current.name}?`)) return;
    if (timerRunning) resetTimer();
    activeProjectId = null;
    localStorage.removeItem(STORAGE.activeProject);
    renderProjects();
  }

  function openNotes(project) {
    if (!project) return;
    if (noteProjectId === project.id && !elements.noteDrawer.hidden) {
      closeNotes();
      return;
    }
    noteProjectId = project.id;
    elements.noteProjectName.textContent = project.name;
    elements.projectNote.value = notes[project.id] || '';
    elements.noteDrawer.hidden = false;
    elements.shell.classList.add('notes-open');
    window.setTimeout(() => elements.projectNote.focus(), 0);
  }

  function closeNotes() {
    noteProjectId = null;
    elements.noteDrawer.hidden = true;
    elements.shell.classList.remove('notes-open');
  }

  function showMenu() {
    elements.projectMenu.classList.add('is-open');
    elements.menuBackdrop.classList.add('is-open');
    elements.projectMenu.setAttribute('aria-hidden', 'false');
    elements.openMenu.setAttribute('aria-expanded', 'true');
    elements.closeMenu.focus();
  }

  function hideMenu(restoreFocus = true) {
    elements.projectMenu.classList.remove('is-open');
    elements.menuBackdrop.classList.remove('is-open');
    elements.projectMenu.setAttribute('aria-hidden', 'true');
    elements.openMenu.setAttribute('aria-expanded', 'false');
    if (restoreFocus) elements.openMenu.focus();
  }

  function handleProjectAction(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const project = getProject(button.dataset.projectId);
    if (button.dataset.action === 'open') openProject(project);
    if (button.dataset.action === 'focus') setFocus(project);
    if (button.dataset.action === 'notes') openNotes(project);
    if (button.dataset.action === 'edit') openProjectModal(project);
    if (button.dataset.action === 'clear-focus') clearFocus();
  }

  function openProjectModal(project = null) {
    editingId = project?.id || null;
    draftImage = project?.image || '';
    elements.projectName.value = project?.name || '';
    elements.projectUrl.value = project?.url || '';
    elements.projectNotion.value = project?.notionUrl || '';
    setRadio('kind', project?.kind || 'project');
    setRadio('phase', project?.phase || 'development');
    setRadio('location', project?.location || 'panel');
    elements.projectSubmit.textContent = editingId ? 'Salvar alterações' : 'Cadastrar muda';
    updatePhaseVisibility();
    updateImagePreview();
    elements.modalBackdrop.hidden = false;
    window.setTimeout(() => elements.projectName.focus(), 0);
  }

  function closeProjectModal() {
    elements.modalBackdrop.hidden = true;
    elements.projectForm.reset();
    editingId = null;
    draftImage = '';
  }

  function setRadio(name, value) {
    const input = elements.projectForm.querySelector(`input[name="${name}"][value="${value}"]`);
    if (input) input.checked = true;
  }

  function radioValue(name) {
    return elements.projectForm.querySelector(`input[name="${name}"]:checked`)?.value;
  }

  function updatePhaseVisibility() {
    const isProject = radioValue('kind') === 'project';
    elements.projectPhaseField.hidden = !isProject;
    if (!isProject) setRadio('phase', 'completed');
  }

  function updateImagePreview() {
    const fallback = escapeHtml(initials(elements.projectName.value));
    elements.imagePreview.innerHTML = draftImage ? `<img src="${escapeHtml(draftImage)}" alt="">` : `<span>${fallback}</span>`;
  }

  function slug(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function saveProject(event) {
    event.preventDefault();
    const current = editingId ? getProject(editingId) : null;
    const kind = radioValue('kind');
    const project = {
      ...(current || {}),
      id: current?.id || `${slug(elements.projectName.value) || 'muda'}-${Date.now()}`,
      name: elements.projectName.value.trim(),
      url: elements.projectUrl.value.trim(),
      notionUrl: elements.projectNotion.value.trim(),
      kind,
      phase: kind === 'application' ? 'completed' : radioValue('phase'),
      location: radioValue('location'),
      image: draftImage
    };
    if (!project.name || !project.url) return;
    projects = current ? projects.map((item) => item.id === current.id ? project : item) : [...projects, project];
    if (activeProjectId === project.id && project.kind !== 'project') {
      activeProjectId = null;
      localStorage.removeItem(STORAGE.activeProject);
      resetTimer();
    }
    saveProjects();
    closeProjectModal();
    renderProjects();
  }

  function updateDateTime() {
    const now = new Date();
    elements.clock.textContent = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(now);
    const date = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' }).format(now);
    elements.today.textContent = date.charAt(0).toUpperCase() + date.slice(1);
  }

  const timerElement = document.getElementById('timer');
  const timerToggle = document.getElementById('timerToggle');
  const timerReset = document.getElementById('timerReset');
  const timerProgress = document.getElementById('timerProgress');
  const pomodoroState = document.getElementById('pomodoroState');
  const pomodoroCard = document.getElementById('pomodoro');
  const durationButtons = [...document.querySelectorAll('[data-minutes]')];
  const baseTitle = document.title;
  let timerMinutes = 25;
  let timerRemaining = timerMinutes * 60;
  let timerDeadline = 0;
  let timerAccountedRemaining = timerRemaining;
  let timerInterval = null;
  let timerRunning = false;
  let audioContext = null;

  function renderTimer() {
    const minutes = Math.floor(timerRemaining / 60);
    const seconds = timerRemaining % 60;
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerProgress.style.width = `${Math.min(100, Math.max(0, (timerMinutes * 60 - timerRemaining) / (timerMinutes * 60) * 100))}%`;
  }

  function trackElapsed(nextRemaining) {
    const elapsed = Math.max(0, timerAccountedRemaining - nextRemaining);
    const active = activeProject();
    if (elapsed > 0 && active) {
      timeTotals[active.id] = (Number(timeTotals[active.id]) || 0) + elapsed;
      localStorage.setItem(STORAGE.timeTotals, JSON.stringify(timeTotals));
      renderProjects();
    }
    timerAccountedRemaining = nextRemaining;
  }

  function tickTimer() {
    const next = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
    trackElapsed(next);
    timerRemaining = next;
    renderTimer();
    if (next === 0) completeTimer();
  }

  function prepareAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioContext) audioContext = new AudioContext();
    if (audioContext.state === 'suspended') audioContext.resume();
  }

  function playCompletionChime() {
    if (!audioContext) return;
    [0, 0.26].forEach((delay, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + delay;
      oscillator.frequency.value = index === 0 ? 660 : 880;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.36);
    });
  }

  function stopTimer(state = 'pausado') {
    window.clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
    pomodoroState.textContent = state;
    timerToggle.innerHTML = '<span aria-hidden="true">▶</span>';
    timerToggle.setAttribute('aria-label', 'Iniciar Pomodoro');
  }

  function completeTimer() {
    stopTimer('concluído');
    pomodoroCard.classList.add('is-complete');
    document.title = 'Pomodoro concluído — Terrário';
    playCompletionChime();
  }

  function startTimer() {
    if (timerRemaining === 0) timerRemaining = timerMinutes * 60;
    timerAccountedRemaining = timerRemaining;
    timerDeadline = Date.now() + timerRemaining * 1000;
    timerRunning = true;
    pomodoroCard.classList.remove('is-complete');
    document.title = baseTitle;
    pomodoroState.textContent = 'em foco';
    timerToggle.innerHTML = '<span aria-hidden="true">Ⅱ</span>';
    timerToggle.setAttribute('aria-label', 'Pausar Pomodoro');
    prepareAudio();
    timerInterval = window.setInterval(tickTimer, 250);
  }

  function pauseTimer() {
    const next = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000));
    trackElapsed(next);
    timerRemaining = next;
    renderTimer();
    stopTimer();
  }

  function resetTimer() {
    window.clearInterval(timerInterval);
    timerInterval = null;
    timerRunning = false;
    timerRemaining = timerMinutes * 60;
    timerAccountedRemaining = timerRemaining;
    pomodoroCard.classList.remove('is-complete');
    document.title = baseTitle;
    pomodoroState.textContent = 'pronto';
    timerToggle.innerHTML = '<span aria-hidden="true">▶</span>';
    timerToggle.setAttribute('aria-label', 'Iniciar Pomodoro');
    renderTimer();
  }

  async function fetchJson(url, timeoutMs) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function refreshProject(project, fresh) {
    if (!project.integrationUrl) return;
    projectSync[project.id] = { status: 'loading' };
    renderProjects();
    try {
      const target = new URL(project.integrationUrl);
      if (fresh) target.searchParams.set('fresh', '1');
      const snapshot = await fetchJson(target.toString(), 12000);
      if (snapshot.tasks && !safeTasks(snapshot.tasks)) throw new Error('Contagens inválidas');
      projects = projects.map((item) => item.id === project.id ? {
        ...item,
        ...(snapshot.tasks ? { tasks: snapshot.tasks } : {}),
        ...(snapshot.taskColors ? { taskColors: snapshot.taskColors } : {}),
        ...(Object.prototype.hasOwnProperty.call(snapshot, 'signal') ? { signal: snapshot.signal || undefined } : {})
      } : item);
      projectSync[project.id] = { status: snapshot.tasks || snapshot.signal ? 'updated' : 'empty' };
      saveProjects();
    } catch {
      projectSync[project.id] = { status: 'error' };
    }
    renderProjects();
  }

  function radarText(items) {
    return Array.isArray(items) && items.length
      ? items.map((item) => `${item.title}${item.project ? ` · ${item.project}` : ''}`).join('; ')
      : 'nenhuma entrega com prazo';
  }

  async function refreshRadar(fresh) {
    elements.radarStatus.textContent = 'atualizando…';
    try {
      const target = new URL(RADAR_ENDPOINT);
      if (fresh) target.searchParams.set('fresh', '1');
      const radar = await fetchJson(target.toString(), 12000);
      if (!Array.isArray(radar.today) || !Array.isArray(radar.tomorrow)) throw new Error('Radar inválido');
      elements.radarToday.textContent = radarText(radar.today);
      elements.radarTomorrow.textContent = radarText(radar.tomorrow);
      elements.radarStatus.textContent = 'Notion conectado';
    } catch {
      elements.radarStatus.textContent = 'indisponível';
      elements.radarToday.textContent = 'não foi possível atualizar';
      elements.radarTomorrow.textContent = 'não foi possível atualizar';
    }
  }

  async function refreshAll(fresh = false) {
    elements.projectRefresh.disabled = true;
    elements.projectRefresh.className = 'status-pill global-refresh is-loading';
    elements.projectRefreshLabel.textContent = 'Atualizando…';
    await Promise.all([
      ...projects.filter((project) => project.integrationUrl).map((project) => refreshProject(project, fresh)),
      refreshRadar(fresh)
    ]);
    const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
    elements.projectRefresh.className = 'status-pill global-refresh is-updated';
    elements.projectRefreshLabel.textContent = `Atualizado ${time}`;
    elements.projectRefresh.disabled = false;
  }

  const taximeter = document.getElementById('taximeter');
  const taxiRefresh = document.getElementById('taxiRefresh');
  const taxiSummary = document.getElementById('taxiSummary');
  const taxiStatus = document.getElementById('taxiStatus');
  const taxiGauge = document.getElementById('taxiGauge');
  const taxiValue = document.getElementById('taxiValue');
  const taxiMeter = document.getElementById('taxiMeter');
  const taxiTasks = document.getElementById('taxiTasks');
  const taxiSources = document.getElementById('taxiSources');
  const taxiOpen = document.getElementById('taxiOpen');
  let activeTaxiEndpoint = TAXIMETER_ENDPOINTS[0];

  function renderTaximeter(data) {
    const sources = Array.isArray(data.sources) ? data.sources : [];
    const source = sources.find((item) => Number.isFinite(item.usagePercent)) || sources[0] || null;
    const usage = Math.max(0, Math.min(100, Number(source?.usagePercent) || 0));
    taximeter.className = 'taximeter-card glass-card is-connected';
    taxiRefresh.textContent = 'atualizar';
    taxiSummary.textContent = source ? `${source.name}${source.cycleLabel ? ` · ${source.cycleLabel}` : ''}` : 'Abra o Taxímetro para conectar uma fonte';
    taxiStatus.textContent = source && Number.isFinite(source.usagePercent) ? `${Math.round(usage)}% de uso` : '—';
    taxiValue.textContent = source && Number.isFinite(source.usagePercent) ? `${Math.round(usage)}%` : '—';
    taxiGauge.style.setProperty('--usage', `${usage}%`);
    taxiGauge.setAttribute('aria-label', `${Math.round(usage)} por cento de uso`);
    taxiMeter.style.width = `${usage}%`;
    taxiSources.textContent = sources.slice(0, 3).map((item) => item.name).join(' · ');
    taxiTasks.innerHTML = (source?.conversations || []).slice(0, 3).map((conversation) =>
      `<div class="recent-task"><span>${escapeHtml(conversation.title || '')}</span><small>${escapeHtml([conversation.tokens, conversation.age].filter(Boolean).join(' · '))}</small></div>`
    ).join('');
    taxiOpen.hidden = true;
  }

  function renderTaximeterOffline() {
    taximeter.className = 'taximeter-card glass-card is-offline';
    taxiRefresh.textContent = 'desconectado';
    taxiSummary.textContent = 'Inicie o Taxímetro neste Mac';
    taxiStatus.textContent = '—';
    taxiValue.textContent = '—';
    taxiGauge.style.setProperty('--usage', '0%');
    taxiMeter.style.width = '0%';
    taxiTasks.replaceChildren();
    taxiSources.textContent = '';
    taxiOpen.href = activeTaxiEndpoint;
    taxiOpen.hidden = false;
  }

  async function loadTaximeter(fresh = false) {
    taxiRefresh.disabled = true;
    taxiRefresh.textContent = 'conectando…';
    const endpoints = [activeTaxiEndpoint, ...TAXIMETER_ENDPOINTS.filter((endpoint) => endpoint !== activeTaxiEndpoint)];
    for (const endpoint of endpoints) {
      try {
        const data = await fetchJson(`${endpoint}/api/widget${fresh ? '?fresh=1' : ''}`, 25000);
        if (!Array.isArray(data.sources)) throw new Error('Resposta inválida');
        activeTaxiEndpoint = endpoint;
        renderTaximeter(data);
        taxiRefresh.disabled = false;
        return;
      } catch {
        // A instalação local pode usar qualquer uma das duas portas.
      }
    }
    renderTaximeterOffline();
    taxiRefresh.disabled = false;
  }

  elements.projectsGrid.addEventListener('click', handleProjectAction);
  elements.focusContent.addEventListener('click', handleProjectAction);
  elements.projectMenuList.addEventListener('click', handleProjectAction);
  elements.applicationMenuList.addEventListener('click', handleProjectAction);
  elements.openMenu.addEventListener('click', showMenu);
  elements.closeMenu.addEventListener('click', () => hideMenu());
  elements.menuBackdrop.addEventListener('click', () => hideMenu());
  elements.createProject.addEventListener('click', () => openProjectModal());
  elements.closeNotes.addEventListener('click', closeNotes);
  elements.projectNote.addEventListener('input', () => {
    if (!noteProjectId) return;
    notes[noteProjectId] = elements.projectNote.value;
    localStorage.setItem(STORAGE.notes, JSON.stringify(notes));
  });
  elements.projectForm.addEventListener('submit', saveProject);
  elements.projectForm.addEventListener('change', (event) => {
    if (event.target.name === 'kind') updatePhaseVisibility();
  });
  elements.projectName.addEventListener('input', updateImagePreview);
  elements.projectImage.addEventListener('change', () => {
    const file = elements.projectImage.files?.[0];
    if (!file || file.type !== 'image/png') return;
    const reader = new FileReader();
    reader.addEventListener('load', () => { draftImage = String(reader.result || ''); updateImagePreview(); });
    reader.readAsDataURL(file);
  });
  document.querySelectorAll('[data-action="close-modal"]').forEach((button) => button.addEventListener('click', closeProjectModal));
  elements.modalBackdrop.addEventListener('mousedown', (event) => { if (event.target === elements.modalBackdrop) closeProjectModal(); });
  document.querySelectorAll('[data-tool-target]').forEach((button) => button.addEventListener('click', () => {
    hideMenu(false);
    const target = document.getElementById(button.dataset.toolTarget);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => target?.focus(), 350);
  }));
  timerToggle.addEventListener('click', () => timerRunning ? pauseTimer() : startTimer());
  timerReset.addEventListener('click', resetTimer);
  durationButtons.forEach((button) => button.addEventListener('click', () => {
    timerMinutes = Number(button.dataset.minutes);
    durationButtons.forEach((item) => item.classList.toggle('is-selected', item === button));
    resetTimer();
  }));
  elements.projectRefresh.addEventListener('click', () => refreshAll(true));
  taxiRefresh.addEventListener('click', () => loadTaximeter(true));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      if (timerRunning) tickTimer();
      refreshAll(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!elements.modalBackdrop.hidden) closeProjectModal();
    else if (!elements.noteDrawer.hidden) closeNotes();
    else if (elements.projectMenu.classList.contains('is-open')) hideMenu();
  });

  if (!activeProject()) {
    activeProjectId = null;
    localStorage.removeItem(STORAGE.activeProject);
  }
  updateDateTime();
  window.setInterval(updateDateTime, 1000);
  renderProjects();
  renderTimer();
  window.setTimeout(() => refreshAll(false), 0);
  window.setTimeout(() => loadTaximeter(false), 0);
  window.setInterval(() => refreshAll(false), 5 * 60 * 1000);
  window.setInterval(() => loadTaximeter(false), 5 * 60 * 1000);
})();
