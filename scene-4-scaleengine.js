// scene-4-scaleengine.js — Launch Demo (Scene 4)
// Exports: window.initScene4(container)

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     CONSTANTS
     ═══════════════════════════════════════════ */

  const STAGES = [
    { key: 'input',      number: '01', title: 'Input & Extraction',   subtitle: 'Persona brief parsed into deterministic schema' },
    { key: 'risk',       number: '02', title: 'Launch Risk & Strategy', subtitle: 'Risk scan + the one decision FDT left open' },
    { key: 'plan',       number: '03', title: 'Launch Plan',          subtitle: 'Critical path — agent tasks, human tasks, gates' },
    { key: 'generation', number: '04', title: 'Artifact Review',      subtitle: '9 artifacts generated — human checkpoint before deploy' },
    { key: 'deploy',     number: '05', title: 'Deploy',               subtitle: 'Risk clearance gate, file write, bot connect' },
  ];

  /* ═══════════════════════════════════════════
     STYLES
     ═══════════════════════════════════════════ */

  function injectStyles() {
    if (document.getElementById('scene4-styles')) return;
    const style = document.createElement('style');
    style.id = 'scene4-styles';
    style.textContent = `
      .scene4 {
        display: flex;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #fff;
      }

      /* ── Sidebar ── */
      .scene4 .s4-sidebar {
        width: 280px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(38,38,38,0.5);
        overflow: hidden;
      }

      .scene4 .s4-sidebar-brand {
        padding: 24px 20px 16px;
      }

      .scene4 .s4-sidebar-brand .s4-label {
        display: block;
        margin-bottom: 8px;
      }

      .scene4 .s4-sidebar-brand .s4-brand-name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
      }

      .scene4 .s4-play-area {
        padding: 0 20px 20px;
      }

      .scene4 .s4-play-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 8px 0;
        background: #fff;
        color: #000;
        font-size: 14px;
        font-weight: 500;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.15s;
      }
      .scene4 .s4-play-btn:hover {
        background: #e5e5e5;
      }

      /* Timeline */
      .scene4 .s4-timeline {
        flex: 1;
        overflow-y: auto;
        padding: 0 12px;
      }

      .scene4 .s4-timeline-inner {
        position: relative;
      }

      .scene4 .s4-track {
        position: absolute;
        left: 19px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: rgba(38,38,38,0.6);
      }

      .scene4 .s4-track-fill {
        position: absolute;
        left: 19px;
        top: 0;
        width: 1px;
        background: rgba(52,211,153,0.4);
        transition: height 0.5s ease-out;
      }

      .scene4 .s4-node-btn {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        width: 100%;
        text-align: left;
        padding: 12px 8px;
        border-radius: 8px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.15s;
      }
      .scene4 .s4-node-btn:hover {
        background: rgba(38,38,38,0.15);
      }
      .scene4 .s4-node-btn.active {
        background: rgba(38,38,38,0.3);
      }

      .scene4 .s4-node-dot {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
      }
      .scene4 .s4-node-dot.past {
        background: rgba(52,211,153,0.3);
        border: 1px solid rgba(52,211,153,0.4);
      }
      .scene4 .s4-node-dot.active-dot {
        background: #fff;
        box-shadow: 0 0 20px rgba(255,255,255,0.2);
      }
      .scene4 .s4-node-dot.future {
        background: #262626;
        border: 1px solid #404040;
      }

      .scene4 .s4-node-dot .dot-inner {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #000;
      }

      .scene4 .s4-node-dot .dot-number {
        font-size: 8px;
        font-family: 'JetBrains Mono', monospace;
        color: #525252;
      }

      .scene4 .s4-node-label {
        min-width: 0;
        padding-top: 2px;
      }
      .scene4 .s4-node-title {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #525252;
      }
      .scene4 .s4-node-title.active-title { color: #fff; }
      .scene4 .s4-node-title.past-title { color: #a3a3a3; }

      .scene4 .s4-node-sub {
        font-size: 11px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #525252;
      }
      .scene4 .s4-node-sub.active-sub { color: #a3a3a3; }

      /* Bottom counter */
      .scene4 .s4-counter {
        padding: 16px 20px;
        border-top: 1px solid rgba(38,38,38,0.5);
      }

      .scene4 .s4-counter-val {
        font-size: 14px;
        font-family: 'JetBrains Mono', monospace;
        color: #fff;
        font-variant-numeric: tabular-nums;
      }

      .scene4 .s4-slider {
        margin-top: 12px;
        width: 100%;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: #262626;
        border-radius: 9999px;
        cursor: pointer;
        outline: none;
      }
      .scene4 .s4-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
      }

      /* ── Main Content ── */
      .scene4 .s4-main {
        flex: 1;
        overflow-y: auto;
      }

      .scene4 .s4-content {
        max-width: 896px;
        margin: 0 auto;
        padding: 48px 40px;
      }

      /* ── Labels ── */
      .scene4 .s4-label {
        font-size: 10px;
        font-family: 'JetBrains Mono', monospace;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: #525252;
      }

      /* ── Stage Header ── */
      .scene4 .s4-stage-header {
        margin-bottom: 32px;
      }
      .scene4 .s4-stage-number {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #555;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        margin-bottom: 8px;
      }
      .scene4 .s4-stage-title {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 36px;
        font-weight: 400;
        color: #fff;
        letter-spacing: -0.02em;
      }

      /* ── Card ── */
      .scene4 .s4-card {
        background: rgba(23,23,23,0.4);
        border: 1px solid rgba(38,38,38,0.8);
        border-radius: 12px;
        overflow: hidden;
      }

      /* ── Terminal Chrome ── */
      .scene4 .s4-terminal-chrome {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(38,38,38,0.6);
      }
      .scene4 .s4-terminal-dots {
        display: flex;
        gap: 6px;
      }
      .scene4 .s4-terminal-dots span {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .scene4 .s4-terminal-filename {
        font-size: 10px;
        font-family: 'JetBrains Mono', monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #404040;
        margin-left: 8px;
      }

      /* ── Annotation ── */
      .scene4 .s4-annotation {
        margin-top: 32px;
        padding-left: 16px;
        border-left: 2px solid rgba(64,64,64,0.4);
        opacity: 0;
        transform: translateX(-8px);
        animation: s4FadeInRight 0.4s ease-out 0.6s forwards;
      }
      .scene4 .s4-annotation-badge {
        display: inline-block;
        margin-bottom: 6px;
        padding: 2px 8px;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        font-family: 'JetBrains Mono', monospace;
        color: #737373;
        background: rgba(64,64,64,0.4);
        border-radius: 4px;
      }
      .scene4 .s4-annotation p {
        color: #737373;
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
      }

      /* ── Animations ── */
      @keyframes s4FadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes s4FadeInRight {
        from { opacity: 0; transform: translateX(-8px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes s4BlurIn {
        from { opacity: 0; transform: scale(0.9); filter: blur(16px); }
        to   { opacity: 1; transform: scale(1); filter: blur(0px); }
      }
      @keyframes s4Ping {
        75%, 100% { transform: scale(2); opacity: 0; }
      }
      @keyframes s4Spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes s4BarFill {
        from { width: 0%; }
      }

      .scene4 .s4-fade-in {
        opacity: 0;
        animation: s4FadeIn 0.5s ease-out forwards;
      }

      /* ── Status badges ── */
      .scene4 .s4-badge {
        padding: 2px 8px;
        font-size: 10px;
        font-family: 'JetBrains Mono', monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-radius: 4px;
      }
      .scene4 .s4-badge-pass { color: #34d399; background: rgba(52,211,153,0.1); }
      .scene4 .s4-badge-warn { color: #fbbf24; background: rgba(251,191,36,0.1); }
      .scene4 .s4-badge-fatal { color: #f87171; background: rgba(248,113,113,0.1); }

      /* ── Pills ── */
      .scene4 .s4-pill {
        display: inline-block;
        padding: 4px 12px;
        font-size: 12px;
        color: #d4d4d4;
        background: rgba(38,38,38,0.6);
        border: 1px solid rgba(64,64,64,0.5);
        border-radius: 9999px;
      }

      /* ── Option pills (decisions) ── */
      .scene4 .s4-option {
        display: inline-block;
        padding: 4px 12px;
        font-size: 12px;
        border-radius: 9999px;
        transition: all 0.3s;
        color: #525252;
        background: transparent;
        border: 1px solid rgba(64,64,64,0.5);
      }
      .scene4 .s4-option.selected {
        color: #000;
        background: #fff;
        border-color: #fff;
      }

      /* ── Progress bar ── */
      .scene4 .s4-progress-track {
        height: 4px;
        background: #262626;
        border-radius: 9999px;
        overflow: hidden;
      }
      .scene4 .s4-progress-fill {
        height: 100%;
        background: rgba(255,255,255,0.6);
        border-radius: 9999px;
        transition: width 0.1s linear;
      }

      /* ── Confidence bar ── */
      .scene4 .s4-confidence-track {
        height: 8px;
        background: #262626;
        border-radius: 9999px;
        overflow: hidden;
      }
      .scene4 .s4-confidence-fill {
        height: 100%;
        background: #fff;
        border-radius: 9999px;
        width: 0%;
        transition: width 0.8s ease-out;
      }

      /* ── Grid layouts ── */
      .scene4 .s4-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .scene4 .s4-grid-4 {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        text-align: center;
      }

      /* ── Live pulse ── */
      .scene4 .s4-pulse-container {
        position: relative;
        display: inline-flex;
        width: 8px;
        height: 8px;
      }
      .scene4 .s4-pulse-ping {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #34d399;
        opacity: 0.75;
        animation: s4Ping 1s cubic-bezier(0,0,0.2,1) infinite;
      }
      .scene4 .s4-pulse-dot {
        position: relative;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #34d399;
      }

      /* ── Spinner ── */
      .scene4 .s4-spinner {
        width: 8px;
        height: 8px;
        border-top: 1px solid #525252;
        border-radius: 50%;
        animation: s4Spin 0.6s linear infinite;
      }

      /* ── Gantt Timeline ── */
      .scene4 .s4-gantt {
        position: relative;
        overflow-x: auto;
        margin-bottom: 24px;
      }
      .scene4 .s4-gantt-lane-label {
        font-size: 10px;
        font-family: 'JetBrains Mono', monospace;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #525252;
        padding: 6px 0 4px;
        border-bottom: 1px solid rgba(38,38,38,0.5);
        margin-bottom: 4px;
      }
      .scene4 .s4-gantt-row {
        position: relative;
        height: 28px;
        display: flex;
        align-items: center;
      }
      .scene4 .s4-gantt-bar {
        position: absolute;
        height: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        font-size: 10px;
        font-family: 'JetBrains Mono', monospace;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        transition: filter 0.15s, transform 0.15s;
      }
      .scene4 .s4-gantt-bar:hover {
        filter: brightness(1.3);
        transform: scaleY(1.15);
        z-index: 5;
      }
      .scene4 .s4-gantt-bar.bar-agent {
        background: rgba(52,211,153,0.25);
        border: 1px solid rgba(52,211,153,0.5);
        color: #34d399;
      }
      .scene4 .s4-gantt-bar.bar-human {
        background: rgba(251,191,36,0.15);
        border: 1px solid rgba(251,191,36,0.4);
        color: #fbbf24;
      }
      .scene4 .s4-gantt-bar.bar-gate {
        background: rgba(248,113,113,0.15);
        border: 1px solid rgba(248,113,113,0.4);
        color: #f87171;
      }
      .scene4 .s4-gantt-bar.bar-decision {
        background: rgba(245,158,11,0.15);
        border: 1px solid rgba(245,158,11,0.4);
        color: #f59e0b;
      }
      .scene4 .s4-gantt-bar.on-critical-path {
        box-shadow: 0 0 10px rgba(52,211,153,0.35);
        border-color: rgba(52,211,153,0.8);
      }
      .scene4 .s4-gantt-tooltip {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        padding: 12px 16px;
        background: rgba(23,23,23,0.95);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.5);
        backdrop-filter: blur(8px);
        font-size: 12px;
        min-width: 240px;
        max-width: 380px;
        white-space: normal;
      }
      .scene4 .s4-gantt-legend {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
      }
      .scene4 .s4-gantt-legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        font-family: 'JetBrains Mono', monospace;
        color: #525252;
      }
      .scene4 .s4-gantt-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 2px;
      }
      .scene4 .s4-gantt-day-header {
        display: flex;
        font-size: 9px;
        font-family: 'JetBrains Mono', monospace;
        color: #404040;
        margin-bottom: 4px;
      }
      .scene4 .s4-gantt-summary {
        display: flex;
        gap: 24px;
        padding: 16px 0;
        border-top: 1px solid rgba(38,38,38,0.5);
        margin-top: 16px;
      }
      .scene4 .s4-gantt-summary-stat {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════ */

  function el(tag, attrs, ...children) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === 'style' && typeof v === 'object') {
          Object.assign(e.style, v);
        } else if (k === 'className') {
          e.className = v;
        } else if (k.startsWith('on')) {
          e.addEventListener(k.slice(2).toLowerCase(), v);
        } else {
          e.setAttribute(k, v);
        }
      }
    }
    for (const c of children) {
      if (c == null) continue;
      if (typeof c === 'string' || typeof c === 'number') {
        e.appendChild(document.createTextNode(String(c)));
      } else if (Array.isArray(c)) {
        c.forEach(ch => ch && e.appendChild(ch));
      } else {
        e.appendChild(c);
      }
    }
    return e;
  }

  function svgEl(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function stageHeader(number, title) {
    const wrap = el('div', { className: 's4-stage-header' });
    wrap.appendChild(el('div', { className: 's4-stage-number' }, 'Stage ' + number));
    wrap.appendChild(el('div', { className: 's4-stage-title' }, title));
    return wrap;
  }

  function annotation(text) {
    const a = el('div', { className: 's4-annotation' },
      el('span', { className: 's4-annotation-badge' }, 'AI decided'),
      el('p', null, text)
    );
    return a;
  }

  function card(attrs, ...children) {
    return el('div', { className: 's4-card ' + (attrs?.className || ''), style: attrs?.style }, ...children);
  }

  function terminalCard(filename, ...contentChildren) {
    return card(null,
      el('div', { className: 's4-terminal-chrome' },
        el('div', { className: 's4-terminal-dots' },
          el('span', { style: { background: 'rgba(239,68,68,0.4)' } }),
          el('span', { style: { background: 'rgba(234,179,8,0.4)' } }),
          el('span', { style: { background: 'rgba(34,197,94,0.4)' } })
        ),
        el('span', { className: 's4-terminal-filename' }, filename)
      ),
      el('div', { style: { padding: '24px', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', lineHeight: '1.6' } }, ...contentChildren)
    );
  }

  function makeCheckSvg(size, color) {
    return svgEl(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="${size === 12 ? 'M2.5 6L5 8.5L9.5 3.5' : size === 14 ? 'M3 7L6 10L11 4' : 'M5 13l4 4L19 7'}" stroke="${color}" stroke-width="${size <= 14 ? '1.5' : '2.5'}" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`);
  }

  /* ═══════════════════════════════════════════
     STAGE BUILDERS
     ═══════════════════════════════════════════ */

  function buildStageInput() {
    // Combined Input + Brief Extraction
    const fields = [
      { key: 'slug', value: 'specter' },
      { key: 'assistant_name', value: 'Specter' },
      { key: 'audience', value: 'Privacy-conscious professionals, 25-50' },
      { key: 'plan_price', value: '$55/mo' },
      { key: 'value_add', value: 'E2E encrypted calls, zero-knowledge accounts' },
      { key: 'carrier', value: 'T-Mobile (ConnectX)' },
    ];
    const traits = ['dark', 'nocturnal', 'technical'];

    const brandName = el('h2', {
      style: {
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontSize: '80px',
        fontWeight: '300',
        letterSpacing: '-0.01em',
        color: '#fff',
        textAlign: 'center',
        margin: '0 0 12px',
        animation: 's4BlurIn 0.8s ease-out forwards',
      }
    }, 'Specter');

    const tagline = el('p', {
      style: {
        textAlign: 'center',
        fontSize: '18px',
        fontStyle: 'italic',
        color: '#525252',
        marginBottom: '40px',
        opacity: '0',
        animation: 's4FadeIn 0.5s ease-out 0.4s forwards',
      }
    }, 'Invisibility is not a feature. It\u2019s the architecture.');

    // Fields grid
    const fieldEls = fields.map((f, i) => {
      const d = el('div', {
        style: { opacity: '0', animation: `s4FadeInRight 0.3s ease-out ${0.6 + i * 0.1}s forwards` }
      },
        el('div', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em', color: '#404040' } }, f.key),
        el('div', { style: { fontSize: '14px', color: '#d4d4d4' } }, f.value)
      );
      return d;
    });

    const fieldsCard = card({ style: { padding: '20px', marginBottom: '24px' } },
      el('span', { className: 's4-label', style: { display: 'block', marginBottom: '16px', color: '#404040' } }, 'Extracted brief \u2014 21-rule prompt'),
      el('div', { className: 's4-grid-2', style: { gap: '12px 32px' } }, fieldEls)
    );
    fieldsCard.style.opacity = '0';
    fieldsCard.style.animation = 's4FadeIn 0.5s ease-out 0.5s forwards';

    // Trait pills
    const traitContainer = el('div', { style: { marginBottom: '24px', opacity: '0', animation: 's4FadeIn 0.4s ease-out 0.7s forwards' } },
      el('span', { className: 's4-label', style: { display: 'block', marginBottom: '12px', color: '#404040' } }, 'Personality'),
      el('div', { style: { display: 'flex', gap: '8px' } },
        traits.map((t, i) => {
          const pill = el('span', { className: 's4-pill', style: { opacity: '0', animation: `s4FadeIn 0.3s ease-out ${0.8 + i * 0.1}s forwards` } }, t);
          return pill;
        })
      )
    );

    // Classification
    const classCard = card({ style: { padding: '20px', marginBottom: '24px', opacity: '0', animation: 's4FadeIn 0.4s ease-out 1s forwards' } },
      el('span', { className: 's4-label', style: { display: 'block', marginBottom: '12px', color: '#404040' } }, 'Segment classification'),
      el('div', { style: { color: '#fff', fontSize: '18px', fontFamily: "'JetBrains Mono', monospace", marginBottom: '12px' } }, 'IDENTITY_SPECIFIC'),
      el('div', { style: { display: 'flex', gap: '16px' } },
        el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#525252' } }, '8.1M addressable'),
        el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#525252' } }, 'Evergreen demand'),
        el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#525252' } }, 'Privacy awareness accelerating')
      )
    );

    const wrapper = el('div', { className: 's4-fade-in' },
      stageHeader('01', 'Input & Extraction'),
      el('p', { style: { color: '#a3a3a3', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px', maxWidth: '560px' } },
        'A validated persona brief from Fake Door Testing enters the engine. 21 extraction rules parse it into a deterministic schema \u2014 every downstream decision cascades from this single input.'
      ),
      terminalCard('persona_research_specter.md',
        el('p', { style: { color: '#fff', marginBottom: '12px' } }, '# Specter \u2014 Privacy-First Mobile'),
        el('p', { style: { color: '#a3a3a3', marginBottom: '12px' } },
          'Target: Privacy-conscious professionals and OPSEC enthusiasts aged 25-50 who actively manage their digital footprint. They currently suffer from invasive carrier tracking, SIM-swap attacks, and lack of encryption at the network layer.'
        ),
        el('p', { style: { color: '#a3a3a3', marginBottom: '12px' } },
          'Value-add: End-to-end encrypted calls, hardware-backed SIM security, automatic VPN routing, and zero-knowledge account management with no identity verification required.'
        ),
        el('p', { style: { color: '#525252', marginBottom: '8px' } }, 'Tone: Dark, nocturnal, technical.'),
        el('p', { style: { color: '#525252', marginBottom: '8px' } }, 'Price point: $55/month premium positioning.'),
        el('p', { style: { color: '#525252' } }, 'Carrier: AT&T via ConnectX infrastructure.')
      ),
      el('div', { style: { textAlign: 'center', margin: '32px 0 40px' } }, brandName, tagline),
      fieldsCard,
      traitContainer,
      classCard,
      annotation('21 extraction rules coerce LLM output into a deterministic BrandBrief schema. Field normalization handles common mismatches \u2014 name\u2192brand_name, price\u2192plan_price.')
    );
    return wrapper;
  }

  function buildStageLaunchRisk() {
    // Risk Assessment — FDT-validated where applicable
    const risks = [
      { name: 'Value Risk', status: 'PASS', detail: 'Clear problem-solution fit for privacy/surveillance pain point', type: 'auto-evaluated' },
      { name: 'Feasibility Risk', status: 'PASS', detail: 'ConnectX eSIM + VPN routing technically validated', type: 'auto-evaluated' },
      { name: 'Viability Risk', status: 'PASS', detail: 'Privacy-first mobile is an accelerating, underserved niche', type: 'auto-evaluated' },
      { name: 'Commercial Risk', status: 'PASS', detail: 'FDT: WTP signal $45\u201355/mo, price sensitivity LOW (2.3x above avg. premium tolerance). Recommended $49/mo.', type: 'fdt-validated' },
      { name: 'Channel Risk', status: 'PASS', detail: 'FDT: r/Privacy, OPSEC communities, Signal/Telegram (lowest CPL). Broad Meta 3.2x more expensive \u2014 avoid.', type: 'fdt-validated' },
      { name: 'Trust Risk', status: 'WARNING', detail: 'Privacy audience needs day-1 credibility proof point \u2014 security audit or open-source transparency', type: 'requires-action' },
      { name: 'Timing Risk', status: 'PASS', detail: 'Evergreen demand \u2014 privacy awareness growing post-regulation', type: 'auto-evaluated' },
    ];

    const passCount = risks.filter(r => r.status === 'PASS').length;
    const warnCount = risks.filter(r => ['WARNING', 'GAP', 'TIGHT'].includes(r.status)).length;
    const fatalCount = risks.filter(r => r.status === 'FATAL').length;

    function badgeClass(status) {
      if (status === 'PASS') return 's4-badge s4-badge-pass';
      if (['WARNING', 'GAP', 'TIGHT'].includes(status)) return 's4-badge s4-badge-warn';
      if (status === 'FATAL') return 's4-badge s4-badge-fatal';
      return 's4-badge';
    }

    const riskCards = risks.map((r, i) =>
      card({ style: { padding: '16px', opacity: '0', animation: `s4FadeIn 0.4s ease-out ${0.2 + i * 0.08}s forwards` } },
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
          el('span', { style: { fontSize: '14px', fontWeight: '500', color: '#fff' } }, r.name),
          el('span', { className: badgeClass(r.status) }, r.status)
        ),
        el('p', { style: { fontSize: '12px', color: '#525252', lineHeight: '1.5' } }, r.detail),
        el('p', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#404040', marginTop: '8px' } }, r.type)
      )
    );

    const summaryDelay = 0.2 + risks.length * 0.08;
    const summaryCard = card({ style: { padding: '16px', marginBottom: '24px', opacity: '0', animation: `s4FadeIn 0.4s ease-out ${summaryDelay}s forwards` } },
      el('div', { style: { display: 'flex', gap: '24px', marginBottom: '8px' } },
        el('span', { style: { fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", color: '#34d399' } }, passCount + ' passed'),
        el('span', { style: { fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", color: '#fbbf24' } }, warnCount + ' requires action'),
        el('span', { style: { fontSize: '14px', fontFamily: "'JetBrains Mono', monospace", color: '#f87171' } }, fatalCount + ' fatal')
      ),
      el('p', { style: { fontSize: '12px', color: '#a3a3a3' } }, 'No fatal blockers. One risk dimension requires an operator decision before launch planning can proceed.')
    );

    // Compliance section
    const complianceItems = [
      { label: 'TCPA', desc: 'N/A \u2014 no telemarketing component' },
      { label: 'Medical Claims', desc: 'N/A \u2014 no health advice' },
      { label: 'Financial Services', desc: 'N/A \u2014 no payment or lending features' },
      { label: 'Encryption Export', desc: 'Reviewed \u2014 standard TLS/VPN, no novel cryptography' },
      { label: 'Data Retention', desc: 'Zero-knowledge architecture \u2014 no PII stored' },
    ];

    const complianceDelay = summaryDelay + 0.15;
    const complianceHeader = el('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', opacity: '0', animation: `s4FadeIn 0.4s ease-out ${complianceDelay}s forwards` } },
      el('span', { style: { fontSize: '14px', fontWeight: '500', color: '#fff' } }, 'Compliance Scan'),
      el('span', { style: { fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", padding: '2px 8px', borderRadius: '4px', background: 'rgba(52,211,153,0.15)', color: '#34d399' } }, 'CLEAR')
    );

    const checklistEls = complianceItems.map((item, i) =>
      el('div', {
        className: 's4-card',
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          marginBottom: '8px',
          opacity: '0',
          animation: `s4FadeIn 0.3s ease-out ${complianceDelay + 0.05 + i * 0.06}s forwards`
        }
      },
        el('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', flexShrink: '0' } }),
        el('span', { style: { fontSize: '12px', fontWeight: '500', color: '#d4d4d4', width: '128px', flexShrink: '0' } }, item.label),
        el('span', { style: { fontSize: '12px', color: '#525252' } }, item.desc)
      )
    );

    // Trust Risk Decision — the only open decision
    const trustDelay = complianceDelay + 0.4;
    const trustOptionEls = [];

    const trustOptions = ['Security Audit', 'Influencer Seeding'];
    const trustBtns = trustOptions.map((opt, oi) => {
      const btn = el('span', { className: 's4-option' }, opt);
      trustOptionEls.push(btn);
      return btn;
    });

    const trustDecision = card({ style: { padding: '20px', marginBottom: '24px', opacity: '0', animation: `s4FadeIn 0.4s ease-out ${trustDelay}s forwards`, borderColor: 'rgba(251,191,36,0.3)' } },
      el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' } },
        el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '4px', background: 'rgba(251,191,36,0.1)', color: '#fbbf24' } }, 'Operator Decision Required'),
      ),
      el('h3', { style: { color: '#fff', fontSize: '16px', fontWeight: '500', marginBottom: '8px' } }, 'Trust Signal Strategy'),
      el('p', { style: { color: '#a3a3a3', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' } },
        'FDT validates demand ($49/mo, privacy-first channels) but this audience won\u2019t convert without a day-1 credibility signal. This is the only risk dimension FDT couldn\u2019t resolve \u2014 it requires a strategic choice.'
      ),
      el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' } },
        card({ style: { padding: '14px' } },
          el('div', { style: { fontSize: '13px', fontWeight: '500', color: '#fff', marginBottom: '6px' } }, 'Security Audit'),
          el('p', { style: { fontSize: '11px', color: '#525252', lineHeight: '1.5' } }, 'Commission third-party pentest, publish results on GitHub. High credibility, +10 days to critical path.'),
        ),
        card({ style: { padding: '14px' } },
          el('div', { style: { fontSize: '13px', fontWeight: '500', color: '#fff', marginBottom: '6px' } }, 'Influencer Seeding'),
          el('p', { style: { fontSize: '11px', color: '#525252', lineHeight: '1.5' } }, 'Privacy YouTuber / blogger early access. Faster but less durable. +5 days to critical path.'),
        ),
      ),
      el('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px' } }, trustBtns),
      el('p', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#404040' } }, 'trust_risk \u2192 requires-action \u2192 selection feeds into launch plan')
    );

    // Expert Assessment
    const confidenceBar = el('div', { className: 's4-confidence-track' },
      el('div', { className: 's4-confidence-fill' })
    );

    const expertDelay = trustDelay + 0.3;
    const expertCard = card({ style: { padding: '20px', marginBottom: '24px', opacity: '0', animation: `s4FadeIn 0.4s ease-out ${expertDelay}s forwards` } },
      el('p', { className: 's4-label', style: { marginBottom: '16px', color: '#404040' } }, 'Expert Assessment'),
      el('div', { style: { marginBottom: '16px' } },
        el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
          el('span', { style: { fontSize: '12px', color: '#a3a3a3' } }, 'Confidence'),
          el('span', { style: { fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: '#fff' } }, '0.87')
        ),
        confidenceBar
      ),
      el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' } },
        el('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' } }),
        el('span', { style: { fontSize: '14px', fontWeight: '500', color: '#fff' } }, 'READY')
      ),
      el('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          makeCheckSvg(14, '#34d399'),
          el('span', { style: { fontSize: '12px', color: '#a3a3a3' } }, 'Structural checks: 8/8 complete')
        ),
        el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          makeCheckSvg(14, '#34d399'),
          el('span', { style: { fontSize: '12px', color: '#a3a3a3' } }, 'Differentiation: Strong \u2014 underserved niche with clear value')
        )
      )
    );

    const wrapper = el('div', { className: 's4-fade-in' },
      stageHeader('02', 'Launch Risk & Strategy'),
      el('p', { style: { fontSize: '14px', color: '#a3a3a3', lineHeight: '1.6', marginBottom: '24px' } },
        'The engine scans 7 risk dimensions, cross-referencing FDT results. Validated risks are marked as passed. The one open dimension surfaces as an operator decision \u2014 its resolution feeds directly into the launch plan.'
      ),
      el('div', { className: 's4-grid-2', style: { marginBottom: '24px' } }, riskCards),
      summaryCard,
      complianceHeader,
      el('div', { style: { marginBottom: '24px' } }, checklistEls),
      trustDecision,
      expertCard,
      annotation('FDT collapses 6 of 7 risk dimensions before the operator sees them. Only trust risk requires a new decision. Once resolved, the engine has everything it needs to generate a launch plan with a real critical path.')
    );

    // Animate confidence bar
    requestAnimationFrame(() => {
      setTimeout(() => {
        const fill = confidenceBar.querySelector('.s4-confidence-fill');
        if (fill) fill.style.width = '87%';
      }, 600);
    });

    // Auto-select trust option
    setTimeout(() => {
      trustOptionEls[0].classList.add('selected');
    }, trustDelay * 1000 + 1200);

    return wrapper;
  }

  function buildStageLaunchPlan() {
    // ── Task data ──
    // Soft launch: ~3-day critical path. All artifacts are agent-generated (invariant layer)
    // with no human dependencies. Human tasks are post-launch (variant layer).
    // Lanes segmented by domain for clarity.
    const TASKS = [
      // Customer Journey — everything the customer touches
      { id: 'website',        name: 'Website & Landing',  lane: 'Customer Journey',      type: 'agent', days: 1, deps: [],                  description: 'Landing page fork, pricing page, design system' },
      { id: 'journey_config', name: 'Journey Config',     lane: 'Customer Journey',      type: 'agent', days: 1, deps: [],                  description: 'Onboarding steps, escalation rules, bot copy' },
      { id: 'faq',            name: 'FAQ & Objections',   lane: 'Customer Journey',      type: 'agent', days: 1, deps: [],                  description: 'Objection matrix, audience-specific Q&A' },
      { id: 'plan_config',    name: 'Plan Config',        lane: 'Customer Journey',      type: 'agent', days: 1, deps: [],                  description: 'eSIM config, data limits, pricing, Stripe product + payment wiring' },
      { id: 'legal_docs',     name: 'Legal Docs',         lane: 'Customer Journey',      type: 'agent', days: 1, deps: [],                  description: 'ToS, privacy policy, compliance scan — generated from brief' },
      { id: 'domain_dns',     name: 'Domain & DNS',       lane: 'Customer Journey',      type: 'human', days: 1, deps: ['website'],         description: 'Point brand domain to landing page' },

      // Support — bot and knowledge base
      { id: 'brand_voice',    name: 'Brand Voice',        lane: 'Support',               type: 'agent', days: 1, deps: [],                  description: 'Personality, tone, conversation starters' },
      { id: 'product_kb',     name: 'Product KB',         lane: 'Support',               type: 'agent', days: 1, deps: [],                  description: 'Features, troubleshooting, use cases' },
      { id: 'bot_deploy',     name: 'Bot Deploy',         lane: 'Support',               type: 'agent', days: 1, deps: ['brand_voice', 'journey_config'], description: 'Telegram webhook, escalation config, go live' },
      { id: 'unit_econ',      name: 'Unit Economics',     lane: 'Support',               type: 'agent', days: 1, deps: [],                  description: 'CAC, LTV, margin model at $49/mo' },

      // Launch Readiness — gates
      { id: 'esim_test',      name: 'eSIM Smoke Test',    lane: 'Launch Readiness',      type: 'human', days: 1, deps: ['plan_config'],     description: 'Verify activation on pre-provisioned test SIM' },
      { id: 'e2e_test',       name: 'E2E Journey Test',   lane: 'Launch Readiness',      type: 'gate',  days: 1, deps: ['journey_config', 'website', 'bot_deploy', 'domain_dns', 'esim_test'], description: 'Full signup \u2192 activation \u2192 first call' },
      { id: 'soft_launch',    name: 'Soft Launch',        lane: 'Launch Readiness',      type: 'gate',  days: 0, deps: ['e2e_test'],        description: 'Bot live, website live, first cohort can activate' },

      // Post-Launch: Legal & Compliance
      { id: 'eua',            name: 'Full EUA Review',    lane: 'Legal & Compliance',    type: 'human', days: 5, deps: ['soft_launch'],     description: 'Legal counsel review \u2014 soft launch uses generated template', postLaunch: true },
      { id: 'privacy_review', name: 'Privacy Counsel',    lane: 'Legal & Compliance',    type: 'human', days: 3, deps: ['soft_launch'],     description: 'External review of generated privacy policy', postLaunch: true },
      { id: 'security_audit', name: 'Security Audit',     lane: 'Legal & Compliance',    type: 'human', days: 7, deps: ['soft_launch'],     description: 'Third-party pentest \u2014 trust signal for scale', postLaunch: true },

      // Post-Launch: Carrier Ops
      { id: 'alpha_tag',      name: 'AT&T Alpha Tag',     lane: 'Carrier Ops',           type: 'human', days: 5, deps: ['soft_launch'],     description: 'Brand name on caller ID \u2014 cosmetic, not blocking', postLaunch: true },
      { id: 'esim_inventory', name: 'eSIM Inventory',     lane: 'Carrier Ops',           type: 'human', days: 3, deps: ['soft_launch'],     description: 'Bulk QR allocation for scale beyond test cohort', postLaunch: true },

      // Post-Launch: Growth & GTM
      { id: 'community_seed', name: 'Community Seeding',  lane: 'Growth & GTM',          type: 'human', days: 5, deps: ['soft_launch'],     description: 'r/Privacy, Signal/Telegram — FDT-validated channels', postLaunch: true },
      { id: 'affiliate',      name: 'Affiliate Outreach', lane: 'Growth & GTM',          type: 'human', days: 5, deps: ['soft_launch'],     description: 'Privacy bloggers, VPN review sites, commission structure', postLaunch: true },
      { id: 'influencer',     name: 'Influencer Partners',lane: 'Growth & GTM',          type: 'human', days: 7, deps: ['soft_launch'],     description: 'Creator outreach — privacy YouTubers, tech reviewers', postLaunch: true },
      { id: 'paid_ads',       name: 'Paid Ads Config',    lane: 'Growth & GTM',          type: 'human', days: 3, deps: ['soft_launch'],     description: 'Meta, Reddit, privacy-focused ad networks — targeting + creatives', postLaunch: true },
      { id: 'content_cal',    name: 'Content Calendar',   lane: 'Growth & GTM',          type: 'agent', days: 1, deps: ['soft_launch'],     description: 'Blog posts, social cadence, topic clusters from brief', postLaunch: true },
      { id: 'email_drip',     name: 'Email Drip',         lane: 'Growth & GTM',          type: 'agent', days: 1, deps: ['soft_launch'],     description: 'Welcome sequence, activation nudges, re-engagement flows', postLaunch: true },
      { id: 'monitoring',     name: 'Monitoring Setup',   lane: 'Growth & GTM',          type: 'human', days: 2, deps: ['soft_launch'],     description: 'Activation rate, churn, VPN usage dashboards', postLaunch: true },
    ];

    // ── Compute start days (topological sort) ──
    const taskMap = {};
    TASKS.forEach(t => { taskMap[t.id] = t; t.start = 0; });

    function resolveStart(task) {
      if (task._resolved) return task.start;
      if (task.deps.length === 0) { task._resolved = true; return 0; }
      task.start = Math.max(...task.deps.map(depId => {
        const dep = taskMap[depId];
        return resolveStart(dep) + dep.days;
      }));
      task._resolved = true;
      return task.start;
    }
    TASKS.forEach(t => resolveStart(t));

    const launchTasks = TASKS.filter(t => !t.postLaunch);
    const postTasks = TASKS.filter(t => t.postLaunch);
    const softLaunchDay = Math.max(...launchTasks.map(t => t.start + t.days));
    const totalDays = Math.max(...TASKS.map(t => t.start + t.days));

    // All pre-launch tasks are critical — if any slips, launch slips
    const criticalSet = new Set(launchTasks.map(t => t.id));

    // ── Lane ordering & colors ──
    const LANE_ORDER = ['Customer Journey', 'Support', 'Launch Readiness', 'Legal & Compliance', 'Carrier Ops', 'Growth & GTM'];
    const LANE_COLORS = {
      'Customer Journey': '#7c6af0',
      'Support': '#20b0d0',
      'Launch Readiness': '#40c060',
      'Legal & Compliance': '#6366f1',
      'Carrier Ops': '#f06040',
      'Growth & GTM': '#e8c840',
    };
    const POST_LANES = new Set(['Legal & Compliance', 'Carrier Ops', 'Growth & GTM']);

    const TYPE_COLORS = { agent: '#34d399', human: '#fbbf24', gate: '#f87171', decision: '#f59e0b' };
    const TYPE_LABELS = { agent: 'Agent', human: 'Human', gate: 'Gate', decision: 'Decision' };

    // ── Build Gantt ──
    const DAY_W = 56; // px per day
    const LABEL_W = 148;
    const gridWidth = totalDays * DAY_W;

    // Tooltip element (shared)
    const tooltipEl = el('div', { className: 's4-gantt-tooltip', style: { display: 'none' } });

    // Day headers
    const dayHeaders = el('div', { className: 's4-gantt-day-header', style: { marginLeft: LABEL_W + 'px', width: gridWidth + 'px' } });
    for (let d = 0; d < totalDays; d++) {
      const label = d < softLaunchDay ? 'D' + (d + 1) : (d === softLaunchDay ? '\u25b6 LIVE' : '+' + (d - softLaunchDay));
      const color = d < softLaunchDay ? '#a3a3a3' : (d === softLaunchDay ? '#34d399' : '#404040');
      dayHeaders.appendChild(el('span', { style: { width: DAY_W + 'px', textAlign: 'center', flexShrink: '0', color: color, fontWeight: d === softLaunchDay ? '600' : '400' } }, label));
    }

    // Day grid lines + soft launch marker
    const gridLines = el('div', { style: { position: 'absolute', top: '0', bottom: '0', left: LABEL_W + 'px', width: gridWidth + 'px', pointerEvents: 'none' } });
    for (let d = 0; d <= totalDays; d++) {
      const isSoftLaunch = d === softLaunchDay;
      gridLines.appendChild(el('div', {
        style: {
          position: 'absolute',
          left: (d * DAY_W) + 'px',
          top: '0',
          bottom: '0',
          width: isSoftLaunch ? '2px' : '1px',
          background: isSoftLaunch ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.03)',
        }
      }));
    }

    // Build lanes
    const lanesContainer = el('div', { style: { position: 'relative' } });
    lanesContainer.appendChild(gridLines);

    let animIdx = 0;
    LANE_ORDER.forEach(laneName => {
      const laneTasks = TASKS.filter(t => t.lane === laneName);
      if (laneTasks.length === 0) return;

      const isPostLane = POST_LANES.has(laneName);
      const laneLabel = el('div', { className: 's4-gantt-lane-label', style: { opacity: '0', animation: `s4FadeIn 0.3s ease-out ${0.3 + animIdx * 0.06}s forwards` } },
        el('span', { style: { color: LANE_COLORS[laneName] || '#525252' } }, laneName),
        isPostLane ? el('span', { style: { fontSize: '9px', color: '#404040', marginLeft: '8px', fontStyle: 'italic', textTransform: 'none', letterSpacing: '0' } }, 'post-launch') : null
      );
      lanesContainer.appendChild(laneLabel);

      laneTasks.forEach(task => {
        const isCritical = criticalSet.has(task.id);
        const isPost = task.postLaunch;
        const barClass = 's4-gantt-bar bar-' + task.type;
        const barLeft = LABEL_W + task.start * DAY_W + 2;
        const barWidth = Math.max(task.days * DAY_W - 4, 24);
        const delay = 0.4 + animIdx * 0.06;

        const bar = el('div', {
          className: barClass,
          style: {
            left: barLeft + 'px',
            width: '0px',
            top: '4px',
            opacity: '0',
          }
        }, task.days > 0 ? task.name : '\u25b6');

        if (isPost) {
          bar.style.opacity = '0';
          bar.style.borderStyle = 'dashed';
        }

        // Pre-launch at full brightness, post-launch dimmed
        const barOpacity = isPost ? '0.35' : '1';
        setTimeout(() => {
          bar.style.transition = 'width 0.5s ease-out, opacity 0.3s ease-out';
          bar.style.opacity = barOpacity;
          bar.style.width = barWidth + 'px';
        }, delay * 1000);

        // Hover tooltip
        bar.addEventListener('mouseenter', (e) => {
          bar.style.opacity = '1';
          tooltipEl.style.display = 'block';
          tooltipEl.innerHTML = '';
          tooltipEl.appendChild(el('div', { style: { fontWeight: '500', color: '#fff', marginBottom: '4px' } }, task.name));
          tooltipEl.appendChild(el('div', { style: { display: 'flex', gap: '12px', marginBottom: '6px' } },
            el('span', { style: { color: TYPE_COLORS[task.type] } }, TYPE_LABELS[task.type]),
            task.days > 0 ? el('span', { style: { color: '#525252' } }, task.days + (task.days === 1 ? ' day' : ' days')) : null,
            isCritical ? el('span', { style: { color: '#f87171' } }, '\u25cf critical path') : null,
            isPost ? el('span', { style: { color: '#525252', fontStyle: 'italic' } }, 'post-launch') : null
          ));
          tooltipEl.appendChild(el('div', { style: { color: '#a3a3a3', lineHeight: '1.4' } }, task.description));
          if (task.deps.length > 0) {
            tooltipEl.appendChild(el('div', { style: { color: '#404040', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", marginTop: '6px' } },
              'depends on: ' + task.deps.join(', ')
            ));
          }
          // Position anchored to bar
          var rect = bar.getBoundingClientRect();
          var tx = rect.right + 8;
          if (tx + 300 > window.innerWidth - 4) tx = rect.left - 308;
          if (tx < 4) tx = 4;
          tooltipEl.style.left = tx + 'px';
          tooltipEl.style.top = (rect.top - 4) + 'px';
        });
        bar.addEventListener('mouseleave', () => {
          bar.style.opacity = barOpacity;
          tooltipEl.style.display = 'none';
        });

        const row = el('div', { className: 's4-gantt-row', style: { position: 'relative' } });

        const taskLabel = el('div', {
          style: {
            width: LABEL_W + 'px',
            flexShrink: '0',
            fontSize: '11px',
            color: isPost ? '#404040' : '#a3a3a3',
            fontWeight: '400',
            paddingLeft: '8px',
            opacity: '0',
            animation: `s4FadeInRight 0.3s ease-out ${delay}s forwards`,
          }
        },
          el('span', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            el('span', { style: { width: '6px', height: '6px', borderRadius: '2px', background: isPost ? '#333' : TYPE_COLORS[task.type], flexShrink: '0' } }),
            task.name
          )
        );
        row.appendChild(taskLabel);
        row.appendChild(bar);
        lanesContainer.appendChild(row);
        animIdx++;
      });
    });

    // ── Legend ──
    const legend = el('div', { className: 's4-gantt-legend' },
      [
        { color: '#34d399', label: 'Agent (engine)' },
        { color: '#fbbf24', label: 'Human' },
        { color: '#f87171', label: 'Gate' },
        { color: '#404040', label: 'Post-launch', style: 'dashed' },
      ].map(l => el('div', { className: 's4-gantt-legend-item' },
        el('span', { className: 's4-gantt-legend-dot', style: { background: l.style === 'dashed' ? 'transparent' : l.color, border: l.style === 'dashed' ? '1px dashed ' + l.color : 'none' } }),
        l.label
      ))
    );

    // ── Summary stats ──
    const agentCount = TASKS.filter(t => t.type === 'agent' && !t.postLaunch).length;
    const humanLaunch = launchTasks.filter(t => t.type === 'human').length;
    const gateCount = launchTasks.filter(t => t.type === 'gate').length;

    const summarySection = el('div', { className: 's4-gantt-summary', style: { borderTop: 'none', marginTop: '0', paddingTop: '0', opacity: '0', animation: 's4FadeIn 0.4s ease-out 0.2s forwards' } },
      el('div', { className: 's4-gantt-summary-stat' },
        el('span', { style: { fontSize: '22px', fontFamily: "'JetBrains Mono', monospace", color: '#34d399' } }, agentCount + ' artifacts'),
        el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#525252', textTransform: 'uppercase' } }, 'Agent \u2014 day 1 (parallel)')
      ),
      el('div', { className: 's4-gantt-summary-stat' },
        el('span', { style: { fontSize: '22px', fontFamily: "'JetBrains Mono', monospace", color: '#fbbf24' } }, humanLaunch + ' task' + (humanLaunch > 1 ? 's' : '')),
        el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#525252', textTransform: 'uppercase' } }, 'Human (pre-launch)')
      ),
      el('div', { className: 's4-gantt-summary-stat' },
        el('span', { style: { fontSize: '22px', fontFamily: "'JetBrains Mono', monospace", color: '#f87171' } }, gateCount + ' gates'),
        el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#525252', textTransform: 'uppercase' } }, 'Must pass')
      ),
      el('div', { className: 's4-gantt-summary-stat' },
        el('span', { style: { fontSize: '22px', fontFamily: "'JetBrains Mono', monospace", color: '#fff' } }, softLaunchDay + ' days'),
        el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#525252', textTransform: 'uppercase' } }, 'To soft launch')
      )
    );

    // ── Critical path callout (phase-level, not individual tasks) ──
    const cpPhases = ['Artifact Generation', 'Web & Bot Deployment', 'E2E Journey Test', 'Soft Launch'];

    const cpCard = card({ style: { padding: '16px', marginBottom: '24px', borderColor: 'rgba(52,211,153,0.3)', opacity: '0', animation: 's4FadeIn 0.4s ease-out 0.3s forwards' } },
      el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' } },
        el('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' } }),
        el('span', { style: { fontSize: '12px', fontWeight: '500', color: '#fff' } }, 'Critical Path \u2014 ' + softLaunchDay + ' days to soft launch'),
      ),
      el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' } },
        cpPhases.map((name, i) => {
          const els = [el('span', { style: { fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#d4d4d4', padding: '2px 8px', background: 'rgba(52,211,153,0.1)', borderRadius: '4px' } }, name)];
          if (i < cpPhases.length - 1) {
            els.push(el('span', { style: { fontSize: '10px', color: '#404040', margin: '0 2px' } }, '\u2192'));
          }
          return els;
        }).flat()
      )
    );

    const wrapper = el('div', { className: 's4-fade-in' },
      stageHeader('03', 'Launch Plan'),
      el('p', { style: { fontSize: '14px', color: '#a3a3a3', lineHeight: '1.6', marginBottom: '24px' } },
        'Same engine, different brand. Agents generate all brand-specific artifacts on day 1. Post-launch tasks \u2014 legal, carrier, growth \u2014 run without blocking first activation.'
      ),
      summarySection,
      cpCard,
      legend,
      el('div', { className: 's4-gantt' },
        dayHeaders,
        lanesContainer,
      ),
      tooltipEl,
      annotation('The engine (pipeline, infra, tooling) is shared across every brand. Everything brand-specific \u2014 artifacts, legal docs, carrier config, GTM \u2014 is generated by agents in hours. Humans handle ops over days, post-launch. Critical path compresses to ' + softLaunchDay + ' days because agent work parallelizes completely.')
    );

    return wrapper;
  }


  function buildStageGeneration() {
    const artifacts = [
      { name: 'Website & Landing', filename: 'page-spec.json', description: 'Landing page fork, pricing page, design system',
        preview: '{\n  "brand": "Specter",\n  "pages": {\n    "landing": {\n      "hero": "Network-layer invisibility.",\n      "cta": "Get Specter",\n      "pricing": "$49/mo"\n    },\n    "design_system": {\n      "palette": "dark-cyber",\n      "font": "JetBrains Mono"\n    }\n  }\n}' },
      { name: 'Journey Config', filename: 'journey-config.yaml', description: 'Onboarding steps, escalation rules, bot copy',
        preview: 'onboarding:\n  steps:\n    - verify_email\n    - select_plan\n    - install_esim\n    - activate\n\nescalation:\n  timeout: 120s\n  fallback: human_agent\n\nbot_copy:\n  greeting: "Welcome to Specter."\n  tone: technical, direct' },
      { name: 'FAQ & Objections', filename: 'faq.md', description: 'Objection matrix, audience-specific Q&A',
        preview: '# FAQ \u2014 Specter\n\n## Is this actually private?\nSpecter runs on zero-knowledge infrastructure.\nNo logs. No metadata retention. Verified by\nthird-party audit.\n\n## Why not just use a VPN?\nVPNs encrypt traffic. Specter makes your\ndevice invisible at the network layer.' },
      { name: 'Plan Config', filename: 'plan-spec.json', description: 'eSIM config, data limits, pricing, Stripe + payment wiring',
        preview: '{\n  "plan": "specter-core",\n  "price_cents": 4900,\n  "currency": "usd",\n  "data_limit_gb": "unlimited",\n  "fup_threshold_gb": 50,\n  "esim_provider": "connectx",\n  "stripe_product": "prod_specter_core"\n}' },
      { name: 'Legal Docs', filename: 'legal.md', description: 'ToS, privacy policy, compliance scan',
        preview: '# Terms of Service \u2014 Specter\n\nEffective: Launch date\n\n## Data Collection\nSpecter collects no personally identifiable\ninformation beyond what is required for\nbilling and eSIM provisioning.\n\n## Privacy Policy\nZero-knowledge architecture. No session logs.' },
      { name: 'Brand Voice', filename: 'brand.md', description: 'Personality, tone, conversation starters',
        preview: '# Specter \u2014 retro-cyber\n\n## Positioning\nFor OPSEC practitioners, Specter is the\nMVNO architected for network-layer\ninvisibility.\n\n## Personality\nTechnical, Transparent, Uncompromising' },
      { name: 'Product KB', filename: 'product.md', description: 'Features, troubleshooting, use cases',
        preview: '# Product Knowledge Base\n\n## Core Features\n- eSIM-only activation (no physical SIM)\n- Zero-knowledge network architecture\n- No metadata retention\n- Encrypted DNS by default\n\n## Troubleshooting\n### eSIM not activating?\n1. Check device compatibility\n2. Restart device after install' },
      { name: 'Bot Deploy', filename: 'bot-config.yaml', description: 'Telegram webhook, escalation config, go live',
        preview: 'bot:\n  platform: telegram\n  handle: "@SpecterBot"\n  webhook: /api/webhook/specter\n\nescalation:\n  provider: sunshine\n  timeout: 120s\n  sync_history: true\n\nstatus: ready' },
      { name: 'Unit Economics', filename: 'economics.json', description: 'CAC, LTV, margin model',
        preview: '{\n  "price_monthly": 49,\n  "cogs_monthly": 18.50,\n  "gross_margin": 0.622,\n  "estimated_cac": 32,\n  "ltv_12mo": 366,\n  "ltv_cac_ratio": 11.4,\n  "payback_months": 0.65\n}' },
    ];

    const rows = [];
    const statusEls = [];
    const checkEls = [];
    const previewEls = [];
    let summaryEl;
    let activePreview = null;

    artifacts.forEach((a, i) => {
      const statusBadge = el('span', {
        style: {
          fontSize: '10px',
          fontFamily: "'JetBrains Mono', monospace",
          padding: '2px 8px',
          borderRadius: '4px',
          background: 'rgba(52,211,153,0.1)',
          color: '#34d399',
          transition: 'all 0.3s ease-out',
        }
      }, 'generated');
      statusEls.push(statusBadge);

      const checkEl = el('span', { style: { display: 'none', marginLeft: '8px' } });
      checkEl.appendChild(makeCheckSvg(12, '#34d399'));
      checkEls.push(checkEl);

      // Terminal-style preview pane
      const previewPane = el('div', {
        style: {
          display: 'none',
          margin: '0 16px 8px 16px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
          background: '#0c0a14',
        }
      },
        // Title bar with traffic lights
        el('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }
        },
          el('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' } }),
          el('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' } }),
          el('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' } }),
          el('span', { style: { fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#525252', marginLeft: '8px' } }, a.filename)
        ),
        // File content
        el('pre', {
          style: {
            margin: '0',
            padding: '16px',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            color: '#a3a3a3',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            maxHeight: '200px',
            overflow: 'hidden',
          }
        }, a.preview)
      );
      previewEls.push(previewPane);

      const rowHeader = el('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          padding: '10px 16px',
          cursor: 'pointer',
          transition: 'background 0.2s ease-out',
          opacity: '0',
          animation: 's4FadeInRight 0.3s ease-out ' + (0.1 + i * 0.06) + 's forwards',
        }
      },
        // Status indicator dot
        el('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', flexShrink: '0', marginRight: '12px' } }),
        // Name + filename
        el('div', { style: { flex: '1', minWidth: '0' } },
          el('div', { style: { display: 'flex', alignItems: 'baseline', gap: '8px' } },
            el('span', { style: { fontSize: '13px', fontWeight: '500', color: '#e5e5e5' } }, a.name),
            el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#404040' } }, a.filename)
          ),
          el('div', { style: { fontSize: '11px', color: '#525252', marginTop: '2px' } }, a.description)
        ),
        // Status badge + check
        el('div', { style: { display: 'flex', alignItems: 'center', flexShrink: '0', marginLeft: '16px' } },
          statusBadge,
          checkEl
        )
      );

      rowHeader.addEventListener('mouseenter', () => { rowHeader.style.background = 'rgba(255,255,255,0.02)'; });
      rowHeader.addEventListener('mouseleave', () => { rowHeader.style.background = ''; });
      rowHeader.addEventListener('click', () => {
        if (activePreview === previewPane) {
          previewPane.style.display = 'none';
          activePreview = null;
        } else {
          if (activePreview) activePreview.style.display = 'none';
          previewPane.style.display = '';
          activePreview = previewPane;
        }
      });

      const rowContainer = el('div', {
        style: { borderBottom: '1px solid rgba(255,255,255,0.04)' }
      }, rowHeader, previewPane);

      rows.push(rowContainer);
    });

    const listContainer = card({ style: { padding: '0', overflow: 'hidden' } },
      // Header row
      el('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: '10px',
          fontFamily: "'JetBrains Mono', monospace",
          color: '#525252',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }
      },
        el('span', null, 'Artifact'),
        el('span', null, 'Status')
      ),
      ...rows
    );

    summaryEl = el('div', {
      style: {
        display: 'none',
        textAlign: 'center',
        padding: '16px',
        marginTop: '16px',
        borderRadius: '8px',
        border: '1px solid rgba(52,211,153,0.2)',
        background: 'rgba(52,211,153,0.05)',
      }
    },
      el('span', { style: { fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", color: '#34d399' } },
        artifacts.length + '/' + artifacts.length + ' reviewed \u2014 ready to deploy'
      )
    );

    const wrapper = el('div', { className: 's4-fade-in' },
      stageHeader('04', 'Artifact Review'),
      el('p', { style: { color: '#a3a3a3', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' } },
        artifacts.length + ' artifacts generated from the brief. Each is verified against brand voice, strategic context, and compliance rules before deploy.'
      ),
      listContainer,
      summaryEl,
      annotation('All artifacts are generated in parallel in under 15 seconds. This stage is the human checkpoint \u2014 review what the engine built before it goes live.')
    );

    // Staggered review animation: generated → reviewed
    const reviewDelay = 800; // initial pause
    const reviewInterval = 400; // per-artifact stagger
    const timeouts = [];

    artifacts.forEach((a, i) => {
      const t = setTimeout(() => {
        statusEls[i].textContent = 'reviewed';
        statusEls[i].style.background = 'rgba(52,211,153,0.15)';
        statusEls[i].style.color = '#34d399';
        checkEls[i].style.display = '';

        // Check if all done
        if (i === artifacts.length - 1) {
          setTimeout(() => {
            summaryEl.style.display = '';
            summaryEl.style.opacity = '0';
            summaryEl.style.animation = 's4FadeIn 0.4s ease-out forwards';
          }, 300);
        }
      }, reviewDelay + i * reviewInterval);
      timeouts.push(t);
    });

    wrapper._cleanup = () => {
      timeouts.forEach(t => clearTimeout(t));
    };

    return wrapper;
  }

  function buildStageDeploy() {
    const checklist = [
      { label: 'Pre-deploy risk clearance', result: 'CLEAR \u2014 0 fatal, 1 should-resolve (approved)' },
      { label: 'Write pilot/brands/specter/', result: '' },
      { label: 'Generate QR code for @SpecterBot', result: '' },
      { label: 'Connect messaging channel webhook', result: '' },
      { label: 'QA agent \u2014 automated conversation test', result: 'PASS \u2014 4/4 exchanges, brand voice verified' },
    ];

    const gates = [
      { label: 'eSIM Smoke Test', description: 'Verify activation on pre-provisioned test SIM', result: 'PASS \u2014 eSIM activated, data session confirmed' },
      { label: 'E2E Journey Test', description: 'Full signup \u2192 activation \u2192 first call', result: 'PASS \u2014 journey complete in 3m 42s' },
    ];

    const fileTree = [
      '\u251C\u2500\u2500 brand.md',
      '\u251C\u2500\u2500 product.md',
      '\u251C\u2500\u2500 faq.md',
      '\u251C\u2500\u2500 journey-config.yaml',
      '\u251C\u2500\u2500 plan-spec.json',
      '\u251C\u2500\u2500 legal.md',
      '\u251C\u2500\u2500 bot-config.yaml',
      '\u251C\u2500\u2500 economics.json',
      '\u2514\u2500\u2500 website/',
    ];

    const closingStats = [
      { value: '5', label: 'Pipeline stages' },
      { value: '10', label: 'Risks assessed' },
      { value: '9', label: 'Artifacts generated' },
      { value: '2', label: 'Gates passed' },
    ];

    const liveStats = [
      { value: '0', label: 'Subscribers', note: 'awaiting first activation' },
      { value: '$0', label: 'MRR', note: '' },
      { value: 'ONLINE', label: 'Bot', dot: true },
    ];

    const checklistContainer = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' } });
    const gatesSection = el('div', { style: { display: 'none', marginBottom: '40px' } });
    const liveSection = el('div', { style: { display: 'none' } });
    const closingSection = el('div', { style: { display: 'none' } });
    const timers = [];

    // Build gate items
    const gateSpinners = [];
    const gateChecks = [];
    const gateResults = [];

    const gatesHeader = el('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }
    },
      el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' } }, '\u25cf Launch Gates')
    );
    gatesSection.appendChild(gatesHeader);

    gates.forEach((gate, i) => {
      const spinner = el('div', { style: { width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', marginTop: '2px' } },
        el('div', { className: 's4-spinner' })
      );
      gateSpinners.push(spinner);

      const checkSvg = el('div', { style: { display: 'none', flexShrink: '0', marginTop: '2px' } },
        makeCheckSvg(16, '#34d399')
      );
      gateChecks.push(checkSvg);

      const resultSpan = el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#34d399', marginLeft: '8px', display: 'none' } }, gate.result);
      gateResults.push(resultSpan);

      const row = el('div', { style: { marginBottom: '12px' } },
        el('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px' } },
          spinner,
          checkSvg,
          el('div', null,
            el('span', { style: { fontSize: '14px', color: '#fff' } }, gate.label),
            resultSpan,
            el('div', { style: { fontSize: '11px', color: '#525252', marginTop: '2px' } }, gate.description)
          )
        )
      );
      gatesSection.appendChild(row);
    });

    // Build checklist items
    const checkIcons = [];
    const spinners = [];
    const resultSpans = [];
    const fileTreeContainer = el('div', { style: { paddingLeft: '24px', marginTop: '8px', display: 'none' } });

    checklist.forEach((item, i) => {
      const spinner = el('div', { style: { width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', marginTop: '2px' } },
        el('div', { className: 's4-spinner' })
      );
      spinners.push(spinner);

      const checkSvg = el('div', { style: { display: 'none', flexShrink: '0', marginTop: '2px' } },
        makeCheckSvg(16, '#34d399')
      );
      checkIcons.push(checkSvg);

      const resultSpan = el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#404040', marginLeft: '8px', display: 'none' } }, item.result);
      resultSpans.push(resultSpan);

      const row = el('div', {
        style: { opacity: '0', animation: `s4FadeInRight 0.3s ease-out ${0.1 + i * 0.12}s forwards` }
      },
        el('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px' } },
          spinner,
          checkSvg,
          el('div', null,
            el('span', { style: { fontSize: '14px', color: '#fff' } }, item.label),
            resultSpan
          )
        )
      );

      // File tree goes after item index 1
      if (i === 1) {
        row.appendChild(fileTreeContainer);
      }

      checklistContainer.appendChild(row);
    });

    // Build file tree
    fileTree.forEach((f, fi) => {
      fileTreeContainer.appendChild(
        el('div', {
          style: {
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: '#525252',
            opacity: '0',
            animation: `s4FadeIn 0.2s ease-out ${fi * 0.1}s forwards`
          }
        }, f)
      );
    });

    // Mock Telegram conversation preview
    const chatMessages = [
      { from: 'user', text: 'What makes Specter different from a regular phone plan?' },
      { from: 'bot', text: 'Specter is built on zero-knowledge infrastructure. No metadata retention, no session logs, encrypted DNS by default. Your device is invisible at the network layer \u2014 not just your traffic.' },
      { from: 'user', text: 'How do I activate?' },
      { from: 'bot', text: 'It\u2019s eSIM-only \u2014 no physical SIM needed. I\u2019ll walk you through it: takes about 2 minutes. Ready to start?' },
    ];

    const channels = [
      { name: 'Telegram', color: '#26A5E4' },
      { name: 'iMessage', color: '#007AFF' },
      { name: 'RCS', color: '#4285F4' },
      { name: 'SMS', color: '#a3a3a3' },
      { name: 'WhatsApp', color: '#25D366' },
    ];
    var activeChannel = channels[0];

    // Channel label in chat header (mutable)
    const channelDot = el('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: activeChannel.color, display: 'inline-block', marginRight: '6px' } });
    const channelLabelText = el('span', null, activeChannel.name);
    const channelLabel = el('div', { style: { marginLeft: 'auto', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#a3a3a3', display: 'flex', alignItems: 'center' } }, channelDot, channelLabelText);

    const chatBubbles = [];
    const chatContainer = el('div', {
      style: {
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        background: '#0c0a14',
        marginBottom: '32px',
      }
    },
      // Chat header
      el('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }
      },
        el('div', {
          style: {
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #34d399, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: '#fff', fontWeight: '600',
          }
        }, 'S'),
        el('div', null,
          el('div', { style: { fontSize: '13px', fontWeight: '500', color: '#e5e5e5' } }, 'SpecterBot'),
          el('div', { style: { fontSize: '10px', color: '#34d399' } }, 'online')
        ),
        channelLabel
      ),
      // Messages area
      el('div', { style: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '60px' } },
        ...chatMessages.map((msg, mi) => {
          const isBot = msg.from === 'bot';
          const bubble = el('div', {
            style: {
              display: 'none',
              maxWidth: '80%',
              alignSelf: isBot ? 'flex-start' : 'flex-end',
              padding: '10px 14px',
              borderRadius: isBot ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
              background: isBot ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (isBot ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)'),
              fontSize: '12px',
              lineHeight: '1.5',
              color: isBot ? '#d1d5db' : '#a3a3a3',
            }
          }, msg.text);
          chatBubbles.push(bubble);
          return bubble;
        })
      )
    );

    // Channel selector badges (above chat)
    var channelBadgeEls = [];
    var channelSelector = el('div', { style: { display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' } },
      channels.map(function (ch) {
        var isActive = ch === activeChannel;
        var dot = el('span', {
          style: {
            width: '7px', height: '7px', borderRadius: '50%',
            background: ch.color,
            flexShrink: '0',
            opacity: isActive ? '1' : '0.35',
            transition: 'opacity 0.2s ease-out',
          }
        });
        var badge = el('span', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            padding: '5px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-out',
            border: '1px solid ' + (isActive ? ch.color + '4D' : 'rgba(255,255,255,0.06)'),
            background: isActive ? ch.color + '14' : 'transparent',
            color: isActive ? '#e5e5e5' : '#525252',
          }
        }, dot, ch.name);
        badge._dot = dot;
        badge._ch = ch;
        badge.addEventListener('click', function () {
          activeChannel = ch;
          channelLabelText.textContent = ch.name;
          channelDot.style.background = ch.color;
          channelBadgeEls.forEach(function (b) {
            var a = b._ch === ch;
            b.style.border = '1px solid ' + (a ? b._ch.color + '4D' : 'rgba(255,255,255,0.06)');
            b.style.background = a ? b._ch.color + '14' : 'transparent';
            b.style.color = a ? '#e5e5e5' : '#525252';
            b._dot.style.opacity = a ? '1' : '0.35';
          });
        });
        channelBadgeEls.push(badge);
        return badge;
      })
    );

    const chatSection = el('div', { style: { display: 'none' } }, channelSelector, chatContainer);

    // Live state card
    const liveCard = el('div', {
      className: 's4-card',
      style: {
        padding: '32px',
        marginBottom: '40px',
        borderColor: 'rgba(6,95,70,0.5)',
        boxShadow: '0 0 40px -12px rgba(16,185,129,0.12)',
      }
    },
      el('div', { style: { textAlign: 'center', marginBottom: '24px' } },
        el('h2', { style: { fontFamily: '"Instrument Serif", Georgia, serif', fontSize: '30px', color: '#fff', marginBottom: '4px' } }, 'Specter'),
        el('p', { style: { color: '#525252', fontSize: '14px', marginBottom: '12px' } }, 'is live'),
        el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' } },
          el('span', { className: 's4-pulse-container' },
            el('span', { className: 's4-pulse-ping' }),
            el('span', { className: 's4-pulse-dot' })
          ),
          el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em', color: '#34d399' } }, 'LIVE')
        )
      ),
      el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' } },
        liveStats.map(stat =>
          el('div', null,
            el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' } },
              stat.dot ? el('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', flexShrink: '0' } }) : null,
              el('span', { style: { fontSize: '20px', fontFamily: "'JetBrains Mono', monospace", color: '#fff' } }, stat.value)
            ),
            el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#404040', textTransform: 'uppercase', display: 'block', marginTop: '4px' } }, stat.label),
            stat.note ? el('span', { style: { fontSize: '10px', color: '#404040', display: 'block' } }, stat.note) : null
          )
        )
      )
    );

    liveSection.appendChild(liveCard);

    // Post-launch ops section
    const postLaunchLanes = [
      {
        lane: 'Legal & Compliance',
        color: '#f87171',
        tasks: [
          { name: 'Full EUA Review', type: 'human', days: 5 },
          { name: 'Privacy Counsel', type: 'human', days: 3 },
          { name: 'Security Audit', type: 'human', days: 7 },
        ]
      },
      {
        lane: 'Carrier Ops',
        color: '#fbbf24',
        tasks: [
          { name: 'AT&T Alpha Tag', type: 'human', days: 5 },
          { name: 'eSIM Inventory', type: 'human', days: 3 },
        ]
      },
      {
        lane: 'Growth & GTM',
        color: '#34d399',
        tasks: [
          { name: 'Community Seeding', type: 'human', days: 5 },
          { name: 'Affiliate Outreach', type: 'human', days: 5 },
          { name: 'Influencer Partners', type: 'human', days: 7 },
          { name: 'Paid Ads Config', type: 'human', days: 3 },
          { name: 'Content Calendar', type: 'agent', days: 1 },
          { name: 'Email Drip', type: 'agent', days: 1 },
          { name: 'Monitoring Setup', type: 'human', days: 2 },
        ]
      },
    ];

    const postLaunchSection = el('div', { style: { display: 'none', marginTop: '40px' } });

    postLaunchSection.appendChild(
      el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' } },
        el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#525252', textTransform: 'uppercase', letterSpacing: '0.05em' } }, 'Post-Launch Ops'),
        el('span', { style: { flex: '1', height: '1px', background: 'rgba(255,255,255,0.04)' } }),
        // Legend
        el('div', { style: { display: 'flex', gap: '12px', flexShrink: '0' } },
          el('span', { style: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#60a5fa' } },
            el('span', { style: { width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', flexShrink: '0' } }),
            'Agent'
          ),
          el('span', { style: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#a78bfa' } },
            el('span', { style: { width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', flexShrink: '0' } }),
            'Human'
          )
        )
      )
    );

    postLaunchLanes.forEach(function (lane, li) {
      var laneEl = el('div', {
        style: {
          marginBottom: li < postLaunchLanes.length - 1 ? '16px' : '0',
          opacity: '0',
          animation: 's4FadeInRight 0.3s ease-out ' + (0.1 + li * 0.12) + 's forwards',
        }
      });

      laneEl.appendChild(
        el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } },
          el('span', { style: { width: '4px', height: '12px', borderRadius: '2px', background: '#525252', flexShrink: '0' } }),
          el('span', { style: { fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.03em' } }, lane.lane)
        )
      );

      var taskList = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '12px' } });
      lane.tasks.forEach(function (task) {
        var isAgent = task.type === 'agent';
        taskList.appendChild(
          el('span', {
            style: {
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              padding: '3px 10px',
              borderRadius: '4px',
              border: '1px solid ' + (isAgent ? 'rgba(96,165,250,0.3)' : 'rgba(167,139,250,0.2)'),
              background: isAgent ? 'rgba(96,165,250,0.1)' : 'rgba(167,139,250,0.05)',
              color: isAgent ? '#60a5fa' : '#a78bfa',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }
          },
            el('span', { style: { width: '4px', height: '4px', borderRadius: '50%', background: isAgent ? '#60a5fa' : '#a78bfa', flexShrink: '0' } }),
            task.name,
            el('span', { style: { color: '#404040', fontSize: '10px' } }, task.days + 'd')
          )
        );
      });
      laneEl.appendChild(taskList);
      postLaunchSection.appendChild(laneEl);
    });

    liveSection.appendChild(postLaunchSection);

    // Closing section
    const closingInner = el('div', { style: { borderTop: '1px solid rgba(38,38,38,0.5)', marginTop: '48px', paddingTop: '32px' } },
      el('h2', { style: { fontFamily: '"Instrument Serif", Georgia, serif', fontSize: '24px', color: '#fff', textAlign: 'center', marginBottom: '32px' } }),
      el('div', { className: 's4-grid-4', style: { gap: '24px' } },
        closingStats.map(stat =>
          el('div', null,
            el('span', { style: { fontSize: '30px', fontWeight: '300', color: '#fff', fontVariantNumeric: 'tabular-nums', display: 'block' } }, stat.value),
            el('span', { style: { fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: '#404040', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginTop: '4px' } }, stat.label)
          )
        )
      )
    );
    // Set heading HTML to handle <em>
    closingInner.querySelector('h2').innerHTML = 'Brief to brand in <em>one engine run</em>';

    closingSection.appendChild(closingInner);

    const wrapper = el('div', { className: 's4-fade-in' },
      stageHeader('05', 'Deploy'),
      checklistContainer,
      chatSection,
      gatesSection,
      liveSection,
      closingSection,
      annotation('Total elapsed: persona brief to live brand in a single engine run. The bot is connected, the website is deployed, and the journey config is active. Post-launch monitoring begins automatically.')
    );

    // Sequential auto-checks for items 1-4 (before QA)
    var qaIndex = checklist.length - 1; // last item is the QA result
    for (var ci = 0; ci < qaIndex; ci++) {
      (function (i) {
        timers.push(setTimeout(function () {
          spinners[i].style.display = 'none';
          checkIcons[i].style.display = '';
          if (checklist[i].result) {
            resultSpans[i].style.display = '';
          }
          if (i === 1) {
            fileTreeContainer.style.display = '';
          }
        }, 700 * (i + 1)));
      })(ci);
    }

    // After item 4, show chat preview (QA agent testing)
    var chatStart = 700 * qaIndex + 600;
    timers.push(setTimeout(function () {
      chatSection.style.display = '';
      chatSection.style.opacity = '0';
      chatSection.style.animation = 's4FadeIn 0.4s ease-out forwards';

      // Stagger chat bubbles
      chatBubbles.forEach(function (bubble, bi) {
        timers.push(setTimeout(function () {
          bubble.style.display = '';
          bubble.style.opacity = '0';
          bubble.style.animation = 's4FadeIn 0.3s ease-out forwards';
        }, 600 * (bi + 1)));
      });

      // After chat completes, check off QA item
      var qaCheckTime = 600 * chatBubbles.length + 600;
      timers.push(setTimeout(function () {
        spinners[qaIndex].style.display = 'none';
        checkIcons[qaIndex].style.display = '';
        resultSpans[qaIndex].style.display = '';

        // Show gates after QA passes
        timers.push(setTimeout(function () {
          gatesSection.style.display = '';
          gatesSection.style.opacity = '0';
          gatesSection.style.animation = 's4FadeIn 0.4s ease-out forwards';

          // Stagger gate completions
          gates.forEach(function (_, gi) {
            timers.push(setTimeout(function () {
              gateSpinners[gi].style.display = 'none';
              gateChecks[gi].style.display = '';
              gateResults[gi].style.display = '';
            }, 1200 * (gi + 1)));
          });

          // Show live card after all gates pass
          timers.push(setTimeout(function () {
            liveSection.style.display = '';
            liveSection.style.opacity = '0';
            liveSection.style.animation = 's4FadeIn 0.5s ease-out forwards';

            // Show post-launch ops after live card
            timers.push(setTimeout(function () {
              postLaunchSection.style.display = '';
              postLaunchSection.style.opacity = '0';
              postLaunchSection.style.animation = 's4FadeIn 0.4s ease-out forwards';

              // Show closing after post-launch
              timers.push(setTimeout(function () {
                closingSection.style.display = '';
                closingSection.style.opacity = '0';
                closingSection.style.animation = 's4FadeIn 0.4s ease-out forwards';
              }, 800));
            }, 600));
          }, 1200 * gates.length + 800));
        }, 600));
      }, qaCheckTime));
    }, chatStart));

    wrapper._cleanup = () => timers.forEach(clearTimeout);

    return wrapper;
  }

  /* ═══════════════════════════════════════════
     STAGE BUILDER MAP
     ═══════════════════════════════════════════ */


  const STAGE_BUILDERS = [
    buildStageInput,
    buildStageLaunchRisk,
    buildStageLaunchPlan,
    buildStageGeneration,
    buildStageDeploy,
  ];

  /* ═══════════════════════════════════════════
     MAIN INIT
     ═══════════════════════════════════════════ */

  window.initScene4 = function (container) {
    injectStyles();

    // Load fonts
    if (!document.getElementById('scene4-fonts')) {
      const link = document.createElement('link');
      link.id = 'scene4-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap';
      document.head.appendChild(link);
    }

    let activeStage = 0;
    let isPlaying = false;
    let playTimer = null;
    let currentStageEl = null;

    const root = el('div', { className: 'scene4' });

    /* ── Sidebar ── */
    const sidebar = el('aside', { className: 's4-sidebar' });

    // Brand
    const brandSection = el('div', { className: 's4-sidebar-brand' },
      el('span', { className: 's4-label' }, 'Brand'),
      el('span', { className: 's4-brand-name' }, 'Specter')
    );

    // Play button
    const playBtn = el('button', { className: 's4-play-btn' });

    const playArea = el('div', { className: 's4-play-area' }, playBtn);

    // Timeline
    const timelineOuter = el('div', { className: 's4-timeline' });
    const timelineInner = el('div', { className: 's4-timeline-inner' });
    const trackBg = el('div', { className: 's4-track' });
    const trackFill = el('div', { className: 's4-track-fill', style: { height: '0%' } });
    timelineInner.appendChild(trackBg);
    timelineInner.appendChild(trackFill);

    const nodeButtons = [];

    STAGES.forEach((stage, i) => {
      const btn = el('button', { className: 's4-node-btn', onClick: () => goToStage(i) },
        el('div', { className: 's4-node-dot future' }),
        el('div', { className: 's4-node-label' },
          el('div', { className: 's4-node-title' }, stage.title),
          el('div', { className: 's4-node-sub' }, stage.subtitle)
        )
      );
      nodeButtons.push(btn);
      timelineInner.appendChild(btn);
    });

    timelineOuter.appendChild(timelineInner);

    // Counter
    const counterVal = el('span', { className: 's4-counter-val' });
    const slider = el('input', {
      className: 's4-slider',
      type: 'range',
      min: '0',
      max: String(STAGES.length - 1),
      value: '0',
    });
    slider.addEventListener('input', (e) => {
      goToStage(Number(e.target.value));
    });

    const counterSection = el('div', { className: 's4-counter' },
      el('span', { className: 's4-label', style: { display: 'block', marginBottom: '8px' } }, 'Step'),
      el('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, counterVal),
      slider
    );

    sidebar.appendChild(brandSection);
    sidebar.appendChild(playArea);
    sidebar.appendChild(timelineOuter);
    sidebar.appendChild(counterSection);

    /* ── Main content ── */
    const main = el('main', { className: 's4-main' });
    const content = el('div', { className: 's4-content' });
    main.appendChild(content);

    root.appendChild(sidebar);
    root.appendChild(main);
    container.appendChild(root);

    /* ── State management ── */

    function updatePlayButton() {
      const isComplete = activeStage >= STAGES.length - 1 && !isPlaying;
      const icon = isPlaying
        ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="2" width="3" height="10" rx="0.5" fill="currentColor"/><rect x="8" y="2" width="3" height="10" rx="0.5" fill="currentColor"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2L12 7L3 12V2Z" fill="currentColor"/></svg>';
      const label = isPlaying ? 'Pause' : isComplete ? 'Replay' : 'Play';
      playBtn.innerHTML = icon + ' ' + label;
    }

    function updateTimeline() {
      const pct = STAGES.length > 1 ? (activeStage / (STAGES.length - 1)) * 100 : 0;
      trackFill.style.height = pct + '%';

      nodeButtons.forEach((btn, i) => {
        const isPast = i < activeStage;
        const isActive = i === activeStage;

        btn.className = 's4-node-btn' + (isActive ? ' active' : '');

        const dot = btn.querySelector('.s4-node-dot');
        dot.className = 's4-node-dot ' + (isPast ? 'past' : isActive ? 'active-dot' : 'future');

        // Rebuild dot inner content
        dot.innerHTML = '';
        if (isPast) {
          dot.appendChild(makeCheckSvg(12, '#34d399'));
        } else if (isActive) {
          dot.appendChild(el('div', { className: 'dot-inner' }));
        } else {
          dot.appendChild(el('span', { className: 'dot-number' }, STAGES[i].number));
        }

        const title = btn.querySelector('.s4-node-title');
        title.className = 's4-node-title' + (isActive ? ' active-title' : isPast ? ' past-title' : '');

        const sub = btn.querySelector('.s4-node-sub');
        sub.className = 's4-node-sub' + (isActive ? ' active-sub' : '');
      });

      counterVal.textContent = (activeStage + 1) + ' / ' + STAGES.length;
      slider.value = String(activeStage);
    }

    function renderStage() {
      // Cleanup previous
      if (currentStageEl && currentStageEl._cleanup) {
        currentStageEl._cleanup();
      }
      content.innerHTML = '';

      currentStageEl = STAGE_BUILDERS[activeStage]();
      content.appendChild(currentStageEl);

      // Scroll main to top
      main.scrollTop = 0;
    }

    function goToStage(index) {
      if (index === activeStage) return;
      activeStage = index;
      stopPlaying();
      updateTimeline();
      updatePlayButton();
      renderStage();
    }

    function stopPlaying() {
      isPlaying = false;
      if (playTimer) {
        clearInterval(playTimer);
        playTimer = null;
      }
    }

    function togglePlay() {
      if (activeStage >= STAGES.length - 1 && !isPlaying) {
        // Replay
        activeStage = 0;
        isPlaying = true;
        updateTimeline();
        renderStage();
        startPlayTimer();
      } else if (isPlaying) {
        stopPlaying();
      } else {
        isPlaying = true;
        startPlayTimer();
      }
      updatePlayButton();
    }

    function startPlayTimer() {
      playTimer = setInterval(() => {
        if (activeStage >= STAGES.length - 1) {
          stopPlaying();
          updatePlayButton();
          return;
        }
        activeStage++;
        updateTimeline();
        updatePlayButton();
        renderStage();
      }, 4000);
    }

    playBtn.addEventListener('click', togglePlay);

    // Initial render
    updateTimeline();
    updatePlayButton();
    renderStage();
  };
})();
