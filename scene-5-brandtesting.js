// scene-5-brandtesting.js — Brand Testing / Fake Door Testing (Scene 5)
// Exports: window.initScene5(container)

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     CONSTANTS
     ═══════════════════════════════════════════ */

  const STAGES = [
    { key: 'launch',   number: '01', title: 'Launch Test',        subtitle: 'Meta ads go live for 3 brand candidates' },
    { key: 'week1',    number: '02', title: 'Week 1 Kill Screen', subtitle: 'CPL thresholds determine which brands survive' },
    { key: 'creative', number: '03', title: 'Creative Iteration', subtitle: 'Surviving brands get new hooks & angles' },
    { key: 'week2',    number: '04', title: 'Week 2 Results',     subtitle: 'Final performance data after optimization' },
    { key: 'verdict',  number: '05', title: 'Test Verdict',        subtitle: 'Composite scoring decides launch readiness' },
  ];

  const BRANDS = [
    {
      name: 'Specter',
      tagline: 'Privacy-first mobile for the post-breach era',
      testId: 'fdt_midnight_maker_1772597219',
      week1: { cpl: 8.20, hookRate: 4.1, ctr: 1.8, formCompletion: 62, qualifierPass: 71 },
      week2: { cpl: 4.50, hookRate: 6.3, ctr: 3.2, formCompletion: 78, qualifierPass: 84 },
      daily: {
        cpl:  [14.5, 11.2, 9.8, 8.9, 8.4, 8.3, 8.2],
        hook: [2.1, 2.8, 3.2, 3.6, 3.9, 4.0, 4.1],
        ctr:  [0.9, 1.1, 1.3, 1.5, 1.6, 1.7, 1.8],
      },
      status: 'launch',
      fdt: { marketPull: 82, switchingReadiness: 78, scalePotential: 71, index: 77.85 },
      spend: 2400, leads: 533,
      bestHook: 'Your carrier sells your location data.',
      creativeVideos: [
        'https://v3b.fal.media/files/b/0a91c0b5/bBZ066w33b7izYIscDdtW_ofxOHfrfE28G2UDWMQCAK_output.mp4',
        'https://v3b.fal.media/files/b/0a91c0b6/W-b4Lf4viASheq9j8QTFi_dqexkcKY7Z_bGGxUwbEXS_output.mp4',
        'https://v3b.fal.media/files/b/0a91c0b6/O2VmSVkPk5ajP5-pS2x0A_6Zst-Dm__Ngkyka9uHDqc_output.mp4',
      ],
      creativeLabels: ['Mullvad VPN — Discovery', 'Mullvad VPN — Frustration', 'Mullvad VPN — Social Proof'],
      winnerCreatives: [0, 2],
      loserCreatives: [1],
      /* Extra Specter videos for new creatives in iteration */
      iterationVideos: [
        'https://v3b.fal.media/files/b/0a91c0b6/OrbURImpKQoEJOELlYWhE_0nYaziUEUsPS-yVbw10CU_output.mp4',
        'https://v3b.fal.media/files/b/0a91c0b6/ZQmKzzO2FBDxI-gbEwtPe_iAK7sOXi4R7llux7GUSIb_output.mp4',
        'https://v3b.fal.media/files/b/0a91c0b7/BFw24X9qRuMCiTxuIzQVT_XHWmd9KbPT0y9TxRJGhJ8_output.mp4',
      ],
      iterationLabels: ['Metadata Dashboard — Discovery', 'Metadata Dashboard — Frustration', 'IMSI Rotation — Discovery'],
    },
    {
      name: 'Mutt Mobile',
      tagline: 'The phone plan that includes your dog',
      testId: 'fdt_midnight_maker_1772638457',
      week1: { cpl: 22.40, hookRate: 1.2, ctr: 0.6, formCompletion: 28, qualifierPass: 34 },
      week2: null,
      daily: {
        cpl:  [28.0, 26.5, 25.1, 24.0, 23.2, 22.8, 22.4],
        hook: [0.8, 0.9, 1.0, 1.0, 1.1, 1.1, 1.2],
        ctr:  [0.3, 0.4, 0.4, 0.5, 0.5, 0.6, 0.6],
      },
      status: 'killed',
      fdt: null,
      spend: 800, leads: 36,
      bestHook: 'Your dog deserves GPS. Your plan should include it.',
      creativeVideos: [
        'https://v3b.fal.media/files/b/0a90d694/AtMLpRsuSYAt3pjLTTLit_output.mp4',
        'https://v3b.fal.media/files/b/0a90d681/tf3NqN3V39QDU39LSKAxM_output.mp4',
        'https://v3b.fal.media/files/b/0a90d683/nOQjYsLQMVIa0rU0zAh2R_output.mp4',
      ],
      creativeLabels: ['Dog GPS — Discovery', 'Lost Pet — Frustration', 'Pack Walks — Social Proof'],
      winnerCreatives: [],
      loserCreatives: [0, 1, 2],
    },
    {
      name: 'Vault',
      tagline: 'Your phone number is a security perimeter',
      testId: 'fdt_crypto_persona_mmbvqf1o',
      week1: { cpl: 6.80, hookRate: 3.4, ctr: 2.1, formCompletion: 55, qualifierPass: 58 },
      week2: { cpl: 7.10, hookRate: 3.1, ctr: 1.9, formCompletion: 52, qualifierPass: 55 },
      daily: {
        cpl:  [10.2, 8.8, 7.9, 7.4, 7.1, 6.9, 6.8],
        hook: [2.4, 2.8, 3.0, 3.1, 3.2, 3.3, 3.4],
        ctr:  [1.4, 1.6, 1.8, 1.9, 2.0, 2.0, 2.1],
      },
      status: 'iterate',
      fdt: { marketPull: 61, switchingReadiness: 48, scalePotential: 55, index: 55.15 },
      spend: 1800, leads: 257,
      bestHook: 'SIM swaps cost crypto holders $68M last year.',
      creativeVideos: [
        'https://v3b.fal.media/files/b/0a90d3f1/a-L6TV4BXxBq75B3or0p4_output.mp4',
        'https://v3b.fal.media/files/b/0a90d3f3/IwEr92wOGRB70q6oQYsKT_output.mp4',
        'https://v3b.fal.media/files/b/0a90d3f2/FsC7SXJ7bkye3HxWxsiuB_output.mp4',
      ],
      creativeLabels: ['Cold Storage — Discovery', 'SIM Swap Shield — Frustration', 'Hardware Key — Social Proof'],
      winnerCreatives: [0],
      loserCreatives: [1, 2],
    },
  ];

  /* Brand colors for charts */
  const BRAND_COLORS = ['#10b981', '#ef4444', '#f59e0b'];

  /* ═══════════════════════════════════════════
     STYLES
     ═══════════════════════════════════════════ */

  function injectStyles() {
    if (document.getElementById('scene5-styles')) return;
    const style = document.createElement('style');
    style.id = 'scene5-styles';
    style.textContent = `
      .scene5 {
        display: flex;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #fff;
      }

      /* ── Sidebar ── */
      .scene5 .s5-sidebar {
        width: 280px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(38,38,38,0.5);
        overflow-x: hidden;
      }
      .scene5 .s5-sidebar-top {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px 20px 16px;
      }
      .scene5 .s5-sidebar-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #525252;
      }
      .scene5 .s5-sidebar-title {
        font-size: 15px;
        font-weight: 500;
        color: #fff;
        line-height: 1.4;
      }

      /* Play button */
      .scene5 .s5-play-area { padding: 0 20px 20px; }
      .scene5 .s5-play-btn {
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
      .scene5 .s5-play-btn:hover { background: #e5e5e5; }

      /* Timeline */
      .scene5 .s5-timeline { flex: 1; overflow-y: auto; padding: 0 12px; }
      .scene5 .s5-timeline-inner { position: relative; }
      .scene5 .s5-timeline-track {
        position: absolute; left: 19px; top: 0; bottom: 0; width: 1px;
        background: rgba(38,38,38,0.6);
      }
      .scene5 .s5-timeline-fill {
        position: absolute; left: 19px; top: 0; width: 1px;
        background: rgba(52,211,153,0.4);
        transition: height 0.5s ease-out;
      }
      .scene5 .s5-stage-btn {
        display: flex; align-items: flex-start; gap: 12px; width: 100%;
        padding: 12px 8px; background: transparent; border: none; cursor: pointer;
        position: relative; text-align: left; border-radius: 8px;
        transition: background 0.15s; font-family: inherit;
      }
      .scene5 .s5-stage-btn:hover { background: rgba(38,38,38,0.15); }
      .scene5 .s5-stage-btn.active { background: rgba(38,38,38,0.3); }
      .scene5 .s5-node {
        width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-family: 'JetBrains Mono', monospace; font-size: 9px;
        transition: all 0.3s ease; position: relative; z-index: 2; margin-top: 2px;
      }
      .scene5 .s5-node.future { background: #262626; border: 1px solid #404040; color: #737373; }
      .scene5 .s5-node.active { background: #fff; box-shadow: 0 0 20px rgba(255,255,255,0.2); color: #000; }
      .scene5 .s5-node.past { background: rgba(52,211,153,0.3); border: 1px solid rgba(52,211,153,0.4); color: #10b981; }
      .scene5 .s5-dot-inner { width: 8px; height: 8px; border-radius: 50%; background: #000; }
      .scene5 .s5-dot-number { font-size: 8px; font-family: 'JetBrains Mono', monospace; color: #525252; }
      .scene5 .s5-stage-text { display: flex; flex-direction: column; gap: 2px; padding-top: 2px; min-width: 0; }
      .scene5 .s5-stage-title { font-size: 14px; font-weight: 500; color: #525252; transition: color 0.2s; }
      .scene5 .s5-stage-btn.active .s5-stage-title { color: #fff; }
      .scene5 .s5-stage-sub { font-size: 11px; color: #525252; line-height: 1.4; }
      .scene5 .s5-stage-btn.active .s5-stage-sub { color: #a3a3a3; }

      /* Counter */
      .scene5 .s5-counter { padding: 16px 20px; border-top: 1px solid rgba(38,38,38,0.5); }
      .scene5 .s5-counter-label {
        font-size: 10px; font-family: 'JetBrains Mono', monospace;
        text-transform: uppercase; letter-spacing: 0.2em; color: #525252;
        display: block; margin-bottom: 8px;
      }
      .scene5 .s5-counter-value {
        font-size: 14px; font-family: 'JetBrains Mono', monospace;
        color: #fff; font-variant-numeric: tabular-nums;
      }
      .scene5 .s5-slider {
        margin-top: 12px; width: 100%; height: 4px;
        -webkit-appearance: none; appearance: none;
        background: #262626; border-radius: 9999px; cursor: pointer; outline: none;
      }
      .scene5 .s5-slider::-webkit-slider-thumb {
        -webkit-appearance: none; width: 12px; height: 12px;
        border-radius: 50%; background: #fff; cursor: pointer;
      }
      .scene5 .s5-slider::-moz-range-thumb {
        width: 14px; height: 14px; border-radius: 50%;
        background: #fff; cursor: pointer; border: none;
      }

      /* ── Main Content ── */
      .scene5 .s5-main { flex: 1; overflow-y: auto; display: flex; justify-content: center; }
      .scene5 .s5-content { max-width: 940px; width: 100%; padding: 48px 40px; }

      /* Panels */
      .scene5 .s5-panel {
        opacity: 0; transform: translateY(12px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .scene5 .s5-panel.visible { opacity: 1; transform: translateY(0); }

      /* Stage header */
      .scene5 .s5-stage-header { margin-bottom: 32px; }
      .scene5 .s5-stage-number {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555;
        text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;
      }
      .scene5 .s5-stage-heading {
        font-family: 'Instrument Serif', Georgia, serif; font-size: 36px;
        font-weight: 400; color: #fff; letter-spacing: -0.02em;
      }
      .scene5 .s5-desc { color: #999; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }

      /* Terminal box */
      .scene5 .s5-code-box {
        border-radius: 12px; border: 1px solid rgba(38,38,38,0.8);
        background: rgba(23,23,23,0.4); overflow: hidden; margin-bottom: 24px;
      }
      .scene5 .s5-code-topbar {
        display: flex; align-items: center; gap: 8px;
        padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .scene5 .s5-wdot { width: 10px; height: 10px; border-radius: 50%; }
      .scene5 .s5-wdot-r { background: rgba(255,95,87,0.4); }
      .scene5 .s5-wdot-y { background: rgba(255,189,46,0.4); }
      .scene5 .s5-wdot-g { background: rgba(39,201,63,0.4); }
      .scene5 .s5-code-file {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #555; margin-left: 8px;
      }
      .scene5 .s5-code-content {
        padding: 20px; font-family: 'JetBrains Mono', monospace;
        font-size: 12px; line-height: 1.8; color: #a3a3a3; white-space: pre-wrap;
        min-height: 60px;
      }
      .scene5 .s5-cursor {
        display: inline-block; width: 7px; height: 14px;
        background: rgba(16,185,129,0.7);
        animation: s5blink 0.8s step-end infinite;
        vertical-align: text-bottom; margin-left: 1px;
      }
      @keyframes s5blink { 50% { opacity: 0; } }

      /* Annotation */
      .scene5 .s5-annotation { margin-top: 32px; padding-left: 16px; border-left: 2px solid rgba(64,64,64,0.4); }
      .scene5 .s5-annotation-badge {
        display: inline-block; margin-bottom: 6px; padding: 2px 8px;
        font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em;
        font-family: 'JetBrains Mono', monospace; color: #737373;
        background: rgba(64,64,64,0.4); border-radius: 4px;
      }
      .scene5 .s5-annotation p { color: #737373; font-size: 14px; line-height: 1.6; }

      /* Brand cards grid */
      .scene5 .s5-brand-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
      .scene5 .s5-brand-card {
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px; padding: 20px; display: flex; flex-direction: column;
      }
      .scene5 .s5-brand-card.winner { border-color: rgba(16,185,129,0.4); }
      .scene5 .s5-brand-card.killed { border-color: rgba(239,68,68,0.3); opacity: 0.5; }
      .scene5 .s5-brand-card.iterate { border-color: rgba(245,158,11,0.3); }
      .scene5 .s5-brand-name {
        font-family: 'Instrument Serif', Georgia, serif; font-size: 22px;
        font-weight: 400; color: #fff; margin-bottom: 4px;
      }
      .scene5 .s5-brand-tagline { font-size: 12px; color: #737373; margin-bottom: 12px; line-height: 1.4; }

      /* Metric rows */
      .scene5 .s5-metric-row {
        display: flex; justify-content: space-between; align-items: baseline;
        padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
      }
      .scene5 .s5-metric-row:last-child { border-bottom: none; }
      .scene5 .s5-metric-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; flex-shrink: 0;
      }
      .scene5 .s5-metric-value {
        font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #d4d4d4;
        font-variant-numeric: tabular-nums; text-align: right;
      }
      .scene5 .s5-metric-value.green { color: #10b981; }
      .scene5 .s5-metric-value.amber { color: #f59e0b; }
      .scene5 .s5-metric-value.red { color: #ef4444; }

      /* Status badge */
      .scene5 .s5-status {
        display: inline-block; padding: 3px 10px; width: fit-content;
        font-family: 'JetBrains Mono', monospace; font-size: 10px;
        text-transform: uppercase; letter-spacing: 0.1em; border-radius: 9999px; margin-bottom: 8px;
      }
      .scene5 .s5-status.launch { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
      .scene5 .s5-status.killed { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
      .scene5 .s5-status.iterate { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
      .scene5 .s5-status.active { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }

      /* Creative carousel (video) */
      .scene5 .s5-carousel-wrap {
        margin-top: 12px; position: relative; overflow: hidden;
        border-radius: 8px; aspect-ratio: 9/16; max-height: 280px;
        background: rgba(38,38,38,0.3);
        border: 1px solid rgba(255,255,255,0.06);
      }
      .scene5 .s5-carousel-vid {
        width: 100%; height: 100%; object-fit: cover; position: absolute;
        top: 0; left: 0; opacity: 0; transition: opacity 0.6s ease;
      }
      .scene5 .s5-carousel-vid.active { opacity: 1; }
      .scene5 .s5-carousel-label {
        font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #525252;
        margin-top: 6px; text-align: center; height: 14px;
      }
      .scene5 .s5-carousel-dots {
        display: flex; justify-content: center; gap: 4px; margin-top: 4px;
      }
      .scene5 .s5-carousel-dot {
        width: 4px; height: 4px; border-radius: 50%; background: #333;
        transition: background 0.3s;
      }
      .scene5 .s5-carousel-dot.active { background: #999; }
      .scene5 .s5-carousel-nav {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 28px; height: 28px; border-radius: 50%;
        background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15);
        color: #fff; display: flex; align-items: center; justify-content: center;
        cursor: pointer; z-index: 2; opacity: 0; transition: opacity 0.2s;
      }
      .scene5 .s5-carousel-wrap:hover .s5-carousel-nav { opacity: 1; }
      .scene5 .s5-carousel-nav:hover { background: rgba(0,0,0,0.8); }
      .scene5 .s5-carousel-prev { left: 8px; }
      .scene5 .s5-carousel-next { right: 8px; }
      .scene5 .s5-carousel-play-overlay {
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        display: flex; align-items: center; justify-content: center;
        z-index: 3; cursor: pointer; transition: opacity 0.3s ease;
      }
      .scene5 .s5-carousel-play-overlay.hidden { opacity: 0; pointer-events: none; }
      .scene5 .s5-carousel-play-icon {
        width: 48px; height: 48px; border-radius: 50%;
        background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2);
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
        transition: transform 0.2s ease, background 0.2s ease;
      }
      .scene5 .s5-carousel-play-overlay:hover .s5-carousel-play-icon {
        transform: scale(1.1); background: rgba(0,0,0,0.8);
      }

      /* Charts */
      .scene5 .s5-chart-section { margin-bottom: 32px; }
      .scene5 .s5-chart-title {
        font-family: 'JetBrains Mono', monospace; font-size: 11px;
        text-transform: uppercase; letter-spacing: 0.1em; color: #555; margin-bottom: 12px;
      }
      .scene5 .s5-chart-wrap {
        background: rgba(23,23,23,0.4); border: 1px solid rgba(38,38,38,0.8);
        border-radius: 12px; padding: 20px; position: relative;
      }
      .scene5 .s5-chart-legend {
        display: flex; gap: 16px; margin-bottom: 12px;
      }
      .scene5 .s5-legend-item {
        display: flex; align-items: center; gap: 6px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #737373;
      }
      .scene5 .s5-legend-dot { width: 8px; height: 8px; border-radius: 50%; }

      /* Creative winner/loser */
      .scene5 .s5-creative-grid {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;
      }
      .scene5 .s5-creative-card {
        border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06);
        position: relative;
      }
      .scene5 .s5-creative-card video {
        width: 100%; aspect-ratio: 9/16; max-height: 240px; object-fit: cover; display: block;
      }
      .scene5 .s5-creative-badge {
        position: absolute; top: 8px; right: 8px; padding: 2px 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 9px;
        text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;
      }
      .scene5 .s5-creative-badge.winner { background: rgba(16,185,129,0.9); color: #000; }
      .scene5 .s5-creative-badge.loser { background: rgba(239,68,68,0.9); color: #fff; }
      .scene5 .s5-creative-meta {
        padding: 8px 10px; background: rgba(23,23,23,0.8);
        font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #737373;
      }

      /* Diffusion effect (video) */
      .scene5 .s5-diffusion-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
      .scene5 .s5-diffusion-card {
        border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06);
      }
      .scene5 .s5-diffusion-vid {
        width: 100%; aspect-ratio: 9/16; max-height: 240px; object-fit: cover; display: block;
        filter: blur(30px) brightness(0.6) saturate(0.3);
        transition: filter 4s ease-out;
      }
      .scene5 .s5-diffusion-vid.revealed { filter: blur(0px) brightness(1) saturate(1); }
      .scene5 .s5-diffusion-label {
        padding: 8px 10px; background: rgba(23,23,23,0.8);
        font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #525252;
      }
      .scene5 .s5-new-badge {
        display: inline-block; padding: 1px 6px; background: rgba(16,185,129,0.2);
        color: #10b981; font-size: 9px; border-radius: 3px; margin-left: 4px;
        text-transform: uppercase; letter-spacing: 0.05em;
      }

      /* Animated bars */
      .scene5 .s5-bar-chart { margin-bottom: 24px; }
      .scene5 .s5-bar-row {
        display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
      }
      .scene5 .s5-bar-label {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373;
        width: 120px; flex-shrink: 0; text-align: right;
      }
      .scene5 .s5-bar-track {
        flex: 1; height: 24px; background: #1a1a1a; border-radius: 4px;
        overflow: hidden; position: relative;
      }
      .scene5 .s5-bar-fill {
        height: 100%; border-radius: 4px; transition: width 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        display: flex; align-items: center; justify-content: flex-end; padding-right: 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #000; font-weight: 500;
        min-width: 0;
      }
      .scene5 .s5-bar-val {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373;
        width: 60px; flex-shrink: 0; text-align: left;
      }

      /* FDT bars */
      .scene5 .s5-fdt-bar {
        height: 8px; border-radius: 4px; background: #262626;
        overflow: hidden; margin: 6px 0 4px;
      }
      .scene5 .s5-fdt-fill {
        height: 100%; border-radius: 4px; transition: width 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      /* Verdict columns */
      .scene5 .s5-verdict-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
      .scene5 .s5-verdict-card {
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px; padding: 20px;
      }
      .scene5 .s5-verdict-card.launch-card { border-color: rgba(16,185,129,0.4); }
      .scene5 .s5-verdict-card.killed-card { border-color: rgba(239,68,68,0.2); opacity: 0.5; }
      .scene5 .s5-verdict-card.iterate-card { border-color: rgba(245,158,11,0.3); }

      /* Cards */
      .scene5 .s5-card {
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
        border-radius: 12px; padding: 24px; margin-bottom: 20px;
      }
      .scene5 .s5-card-label {
        font-family: 'JetBrains Mono', monospace; font-size: 10px;
        text-transform: uppercase; letter-spacing: 0.15em; color: #555; margin-bottom: 12px;
      }
      .scene5 .s5-card-text { color: #d4d4d4; font-size: 15px; line-height: 1.7; }

      /* Stats grid */
      .scene5 .s5-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
      .scene5 .s5-stat-num {
        font-family: 'JetBrains Mono', monospace; font-size: 28px;
        font-weight: 300; color: #fff; margin-bottom: 4px;
      }
      .scene5 .s5-stat-label {
        font-family: 'JetBrains Mono', monospace; font-size: 10px;
        text-transform: uppercase; letter-spacing: 0.1em; color: #525252;
      }

      /* Delta */
      .scene5 .s5-delta { font-size: 11px; margin-left: 4px; }
      .scene5 .s5-delta.up { color: #10b981; }
      .scene5 .s5-delta.down { color: #ef4444; }

      /* Section divider */
      .scene5 .s5-section-label {
        font-family: 'JetBrains Mono', monospace; font-size: 10px;
        text-transform: uppercase; letter-spacing: 0.15em; color: #555;
        margin-bottom: 16px; margin-top: 32px;
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
        if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
        else if (k === 'className') e.className = v;
        else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
        else e.setAttribute(k, v);
      }
    }
    if (children != null) {
      if (typeof children === 'string') e.textContent = children;
      else if (Array.isArray(children)) children.forEach(c => { if (c) e.appendChild(c); });
      else if (children instanceof Node) e.appendChild(children);
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
  function playSvg() {
    return '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 2l10 6-10 6V2z" fill="currentColor"/></svg>';
  }
  function pauseSvg() {
    return '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="4" height="12" rx="1" fill="currentColor"/><rect x="9" y="2" width="4" height="12" rx="1" fill="currentColor"/></svg>';
  }
  function replaySvg() {
    return '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 1 1 1.76 4.24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 4v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function annotation(badgeText, desc) {
    const wrap = el('div', { className: 's5-annotation' });
    wrap.appendChild(el('span', { className: 's5-annotation-badge' }, badgeText));
    wrap.appendChild(el('p', null, desc));
    return wrap;
  }

  function stageHeader(number, title) {
    const wrap = el('div', { className: 's5-stage-header' });
    wrap.appendChild(el('div', { className: 's5-stage-number' }, 'Stage ' + number));
    wrap.appendChild(el('div', { className: 's5-stage-heading' }, title));
    return wrap;
  }

  function cplColor(cpl) {
    if (cpl < 5) return 'green';
    if (cpl <= 10) return 'amber';
    return 'red';
  }

  function metricRow(label, value, colorClass) {
    const row = el('div', { className: 's5-metric-row' });
    row.appendChild(el('span', { className: 's5-metric-label' }, label));
    row.appendChild(el('span', { className: 's5-metric-value' + (colorClass ? ' ' + colorClass : '') }, value));
    return row;
  }

  /* Cleanup registry — timers and intervals to clear when switching stages */
  let cleanupFns = [];
  function registerCleanup(fn) { cleanupFns.push(fn); }
  function runCleanups() { cleanupFns.forEach(fn => fn()); cleanupFns = []; }

  /* ── Viewport trigger ── */
  // Fires callback once when element enters viewport (within the .s5-main scroller).
  // Returns a cleanup fn.
  function onViewport(element, callback, opts) {
    const threshold = (opts && opts.threshold) || 0.15;
    let fired = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          callback();
          observer.disconnect();
        }
      });
    }, { threshold: threshold });
    // Observe after next frame so element is in the DOM
    requestAnimationFrame(() => observer.observe(element));
    const cleanup = () => { observer.disconnect(); };
    registerCleanup(cleanup);
    return cleanup;
  }

  /* ── Typewriter terminal ── */
  function typewriterBox(filename, lines, speed) {
    speed = speed || 22;
    const box = el('div', { className: 's5-code-box' });
    const topbar = html('div', { className: 's5-code-topbar' },
      '<span class="s5-wdot s5-wdot-r"></span><span class="s5-wdot s5-wdot-y"></span><span class="s5-wdot s5-wdot-g"></span>' +
      '<span class="s5-code-file">' + filename + '</span>');
    box.appendChild(topbar);
    const content = el('div', { className: 's5-code-content' });
    box.appendChild(content);

    const fullText = lines.join('\n');
    let idx = 0;
    let cancelled = false;

    function tick() {
      if (cancelled) return;
      if (idx < fullText.length) {
        const chunk = Math.min(2, fullText.length - idx);
        content.textContent = fullText.slice(0, idx + chunk);
        idx += chunk;
        const cursor = document.createElement('span');
        cursor.className = 's5-cursor';
        content.appendChild(cursor);
        content.scrollTop = content.scrollHeight;
        requestAnimationFrame(() => setTimeout(tick, speed));
      } else {
        setTimeout(() => {
          const c = content.querySelector('.s5-cursor');
          if (c) c.remove();
        }, 2000);
      }
    }

    // Wait until visible before starting
    onViewport(box, () => {
      requestAnimationFrame(() => tick());
    });

    registerCleanup(() => { cancelled = true; });
    return box;
  }

  /* ── Creative carousel (video) ── */
  function createCarousel(videos, labels) {
    const wrap = el('div', { className: 's5-carousel-wrap' });
    let playing = false;

    // Play overlay
    const playOverlay = el('div', { className: 's5-carousel-play-overlay' });
    const playIcon = el('div', { className: 's5-carousel-play-icon' });
    playIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4.5L16 10L7 15.5V4.5Z" fill="white"/></svg>';
    playOverlay.appendChild(playIcon);

    function showOverlay() { playing = false; playOverlay.classList.remove('hidden'); }
    function hideOverlay() { playing = true; playOverlay.classList.add('hidden'); }

    const vids = videos.map((url, i) => {
      const vid = document.createElement('video');
      vid.className = 's5-carousel-vid' + (i === 0 ? ' active' : '');
      vid.src = url;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.preload = 'metadata';
      vid.setAttribute('playsinline', '');
      vid.addEventListener('pause', showOverlay);
      vid.addEventListener('play', hideOverlay);
      wrap.appendChild(vid);
      return vid;
    });

    // Click overlay or video to toggle play/pause
    function toggleCurrent() {
      const vid = vids[current];
      if (vid.paused) { vid.play().catch(() => {}); } else { vid.pause(); }
    }
    playOverlay.addEventListener('click', (e) => { e.stopPropagation(); toggleCurrent(); });
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('.s5-carousel-nav') || e.target.closest('.s5-carousel-play-overlay')) return;
      toggleCurrent();
    });

    const labelEl = el('div', { className: 's5-carousel-label' }, labels[0] || '');
    const dotsWrap = el('div', { className: 's5-carousel-dots' });
    const dots = videos.map((_, i) => {
      const d = el('div', { className: 's5-carousel-dot' + (i === 0 ? ' active' : '') });
      d.style.cursor = 'pointer';
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
      return d;
    });

    let current = 0;
    function goTo(idx) {
      if (idx === current) return;
      vids[current].classList.remove('active');
      vids[current].pause();
      dots[current].classList.remove('active');
      current = idx;
      vids[current].classList.add('active');
      vids[current].currentTime = 0;
      dots[current].classList.add('active');
      labelEl.textContent = labels[current] || '';
      showOverlay();
    }

    // Nav arrows
    const prevBtn = el('button', { className: 's5-carousel-nav s5-carousel-prev' });
    prevBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    prevBtn.addEventListener('click', () => goTo((current - 1 + videos.length) % videos.length));

    const nextBtn = el('button', { className: 's5-carousel-nav s5-carousel-next' });
    nextBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    nextBtn.addEventListener('click', () => goTo((current + 1) % videos.length));

    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);
    wrap.appendChild(playOverlay);

    const outer = el('div');
    outer.appendChild(wrap);
    outer.appendChild(labelEl);
    outer.appendChild(dotsWrap);
    return outer;
  }

  /* ── SVG Line Chart ── */
  function createLineChart(datasets, yLabel, yMax, yFormat, dayLabels) {
    // datasets: [{name, color, values:[7 numbers]}]
    const W = 500, H = 200, PAD_L = 50, PAD_R = 20, PAD_T = 10, PAD_B = 30;
    const plotW = W - PAD_L - PAD_R;
    const plotH = H - PAD_T - PAD_B;

    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', '100%');
    svg.style.display = 'block';

    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = PAD_T + (plotH / 4) * i;
      const line = document.createElementNS(svgNs, 'line');
      line.setAttribute('x1', PAD_L);
      line.setAttribute('x2', W - PAD_R);
      line.setAttribute('y1', y);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'rgba(255,255,255,0.06)');
      svg.appendChild(line);

      const val = yMax - (yMax / 4) * i;
      const text = document.createElementNS(svgNs, 'text');
      text.setAttribute('x', PAD_L - 8);
      text.setAttribute('y', y + 4);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('fill', '#555');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-family', "'JetBrains Mono', monospace");
      text.textContent = yFormat ? yFormat(val) : val.toFixed(1);
      svg.appendChild(text);
    }

    // Day labels
    const days = dayLabels || ['D1','D2','D3','D4','D5','D6','D7'];
    days.forEach((d, i) => {
      const x = PAD_L + (plotW / 6) * i;
      const text = document.createElementNS(svgNs, 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', H - 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#555');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-family', "'JetBrains Mono', monospace");
      text.textContent = d;
      svg.appendChild(text);
    });

    // Data lines (animated via stroke-dashoffset)
    datasets.forEach((ds) => {
      const points = ds.values.map((v, i) => {
        const x = PAD_L + (plotW / 6) * i;
        const y = PAD_T + plotH - (v / yMax) * plotH;
        return x + ',' + y;
      });
      const path = document.createElementNS(svgNs, 'path');
      const d = 'M' + points.join(' L');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', ds.color);
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      const len = 1200;
      path.setAttribute('stroke-dasharray', len);
      path.setAttribute('stroke-dashoffset', len);
      path.style.transition = 'stroke-dashoffset 3.5s ease-out';
      svg.appendChild(path);

      // Dots at each data point (appear after line animates)
      ds.values.forEach((v, i) => {
        const x = PAD_L + (plotW / 6) * i;
        const y = PAD_T + plotH - (v / yMax) * plotH;
        const circle = document.createElementNS(svgNs, 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', ds.color);
        circle.style.opacity = '0';
        circle.style.transition = 'opacity 0.4s ease';
        svg.appendChild(circle);
        // Store for viewport trigger
        path._dots = path._dots || [];
        path._dots.push({ circle, delay: 3500 + i * 200 });
      });
    });

    // Viewport-triggered animation
    onViewport(svg, () => {
      // Animate all paths
      svg.querySelectorAll('path').forEach(p => {
        p.setAttribute('stroke-dashoffset', '0');
        // Show dots after line finishes
        if (p._dots) {
          p._dots.forEach(({ circle, delay }) => {
            const timer = setTimeout(() => { circle.style.opacity = '1'; }, delay);
            registerCleanup(() => clearTimeout(timer));
          });
        }
      });
    });

    return svg;
  }

  /* ═══════════════════════════════════════════
     STAGE RENDERERS
     ═══════════════════════════════════════════ */

  function renderStage0() {
    const panel = el('div', { className: 's5-panel' });
    panel.appendChild(stageHeader('01', 'Launch Test'));
    panel.appendChild(el('p', { className: 's5-desc' },
      '3 brands from Brand Creation enter simultaneous Fake Door Tests via Meta Ads. Each brand gets identical budget and targets the persona cluster identified in the pipeline.'));

    // Animated terminal — Meta ads trafficking
    panel.appendChild(typewriterBox('meta-ads-trafficker.sh', [
      '$ gather fdt launch --platform meta --budget 800 --duration 2w',
      '',
      '▸ Connecting to Meta Business Manager...',
      '  ✓ Account: Gather Labs (act_2847291)',
      '  ✓ Pixel: gl-fdt-pixel (392847102)',
      '',
      '▸ Creating campaign: FDT-2026-Q1-Privacy-Cluster',
      '  Objective:     LEAD_GENERATION',
      '  Budget:        $800/week × 3 brands = $2,400/week',
      '  Audience:      Privacy-conscious, 25-45, US metro',
      '  Placements:    FB Feed, IG Feed, IG Stories, IG Reels',
      '',
      '▸ Trafficking SPECTER...',
      '  Ad Set: specter_privacy_mvno_broad',
      '  Uploading 3 creatives → Mullvad VPN, Metadata Dashboard, IMSI Rotation',
      '  Lead form: "Get early access to Specter" → zip + email',
      '  ✓ Ad Set LIVE — creative review passed',
      '',
      '▸ Trafficking MUTT MOBILE...',
      '  Ad Set: mutt_pet_gps_broad',
      '  Uploading 3 creatives → Dog GPS, Lost Pet, Pack Walks',
      '  Lead form: "Join the Mutt waitlist" → zip + email',
      '  ✓ Ad Set LIVE — creative review passed',
      '',
      '▸ Trafficking VAULT...',
      '  Ad Set: vault_crypto_security_broad',
      '  Uploading 3 creatives → Cold Storage, SIM Swap Shield, Hardware Key',
      '  Lead form: "Secure your number with Vault" → zip + email',
      '  ✓ Ad Set LIVE — creative review passed',
      '',
      '▸ All 3 ad sets live. Kill gates armed for Day 7.',
      '  Dashboard: https://gather.internal/fdt/2026-q1',
    ], 12));

    // Brand cards with creative carousels
    const grid = el('div', { className: 's5-brand-grid' });
    BRANDS.forEach(b => {
      const card = el('div', { className: 's5-brand-card' });
      card.appendChild(el('div', { className: 's5-brand-name' }, b.name));
      card.appendChild(el('div', { className: 's5-brand-tagline' }, b.tagline));
      card.appendChild(metricRow('Budget', '$800/week'));
      card.appendChild(metricRow('Creatives', b.creativeVideos.length + ' variants'));
      card.appendChild(createCarousel(b.creativeVideos, b.creativeLabels));
      grid.appendChild(card);
    });
    panel.appendChild(grid);

    panel.appendChild(annotation('AI decided', 'Brand selection based on persona-concept match scores from Stage 3. Budget allocation is equal — the market decides which brand resonates.'));
    return panel;
  }

  function renderStage1() {
    const panel = el('div', { className: 's5-panel' });
    panel.appendChild(stageHeader('02', 'Week 1 Kill Screen'));
    panel.appendChild(el('p', { className: 's5-desc' },
      'After 7 days of ad delivery, kill thresholds are applied. Watch the daily metrics converge — brands that fail any gate are terminated.'));

    // CPL chart
    const cplSection = el('div', { className: 's5-chart-section' });
    cplSection.appendChild(el('div', { className: 's5-chart-title' }, 'Cost Per Lead — Daily'));
    const cplWrap = el('div', { className: 's5-chart-wrap' });
    const cplLegend = el('div', { className: 's5-chart-legend' });
    BRANDS.forEach((b, i) => {
      const item = html('div', { className: 's5-legend-item' },
        '<span class="s5-legend-dot" style="background:' + BRAND_COLORS[i] + '"></span>' + b.name);
      cplLegend.appendChild(item);
    });
    cplWrap.appendChild(cplLegend);
    // Add $15 kill line label
    cplWrap.appendChild(createLineChart(
      BRANDS.map((b, i) => ({ name: b.name, color: BRAND_COLORS[i], values: b.daily.cpl })),
      'CPL', 30, v => '$' + v.toFixed(0)
    ));
    cplSection.appendChild(cplWrap);
    panel.appendChild(cplSection);

    // Hook Rate chart
    const hookSection = el('div', { className: 's5-chart-section' });
    hookSection.appendChild(el('div', { className: 's5-chart-title' }, 'Hook Rate — Daily'));
    const hookWrap = el('div', { className: 's5-chart-wrap' });
    hookWrap.appendChild(createLineChart(
      BRANDS.map((b, i) => ({ name: b.name, color: BRAND_COLORS[i], values: b.daily.hook })),
      'Hook %', 5, v => v.toFixed(1) + '%'
    ));
    hookSection.appendChild(hookWrap);
    panel.appendChild(hookSection);

    // Kill screen terminal
    panel.appendChild(typewriterBox('kill-screen-w1.log', [
      '▸ Processing kill gates for 3 brands...',
      '',
      '  SPECTER',
      '    CPL: $8.20         ■ AMBER  (< $15 ✓)',
      '    Hook Rate: 4.1%    ■ PASS   (> 1.5% ✓)',
      '    Form Comp: 62%     ■ PASS   (> 30% ✓)',
      '    ⟶ CONTINUE',
      '',
      '  MUTT MOBILE',
      '    CPL: $22.40        ■ FAIL   (> $15 ✕)',
      '    Hook Rate: 1.2%    ■ FAIL   (< 1.5% ✕)',
      '    Form Comp: 28%     ■ FAIL   (< 30% ✕)',
      '    ⟶ ✕ KILLED — 3/3 gates failed',
      '',
      '  VAULT',
      '    CPL: $6.80         ■ PASS   (< $15 ✓)',
      '    Hook Rate: 3.4%    ■ PASS   (> 1.5% ✓)',
      '    Form Comp: 55%     ■ PASS   (> 30% ✓)',
      '    ⟶ CONTINUE',
      '',
      '▸ 2 brands continue → 1 killed',
      '▸ Reallocating Mutt budget to survivors',
    ], 14));

    // Status cards
    const grid = el('div', { className: 's5-brand-grid' });
    BRANDS.forEach(b => {
      const isKilled = b.status === 'killed';
      const card = el('div', { className: 's5-brand-card' + (isKilled ? ' killed' : '') });
      card.appendChild(el('span', { className: 's5-status ' + (isKilled ? 'killed' : 'active') }, isKilled ? 'Killed' : 'Active'));
      card.appendChild(el('div', { className: 's5-brand-name' }, b.name));
      card.appendChild(metricRow('CPL', '$' + b.week1.cpl.toFixed(2), cplColor(b.week1.cpl)));
      card.appendChild(metricRow('Hook Rate', b.week1.hookRate + '%', b.week1.hookRate >= 1.5 ? 'green' : 'red'));
      card.appendChild(metricRow('Form %', b.week1.formCompletion + '%', b.week1.formCompletion >= 30 ? '' : 'red'));
      card.appendChild(metricRow('Qualifier', b.week1.qualifierPass + '%'));
      grid.appendChild(card);
    });
    panel.appendChild(grid);

    panel.appendChild(annotation('AI decided', 'Mutt Mobile failed all 3 kill gates. The pet-GPS-bundled-phone concept did not generate sufficient intent signals. Budget reallocated to surviving brands.'));
    return panel;
  }

  function renderStage2() {
    const panel = el('div', { className: 's5-panel' });
    panel.appendChild(stageHeader('03', 'Creative Iteration'));
    panel.appendChild(el('p', { className: 's5-desc' },
      'AI analyzes which creatives drove conversions and which underperformed. Winners are amplified. New variants are generated using engagement signals from Week 1.'));

    // Specter creative winners/losers
    panel.appendChild(el('div', { className: 's5-section-label' }, 'Specter — Creative Performance'));
    const creativeGrid = el('div', { className: 's5-creative-grid' });
    const specter = BRANDS[0];
    specter.creativeVideos.forEach((url, i) => {
      const card = el('div', { className: 's5-creative-card' });
      const vid = document.createElement('video');
      vid.src = url;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.autoplay = true;
      vid.setAttribute('playsinline', '');
      vid.play().catch(() => {});
      card.appendChild(vid);
      const isWinner = specter.winnerCreatives.includes(i);
      card.appendChild(el('span', {
        className: 's5-creative-badge ' + (isWinner ? 'winner' : 'loser')
      }, isWinner ? 'Winner' : 'Cut'));
      card.appendChild(el('div', { className: 's5-creative-meta' }, specter.creativeLabels[i]));
      creativeGrid.appendChild(card);
    });
    panel.appendChild(creativeGrid);

    // Terminal — analysis
    panel.appendChild(typewriterBox('creative-iteration.log', [
      '▸ Analyzing Specter engagement signals...',
      '',
      '  Creative #1 (Mullvad VPN — Discovery)',
      '    CTR: 3.1% | Hook Rate: 5.8% | CPA: $4.20',
      '    ✓ WINNER — amplify budget 2×',
      '',
      '  Creative #2 (Metadata Dashboard — Frustration)',
      '    CTR: 1.2% | Hook Rate: 2.1% | CPA: $12.40',
      '    ✕ CUT — below median performance',
      '',
      '  Creative #3 (IMSI Rotation — Social Proof)',
      '    CTR: 2.8% | Hook Rate: 4.9% | CPA: $5.10',
      '    ✓ WINNER — amplify budget 1.5×',
      '',
      '▸ Generating 3 new creative variants from winner signals...',
      '  Hook angle: privacy fear → "They sell your data"',
      '  Format: UGC testimonial + data viz overlay',
      '  ✓ 3 new creatives queued for generation',
    ], 14));

    // New creatives — diffusion effect (videos go from blurry to clear)
    panel.appendChild(el('div', { className: 's5-section-label' }, 'New Creatives — AI Generation'));
    const diffGrid = el('div', { className: 's5-diffusion-grid' });
    const newLabels = [
      'Variant A — "They track every tower"',
      'Variant B — "No logs. No backdoors."',
      'Variant C — "The Snowden plan"',
    ];
    const diffVids = [];
    specter.iterationVideos.forEach((url, i) => {
      const card = el('div', { className: 's5-diffusion-card' });
      const vid = document.createElement('video');
      vid.className = 's5-diffusion-vid';
      vid.src = url;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.preload = 'metadata';
      vid.setAttribute('playsinline', '');
      vid.style.cursor = 'pointer';
      vid.addEventListener('click', () => {
        if (vid.paused) { vid.play().catch(() => {}); } else { vid.pause(); }
      });
      card.appendChild(vid);
      const labelDiv = html('div', { className: 's5-diffusion-label' }, newLabels[i] + '<span class="s5-new-badge">new</span>');
      card.appendChild(labelDiv);
      diffGrid.appendChild(card);
      diffVids.push(vid);
    });

    // Viewport-triggered stagger reveal (no autoplay — user clicks to play)
    onViewport(diffGrid, () => {
      diffVids.forEach((vid, i) => {
        const delay = 600 + i * 1500;
        const timer = setTimeout(() => { vid.classList.add('revealed'); }, delay);
        registerCleanup(() => clearTimeout(timer));
      });
    });
    panel.appendChild(diffGrid);

    // Stats
    const stats = el('div', { className: 's5-stats-grid' });
    [['6', 'New hooks'], ['3', 'New creatives'], ['2', 'Brands active'], ['$1,200', 'Realloc. budget']].forEach(([num, label]) => {
      const stat = el('div');
      stat.appendChild(el('div', { className: 's5-stat-num' }, num));
      stat.appendChild(el('div', { className: 's5-stat-label' }, label));
      stats.appendChild(stat);
    });
    panel.appendChild(stats);

    panel.appendChild(annotation('AI decided', 'Hook variants generated from Week 1 engagement data. The AI identifies which emotional triggers drove the highest intent and creates derivative angles. New creatives enter the rotation for Week 2.'));
    return panel;
  }

  function renderStage3() {
    const panel = el('div', { className: 's5-panel' });
    panel.appendChild(stageHeader('04', 'Week 2 Results'));
    panel.appendChild(el('p', { className: 's5-desc' },
      'Final performance data after creative optimization. Specter shows strong CPL improvement while Vault plateaus — a leading indicator of market pull strength.'));

    // Animated bar charts — CPL comparison
    panel.appendChild(el('div', { className: 's5-section-label' }, 'Cost Per Lead — Week 1 vs Week 2'));
    const barChart = el('div', { className: 's5-bar-chart' });

    const activeBrands = BRANDS.filter(b => b.week2);
    activeBrands.forEach((b, idx) => {
      const color = b.status === 'launch' ? '#10b981' : '#f59e0b';
      // W1 bar
      const row1 = el('div', { className: 's5-bar-row' });
      row1.appendChild(el('div', { className: 's5-bar-label' }, b.name + ' W1'));
      const track1 = el('div', { className: 's5-bar-track' });
      const fill1 = el('div', { className: 's5-bar-fill', style: { width: '0%', background: color, opacity: '0.4' } });
      track1.appendChild(fill1);
      row1.appendChild(track1);
      row1.appendChild(el('div', { className: 's5-bar-val' }, '$' + b.week1.cpl.toFixed(2)));
      barChart.appendChild(row1);

      // W2 bar
      const row2 = el('div', { className: 's5-bar-row' });
      row2.appendChild(el('div', { className: 's5-bar-label' }, b.name + ' W2'));
      const track2 = el('div', { className: 's5-bar-track' });
      const fill2 = el('div', { className: 's5-bar-fill', style: { width: '0%', background: color } });
      track2.appendChild(fill2);
      row2.appendChild(track2);
      const delta = b.week2.cpl - b.week1.cpl;
      const deltaStr = (delta > 0 ? '+' : '') + delta.toFixed(2);
      row2.appendChild(html('div', { className: 's5-bar-val' }, '$' + b.week2.cpl.toFixed(2) + ' <span class="s5-delta ' + (delta < 0 ? 'up' : 'down') + '">' + deltaStr + '</span>'));
      barChart.appendChild(row2);

      // Store refs for viewport animation
      row1._fill = fill1;
      row1._target = (b.week1.cpl / 10 * 100) + '%';
      row2._fill = fill2;
      row2._target = (b.week2.cpl / 10 * 100) + '%';
      row1._idx = idx;
      row2._idx = idx;
    });
    // Viewport-triggered animation
    onViewport(barChart, () => {
      barChart.querySelectorAll('.s5-bar-row').forEach((row, i) => {
        if (row._fill) {
          const timer = setTimeout(() => {
            row._fill.style.width = row._target;
          }, 400 + i * 350);
          registerCleanup(() => clearTimeout(timer));
        }
      });
    });
    panel.appendChild(barChart);

    // Hook rate & CTR bars
    panel.appendChild(el('div', { className: 's5-section-label' }, 'Engagement Metrics — Week 2'));
    const engBars = el('div', { className: 's5-bar-chart' });
    activeBrands.forEach((b, idx) => {
      const color = b.status === 'launch' ? '#10b981' : '#f59e0b';
      [
        ['Hook Rate', b.week2.hookRate, 8],
        ['CTR', b.week2.ctr, 4],
        ['Form %', b.week2.formCompletion, 100],
      ].forEach(([metric, val, max], mi) => {
        const row = el('div', { className: 's5-bar-row' });
        row.appendChild(el('div', { className: 's5-bar-label' }, b.name + ' ' + metric));
        const track = el('div', { className: 's5-bar-track' });
        const fill = el('div', { className: 's5-bar-fill', style: { width: '0%', background: color } });
        track.appendChild(fill);
        row.appendChild(track);
        const suffix = metric === 'Form %' ? '%' : '%';
        row.appendChild(el('div', { className: 's5-bar-val' }, (typeof val === 'number' ? val : val) + suffix));
        row._fill = fill;
        row._target = (val / max * 100) + '%';
        engBars.appendChild(row);
      });
    });
    // Viewport-triggered animation
    onViewport(engBars, () => {
      const rows = engBars.querySelectorAll('.s5-bar-row');
      rows.forEach((row, i) => {
        if (row._fill) {
          const timer = setTimeout(() => {
            row._fill.style.width = row._target;
          }, 500 + i * 300);
          registerCleanup(() => clearTimeout(timer));
        }
      });
    });
    panel.appendChild(engBars);

    // Highlight card
    const card = el('div', { className: 's5-card' });
    card.appendChild(el('div', { className: 's5-card-label' }, 'Standout Performance — Specter'));
    card.appendChild(el('div', { className: 's5-card-text' },
      'CPL dropped 45% from $8.20 to $4.50 after creative iteration — the strongest W1→W2 improvement. ' +
      'Hook rate nearly doubled (4.1% → 6.3%), suggesting the privacy narrative has strong emotional resonance. ' +
      '533 leads collected at a cost well below the $5 green threshold.'));
    panel.appendChild(card);

    panel.appendChild(annotation('AI decided', 'Specter\'s CPL trajectory and hook rate acceleration indicate strong product-market signal. Vault shows stable but unimproved metrics — a sign of ceiling, not momentum.'));
    return panel;
  }

  function renderStage4() {
    const panel = el('div', { className: 's5-panel' });
    panel.appendChild(stageHeader('05', 'Test Verdict'));
    panel.appendChild(el('p', { className: 's5-desc' },
      'The FDT Index combines three weighted dimensions into a composite score. Brands scoring 75+ are cleared for launch into the Scale Engine.'));

    // Formula terminal
    panel.appendChild(typewriterBox('fdt-index.formula', [
      'FDT Index = (Market Pull × 0.40)',
      '          + (Switching Readiness × 0.35)',
      '          + (Scale Potential × 0.25)',
      '',
      'Verdicts:',
      '  75-100  →  LAUNCH   (proceed to Scale Engine)',
      '  50-74   →  ITERATE  (retest with new creative)',
      '  25-49   →  WEAK     (pivot concept)',
      '   0-24   →  DEAD     (abandon)',
    ], 16));

    // Column layout for all 3 verdicts
    const verdictGrid = el('div', { className: 's5-verdict-grid' });

    BRANDS.forEach((b, bIdx) => {
      const isKilled = b.status === 'killed';
      const cardClass = b.status === 'launch' ? 'launch-card' : b.status === 'killed' ? 'killed-card' : 'iterate-card';
      const card = el('div', { className: 's5-verdict-card ' + cardClass });

      if (isKilled) {
        card.appendChild(el('span', { className: 's5-status killed' }, 'Killed at W1'));
        card.appendChild(el('div', { className: 's5-brand-name' }, b.name));
        card.appendChild(el('div', { style: { fontSize: '12px', color: '#525252', marginTop: '8px' } }, 'Did not qualify for FDT scoring — terminated at kill screen.'));
      } else {
        const verdictLabel = b.status === 'launch' ? 'LAUNCH' : 'ITERATE';
        card.appendChild(el('span', { className: 's5-status ' + b.status }, verdictLabel));
        card.appendChild(el('div', { className: 's5-brand-name', style: { marginBottom: '12px' } }, b.name));

        const dims = [
          ['Market Pull', b.fdt.marketPull, 0.40],
          ['Switching', b.fdt.switchingReadiness, 0.35],
          ['Scale', b.fdt.scalePotential, 0.25],
        ];
        dims.forEach(([label, score, weight]) => {
          const row = el('div', { style: { marginBottom: '8px' } });
          const header = el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '2px' } });
          header.appendChild(el('span', { className: 's5-metric-label', style: { fontSize: '10px' } }, label));
          header.appendChild(el('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#a3a3a3' } }, score + ''));
          row.appendChild(header);
          const bar = el('div', { className: 's5-fdt-bar' });
          const fill = el('div', { className: 's5-fdt-fill', style: { width: '0%', background: score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' } });
          fill._target = score + '%';
          bar.appendChild(fill);
          row.appendChild(bar);
          card.appendChild(row);
        });

        // Score
        const scoreRow = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '4px' } });
        scoreRow.appendChild(el('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' } }, 'FDT Index'));
        const scoreColor = b.fdt.index >= 75 ? '#10b981' : b.fdt.index >= 50 ? '#f59e0b' : '#ef4444';
        scoreRow.appendChild(el('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '22px', fontWeight: '500', color: scoreColor } }, b.fdt.index.toFixed(1)));
        card.appendChild(scoreRow);
      }

      verdictGrid.appendChild(card);
    });

    // Viewport-triggered animation for FDT bars
    onViewport(verdictGrid, () => {
      const fills = verdictGrid.querySelectorAll('.s5-fdt-fill');
      fills.forEach((fill, i) => {
        if (fill._target) {
          const timer = setTimeout(() => { fill.style.width = fill._target; }, 500 + i * 400);
          registerCleanup(() => clearTimeout(timer));
        }
      });
    });
    panel.appendChild(verdictGrid);

    panel.appendChild(annotation('AI decided', 'Specter clears the 75-point launch threshold with FDT Index 77.9. This brand proceeds to Stage 5: Scale Engine. Vault scores 55.2 — marked for iteration and retest.'));
    return panel;
  }

  /* ═══════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════ */

  window.initScene5 = function (container) {
    injectStyles();

    const wrap = el('div', { className: 'scene5' });
    let activeStage = 0;
    let currentPanel = null;
    let counterValue, sliderEl, timelineFill;
    const stageButtons = [];
    let playing = false;
    let playTimer = null;
    let playBtn;

    /* ── Sidebar ── */
    const sidebar = el('div', { className: 's5-sidebar' });

    const sidebarTop = el('div', { className: 's5-sidebar-top' });
    sidebarTop.appendChild(el('div', { className: 's5-sidebar-label' }, 'Stage 04'));
    sidebarTop.appendChild(el('div', { className: 's5-sidebar-title' }, 'Brand Testing'));
    sidebar.appendChild(sidebarTop);

    const playArea = el('div', { className: 's5-play-area' });
    playBtn = html('button', { className: 's5-play-btn' }, playSvg() + ' Play');
    playBtn.addEventListener('click', togglePlay);
    playArea.appendChild(playBtn);
    sidebar.appendChild(playArea);

    const timeline = el('div', { className: 's5-timeline' });
    const timelineInner = el('div', { className: 's5-timeline-inner' });
    timelineInner.appendChild(el('div', { className: 's5-timeline-track' }));
    timelineFill = el('div', { className: 's5-timeline-fill' });
    timelineInner.appendChild(timelineFill);

    STAGES.forEach((stage, i) => {
      const btn = el('button', { className: 's5-stage-btn' + (i === 0 ? ' active' : '') });
      btn.addEventListener('click', () => setStage(i));
      const node = el('div', { className: 's5-node ' + (i === 0 ? 'active' : 'future') });
      if (i === 0) node.appendChild(el('div', { className: 's5-dot-inner' }));
      else node.appendChild(el('span', { className: 's5-dot-number' }, stage.number));
      btn.appendChild(node);
      const text = el('div', { className: 's5-stage-text' });
      text.appendChild(el('span', { className: 's5-stage-title' }, stage.title));
      text.appendChild(el('span', { className: 's5-stage-sub' }, stage.subtitle));
      btn.appendChild(text);
      timelineInner.appendChild(btn);
      stageButtons.push({ btn, node });
    });
    timeline.appendChild(timelineInner);
    sidebar.appendChild(timeline);

    const counter = el('div', { className: 's5-counter' });
    counter.appendChild(el('div', { className: 's5-counter-label' }, 'Step'));
    counterValue = el('div', { className: 's5-counter-value' }, '1 / 5');
    counter.appendChild(counterValue);
    sliderEl = el('input', { className: 's5-slider', type: 'range', min: '0', max: '4', value: '0', step: '1' });
    sliderEl.addEventListener('input', () => setStage(parseInt(sliderEl.value, 10)));
    counter.appendChild(sliderEl);
    sidebar.appendChild(counter);

    const mainWrap = el('div', { className: 's5-main' });
    const mainContent = el('div', { className: 's5-content' });
    mainWrap.appendChild(mainContent);

    wrap.appendChild(sidebar);
    wrap.appendChild(mainWrap);
    container.appendChild(wrap);

    renderActivePanel();

    /* ── Stage management ── */

    function setStage(index) {
      if (index < 0 || index > 4) return;
      activeStage = index;
      updateTimeline();
      renderActivePanel();
    }

    function updateTimeline() {
      stageButtons.forEach(({ btn, node }, i) => {
        const isPast = i < activeStage;
        const isActive = i === activeStage;
        btn.classList.toggle('active', isActive);
        node.className = 's5-node ' + (isPast ? 'past' : isActive ? 'active' : 'future');
        node.innerHTML = '';
        if (isPast) node.innerHTML = checkSvg();
        else if (isActive) node.appendChild(el('div', { className: 's5-dot-inner' }));
        else node.appendChild(el('span', { className: 's5-dot-number' }, STAGES[i].number));
      });
      const pct = stageButtons.length > 1 ? (activeStage / (stageButtons.length - 1)) * 100 : 0;
      timelineFill.style.height = pct + '%';
      counterValue.textContent = (activeStage + 1) + ' / 5';
      sliderEl.value = activeStage;
    }

    function renderActivePanel() {
      runCleanups();
      if (currentPanel) currentPanel.classList.remove('visible');
      mainContent.innerHTML = '';

      const renderers = [renderStage0, renderStage1, renderStage2, renderStage3, renderStage4];
      const panel = renderers[activeStage]();
      mainContent.appendChild(panel);
      currentPanel = panel;

      // Scroll to top of main content
      mainWrap.scrollTop = 0;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => { panel.classList.add('visible'); });
      });
    }

    /* ── Autoplay ── */

    function togglePlay() {
      if (playing) stopPlay();
      else if (activeStage >= 4) {
        activeStage = 0;
        updateTimeline();
        renderActivePanel();
        startPlay();
      } else startPlay();
    }

    function startPlay() {
      playing = true;
      updatePlayButton();
      advancePlay();
    }

    function stopPlay() {
      playing = false;
      if (playTimer) clearTimeout(playTimer);
      playTimer = null;
      updatePlayButton();
    }

    function advancePlay() {
      if (!playing) return;
      playTimer = setTimeout(() => {
        if (activeStage < 4) {
          activeStage++;
          updateTimeline();
          renderActivePanel();
          advancePlay();
        } else stopPlay();
      }, 6000);
    }

    function updatePlayButton() {
      if (activeStage >= 4 && !playing) playBtn.innerHTML = replaySvg() + ' Replay';
      else if (playing) playBtn.innerHTML = pauseSvg() + ' Pause';
      else playBtn.innerHTML = playSvg() + ' Play';
    }
  };

})();
