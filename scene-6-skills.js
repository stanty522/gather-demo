// scene-6-skills.js — "Skills" tab (Tab 02)
// Mounts the showcase Skills page as a full-bleed iframe.
// Self-contained. Call initScene6(container) to mount.

function initScene6(container) {
  container.innerHTML = `
    <style>
      .scene6-root {
        position: absolute;
        inset: 0;
        background: #0a0a0a;
      }
      .scene6-root iframe {
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
      }
    </style>
    <div class="scene6-root">
      <iframe src="skills-page.html?v=1776216060041616000" title="Skills"></iframe>
    </div>
  `;
}

window.initScene6 = initScene6;
