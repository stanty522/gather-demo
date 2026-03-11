// scene-3-recreation.js — Brand Recreation Demo (Scene 3)
// Exports: window.initScene3(container)

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     CONSTANTS
     ═══════════════════════════════════════════ */

  const CONVEX_URL = 'https://hearty-rhinoceros-872.convex.cloud';
  const DEFAULT_TEST_ID = 'fdt_midnight_maker_1772597219';

  const STAGES = [
    { key: 'input',      number: '01', title: 'The Input',          subtitle: 'A persona brief enters the machine' },
    { key: 'strategy',   number: '02', title: 'Brand Strategy',     subtitle: 'Name, positioning, personality — decided by AI' },
    { key: 'research',   number: '03', title: 'Visual Research',    subtitle: 'AI scrapes mood imagery from Pinterest + Cosmos' },
    { key: 'philosophy', number: '04', title: 'Visual Philosophy',  subtitle: 'Template, colors, typography, copy — all selected' },
    { key: 'creative',   number: '05', title: 'Creative Direction', subtitle: 'Logo generated via Quiver AI, images via fal.ai' },
    { key: 'website',    number: '06', title: 'Website Deploy',     subtitle: 'Copy assembled, template injected, deployed to Vercel' },
    { key: 'ads',        number: '07', title: 'Ad Creatives',       subtitle: 'UGC video ads via Sora 2 + fal.ai auto-captions' },
  ];

  /* ═══════════════════════════════════════════
     CONVEX API
     ═══════════════════════════════════════════ */

  async function queryConvex(path, args) {
    try {
      const res = await fetch(CONVEX_URL + '/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, args }),
      });
      const data = await res.json();
      return data.status === 'success' ? data.value : null;
    } catch { return null; }
  }

  /* ═══════════════════════════════════════════
     STYLES
     ═══════════════════════════════════════════ */

  function injectStyles() {
    if (document.getElementById('scene3-styles')) return;
    const style = document.createElement('style');
    style.id = 'scene3-styles';
    style.textContent = `
      .scene3 {
        display: flex;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #fff;
      }

      /* ── Sidebar ── */
      .scene3 .s3-sidebar {
        width: 280px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(255,255,255,0.08);
        padding: 24px 16px;
        overflow-y: auto;
        position: relative;
      }

      .scene3 .s3-sidebar-top {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
      }

      /* Brand picker */
      .scene3 .s3-brand-picker {
        position: relative;
      }
      .scene3 .s3-brand-trigger {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        background: rgba(23,23,23,0.6);
        border: 1px solid #262626;
        border-radius: 8px;
        color: #fff;
        font-size: 13px;
        cursor: pointer;
        font-family: inherit;
        text-align: left;
      }
      .scene3 .s3-brand-trigger:hover {
        border-color: #404040;
      }
      .scene3 .s3-brand-dropdown {
        display: none;
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: #171717;
        border: 1px solid #404040;
        border-radius: 8px;
        max-height: 240px;
        overflow-y: auto;
        z-index: 50;
      }
      .scene3 .s3-brand-dropdown.open {
        display: block;
      }
      .scene3 .s3-brand-option {
        width: 100%;
        display: block;
        padding: 8px 12px;
        background: none;
        border: none;
        color: #999;
        font-size: 13px;
        cursor: pointer;
        text-align: left;
        font-family: inherit;
      }
      .scene3 .s3-brand-option:hover {
        background: rgba(255,255,255,0.05);
        color: #fff;
      }

      /* Play button */
      .scene3 .s3-play-btn {
        width: 100%;
        padding: 10px;
        background: #fff;
        color: #000;
        border: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;
        transition: opacity 0.2s;
      }
      .scene3 .s3-play-btn:hover {
        opacity: 0.9;
      }

      /* Timeline */
      .scene3 .s3-timeline {
        flex: 1;
        position: relative;
        padding: 8px 0;
      }
      .scene3 .s3-timeline-track {
        position: absolute;
        left: 19px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: rgba(38,38,38,0.6);
      }
      .scene3 .s3-timeline-fill {
        position: absolute;
        left: 19px;
        top: 0;
        width: 1px;
        background: rgba(255,255,255,0.3);
        transition: height 0.5s ease;
      }
      .scene3 .s3-stage-btn {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        width: 100%;
        padding: 10px 8px;
        background: none;
        border: none;
        cursor: pointer;
        position: relative;
        text-align: left;
        border-radius: 8px;
        transition: background 0.2s;
        font-family: inherit;
      }
      .scene3 .s3-stage-btn.active {
        background: rgba(38,38,38,0.3);
      }
      .scene3 .s3-node {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        transition: all 0.3s ease;
        position: relative;
        z-index: 2;
      }
      .scene3 .s3-node.future {
        background: #262626;
        border: 1px solid #404040;
        color: #737373;
      }
      .scene3 .s3-node.active {
        background: #fff;
        border: 1px solid #fff;
        box-shadow: 0 0 12px rgba(255,255,255,0.4);
        color: #000;
      }
      .scene3 .s3-node.past {
        background: rgba(16,185,129,0.3);
        border: 1px solid #10b981;
        color: #10b981;
      }
      .scene3 .s3-stage-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-top: 2px;
      }
      .scene3 .s3-stage-title {
        font-size: 13px;
        color: #999;
        transition: color 0.2s;
      }
      .scene3 .s3-stage-btn.active .s3-stage-title {
        color: #fff;
      }
      .scene3 .s3-stage-sub {
        font-size: 10px;
        color: #555;
        line-height: 1.4;
      }

      /* Stage counter */
      .scene3 .s3-counter {
        padding-top: 16px;
        border-top: 1px solid rgba(255,255,255,0.06);
        margin-top: 16px;
      }
      .scene3 .s3-counter-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #555;
        margin-bottom: 4px;
      }
      .scene3 .s3-counter-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 20px;
        font-weight: 300;
        color: #fff;
        margin-bottom: 8px;
      }
      .scene3 .s3-slider {
        width: 100%;
        -webkit-appearance: none;
        appearance: none;
        height: 4px;
        background: #262626;
        border-radius: 2px;
        outline: none;
      }
      .scene3 .s3-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
      }
      .scene3 .s3-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        border: none;
      }

      /* ── Main Content ── */
      .scene3 .s3-main {
        flex: 1;
        overflow-y: auto;
        display: flex;
        justify-content: center;
      }
      .scene3 .s3-content {
        max-width: 896px;
        width: 100%;
        padding: 48px 40px;
      }

      /* Loading */
      .scene3 .s3-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #737373;
        font-size: 14px;
        animation: s3pulse 2s ease-in-out infinite;
      }
      @keyframes s3pulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }

      /* Stage panels */
      .scene3 .s3-panel {
        opacity: 0;
        transform: translateY(12px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .scene3 .s3-panel.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Stage header */
      .scene3 .s3-stage-header {
        margin-bottom: 32px;
      }
      .scene3 .s3-stage-number {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #555;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        margin-bottom: 8px;
      }
      .scene3 .s3-stage-heading {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 36px;
        font-weight: 400;
        color: #fff;
        letter-spacing: -0.02em;
      }
      .scene3 .s3-desc {
        color: #999;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 24px;
      }

      /* Code editor */
      .scene3 .s3-code-box {
        border-radius: 12px;
        border: 1px solid rgba(38,38,38,0.8);
        background: rgba(23,23,23,0.4);
        overflow: hidden;
        margin-bottom: 24px;
      }
      .scene3 .s3-code-topbar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .scene3 .s3-dot { width: 10px; height: 10px; border-radius: 50%; }
      .scene3 .s3-dot-r { background: rgba(255,95,87,0.4); }
      .scene3 .s3-dot-y { background: rgba(255,189,46,0.4); }
      .scene3 .s3-dot-g { background: rgba(39,201,63,0.4); }
      .scene3 .s3-code-file {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #555;
        margin-left: 8px;
      }
      .scene3 .s3-code-content {
        padding: 20px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        line-height: 1.8;
        color: #a3a3a3;
        white-space: pre-wrap;
      }

      /* Annotation */
      .scene3 .s3-annotation {
        margin-top: 32px;
        padding-left: 16px;
        border-left: 2px solid rgba(64,64,64,0.4);
      }
      .scene3 .s3-annotation-badge {
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
      .scene3 .s3-annotation p {
        color: #737373;
        font-size: 14px;
        line-height: 1.6;
      }

      /* Brand name display */
      .scene3 .s3-brand-name-display {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 72px;
        font-weight: 400;
        letter-spacing: -0.03em;
        color: #fff;
        line-height: 1.1;
        margin-bottom: 8px;
      }
      .scene3 .s3-tagline {
        font-family: 'Instrument Serif', Georgia, serif;
        font-style: italic;
        font-size: 22px;
        color: #999;
        margin-bottom: 32px;
      }

      /* Cards */
      .scene3 .s3-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
      }
      .scene3 .s3-card-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #555;
        margin-bottom: 12px;
      }
      .scene3 .s3-card-text {
        color: #d4d4d4;
        font-size: 15px;
        line-height: 1.7;
      }

      /* Personality pills */
      .scene3 .s3-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }
      .scene3 .s3-pill {
        padding: 6px 16px;
        background: rgba(38,38,38,0.6);
        border-radius: 9999px;
        font-size: 13px;
        color: #d4d4d4;
        border: 1px solid rgba(255,255,255,0.06);
      }

      /* Image grids */
      .scene3 .s3-img-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
        margin-bottom: 16px;
      }
      .scene3 .s3-img-cell {
        position: relative;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
      }
      .scene3 .s3-img-cell img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      .scene3 .s3-img-cell:hover img {
        transform: scale(1.05);
      }
      .scene3 .s3-img-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 6px 8px;
        background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        color: #d4d4d4;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .scene3 .s3-img-cell:hover .s3-img-caption {
        opacity: 1;
      }
      .scene3 .s3-source-badge {
        display: inline-block;
        padding: 2px 8px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #737373;
        background: rgba(64,64,64,0.4);
        border-radius: 4px;
        margin-bottom: 8px;
        margin-right: 8px;
      }
      .scene3 .s3-group-title {
        font-size: 14px;
        color: #d4d4d4;
        margin-bottom: 12px;
      }
      .scene3 .s3-count-line {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #555;
        margin-top: 8px;
      }

      /* Color swatches */
      .scene3 .s3-swatch-grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 10px;
      }
      @media (max-width: 768px) {
        .scene3 .s3-swatch-grid { grid-template-columns: repeat(4, 1fr); }
      }
      .scene3 .s3-swatch {
        text-align: center;
        cursor: default;
        transition: transform 0.2s ease;
      }
      .scene3 .s3-swatch:hover {
        transform: scale(1.1);
      }
      .scene3 .s3-swatch-color {
        aspect-ratio: 1;
        border-radius: 8px;
        margin-bottom: 6px;
        transition: box-shadow 0.2s ease;
      }
      .scene3 .s3-swatch:hover .s3-swatch-color {
        box-shadow: 0 0 0 2px rgba(255,255,255,0.2);
      }
      .scene3 .s3-swatch-hex {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #737373;
      }
      .scene3 .s3-swatch-name {
        font-size: 10px;
        color: #555;
        margin-top: 2px;
      }

      /* Logo display */
      .scene3 .s3-logo-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 40px;
      }
      .scene3 .s3-logo-img {
        height: 176px;
        filter: brightness(0) invert(1);
        margin-bottom: 12px;
      }
      @media (max-width: 768px) {
        .scene3 .s3-logo-img { height: 128px; }
      }

      /* Feature grid */
      .scene3 .s3-feat-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 24px;
      }
      .scene3 .s3-feat-img-wrap {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        overflow: hidden;
      }
      .scene3 .s3-feat-img-wrap img {
        width: 100%;
        display: block;
      }

      /* Browser chrome */
      .scene3 .s3-browser {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 20px;
      }
      .scene3 .s3-browser-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: rgba(23,23,23,0.6);
      }
      .scene3 .s3-browser-url {
        flex: 1;
        background: rgba(38,38,38,0.4);
        border-radius: 6px;
        padding: 6px 12px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #737373;
        margin-left: 8px;
      }
      .scene3 .s3-browser-url a {
        color: #737373;
        text-decoration: none;
      }
      .scene3 .s3-browser-url a:hover {
        color: #999;
      }
      .scene3 .s3-browser iframe {
        width: 100%;
        height: 650px;
        border: none;
        background: #000;
      }

      /* Live indicator */
      .scene3 .s3-live {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
      }
      .scene3 .s3-live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        animation: s3livePulse 2s ease-in-out infinite;
      }
      @keyframes s3livePulse {
        0%, 100% { opacity: 0.5; box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
        50% { opacity: 1; box-shadow: 0 0 8px 2px rgba(16,185,129,0.3); }
      }
      .scene3 .s3-live a {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        color: #737373;
        text-decoration: none;
      }
      .scene3 .s3-live a:hover { color: #999; }

      /* Plans grid */
      .scene3 .s3-plans-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 24px;
      }
      .scene3 .s3-plan-card {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        padding: 20px;
      }
      .scene3 .s3-plan-name {
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        margin-bottom: 4px;
      }
      .scene3 .s3-plan-price {
        font-family: 'JetBrains Mono', monospace;
        font-size: 28px;
        font-weight: 300;
        color: #fff;
        margin-bottom: 4px;
      }
      .scene3 .s3-plan-tagline {
        font-size: 12px;
        color: #737373;
        margin-bottom: 12px;
      }
      .scene3 .s3-plan-item {
        font-size: 13px;
        color: #999;
        line-height: 1.8;
      }

      /* Ad matrix */
      .scene3 .s3-ad-matrix {
        overflow-x: auto;
        margin-bottom: 40px;
      }
      .scene3 .s3-ad-matrix table {
        width: 100%;
        border-collapse: collapse;
      }
      .scene3 .s3-ad-matrix th {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #555;
        padding: 8px;
        text-align: left;
        font-weight: 400;
      }
      .scene3 .s3-ad-matrix td {
        padding: 8px;
        vertical-align: top;
      }
      .scene3 .s3-ad-vp {
        font-size: 12px;
        color: #999;
        max-width: 120px;
        line-height: 1.4;
      }
      .scene3 .s3-ad-cell {
        aspect-ratio: 9/16;
        width: 140px;
        border-radius: 8px;
        overflow: hidden;
        background: rgba(38,38,38,0.4);
        border: 1px solid rgba(255,255,255,0.06);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .scene3 .s3-ad-cell video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
      }
      .scene3 .s3-ad-novideotext {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #555;
      }

      /* Closing stats */
      .scene3 .s3-closing {
        margin-top: 48px;
        padding-top: 32px;
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      .scene3 .s3-closing-heading {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 36px;
        font-weight: 400;
        color: #fff;
        margin-bottom: 32px;
        letter-spacing: -0.02em;
      }
      .scene3 .s3-stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }
      .scene3 .s3-stat-num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 36px;
        font-weight: 300;
        color: #fff;
        margin-bottom: 4px;
      }
      .scene3 .s3-stat-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #555;
      }

      /* Hero image */
      .scene3 .s3-hero-wrap {
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px;
        overflow: hidden;
        margin-bottom: 12px;
      }
      .scene3 .s3-hero-wrap img {
        width: 100%;
        display: block;
      }
      .scene3 .s3-img-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #555;
        margin-bottom: 20px;
      }

      /* Template info card */
      .scene3 .s3-template-info {
        display: flex;
        align-items: baseline;
        gap: 16px;
        margin-bottom: 8px;
      }
      .scene3 .s3-template-vibe {
        font-size: 18px;
        color: #fff;
        font-weight: 500;
      }
      .scene3 .s3-template-fonts {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #737373;
      }
    `;
    document.head.appendChild(style);
  }

  /* ═══════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════ */

  function el(tag, attrs, children) {
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
    if (children != null) {
      if (typeof children === 'string') {
        e.textContent = children;
      } else if (Array.isArray(children)) {
        children.forEach(c => { if (c) e.appendChild(c); });
      } else if (children instanceof Node) {
        e.appendChild(children);
      }
    }
    return e;
  }

  function html(tag, attrs, innerHTML) {
    const e = el(tag, attrs);
    if (innerHTML) e.innerHTML = innerHTML;
    return e;
  }

  function checkSvg() {
    return '<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function chevronSvg() {
    return '<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function annotation(badgeText, desc) {
    const wrap = el('div', { className: 's3-annotation' });
    wrap.appendChild(el('span', { className: 's3-annotation-badge' }, badgeText));
    wrap.appendChild(el('p', null, desc));
    return wrap;
  }

  function stageHeader(number, title) {
    const wrap = el('div', { className: 's3-stage-header' });
    wrap.appendChild(el('div', { className: 's3-stage-number' }, 'Stage ' + number));
    wrap.appendChild(el('div', { className: 's3-stage-heading' }, title));
    return wrap;
  }

  function animateCount(element, target, duration) {
    duration = duration || 1000;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ═══════════════════════════════════════════
     STAGE PANEL RENDERERS
     ═══════════════════════════════════════════ */

  function renderStage0(brand) {
    const panel = el('div', { className: 's3-panel' });
    panel.appendChild(stageHeader('01', 'The Input'));
    panel.appendChild(el('p', { className: 's3-desc' }, 'Every brand begins as a persona brief — a structured prompt describing who the customer is, what they want, and how to reach them.'));

    const vibe = (brand.build_config && brand.build_config._vibe) || 'default';
    const personalityStr = (brand.personality || []).join(', ');

    const codeBox = el('div', { className: 's3-code-box' });
    const topBar = el('div', { className: 's3-code-topbar' }, [
      el('span', { className: 's3-dot s3-dot-r' }),
      el('span', { className: 's3-dot s3-dot-y' }),
      el('span', { className: 's3-dot s3-dot-g' }),
      el('span', { className: 's3-code-file' }, 'persona.md'),
    ]);
    codeBox.appendChild(topBar);

    const codeText = `# ${brand.brand_name || 'Brand'} — ${vibe}

## Positioning
${brand.positioning || 'N/A'}

## Personality
${personalityStr || 'N/A'}`;

    codeBox.appendChild(el('div', { className: 's3-code-content' }, codeText));
    panel.appendChild(codeBox);

    panel.appendChild(annotation('AI decided', 'The brand name, vibe direction, and core personality traits were all selected by the AI agent — no human input beyond the initial persona brief.'));

    return panel;
  }

  function renderStage1(brand) {
    const panel = el('div', { className: 's3-panel' });
    panel.appendChild(stageHeader('02', 'Brand Strategy'));

    panel.appendChild(el('div', { className: 's3-brand-name-display' }, brand.brand_name || 'Brand'));

    const bc = brand.build_config || {};
    if (bc.hero_headline) {
      panel.appendChild(el('div', { className: 's3-tagline' }, bc.hero_headline));
    }

    if (brand.positioning) {
      const card = el('div', { className: 's3-card' });
      card.appendChild(el('div', { className: 's3-card-label' }, 'Positioning'));
      card.appendChild(el('div', { className: 's3-card-text' }, brand.positioning));
      panel.appendChild(card);
    }

    if (brand.personality && brand.personality.length) {
      const pillWrap = el('div', { className: 's3-pills' });
      brand.personality.forEach(p => pillWrap.appendChild(el('span', { className: 's3-pill' }, p)));
      panel.appendChild(pillWrap);
    }

    panel.appendChild(annotation('AI decided', 'Brand name, positioning statement, and personality traits were generated from the persona brief. No human selection.'));

    return panel;
  }

  function renderStage2(brand) {
    const panel = el('div', { className: 's3-panel' });
    panel.appendChild(stageHeader('03', 'Visual Research'));
    panel.appendChild(el('p', { className: 's3-desc' }, 'AI agents scrape Pinterest, Cosmos, and curated image databases to assemble a mood board that matches the brand personality.'));

    let totalImages = 0;
    let totalQueries = 0;

    if (brand.research_moodboard && brand.research_moodboard.length) {
      brand.research_moodboard.forEach(group => {
        const section = el('div', { style: { marginBottom: '24px' } });
        const headerRow = el('div', { style: { marginBottom: '12px' } });
        headerRow.appendChild(el('span', { className: 's3-source-badge' }, group.source || 'Source'));
        headerRow.appendChild(el('span', { className: 's3-group-title' }, group.title || ''));
        section.appendChild(headerRow);

        const grid = el('div', { className: 's3-img-grid' });
        const images = group.images || [];
        totalImages += images.length;
        totalQueries++;
        images.forEach(img => {
          const cell = el('div', { className: 's3-img-cell' });
          cell.appendChild(el('img', { src: img.url, loading: 'lazy', alt: img.caption || '' }));
          if (img.caption) {
            cell.appendChild(el('div', { className: 's3-img-caption' }, img.caption));
          }
          grid.appendChild(cell);
        });
        section.appendChild(grid);
        panel.appendChild(section);
      });
    } else if (brand.mood_image_urls && brand.mood_image_urls.length) {
      const grid = el('div', { className: 's3-img-grid' });
      totalImages = brand.mood_image_urls.length;
      totalQueries = 1;
      brand.mood_image_urls.forEach(url => {
        const cell = el('div', { className: 's3-img-cell' });
        cell.appendChild(el('img', { src: url, loading: 'lazy', alt: '' }));
        grid.appendChild(cell);
      });
      panel.appendChild(grid);
    }

    panel.appendChild(el('div', { className: 's3-count-line' }, totalImages + ' images collected across ' + totalQueries + ' search queries'));

    panel.appendChild(annotation('AI decided', 'Search queries, source selection, and image curation were all performed autonomously by the research agent.'));

    return panel;
  }

  function renderStage3(brand) {
    const panel = el('div', { className: 's3-panel' });
    panel.appendChild(stageHeader('04', 'Visual Philosophy'));
    panel.appendChild(el('p', { className: 's3-desc' }, 'The AI selects a template vibe, color system, and typography pairing based on the brand personality and mood research.'));

    const bc = brand.build_config || {};

    // Template + Typography card
    const templateCard = el('div', { className: 's3-card' });
    templateCard.appendChild(el('div', { className: 's3-card-label' }, 'Template'));
    const vibe = bc._vibe || 'default';
    const fonts = bc.fonts || {};
    const templateInfo = el('div', { className: 's3-template-info' });
    templateInfo.appendChild(el('span', { className: 's3-template-vibe' }, vibe.charAt(0).toUpperCase() + vibe.slice(1)));
    if (fonts.heading || fonts.body) {
      templateInfo.appendChild(el('span', { className: 's3-template-fonts' }, (fonts.heading || '?') + ' / ' + (fonts.body || '?')));
    }
    templateCard.appendChild(templateInfo);
    panel.appendChild(templateCard);

    // Color system
    const colors = bc.colors || brand.colors || {};
    const colorEntries = Object.entries(colors);
    if (colorEntries.length) {
      const colorCard = el('div', { className: 's3-card' });
      colorCard.appendChild(el('div', { className: 's3-card-label' }, 'Color system — ' + colorEntries.length + ' tokens'));
      const swatchGrid = el('div', { className: 's3-swatch-grid' });
      colorEntries.forEach(([name, hex]) => {
        const swatch = el('div', { className: 's3-swatch' });
        swatch.appendChild(el('div', { className: 's3-swatch-color', style: { backgroundColor: hex } }));
        swatch.appendChild(el('div', { className: 's3-swatch-hex' }, hex));
        swatch.appendChild(el('div', { className: 's3-swatch-name' }, name));
        swatchGrid.appendChild(swatch);
      });
      colorCard.appendChild(swatchGrid);
      panel.appendChild(colorCard);
    }

    panel.appendChild(annotation('AI decided', 'Template selection, color palette, and font pairing were all chosen by the design agent based on personality-to-aesthetic mapping.'));

    return panel;
  }

  function renderStage4(brand) {
    const panel = el('div', { className: 's3-panel' });
    panel.appendChild(stageHeader('05', 'Creative Direction'));

    // Logo
    if (brand.logo_svg_url) {
      const logoWrap = el('div', { className: 's3-logo-wrap' });
      logoWrap.appendChild(el('div', { className: 's3-card-label', style: { textAlign: 'center' } }, 'Logo generated'));
      logoWrap.appendChild(el('img', { className: 's3-logo-img', src: brand.logo_svg_url, alt: 'Logo', loading: 'lazy' }));
      panel.appendChild(logoWrap);
    }

    // Hero image
    if (brand.hero_image_url) {
      const heroWrap = el('div', { className: 's3-hero-wrap' });
      heroWrap.appendChild(el('img', { src: brand.hero_image_url, loading: 'lazy', alt: 'Hero image' }));
      panel.appendChild(heroWrap);
      panel.appendChild(el('div', { className: 's3-img-label' }, 'Hero image — fal.ai'));
    }

    // Feature images
    if (brand.feature_image_urls && brand.feature_image_urls.length) {
      const grid = el('div', { className: 's3-feat-grid' });
      brand.feature_image_urls.forEach((url, i) => {
        const wrap = el('div', { className: 's3-feat-img-wrap' });
        wrap.appendChild(el('img', { src: url, loading: 'lazy', alt: 'Feature ' + (i + 1) }));
        grid.appendChild(wrap);
      });
      panel.appendChild(grid);
      panel.appendChild(el('div', { className: 's3-img-label' }, brand.feature_image_urls.length + ' feature images'));
    }

    panel.appendChild(annotation('AI decided', 'Logo was generated via Quiver AI. Hero and feature images were generated using fal.ai based on the brand personality and visual philosophy.'));

    return panel;
  }

  function renderStage5(brand) {
    const panel = el('div', { className: 's3-panel' });
    panel.appendChild(stageHeader('06', 'Website Deploy'));

    const websiteUrl = brand.website_url || '';

    // Browser chrome
    const browser = el('div', { className: 's3-browser' });
    const bar = el('div', { className: 's3-browser-bar' }, [
      el('span', { className: 's3-dot s3-dot-r' }),
      el('span', { className: 's3-dot s3-dot-y' }),
      el('span', { className: 's3-dot s3-dot-g' }),
    ]);
    const urlBar = html('div', { className: 's3-browser-url' }, websiteUrl ? '<a href="' + websiteUrl + '" target="_blank" rel="noopener">' + websiteUrl + '</a>' : 'No URL');
    bar.appendChild(urlBar);
    browser.appendChild(bar);

    if (websiteUrl) {
      browser.appendChild(el('iframe', { src: websiteUrl, loading: 'lazy' }));
    }
    panel.appendChild(browser);

    // Live indicator
    if (websiteUrl) {
      const live = el('div', { className: 's3-live' });
      live.appendChild(el('span', { className: 's3-live-dot' }));
      const liveLink = html('span', null, '<a href="' + websiteUrl + '" target="_blank" rel="noopener">' + websiteUrl + '</a>');
      live.appendChild(liveLink);
      panel.appendChild(live);
    }

    // Pricing plans
    const bc = brand.build_config || {};
    if (bc.plans && bc.plans.length) {
      panel.appendChild(el('div', { className: 's3-card-label', style: { marginTop: '24px' } }, 'Pricing'));
      const plansGrid = el('div', { className: 's3-plans-grid' });
      bc.plans.forEach(plan => {
        const card = el('div', { className: 's3-plan-card' });
        card.appendChild(el('div', { className: 's3-plan-name' }, plan.name || ''));
        card.appendChild(el('div', { className: 's3-plan-price' }, plan.price != null ? '$' + plan.price : ''));
        if (plan.tagline) card.appendChild(el('div', { className: 's3-plan-tagline' }, plan.tagline));
        if (plan.items && plan.items.length) {
          plan.items.forEach(item => {
            card.appendChild(el('div', { className: 's3-plan-item' }, '+ ' + item));
          });
        }
        plansGrid.appendChild(card);
      });
      panel.appendChild(plansGrid);
    }

    panel.appendChild(annotation('AI decided', 'Copy was assembled from the brand strategy, template was injected with brand assets, and the site was deployed to Vercel — all automatically.'));

    return panel;
  }

  function renderStage6(brand, creatives) {
    const panel = el('div', { className: 's3-panel' });
    panel.appendChild(stageHeader('07', 'Ad Creatives'));
    panel.appendChild(el('p', { className: 's3-desc' }, '3 value propositions \u00d7 3 hook types = 9 captioned UGC ads, generated via Sora 2 with fal.ai auto-captions.'));

    // Build matrix from creatives
    const valuePropMap = {};
    const hookTypes = new Set();
    (creatives || []).forEach(c => {
      const vp = c.value_prop || 'Unknown';
      const ht = c.hook_type || 'Unknown';
      hookTypes.add(ht);
      if (!valuePropMap[vp]) valuePropMap[vp] = {};
      valuePropMap[vp][ht] = c;
    });
    const hookArr = Array.from(hookTypes);
    const vpArr = Object.keys(valuePropMap);

    if (vpArr.length && hookArr.length) {
      const matrixWrap = el('div', { className: 's3-ad-matrix' });
      const table = el('table');
      // Header row
      const thead = el('tr');
      thead.appendChild(el('th', null, 'Value Prop'));
      hookArr.forEach(h => thead.appendChild(el('th', null, h)));
      table.appendChild(thead);

      vpArr.forEach(vp => {
        const row = el('tr');
        row.appendChild(el('td', null, el('div', { className: 's3-ad-vp' }, vp)));
        hookArr.forEach(ht => {
          const td = el('td');
          const cell = el('div', { className: 's3-ad-cell' });
          const creative = valuePropMap[vp][ht];
          const videoUrl = creative && (creative.captioned_video_url || creative.video_url);
          if (videoUrl) {
            const video = el('video', { src: videoUrl, muted: 'true', loop: 'true', playsinline: 'true' });
            video.addEventListener('mouseenter', () => video.play());
            video.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
            cell.appendChild(video);
          } else {
            cell.appendChild(el('span', { className: 's3-ad-novideotext' }, 'No video'));
          }
          td.appendChild(cell);
          row.appendChild(td);
        });
        table.appendChild(row);
      });
      matrixWrap.appendChild(table);
      panel.appendChild(matrixWrap);
    }

    // Closing stats
    const closing = el('div', { className: 's3-closing' });
    closing.appendChild(html('div', { className: 's3-closing-heading' }, 'Brief to brand in <em>one session</em>'));

    const colors = (brand.build_config && brand.build_config.colors) || brand.colors || {};
    const moodCount = (brand.research_moodboard
      ? brand.research_moodboard.reduce((n, g) => n + (g.images || []).length, 0)
      : (brand.mood_image_urls || []).length);

    const stats = [
      { value: 7, label: 'Pipeline stages' },
      { value: Object.keys(colors).length, label: 'Color tokens' },
      { value: moodCount, label: 'Research images' },
      { value: (creatives || []).length, label: 'Ad creatives' },
    ];

    const statsGrid = el('div', { className: 's3-stats-grid' });
    stats.forEach(s => {
      const stat = el('div');
      const numEl = el('div', { className: 's3-stat-num' }, '0');
      stat.appendChild(numEl);
      stat.appendChild(el('div', { className: 's3-stat-label' }, s.label));
      statsGrid.appendChild(stat);
      // Animate after a brief delay to let the panel fade in
      setTimeout(() => animateCount(numEl, s.value, 1000), 300);
    });
    closing.appendChild(statsGrid);
    panel.appendChild(closing);

    return panel;
  }

  /* ═══════════════════════════════════════════
     MAIN INIT
     ═══════════════════════════════════════════ */

  window.initScene3 = function (container) {
    injectStyles();

    container.innerHTML = '';
    container.className = (container.className || '').replace(/\bscene3\b/g, '').trim() + ' scene3';

    // State
    let activeStage = 0;
    let allBrands = [];
    let currentTestId = DEFAULT_TEST_ID;
    let brand = null;
    let creatives = [];
    let autoPlayInterval = null;
    let isPlaying = false;

    // DOM refs
    let dropdownEl = null;
    let dropdownOpen = false;
    let playBtn = null;
    let stageButtons = [];
    let timelineFill = null;
    let counterValue = null;
    let sliderEl = null;
    let mainContent = null;
    let currentPanel = null;

    /* ── Build Layout ── */

    // Sidebar
    const sidebar = el('div', { className: 's3-sidebar' });

    // Sidebar top: brand picker + play button
    const sidebarTop = el('div', { className: 's3-sidebar-top' });

    // Brand picker
    const pickerWrap = el('div', { className: 's3-brand-picker' });
    const brandTrigger = html('button', { className: 's3-brand-trigger' }, 'Loading brands...' + ' ' + chevronSvg());
    pickerWrap.appendChild(brandTrigger);
    dropdownEl = el('div', { className: 's3-brand-dropdown' });
    pickerWrap.appendChild(dropdownEl);
    sidebarTop.appendChild(pickerWrap);

    brandTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownOpen = !dropdownOpen;
      dropdownEl.classList.toggle('open', dropdownOpen);
    });

    // Close dropdown on outside click / escape
    document.addEventListener('click', () => { dropdownOpen = false; dropdownEl.classList.remove('open'); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { dropdownOpen = false; dropdownEl.classList.remove('open'); }
    });

    // Play button
    playBtn = el('button', { className: 's3-play-btn' }, 'Play');
    playBtn.addEventListener('click', toggleAutoPlay);
    sidebarTop.appendChild(playBtn);

    sidebar.appendChild(sidebarTop);

    // Timeline
    const timeline = el('div', { className: 's3-timeline' });
    timeline.appendChild(el('div', { className: 's3-timeline-track' }));
    timelineFill = el('div', { className: 's3-timeline-fill' });
    timeline.appendChild(timelineFill);

    STAGES.forEach((stage, i) => {
      const btn = el('button', { className: 's3-stage-btn' + (i === 0 ? ' active' : '') });
      btn.addEventListener('click', () => setStage(i));

      const node = el('div', { className: 's3-node ' + (i === 0 ? 'active' : 'future') });
      node.textContent = stage.number;
      btn.appendChild(node);

      const text = el('div', { className: 's3-stage-text' });
      text.appendChild(el('span', { className: 's3-stage-title' }, stage.title));
      text.appendChild(el('span', { className: 's3-stage-sub' }, stage.subtitle));
      btn.appendChild(text);

      timeline.appendChild(btn);
      stageButtons.push({ btn, node });
    });

    sidebar.appendChild(timeline);

    // Counter + slider
    const counter = el('div', { className: 's3-counter' });
    counter.appendChild(el('div', { className: 's3-counter-label' }, 'Stage'));
    counterValue = el('div', { className: 's3-counter-value' }, '1 / 7');
    counter.appendChild(counterValue);
    sliderEl = el('input', { className: 's3-slider', type: 'range', min: '0', max: '6', value: '0', step: '1' });
    sliderEl.addEventListener('input', () => setStage(parseInt(sliderEl.value, 10)));
    counter.appendChild(sliderEl);
    sidebar.appendChild(counter);

    // Main content
    const mainWrap = el('div', { className: 's3-main' });
    mainContent = el('div', { className: 's3-content' });
    mainContent.appendChild(el('div', { className: 's3-loading' }, 'Loading brand data...'));
    mainWrap.appendChild(mainContent);

    container.appendChild(sidebar);
    container.appendChild(mainWrap);

    /* ── Stage Management ── */

    function setStage(index) {
      if (index < 0 || index > 6) return;
      activeStage = index;
      updateTimeline();
      renderActivePanel();
    }

    function updateTimeline() {
      stageButtons.forEach(({ btn, node }, i) => {
        btn.classList.toggle('active', i === activeStage);
        node.className = 's3-node ' + (i === activeStage ? 'active' : (i < activeStage ? 'past' : 'future'));
        if (i < activeStage) {
          node.innerHTML = checkSvg();
        } else {
          node.textContent = STAGES[i].number;
        }
      });

      // Fill height
      const totalButtons = stageButtons.length;
      const pct = totalButtons > 1 ? (activeStage / (totalButtons - 1)) * 100 : 0;
      timelineFill.style.height = pct + '%';

      // Counter + slider
      counterValue.textContent = (activeStage + 1) + ' / 7';
      sliderEl.value = activeStage;
    }

    function renderActivePanel() {
      if (!brand) return;

      // Remove old panel
      if (currentPanel) {
        currentPanel.classList.remove('visible');
      }

      mainContent.innerHTML = '';

      const renderers = [renderStage0, renderStage1, renderStage2, renderStage3, renderStage4, renderStage5, renderStage6];
      const renderer = renderers[activeStage];
      const panel = activeStage === 6 ? renderer(brand, creatives) : renderer(brand);
      mainContent.appendChild(panel);
      currentPanel = panel;

      // Trigger fade-in on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          panel.classList.add('visible');
        });
      });

      // Scroll main to top
      mainContent.parentElement.scrollTop = 0;
    }

    /* ── Auto-play ── */

    function toggleAutoPlay() {
      if (isPlaying) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    }

    function startAutoPlay() {
      isPlaying = true;
      playBtn.textContent = 'Pause';
      autoPlayInterval = setInterval(() => {
        if (activeStage >= 6) {
          stopAutoPlay();
          return;
        }
        setStage(activeStage + 1);
      }, 4000);
    }

    function stopAutoPlay() {
      isPlaying = false;
      playBtn.textContent = 'Play';
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    /* ── Brand Switching ── */

    function populateDropdown() {
      dropdownEl.innerHTML = '';
      allBrands.forEach(b => {
        const opt = el('button', { className: 's3-brand-option' }, b.brand_name || b.test_id);
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdownOpen = false;
          dropdownEl.classList.remove('open');
          if (b.test_id !== currentTestId) {
            currentTestId = b.test_id;
            loadBrand();
          }
        });
        dropdownEl.appendChild(opt);
      });
    }

    function updateTriggerLabel() {
      const name = brand ? (brand.brand_name || currentTestId) : currentTestId;
      brandTrigger.innerHTML = escapeHtml(name) + ' ' + chevronSvg();
    }

    function escapeHtml(str) {
      const d = document.createElement('div');
      d.textContent = str;
      return d.innerHTML;
    }

    /* ── Data Loading ── */

    async function loadBrand() {
      stopAutoPlay();
      activeStage = 0;
      updateTimeline();

      mainContent.innerHTML = '';
      mainContent.appendChild(el('div', { className: 's3-loading' }, 'Loading brand data...'));

      const [brandData, creativesData] = await Promise.all([
        queryConvex('functions/brand_assets:getBrandAsset', { test_id: currentTestId }),
        queryConvex('functions/creatives:getCreativesForTest', { test_id: currentTestId }),
      ]);

      brand = brandData;
      creatives = creativesData || [];

      if (!brand) {
        mainContent.innerHTML = '';
        mainContent.appendChild(el('div', { className: 's3-loading', style: { animation: 'none', opacity: '1' } }, 'Failed to load brand data.'));
        return;
      }

      updateTriggerLabel();
      renderActivePanel();
    }

    async function init() {
      // Fetch brand list
      const brands = await queryConvex('functions/brand_assets:listAllBrandAssets', {});
      allBrands = brands || [];
      populateDropdown();

      // Load default brand
      await loadBrand();
    }

    init();
  };
})();
