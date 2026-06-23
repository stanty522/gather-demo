// scene-1-personas.js — Persona Explorer (Scene 1)
// Self-contained module. Call initScene1(container) to mount.

async function initScene1(container) {
  // ─── DATA ───────────────────────────────────────────────────────────────────

  const [surgePersonas, microPersonas, macroPersonas] = await Promise.all([
    fetch('personas-surge.json').then(r => r.json()),
    fetch('personas-micro.json').then(r => r.json()),
    fetch('personas-macro.json').then(r => r.json())
  ]);
  const personas = [...surgePersonas, ...microPersonas, ...macroPersonas];



  // ─── CONSTANTS ──────────────────────────────────────────────────────────────

  const PIPE_COLORS = { surge: '#e17055', micro: '#74b9ff', macro: '#a29bfe' };
  const PIPE_LABELS = { surge: 'Surge', micro: 'Micro', macro: 'Macro' };
  const AMBER = '#f0c27a';
  const GREEN = '#10b981';

  // ─── STATE ──────────────────────────────────────────────────────────────────

  let activeFilter = 'macro';
  let activeView = 'map';
  let mapFocus = null;
  let mapRaf = null;
  let activeSort = 'score';
  let deepDivePersona = null;
  let typewriterTimer = null;

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  function fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
    return n.toString();
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function intensityDots(n) {
    var out = '';
    for (var i = 0; i < 5; i++) {
      out += '<span class="s1-dot' + (i < n ? ' s1-dot--on' : '') + '"></span>';
    }
    return out;
  }

  function getFiltered() {
    var list = activeFilter === 'all' ? personas.slice() : personas.filter(function(p) { return p.pipe === activeFilter; });
    if (activeSort === 'score') list.sort(function(a, b) { return b.score - a.score; });
    else if (activeSort === 'pop') list.sort(function(a, b) { return b.popNum - a.popNum; });
    else if (activeSort === 'intensity') list.sort(function(a, b) { return b.intensity - a.intensity; });
    else if (activeSort === 'name') list.sort(function(a, b) { return a.name.localeCompare(b.name); });
    return list;
  }

  // ─── CSS ────────────────────────────────────────────────────────────────────

  var css = `
/* ── Scene 1 Scoped Styles ── */
.scene1 {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #e2e2f0;
  position: relative;
  padding: 0;
  overflow-y: auto;
  height: 100%;
  display: flex;
}
.scene1 *, .scene1 *::before, .scene1 *::after { box-sizing: border-box; }

/* Layout: main + sidebar */
.s1-main {
  flex: 1; min-width: 0; padding: 40px 0 60px; overflow-y: auto;
}
.s1-sidebar {
  width: 380px; flex-shrink: 0; border-left: 1px solid rgba(255,255,255,0.06);
  overflow-y: hidden; display: flex; flex-direction: column;
  background: rgba(255,255,255,0.01);
}
.s1-sidebar-header {
  padding: 20px 20px 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
}
.s1-sidebar-header h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 20px; font-weight: 400; color: #e2e2f0; margin: 0 0 4px;
}
.s1-sidebar-header .s1-sidebar-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: #555; letter-spacing: 0.08em; text-transform: uppercase;
}

/* Header */
.s1-header { text-align: left; margin-bottom: 16px; padding-left: 24px; }
.s1-header h2 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 36px; font-weight: 400; margin: 0 0 4px; color: #e2e2f0;
  letter-spacing: -0.5px;
}
.s1-header .s1-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; color: #737373; letter-spacing: 2px; text-transform: uppercase;
}

/* Filter Bar */
.s1-filterbar {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  margin-bottom: 16px; flex-wrap: wrap;
}
.s1-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; padding: 6px 16px; border-radius: 20px;
  background: transparent; border: 1px solid rgba(255,255,255,0.08);
  color: #737373; cursor: pointer; transition: all 0.2s ease;
  user-select: none; letter-spacing: 0.5px;
}
.s1-pill:hover { color: #e2e2f0; border-color: rgba(255,255,255,0.18); }
.s1-pill--active { color: #e2e2f0; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); }
.s1-pill--surge.s1-pill--active { color: #e17055; border-color: rgba(225,112,85,0.4); background: rgba(225,112,85,0.08); }
.s1-pill--micro.s1-pill--active { color: #74b9ff; border-color: rgba(116,185,255,0.4); background: rgba(116,185,255,0.08); }
.s1-pill--macro.s1-pill--active { color: #a29bfe; border-color: rgba(162,155,254,0.4); background: rgba(162,155,254,0.08); }

.s1-pipeline-desc {
  max-width: 1100px; margin: 0 auto 20px; padding: 0 24px; text-align: left;
  font-size: 12px; line-height: 1.6; color: #666; font-style: italic;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.s1-sort-wrap { margin-left: 16px; }
.s1-sort {
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  color: #e2e2f0; padding: 6px 12px; border-radius: 8px; cursor: pointer;
  appearance: none; -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23737373'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 10px center;
  padding-right: 28px;
}
.s1-sort option { background: #1a1a2e; color: #e2e2f0; }
.s1-pipeline-link {
  margin-left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px;
  background: none; border: 1px solid rgba(16,185,129,0.3); color: #10b981;
  padding: 6px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;
  letter-spacing: 0.5px;
}
.s1-pipeline-link:hover { color: #10b981; border-color: rgba(16,185,129,0.6); background: rgba(16,185,129,0.06); }

/* Context Panels */
.s1-context { margin-bottom: 40px; max-width: 1100px; margin-left: auto; margin-right: auto; padding: 0 24px; }
.s1-context-tabs {
  display: flex; gap: 0; margin-bottom: 0; border-bottom: 1px solid rgba(255,255,255,0.06);
}
.s1-context-tab {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1px;
  text-transform: uppercase; color: #737373; padding: 10px 20px; cursor: pointer;
  border-bottom: 2px solid transparent; transition: all 0.2s ease; user-select: none;
}
.s1-context-tab:hover { color: #e2e2f0; }
.s1-context-tab--active { color: #e2e2f0; border-bottom-color: ${AMBER}; }
.s1-context-body {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  border-top: none; border-radius: 0 0 12px 12px; padding: 24px;
  max-height: 420px; overflow-y: auto;
}
.s1-context-body::-webkit-scrollbar { width: 4px; }
.s1-context-body::-webkit-scrollbar-track { background: transparent; }
.s1-context-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

/* Trigger Events Table */
.s1-trigger-row {
  display: grid; grid-template-columns: 40px 1fr 80px 90px 100px 100px;
  gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  align-items: center; font-size: 13px; transition: background 0.15s;
}
.s1-trigger-row:hover { background: rgba(255,255,255,0.02); }
.s1-trigger-rank {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373;
  text-align: center;
}
.s1-trigger-name { color: #e2e2f0; font-weight: 500; }
.s1-trigger-composite {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${AMBER};
  text-align: center;
}
.s1-trigger-type {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.5px;
  text-transform: uppercase; color: #737373;
}
.s1-trigger-vol {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373;
}
.s1-trigger-emotion { font-size: 11px; color: #737373; font-style: italic; }
.s1-trigger-header {
  display: grid; grid-template-columns: 40px 1fr 80px 90px 100px 100px;
  gap: 12px; padding: 0 0 8px; border-bottom: 1px solid rgba(255,255,255,0.08);
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #404040;
  text-transform: uppercase; letter-spacing: 1px;
}

/* Macro/Micro Trend rows */
.s1-trend-row {
  display: grid; grid-template-columns: 60px 1fr 90px 100px 90px;
  gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  align-items: center; font-size: 13px;
}
.s1-trend-id { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #404040; }
.s1-trend-name { color: #e2e2f0; font-weight: 500; }
.s1-trend-signal {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #737373;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.s1-trend-conf {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: ${GREEN};
}
.s1-trend-extra {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373;
}
.s1-trend-header {
  display: grid; grid-template-columns: 60px 1fr 90px 100px 90px;
  gap: 12px; padding: 0 0 8px; border-bottom: 1px solid rgba(255,255,255,0.08);
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #404040;
  text-transform: uppercase; letter-spacing: 1px;
}

/* Surge panel */
.s1-surge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.s1-surge-card {
  background: rgba(225,112,85,0.04); border: 1px solid rgba(225,112,85,0.12);
  border-radius: 10px; padding: 16px; transition: border-color 0.2s;
}
.s1-surge-card:hover { border-color: rgba(225,112,85,0.3); }
.s1-surge-card h4 { font-size: 14px; color: #e2e2f0; margin: 0 0 6px; font-weight: 500; }
.s1-surge-card .s1-surge-meta {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #e17055;
  margin-bottom: 8px;
}
.s1-surge-card p { font-size: 12px; color: #737373; margin: 0; line-height: 1.5; }

/* Score & Select Section (sidebar) */
.s1-scoring-section {
  display: flex; flex-direction: column; height: 100%;
}
.s1-score-btn-wrap {
  padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
}
.s1-score-btn {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600;
  padding: 10px 20px; border-radius: 8px; cursor: pointer; width: 100%;
  border: 1px solid rgba(16,185,129,0.3); background: rgba(16,185,129,0.08);
  color: #10b981; transition: all 0.3s; letter-spacing: 0.03em;
}
.s1-score-btn:hover { background: rgba(16,185,129,0.18); border-color: rgba(16,185,129,0.5); }
.s1-score-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.s1-scoring-panel {
  display: none; text-align: left; flex: 1; overflow-y: auto;
}
.s1-scoring-panel.visible { display: flex; flex-direction: column; }

.s1-scoring-header {
  padding: 16px 20px 12px; border-bottom: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}
.s1-scoring-header h3 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 18px; font-weight: 400; color: #e2e2f0; margin: 0;
}
.s1-scoring-status {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: #10b981; letter-spacing: 0.05em;
}

.s1-scoring-terminal {
  padding: 12px 16px; font-family: 'JetBrains Mono', monospace;
  font-size: 10px; color: #737373; line-height: 1.7;
  max-height: 100px; overflow-y: auto; border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.s1-scoring-terminal .s1-term-line { opacity: 0; animation: s1TermFade 0.3s forwards; }
@keyframes s1TermFade { to { opacity: 1; } }
.s1-scoring-terminal .s1-term-line .s1-term-accent { color: #10b981; }

.s1-scoring-rows { padding: 4px 0; flex: 1; overflow-y: auto; }

.s1-scoring-row {
  display: grid; grid-template-columns: 1fr 50px 56px 70px;
  gap: 8px; align-items: center; padding: 10px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  opacity: 0; transform: translateY(8px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.s1-scoring-row.revealed { opacity: 1; transform: translateY(0); }
.s1-scoring-row.winner {
  background: rgba(16,185,129,0.06);
  border-left: 3px solid #10b981;
}
.s1-scoring-row-name {
  font-size: 12px; color: #e2e2f0; font-weight: 500;
}
.s1-scoring-row-pipe {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  display: block; margin-top: 2px; padding: 1px 6px;
  border-radius: 3px; width: fit-content;
}
.s1-scoring-row-bars {
  display: flex; gap: 3px; align-items: center; height: 20px;
}
.s1-scoring-bar-group { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.s1-scoring-bar-track {
  height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px;
  overflow: hidden; position: relative;
}
.s1-scoring-bar-fill {
  height: 100%; border-radius: 2px; width: 0%;
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.s1-scoring-composite {
  font-family: 'JetBrains Mono', monospace; font-size: 14px;
  font-weight: 600; color: #404040; text-align: right;
  transition: color 0.3s;
}
.s1-scoring-composite.scored { color: #e2e2f0; }
.s1-scoring-composite.top { color: #10b981; }
.s1-scoring-badge {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  text-transform: uppercase; letter-spacing: 0.06em;
  text-align: right; color: #404040;
}
.s1-scoring-badge.selected {
  color: #10b981;
}
.s1-scoring-badge.passed {
  color: #f0c27a;
}
.s1-scoring-badge.failed {
  color: #ef4444;
}

.s1-scoring-verdict {
  padding: 16px; border-top: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: flex-start; gap: 12px;
  opacity: 0; transition: opacity 0.5s ease; flex-shrink: 0;
}
.s1-scoring-verdict.visible { opacity: 1; }
.s1-scoring-verdict-icon {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.s1-scoring-verdict-text h4 {
  font-size: 12px; color: #10b981; font-weight: 600; margin: 0 0 4px;
}
.s1-scoring-verdict-text p {
  font-size: 11px; color: #737373; margin: 0; line-height: 1.5;
}

/* View toggle */
.s1-viewtoggle { display: inline-flex; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; margin-left: 16px; }
.s1-viewbtn {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.5px;
  padding: 6px 14px; background: transparent; border: none; color: #737373; cursor: pointer;
  transition: all 0.2s ease;
}
.s1-viewbtn:hover { color: #e2e2f0; }
.s1-viewbtn--active { background: rgba(255,255,255,0.08); color: #e2e2f0; }

/* Persona Map (node view) */
.s1-map-wrap {
  max-width: 1100px; margin: 0 auto 32px; padding: 0 24px; position: relative;
}
.s1-map-canvas {
  position: relative; width: 100%; border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; background:
    radial-gradient(circle at 30% 38%, rgba(162,155,254,0.07), transparent 45%),
    radial-gradient(circle at 70% 38%, rgba(116,185,255,0.07), transparent 45%),
    radial-gradient(circle at 50% 14%, rgba(225,112,85,0.07), transparent 40%),
    rgba(255,255,255,0.012);
  overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none;
}
.s1-map-svg { display: block; width: 100%; height: auto; }
.s1-map-node { cursor: grab; }
.s1-map-canvas.s1-dragging, .s1-map-canvas.s1-dragging .s1-map-node { cursor: grabbing; }
.s1-map-dot { transition: opacity 0.25s ease, transform 0.15s ease; transform-box: fill-box; transform-origin: center; }
.s1-map-node:hover .s1-map-dot { transform: scale(1.12); }
.s1-map-node--dim { opacity: 0.18; }
.s1-map-label {
  font-family: 'JetBrains Mono', monospace; fill: #cfcfe0; pointer-events: none;
  opacity: 0; transition: opacity 0.2s ease;
}
.s1-map-node:hover .s1-map-label { opacity: 1; }
.s1-map-label--always { opacity: 0.9; }
.s1-map-link { stroke-linecap: round; pointer-events: none; }
.s1-key-ring { fill: none; }
.s1-key-pulse { fill: none; transform-box: fill-box; transform-origin: center; animation: s1pulse 2.6s ease-out infinite; }
@keyframes s1pulse {
  0% { transform: scale(1); opacity: 0.55; }
  70% { transform: scale(2.4); opacity: 0; }
  100% { transform: scale(2.4); opacity: 0; }
}
.s1-key-badge { font-family: 'JetBrains Mono', monospace; font-weight: 600; fill: #0a0a0a; }
.s1-key-badge-bg { fill: ${AMBER}; }

/* Map tooltip */
.s1-map-tip {
  position: absolute; pointer-events: none; z-index: 5; opacity: 0;
  transform: translate(-50%, -115%); transition: opacity 0.15s ease;
  background: rgba(18,18,28,0.96); border: 1px solid rgba(255,255,255,0.14);
  border-radius: 8px; padding: 9px 12px; min-width: 170px; max-width: 240px;
}
.s1-map-tip--show { opacity: 1; }
.s1-map-tip-name { font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px; }
.s1-map-tip-row { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #9a9ab0; display: flex; justify-content: space-between; gap: 12px; }
.s1-map-tip-row b { color: #e2e2f0; font-weight: 500; }

/* Map legend */
.s1-map-legend {
  display: flex; flex-wrap: wrap; gap: 18px 26px; align-items: center; justify-content: center;
  margin: 14px auto 0; max-width: 1000px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #8a8a9a;
}
.s1-map-legend-item { display: flex; align-items: center; gap: 7px; }
.s1-map-legend-dot { width: 11px; height: 11px; border-radius: 50%; }
.s1-map-legend-sz { display: inline-flex; align-items: baseline; gap: 5px; }
.s1-map-legend-sz i { display: inline-block; border-radius: 50%; background: #6b6b80; }

/* Card Grid */
.s1-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px; max-width: 1100px; margin: 0 auto; padding: 0 24px;
}
.s1-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px; padding: 20px 20px 20px 24px; cursor: pointer;
  transition: all 0.25s ease; position: relative; overflow: hidden;
}
.s1-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  border-radius: 12px 0 0 12px;
}
.s1-card--surge::before { background: #e17055; }
.s1-card--micro::before { background: #74b9ff; }
.s1-card--macro::before { background: #a29bfe; }
.s1-card:hover {
  border-color: rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.05);
  transform: translateY(-2px);
}
.s1-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.s1-card-pipe {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  letter-spacing: 1px; text-transform: uppercase; padding: 2px 8px;
  border-radius: 4px;
}
.s1-card-pipe--surge { color: #e17055; background: rgba(225,112,85,0.1); }
.s1-card-pipe--micro { color: #74b9ff; background: rgba(116,185,255,0.1); }
.s1-card-pipe--macro { color: #a29bfe; background: rgba(162,155,254,0.1); }
.s1-card-score {
  font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700;
  color: ${AMBER}; line-height: 1;
}
.s1-card h3 { font-size: 16px; font-weight: 600; margin: 0 0 6px; color: #e2e2f0; line-height: 1.3; }
.s1-card-desc { font-size: 13px; color: #737373; line-height: 1.5; margin-bottom: 12px; }
.s1-card-meta {
  display: flex; gap: 16px; font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: #737373;
}
.s1-card-meta span { display: flex; align-items: center; gap: 4px; }
.s1-card-pop { color: #e2e2f0; }
.s1-card-intensity { display: flex; align-items: center; gap: 3px; }
.s1-dot {
  width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.1);
  display: inline-block;
}
.s1-dot--on { background: ${AMBER}; }

/* Deep Dive Overlay */
.s1-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  display: none; overflow-y: auto;
  animation: s1FadeIn 0.25s ease;
}
.s1-overlay--open { display: flex; }
@keyframes s1FadeIn { from { opacity: 0; } to { opacity: 1; } }

.s1-deepdive {
  width: 100%; max-width: 1100px; margin: 40px auto; padding: 0 24px;
}
.s1-dd-close {
  position: fixed; top: 24px; right: 32px; width: 36px; height: 36px;
  border-radius: 50%; border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05); color: #e2e2f0; font-size: 18px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; z-index: 10000;
}
.s1-dd-close:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }

/* Identity Card */
.s1-dd-identity {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px; padding: 32px; margin-bottom: 24px;
}
.s1-dd-identity-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.s1-dd-identity h2 {
  font-family: 'Instrument Serif', Georgia, serif; font-size: 32px; font-weight: 400;
  margin: 0 0 8px; color: #e2e2f0; letter-spacing: -0.3px; line-height: 1.2;
}
.s1-dd-identity .s1-dd-desc { font-size: 15px; color: #737373; line-height: 1.6; max-width: 600px; }
.s1-dd-report-btn {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 14px;
  font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.5px;
  padding: 8px 16px; border-radius: 8px; cursor: pointer; text-decoration: none;
  color: ${AMBER}; background: rgba(240,194,122,0.08); border: 1px solid rgba(240,194,122,0.35);
  transition: all 0.18s ease;
}
.s1-dd-report-btn:hover { background: rgba(240,194,122,0.16); border-color: rgba(240,194,122,0.7); color: #ffd9a0; }
.s1-dd-scorebox { text-align: right; }
.s1-dd-scorebox .s1-dd-score-val {
  font-family: 'JetBrains Mono', monospace; font-size: 48px; font-weight: 700;
  color: ${AMBER}; line-height: 1;
}
.s1-dd-scorebox .s1-dd-score-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #737373;
  text-transform: uppercase; letter-spacing: 1px;
}

.s1-dd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
@media (max-width: 700px) { .s1-dd-grid { grid-template-columns: 1fr; } }

.s1-dd-section-title {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #404040;
  text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;
}
.s1-dd-markers { list-style: none; padding: 0; margin: 0; }
.s1-dd-markers li {
  font-size: 13px; color: #e2e2f0; padding: 4px 0; position: relative;
  padding-left: 14px;
}
.s1-dd-markers li::before {
  content: ''; position: absolute; left: 0; top: 10px;
  width: 4px; height: 4px; border-radius: 50%; background: #737373;
}
.s1-dd-communities { display: flex; flex-wrap: wrap; gap: 6px; }
.s1-dd-comm-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px; padding: 3px 10px;
}

/* Confidence Bars */
.s1-dd-confidence { margin-top: 24px; }
.s1-dd-conf-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.s1-dd-conf-label {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373;
  width: 80px; text-align: right;
}
.s1-dd-conf-track {
  flex: 1; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px;
  overflow: hidden;
}
.s1-dd-conf-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
.s1-dd-conf-fill--identity { background: #74b9ff; }
.s1-dd-conf-fill--price { background: ${AMBER}; }
.s1-dd-conf-fill--channel { background: ${GREEN}; }
.s1-dd-conf-val {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #e2e2f0; width: 36px;
}

/* Moment */
.s1-dd-moment {
  margin-top: 24px; padding: 16px; border-radius: 10px;
  background: rgba(240,194,122,0.04); border: 1px solid rgba(240,194,122,0.12);
}
.s1-dd-moment-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: ${AMBER};
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
}
.s1-dd-moment-text { font-size: 14px; color: #e2e2f0; line-height: 1.5; }
.s1-dd-moment-window {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; margin-top: 6px;
}

/* Population / Source */
.s1-dd-pop-row {
  display: flex; gap: 24px; margin-top: 20px;
  font-family: 'JetBrains Mono', monospace; font-size: 12px;
}
.s1-dd-pop-val { color: #e2e2f0; }
.s1-dd-pop-src { color: #404040; }

/* Interview Panel */
.s1-dd-interview {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px; padding: 32px; margin-bottom: 24px;
}
.s1-dd-interview h3 {
  font-family: 'Instrument Serif', Georgia, serif; font-size: 22px; font-weight: 400;
  margin: 0 0 24px; color: #e2e2f0;
}
.s1-dd-interview-empty {
  font-size: 14px; color: #404040; font-style: italic; text-align: center; padding: 40px 0;
}
.s1-dd-qa { margin-bottom: 28px; }
.s1-dd-qa:last-child { margin-bottom: 0; }
.s1-dd-q {
  font-size: 13px; color: #737373; margin-bottom: 8px; font-weight: 500;
  padding-left: 12px; border-left: 2px solid rgba(255,255,255,0.08);
}
.s1-dd-a {
  font-size: 14px; color: #e2e2f0; line-height: 1.7; margin-bottom: 10px;
  min-height: 20px;
}
.s1-dd-a .s1-cursor {
  display: inline-block; width: 2px; height: 14px; background: ${AMBER};
  margin-left: 2px; vertical-align: text-bottom;
  animation: s1Blink 0.8s step-end infinite;
}
@keyframes s1Blink { 50% { opacity: 0; } }
.s1-dd-insight {
  font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${GREEN};
  background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.12);
  border-radius: 8px; padding: 10px 14px; line-height: 1.6;
}

/* No interview available */
.s1-no-interview {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #404040;
  text-align: center; padding: 48px 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .s1-grid { grid-template-columns: 1fr; padding: 0 16px; }
  .s1-header h2 { font-size: 32px; }
  .s1-dd-identity-top { flex-direction: column; }
  .s1-dd-scorebox { text-align: left; margin-top: 12px; }
  .s1-trigger-row { grid-template-columns: 30px 1fr 60px; }
  .s1-trigger-row .s1-trigger-type,
  .s1-trigger-row .s1-trigger-vol,
  .s1-trigger-row .s1-trigger-emotion { display: none; }
  .s1-trigger-header { grid-template-columns: 30px 1fr 60px; }
  .s1-trigger-header span:nth-child(n+4) { display: none; }
}
`;

  // ─── INJECT CSS ─────────────────────────────────────────────────────────────

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── BUILD DOM ──────────────────────────────────────────────────────────────

  container.innerHTML = '';
  container.classList.add('scene1');

  // Main content area
  var mainArea = document.createElement('div');
  mainArea.className = 's1-main';

  // Sidebar
  var sidebarArea = document.createElement('div');
  sidebarArea.className = 's1-sidebar';

  // Header
  var header = document.createElement('div');
  header.className = 's1-header';
  header.innerHTML = '<h2>Persona Explorer</h2><div class="s1-subtitle">Pipeline Intelligence \u00b7 ' + personas.length + ' Personas</div>';
  mainArea.appendChild(header);

  // Filter bar
  var filterBar = document.createElement('div');
  filterBar.className = 's1-filterbar';
  var filters = [
    { key: 'macro', label: 'Macro', cls: 's1-pill--macro' },
    { key: 'micro', label: 'Micro', cls: 's1-pill--micro' },
    { key: 'surge', label: 'Surge', cls: 's1-pill--surge' }
  ];
  filters.forEach(function(f) {
    var pill = document.createElement('button');
    pill.className = 's1-pill ' + f.cls + (f.key === activeFilter ? ' s1-pill--active' : '');
    pill.textContent = f.label;
    pill.dataset.filter = f.key;
    pill.addEventListener('click', function() {
      if (activeView === 'map') {
        // In map view the pills focus a cluster (toggle), they don't filter.
        mapFocus = (mapFocus === f.key) ? null : f.key;
        renderFilters();
        updateMapFocus();
      } else {
        activeFilter = f.key;
        renderFilters();
        renderGrid();
      }
    });
    filterBar.appendChild(pill);
  });

  var sortWrap = document.createElement('div');
  sortWrap.className = 's1-sort-wrap';
  var sortSel = document.createElement('select');
  sortSel.className = 's1-sort';
  [['score','Score'],['pop','Population'],['intensity','Intensity'],['name','Name']].forEach(function(o) {
    var opt = document.createElement('option');
    opt.value = o[0]; opt.textContent = o[1];
    sortSel.appendChild(opt);
  });
  sortSel.value = activeSort;
  sortSel.addEventListener('change', function() { activeSort = sortSel.value; renderGrid(); });
  sortWrap.appendChild(sortSel);
  filterBar.appendChild(sortWrap);

  // View toggle (Grid / Map)
  var viewToggle = document.createElement('div');
  viewToggle.className = 's1-viewtoggle';
  [['grid','Grid'],['map','Map']].forEach(function(v) {
    var b = document.createElement('button');
    b.className = 's1-viewbtn' + (v[0] === activeView ? ' s1-viewbtn--active' : '');
    b.textContent = v[1];
    b.dataset.view = v[0];
    b.addEventListener('click', function() { setView(v[0]); });
    viewToggle.appendChild(b);
  });
  filterBar.appendChild(viewToggle);

  var pipelineLink = document.createElement('button');
  pipelineLink.className = 's1-pipeline-link';
  pipelineLink.textContent = 'View Market Intelligence Run';
  pipelineLink.addEventListener('click', function() {
    var scenes = document.querySelectorAll('.scene');
    scenes.forEach(function(s) { s.classList.remove('active'); });
    var scene1 = document.getElementById('scene-1');
    if (scene1) scene1.classList.add('active');
  });
  filterBar.appendChild(pipelineLink);
  mainArea.appendChild(filterBar);

  // Pipeline descriptions
  var pipelineDescs = {
    macro: 'Identifies structural societal shifts (3\u201330+ years) through institutionally-weighted PESTEL analysis with 5-10 year deep lookback \u2014 scanning census data, policy evolution, and demographic projections to surface durable identity communities. Scores trends through a proprietary 5-dimension Identity Community Scan, then qualifies only signals with Ansoff Level 3+ strength and Rogers Early Adopter positioning.',
    micro: 'Detects emerging consumer waves (3 months \u2013 3 years) by scanning PESTEL signals, scoring velocity through Ansoff frameworks, and cross-referencing life-transition events with real community formation. Stress-tests signals through a Sustainability Assessment that separates noise from structural demand, and pinpoints the exact window on the Rogers adoption curve.',
    surge: 'Captures demand spikes in real-time (< 3 months) through velocity-first scanning \u2014 tracking social trending, search volume breakouts, app store surges, and spend evidence with 3x recency weighting on signals from the last 30 days. Classifies each surge by sub-type (Opportunity-Window, Escalating, Structural, Innovation Wave), projects the enduring demand window through comparable precedent analysis.'
  };
  var descEl = document.createElement('div');
  descEl.className = 's1-pipeline-desc';
  descEl.textContent = pipelineDescs[activeFilter] || '';
  mainArea.appendChild(descEl);

  // Grid
  var grid = document.createElement('div');
  grid.className = 's1-grid';
  mainArea.appendChild(grid);

  // Map (node view) — hidden until selected
  var mapWrap = document.createElement('div');
  mapWrap.className = 's1-map-wrap';
  mapWrap.style.display = 'none';
  mainArea.appendChild(mapWrap);

  // Overlay
  var overlay = document.createElement('div');
  overlay.className = 's1-overlay';
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeDeepDive(); });

  var ddContent = document.createElement('div');
  ddContent.className = 's1-deepdive';
  overlay.appendChild(ddContent);

  var closeBtn = document.createElement('button');
  closeBtn.className = 's1-dd-close';
  closeBtn.innerHTML = '&#215;';
  closeBtn.addEventListener('click', closeDeepDive);
  overlay.appendChild(closeBtn);

  mainArea.appendChild(overlay);

  container.appendChild(mainArea);

  // ─── RENDER FUNCTIONS ───────────────────────────────────────────────────────

  function renderFilters() {
    var pills = filterBar.querySelectorAll('.s1-pill');
    var activeKey = activeView === 'map' ? mapFocus : activeFilter;
    pills.forEach(function(p) {
      p.classList.toggle('s1-pill--active', p.dataset.filter === activeKey);
    });
    descEl.textContent = activeView === 'map'
      ? 'Each persona is a node. Color = pipeline · size = signal score · distance from a cluster’s core = relevance. Click a pill to spotlight one pipeline; click any node for the full deep dive.'
      : (pipelineDescs[activeFilter] || '');
  }

  function renderGrid() {
    var list = getFiltered();
    grid.innerHTML = '';
    list.forEach(function(p) {
      var card = document.createElement('div');
      card.className = 's1-card s1-card--' + p.pipe;
      card.innerHTML =
        '<div class="s1-card-top">' +
          '<span class="s1-card-pipe s1-card-pipe--' + p.pipe + '">' + PIPE_LABELS[p.pipe] + '</span>' +
          '<span class="s1-card-score">' + p.score.toFixed(1) + '</span>' +
        '</div>' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<div class="s1-card-desc">' + esc(p.desc) + '</div>' +
        '<div class="s1-card-meta">' +
          '<span class="s1-card-pop">' + esc(p.pop) + '</span>' +
          '<span class="s1-card-intensity">' + intensityDots(p.intensity) + '</span>' +
        '</div>';
      card.addEventListener('click', function() { openDeepDive(p); });
      grid.appendChild(card);
    });
  }

  // ─── MAP (NODE VIEW) ─────────────────────────────────────────────────────────

  function setView(v) {
    activeView = v;
    var btns = filterBar.querySelectorAll('.s1-viewbtn');
    btns.forEach(function(b) { b.classList.toggle('s1-viewbtn--active', b.dataset.view === v); });
    if (v === 'map') {
      grid.style.display = 'none';
      mapWrap.style.display = '';
      sortWrap.style.display = 'none';
      mapFocus = null;
      renderMap();
    } else {
      grid.style.display = '';
      mapWrap.style.display = 'none';
      sortWrap.style.display = '';
      if (mapRaf) { cancelAnimationFrame(mapRaf); mapRaf = null; }
    }
    renderFilters();
  }

  function updateMapFocus() {
    var nodes = mapWrap.querySelectorAll('.s1-map-node');
    nodes.forEach(function(n) {
      var dim = mapFocus && n.dataset.pipe !== mapFocus;
      n.classList.toggle('s1-map-node--dim', !!dim);
    });
  }

  function renderMap() {
    var W = 1000, H = 600;
    var GOLD = 2.39996323;
    var centroids = {
      surge: { x: 505, y: 118, label: 'SURGE' },
      macro: { x: 322, y: 352, label: 'MACRO' },
      micro: { x: 690, y: 344, label: 'MICRO' }
    };
    var spacing = { macro: 34, micro: 30, surge: 46 };

    var scores = personas.map(function(p) { return p.score; });
    var sMin = Math.min.apply(null, scores), sMax = Math.max.apply(null, scores);
    function norm(p) { return (p.score - sMin) / ((sMax - sMin) || 1); }
    function radius(p) {
      var r = 9 + norm(p) * 16;
      if (p.key) r = Math.max(r * 1.3, 31);
      return r;
    }

    // Layout: one phyllotaxis cluster per pipeline; key persona pinned to its core.
    var pos = {};
    Object.keys(centroids).forEach(function(pipe) {
      var c = centroids[pipe];
      var list = personas.filter(function(p) { return p.pipe === pipe; })
                         .sort(function(a, b) { return b.score - a.score; });
      var i = 0;
      list.forEach(function(p) {
        var x, y;
        if (p.key) { x = c.x; y = c.y; }
        else {
          var rr = spacing[pipe] * Math.sqrt(i + 0.7);
          var ang = i * GOLD;
          x = c.x + rr * Math.cos(ang);
          y = c.y + rr * Math.sin(ang);
          i++;
        }
        pos[p.id] = { x: x, y: y, r: radius(p), p: p };
      });
    });

    var svg = '<svg class="s1-map-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">';

    // Cluster watermark labels
    var labelPos = { surge: { x: 505, y: 38 }, macro: { x: 132, y: 470 }, micro: { x: 872, y: 470 } };
    Object.keys(centroids).forEach(function(pipe) {
      var lp = labelPos[pipe];
      svg += '<text x="' + lp.x + '" y="' + lp.y + '" text-anchor="middle" font-family="JetBrains Mono, monospace" '
        + 'font-size="17" letter-spacing="3" fill="' + PIPE_COLORS[pipe] + '" fill-opacity="0.32">' + centroids[pipe].label + '</text>';
    });

    // Spokes: centroid → each node
    Object.keys(pos).forEach(function(id) {
      var n = pos[id];
      if (n.p.key) return;
      var c = centroids[n.p.pipe];
      svg += '<line class="s1-map-link" x1="' + c.x.toFixed(1) + '" y1="' + c.y.toFixed(1) + '" x2="' + n.x.toFixed(1)
        + '" y2="' + n.y.toFixed(1) + '" stroke="' + PIPE_COLORS[n.p.pipe] + '" stroke-opacity="0.10" stroke-width="1"/>';
    });

    // Key persona's links to thematically related personas
    var keyNode = null;
    Object.keys(pos).forEach(function(id) { if (pos[id].p.key) keyNode = pos[id]; });
    if (keyNode) {
      ['M3', 'M6', 'M11'].forEach(function(rid) {
        var t = pos[rid];
        if (!t) return;
        svg += '<line class="s1-map-link" x1="' + keyNode.x.toFixed(1) + '" y1="' + keyNode.y.toFixed(1) + '" x2="' + t.x.toFixed(1)
          + '" y2="' + t.y.toFixed(1) + '" stroke="' + AMBER + '" stroke-opacity="0.4" stroke-width="2" stroke-dasharray="2 5"/>';
      });
    }

    // Nodes
    Object.keys(pos).forEach(function(id) {
      var n = pos[id], p = n.p;
      var color = PIPE_COLORS[p.pipe];
      var op = (0.42 + norm(p) * 0.45).toFixed(2);
      svg += '<g class="s1-map-node" data-id="' + p.id + '" data-pipe="' + p.pipe + '">';
      if (p.key) {
        svg += '<circle class="s1-key-pulse" cx="' + n.x + '" cy="' + n.y + '" r="' + n.r + '" stroke="' + AMBER + '" stroke-width="2"/>';
        svg += '<circle class="s1-key-ring" cx="' + n.x + '" cy="' + n.y + '" r="' + (n.r + 7) + '" stroke="' + AMBER + '" stroke-width="2"/>';
      }
      svg += '<circle class="s1-map-dot" cx="' + n.x + '" cy="' + n.y + '" r="' + n.r.toFixed(1) + '" fill="' + color
        + '" fill-opacity="' + (p.key ? '0.95' : op) + '" stroke="' + color + '" stroke-opacity="0.9" stroke-width="1"/>';
      if (n.r >= 16) {
        svg += '<text x="' + n.x + '" y="' + (n.y + n.r * 0.22) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" '
          + 'font-size="' + (n.r * 0.6).toFixed(1) + '" font-weight="600" fill="#fff" fill-opacity="0.92" pointer-events="none">' + p.score.toFixed(1) + '</text>';
      }
      var labelCls = 's1-map-label' + (p.key ? ' s1-map-label--always' : '');
      var labelY = n.y + n.r + 13;
      svg += '<text class="' + labelCls + '" x="' + n.x + '" y="' + labelY + '" text-anchor="middle" font-size="' + (p.key ? 12 : 10.5) + '">' + esc(p.name) + '</text>';
      if (p.key) {
        var bw = 86, bx = n.x - bw / 2, by = n.y - n.r - 26;
        svg += '<rect class="s1-key-badge-bg" x="' + bx + '" y="' + by + '" width="' + bw + '" height="16" rx="8"/>';
        svg += '<text class="s1-key-badge" x="' + n.x + '" y="' + (by + 11.5) + '" text-anchor="middle" font-size="9" letter-spacing="1">KEY PERSONA</text>';
      }
      svg += '</g>';
    });

    svg += '</svg>';

    var legend = '<div class="s1-map-legend">'
      + '<span class="s1-map-legend-item"><span class="s1-map-legend-dot" style="background:' + PIPE_COLORS.macro + '"></span>Macro</span>'
      + '<span class="s1-map-legend-item"><span class="s1-map-legend-dot" style="background:' + PIPE_COLORS.micro + '"></span>Micro</span>'
      + '<span class="s1-map-legend-item"><span class="s1-map-legend-dot" style="background:' + PIPE_COLORS.surge + '"></span>Surge</span>'
      + '<span class="s1-map-legend-item s1-map-legend-sz">Size = signal score <i style="width:8px;height:8px"></i><i style="width:15px;height:15px"></i></span>'
      + '<span class="s1-map-legend-item">Closer to core = higher relevance</span>'
      + '<span class="s1-map-legend-item"><span class="s1-map-legend-dot" style="background:transparent;border:2px solid ' + AMBER + '"></span>Key persona to watch</span>'
      + '</div>';

    mapWrap.innerHTML = '<div class="s1-map-canvas">' + svg + '<div class="s1-map-tip"></div></div>' + legend;

    // Interactions + floating physics
    var canvas = mapWrap.querySelector('.s1-map-canvas');
    var tip = mapWrap.querySelector('.s1-map-tip');
    var nodeEls = mapWrap.querySelectorAll('.s1-map-node');

    var K = 0.06;    // spring stiffness (pull toward home)
    var DAMP = 0.87; // velocity damping → slight overshoot/bounce on release
    var nodes = [];

    function showTip(nd) {
      var rect = canvas.getBoundingClientRect();
      var sx = rect.width / W;
      tip.innerHTML = '<div class="s1-map-tip-name">' + esc(nd.p.name) + '</div>'
        + '<div class="s1-map-tip-row"><span>Pipeline</span><b>' + PIPE_LABELS[nd.p.pipe] + '</b></div>'
        + '<div class="s1-map-tip-row"><span>Score</span><b>' + nd.p.score.toFixed(1) + '</b></div>'
        + '<div class="s1-map-tip-row"><span>Reach</span><b>' + esc(nd.p.pop) + '</b></div>';
      tip.style.left = (nd.x * sx) + 'px';
      tip.style.top = ((nd.y - nd.r) * sx) + 'px';
      tip.classList.add('s1-map-tip--show');
    }

    nodeEls.forEach(function(g, i) {
      var p = findPersona(g.dataset.id);
      if (!p) return;
      var home = pos[p.id];
      var nd = {
        g: g, p: p, hx: home.x, hy: home.y, r: home.r,
        x: home.x, y: home.y, vx: 0, vy: 0,
        // deterministic per-node drift so the field feels alive but stable
        ampx: 9 + (i % 5) * 3.2, ampy: 8 + (i % 4) * 3.0,
        spdx: 0.0012 + (i % 6) * 0.00026, spdy: 0.0014 + (i % 5) * 0.00024,
        phx: (i * 1.7) % 6.283, phy: (i * 2.9) % 6.283,
        dragging: false, downX: 0, downY: 0, moved: 0
      };
      nodes.push(nd);

      g.addEventListener('pointerenter', function() { if (!nd.dragging) showTip(nd); });
      g.addEventListener('pointerleave', function() { if (!nd.dragging) tip.classList.remove('s1-map-tip--show'); });

      g.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        try { g.setPointerCapture(e.pointerId); } catch (err) {}
        nd.dragging = true; nd.moved = 0; nd.downX = e.clientX; nd.downY = e.clientY;
        nd.vx = 0; nd.vy = 0;
        canvas.classList.add('s1-dragging');
        tip.classList.remove('s1-map-tip--show');
      });
      g.addEventListener('pointermove', function(e) {
        if (!nd.dragging) return;
        var rect = canvas.getBoundingClientRect();
        nd.x = (e.clientX - rect.left) * (W / rect.width);
        nd.y = (e.clientY - rect.top) * (H / rect.height);
        nd.vx = 0; nd.vy = 0;
        nd.moved = Math.max(nd.moved, Math.abs(e.clientX - nd.downX) + Math.abs(e.clientY - nd.downY));
      });
      function release(e) {
        if (!nd.dragging) return;
        nd.dragging = false;
        canvas.classList.remove('s1-dragging');
        try { g.releasePointerCapture(e.pointerId); } catch (err) {}
        // a tap (negligible movement) opens the deep dive; a real drag springs back
        if (nd.moved < 5) openDeepDive(nd.p);
      }
      g.addEventListener('pointerup', release);
      g.addEventListener('pointercancel', release);
    });

    function step(ts) {
      if (activeView !== 'map') { mapRaf = null; return; }
      for (var j = 0; j < nodes.length; j++) {
        var nd = nodes[j];
        if (!nd.dragging) {
          var tx = nd.hx + Math.sin(ts * nd.spdx + nd.phx) * nd.ampx;
          var ty = nd.hy + Math.cos(ts * nd.spdy + nd.phy) * nd.ampy;
          nd.vx = (nd.vx + (tx - nd.x) * K) * DAMP;
          nd.vy = (nd.vy + (ty - nd.y) * K) * DAMP;
          nd.x += nd.vx; nd.y += nd.vy;
        }
        nd.g.setAttribute('transform', 'translate(' + (nd.x - nd.hx).toFixed(2) + ',' + (nd.y - nd.hy).toFixed(2) + ')');
      }
      mapRaf = requestAnimationFrame(step);
    }
    if (mapRaf) cancelAnimationFrame(mapRaf);
    mapRaf = requestAnimationFrame(step);

    updateMapFocus();
  }

  // ─── DEEP DIVE ──────────────────────────────────────────────────────────────

  function openDeepDive(p) {
    deepDivePersona = p;
    if (typewriterTimer) { clearTimeout(typewriterTimer); typewriterTimer = null; }
    overlay.classList.add('s1-overlay--open');
    document.body.style.overflow = 'hidden';

    var pipeColor = PIPE_COLORS[p.pipe];

    var html = '';

    // Identity card
    html += '<div class="s1-dd-identity" style="border-left: 3px solid ' + pipeColor + ';">';
    html += '<div class="s1-dd-identity-top">';
    html += '<div>';
    html += '<span class="s1-card-pipe s1-card-pipe--' + p.pipe + '" style="margin-bottom:8px;display:inline-block;">' + PIPE_LABELS[p.pipe] + ' Pipeline</span>';
    html += '<h2>' + esc(p.name) + '</h2>';
    html += '<div class="s1-dd-desc">' + esc(p.desc) + '</div>';
    if (p.report) {
      var rUrl = 'report-viewer.html?f=' + encodeURIComponent(p.report)
        + '&title=' + encodeURIComponent(p.name)
        + (p.reportPdf ? '&pdf=' + encodeURIComponent(p.reportPdf) : '');
      html += '<a class="s1-dd-report-btn" href="' + rUrl + '" target="_blank" rel="noopener">See full report ↗</a>';
    }
    html += '</div>';
    html += '<div class="s1-dd-scorebox">';
    html += '<div class="s1-dd-score-val">' + p.score.toFixed(1) + '</div>';
    html += '<div class="s1-dd-score-label">Priority Score</div>';
    html += '</div>';
    html += '</div>';

    // Pop + source
    html += '<div class="s1-dd-pop-row">';
    html += '<span class="s1-dd-pop-val">' + esc(p.pop) + '</span>';
    html += '<span class="s1-dd-pop-src">' + esc(p.popSource) + '</span>';
    html += '</div>';

    // Two column: markers + communities
    html += '<div class="s1-dd-grid">';
    html += '<div>';
    html += '<div class="s1-dd-section-title">Identity Markers</div>';
    html += '<ul class="s1-dd-markers">';
    p.markers.forEach(function(m) { html += '<li>' + esc(m) + '</li>'; });
    html += '</ul>';
    html += '</div>';
    html += '<div>';
    html += '<div class="s1-dd-section-title">Communities</div>';
    html += '<div class="s1-dd-communities">';
    p.community.forEach(function(c) { html += '<span class="s1-dd-comm-tag">' + esc(c) + '</span>'; });
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Confidence bars
    html += '<div class="s1-dd-confidence">';
    html += '<div class="s1-dd-section-title">Confidence Scores</div>';
    ['identity', 'price', 'channel'].forEach(function(key) {
      html += '<div class="s1-dd-conf-row">';
      html += '<span class="s1-dd-conf-label">' + key.charAt(0).toUpperCase() + key.slice(1) + '</span>';
      html += '<div class="s1-dd-conf-track"><div class="s1-dd-conf-fill s1-dd-conf-fill--' + key + '" style="width:0%;"></div></div>';
      html += '<span class="s1-dd-conf-val">' + p.confidence[key] + '%</span>';
      html += '</div>';
    });
    html += '</div>';

    // Moment
    html += '<div class="s1-dd-moment">';
    html += '<div class="s1-dd-moment-label">Capture Moment</div>';
    html += '<div class="s1-dd-moment-text">' + esc(p.moment) + '</div>';
    html += '<div class="s1-dd-moment-window">Window: ' + esc(p.momentWindow) + '</div>';
    html += '</div>';

    html += '</div>'; // end identity

    // Interview panel
    html += '<div class="s1-dd-interview">';
    html += '<h3>Interview Synthesis</h3>';
    if (p.interview && p.interview.length > 0) {
      p.interview.forEach(function(item, idx) {
        html += '<div class="s1-dd-qa">';
        html += '<div class="s1-dd-q">' + esc(item.q) + '</div>';
        html += '<div class="s1-dd-a" data-tw-idx="' + idx + '"></div>';
        html += '<div class="s1-dd-insight" style="opacity:0;transition:opacity 0.5s;" data-insight-idx="' + idx + '">' + esc(item.insight) + '</div>';
        html += '</div>';
      });
    } else {
      html += '<div class="s1-no-interview">No interview data available for this persona.<br>Interviews are conducted for priority personas only.</div>';
    }
    html += '</div>';

    ddContent.innerHTML = html;

    // Animate confidence bars
    setTimeout(function() {
      ['identity', 'price', 'channel'].forEach(function(key) {
        var fill = ddContent.querySelector('.s1-dd-conf-fill--' + key);
        if (fill) fill.style.width = p.confidence[key] + '%';
      });
    }, 50);

    // Typewriter effect
    if (p.interview && p.interview.length > 0) {
      runTypewriter(p.interview, 0);
    }
  }

  function runTypewriter(interviews, idx) {
    if (idx >= interviews.length) return;
    var el = ddContent.querySelector('[data-tw-idx="' + idx + '"]');
    if (!el) return;
    var text = interviews[idx].a;
    var charIdx = 0;
    el.innerHTML = '<span class="s1-cursor"></span>';

    function type() {
      if (charIdx < text.length) {
        el.innerHTML = esc(text.substring(0, charIdx + 1)) + '<span class="s1-cursor"></span>';
        charIdx++;
        var delay = 12;
        if (text[charIdx - 1] === '.' || text[charIdx - 1] === '?' || text[charIdx - 1] === '!') delay = 200;
        else if (text[charIdx - 1] === ',') delay = 80;
        else if (text[charIdx - 1] === '\u2026') delay = 150;
        typewriterTimer = setTimeout(type, delay);
      } else {
        el.innerHTML = esc(text);
        // Show insight
        var insightEl = ddContent.querySelector('[data-insight-idx="' + idx + '"]');
        if (insightEl) insightEl.style.opacity = '1';
        // Next question after brief pause
        typewriterTimer = setTimeout(function() { runTypewriter(interviews, idx + 1); }, 400);
      }
    }
    type();
  }

  function closeDeepDive() {
    overlay.classList.remove('s1-overlay--open');
    document.body.style.overflow = '';
    if (typewriterTimer) { clearTimeout(typewriterTimer); typewriterTimer = null; }
    deepDivePersona = null;
  }

  // ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && deepDivePersona) closeDeepDive();
  });

  // ─── SCORING SECTION ───────────────────────────────────────────────────────

  var scoringSection = document.createElement('div');
  scoringSection.className = 's1-scoring-section';

  var scoreBtnWrap = document.createElement('div');
  scoreBtnWrap.className = 's1-score-btn-wrap';
  var scoreBtn = document.createElement('button');
  scoreBtn.className = 's1-score-btn';
  scoreBtn.textContent = 'Score & Select for Brand Creation';
  scoreBtnWrap.appendChild(scoreBtn);
  scoringSection.appendChild(scoreBtnWrap);

  var scoringPanel = document.createElement('div');
  scoringPanel.className = 's1-scoring-panel';
  scoringSection.appendChild(scoringPanel);

  var sidebarHeader = document.createElement('div');
  sidebarHeader.className = 's1-sidebar-header';
  sidebarHeader.innerHTML = '<h3>Brand Selection</h3><div class="s1-sidebar-sub">Score personas for brand creation</div>';
  sidebarArea.appendChild(sidebarHeader);

  sidebarArea.appendChild(scoringSection);
  container.appendChild(sidebarArea);

  // Candidate personas mapped to brands for scoring
  var scoringCandidates = [
    { persona: 'p029', brand: 'Specter', scores: { identity: 82, market: 68, confidence: 78, switching: 85, channel: 70 }, composite: 8.4, verdict: 'selected' },
    { persona: 'M1', brand: 'Kin Mobile', scores: { identity: 85, market: 90, confidence: 55, switching: 45, channel: 55 }, composite: 7.8, verdict: 'passed' },
    { persona: 'M2', brand: 'Solo', scores: { identity: 78, market: 75, confidence: 68, switching: 52, channel: 68 }, composite: 7.5, verdict: 'passed' },
    { persona: 'p046', brand: 'Soloist', scores: { identity: 71, market: 82, confidence: 60, switching: 65, channel: 60 }, composite: 7.2, verdict: 'passed' },
    { persona: 'p018', brand: 'Trailhead', scores: { identity: 75, market: 70, confidence: 62, switching: 48, channel: 62 }, composite: 6.9, verdict: 'passed' },
    { persona: 'M7', brand: 'Efficient', scores: { identity: 68, market: 55, confidence: 48, switching: 60, channel: 48 }, composite: 6.5, verdict: 'passed' },
    { persona: 's08', brand: 'Afford', scores: { identity: 55, market: 72, confidence: 45, switching: 38, channel: 45 }, composite: 5.8, verdict: 'failed' },
    { persona: 's05', brand: 'Pilot', scores: { identity: 35, market: 58, confidence: 30, switching: 30, channel: 42 }, composite: 4.2, verdict: 'failed' },
  ];

  var dimColors = { identity: '#a29bfe', market: '#74b9ff', confidence: '#f0c27a', switching: '#e17055', channel: '#10b981' };
  var dimLabels = { identity: 'Identity', market: 'Market', confidence: 'Confidence', switching: 'Switching', channel: 'Channel' };

  function findPersona(id) {
    for (var i = 0; i < personas.length; i++) { if (personas[i].id === id) return personas[i]; }
    return null;
  }

  var scoringRunning = false;

  scoreBtn.addEventListener('click', function() {
    if (scoringRunning) return;
    scoringRunning = true;
    scoreBtn.disabled = true;
    runScoringAnimation();
  });

  function runScoringAnimation() {
    scoringPanel.innerHTML = '';
    scoringPanel.classList.add('visible');

    // Header
    var header = document.createElement('div');
    header.className = 's1-scoring-header';
    header.innerHTML = '<h3>Brand Creation Selection</h3><span class="s1-scoring-status">Evaluating...</span>';
    scoringPanel.appendChild(header);

    var statusEl = header.querySelector('.s1-scoring-status');

    // Terminal
    var terminal = document.createElement('div');
    terminal.className = 's1-scoring-terminal';
    scoringPanel.appendChild(terminal);

    // Rows container
    var rowsContainer = document.createElement('div');
    rowsContainer.className = 's1-scoring-rows';
    scoringPanel.appendChild(rowsContainer);

    // Build rows (hidden initially)
    var rowEls = [];
    var compositeEls = [];
    var badgeEls = [];
    var barFills = [];

    scoringCandidates.forEach(function(c) {
      var p = findPersona(c.persona);
      var row = document.createElement('div');
      row.className = 's1-scoring-row';

      var nameCell = document.createElement('div');
      var pipeClass = p ? p.pipe : 'micro';
      var pipeColor = PIPE_COLORS[pipeClass] || '#74b9ff';
      nameCell.innerHTML = '<span class="s1-scoring-row-name">' + esc(p ? p.name : c.persona) + '</span>' +
        '<span class="s1-scoring-row-pipe" style="color:' + pipeColor + ';background:' + pipeColor + '15;border:1px solid ' + pipeColor + '30;">' + (p ? PIPE_LABELS[p.pipe] : '') + '</span>';

      var barsCell = document.createElement('div');
      barsCell.className = 's1-scoring-row-bars';
      var fills = {};
      Object.keys(dimColors).forEach(function(dim) {
        var group = document.createElement('div');
        group.className = 's1-scoring-bar-group';
        group.title = dimLabels[dim] + ': ' + c.scores[dim] + '%';
        var track = document.createElement('div');
        track.className = 's1-scoring-bar-track';
        var fill = document.createElement('div');
        fill.className = 's1-scoring-bar-fill';
        fill.style.background = dimColors[dim];
        track.appendChild(fill);
        group.appendChild(track);
        barsCell.appendChild(group);
        fills[dim] = fill;
      });

      var compCell = document.createElement('div');
      compCell.className = 's1-scoring-composite';
      compCell.textContent = '—';

      var badgeCell = document.createElement('div');
      badgeCell.className = 's1-scoring-badge';
      badgeCell.textContent = c.brand !== '—' ? c.brand : '—';

      row.appendChild(nameCell);
      row.appendChild(barsCell);
      row.appendChild(compCell);
      row.appendChild(badgeCell);
      rowsContainer.appendChild(row);

      rowEls.push(row);
      compositeEls.push(compCell);
      badgeEls.push(badgeCell);
      barFills.push(fills);
    });

    // Verdict area
    var verdict = document.createElement('div');
    verdict.className = 's1-scoring-verdict';
    verdict.innerHTML = '<div class="s1-scoring-verdict-icon">&#10003;</div>' +
      '<div class="s1-scoring-verdict-text">' +
      '<h4>Specter selected as primary brand candidate</h4>' +
      '<p>Highest composite score (8.4) driven by exceptional identity intensity and switching readiness. 6 brands total passed threshold for Brand Creation pipeline.</p>' +
      '</div>';
    scoringPanel.appendChild(verdict);

    // Terminal lines
    var termLines = [
      'Initializing brand creation selection model...',
      'Loading <span class="s1-term-accent">' + scoringCandidates.length + ' persona candidates</span> from pipeline output',
      'Scoring dimensions: Identity Intensity (25%) · Market Size (20%) · Confidence (20%) · Switching Readiness (20%) · Channel Fit (15%)',
      'Running composite scoring across all candidates...',
      'Applying brand viability threshold: <span class="s1-term-accent">composite ≥ 6.0</span>',
    ];

    var delay = 0;

    // Phase 1: Terminal typing
    termLines.forEach(function(line, i) {
      setTimeout(function() {
        var lineEl = document.createElement('div');
        lineEl.className = 's1-term-line';
        lineEl.innerHTML = '> ' + line;
        terminal.appendChild(lineEl);
        terminal.scrollTop = terminal.scrollHeight;
      }, delay);
      delay += 600;
    });

    // Phase 2: Reveal rows one by one with bar animations
    delay += 400;
    scoringCandidates.forEach(function(c, i) {
      var revealDelay = delay + i * 500;

      // Reveal row
      setTimeout(function() {
        rowEls[i].classList.add('revealed');

        // Terminal update
        var p = findPersona(c.persona);
        var lineEl = document.createElement('div');
        lineEl.className = 's1-term-line';
        lineEl.innerHTML = '> Scoring: <span class="s1-term-accent">' + esc(p ? p.name : c.persona) + '</span> → ' + c.composite.toFixed(1);
        terminal.appendChild(lineEl);
        terminal.scrollTop = terminal.scrollHeight;
      }, revealDelay);

      // Animate bars
      setTimeout(function() {
        Object.keys(dimColors).forEach(function(dim) {
          barFills[i][dim].style.width = c.scores[dim] + '%';
        });
      }, revealDelay + 100);

      // Show composite score
      setTimeout(function() {
        compositeEls[i].textContent = c.composite.toFixed(1);
        compositeEls[i].classList.add('scored');
        if (i === 0) compositeEls[i].classList.add('top');

        // Show verdict badge
        badgeEls[i].classList.add(c.verdict);
      }, revealDelay + 800);
    });

    // Phase 3: Final verdict
    var finalDelay = delay + scoringCandidates.length * 500 + 1200;
    setTimeout(function() {
      // Highlight winner row
      rowEls[0].classList.add('winner');

      // Terminal verdict
      var lineEl = document.createElement('div');
      lineEl.className = 's1-term-line';
      lineEl.innerHTML = '> <span class="s1-term-accent">Selection complete.</span> 6 brands passed threshold. Specter leads with composite 8.4.';
      terminal.appendChild(lineEl);
      terminal.scrollTop = terminal.scrollHeight;

      statusEl.textContent = 'Complete';
    }, finalDelay);

    setTimeout(function() {
      verdict.classList.add('visible');
      verdict.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, finalDelay + 500);

    setTimeout(function() {
      scoringRunning = false;
    }, finalDelay + 800);
  }

  // ─── INITIAL RENDER ─────────────────────────────────────────────────────────

  renderGrid();      // populate grid so the toggle is instant
  setView('map');    // start on the node map
}
