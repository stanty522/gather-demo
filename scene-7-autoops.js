// scene-7-autoops.js — "Autonomous Ops" tab (Tab 04)
// Mounts the live operations dashboard as a full-bleed iframe.
// The embedded app lives on a sibling subdomain and is re-themed to match this site.
// Self-contained. Call initScene7(container) to mount.

function initScene7(container) {
  container.innerHTML = `
    <style>
      .scene7-root {
        position: absolute;
        inset: 0;
        background: #faf8f3;
      }
      .scene7-root iframe {
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
      }
    </style>
    <div class="scene7-root">
      <iframe
        src="https://scale-engine.178.156.206.22.nip.io/brand/meow-mobile"
        title="Autonomous Ops"
        allow="clipboard-read; clipboard-write"></iframe>
    </div>
  `;
}

window.initScene7 = initScene7;
