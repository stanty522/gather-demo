// scene-2-pipeline.js — Pipeline Run Demo (Scene 2)
// Exports: initScene2(container)

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     DATA
     ═══════════════════════════════════════════ */

  const COLORS = {
    surge: '#e17055', micro: '#74b9ff', macro: '#a29bfe', shared: '#f0c27a',
    green: '#10b981', purple: '#6c5ce7', white: '#e2e2f0',
    dim: '#737373', muted: '#404040'
  };

  const triggerStage = {
    id:'trigger', pipeline:'shared', agent:'trigger', agentName:'Trigger Analyst', dur:3, isLaneStage:false,
    lines:['Scanning for personas with unmet needs...','Building trigger event library: 14 switching moments identified','Clusters: pet wellness, digital privacy, gig economy, elder care','Library ready — distributing to all 3 pipelines']
  };

  const surgePipeline = [
    { id:'s1s', pipeline:'surge', agent:'surge', agentName:'Surge Trend Scanner', dur:3, isLaneStage:true,
      lines:['Velocity-first scan for surges...','Found 8 active demand spikes','Spikes: pet supplements, VPN adoption, SIM-swap fears','Flash moment scan: 3 triggers match','Qualified 6 surges above threshold'] },
    { id:'s2s', pipeline:'surge', agent:'surge', agentName:'Surge Persona Builder', dur:3, isLaneStage:true,
      lines:['Extracting demand variations from 6 surges...','24 surge personas with moment tags','#2: "Privacy-First OPSEC Switcher" — Score 7.9','Top: "TikTok Pet Wellness Convert" — Score 8.1'] },
    { id:'s3s', pipeline:'surge', agent:'surge', agentName:'Surge Opportunity Analyst', dur:2, isLaneStage:true,
      lines:['Single-pass scoring...','Results: 4 GO, 2 MONITOR, 18 SKIP','Top GO: Score 8.1, window closing in 6 weeks'] },
    { id:'s4sa', pipeline:'surge', agent:'surge', agentName:'Surge Demand Analyst', dur:3, isLaneStage:true,
      lines:['Compressed brief: 2 factors, 6 Q&As...','Demand snapshot: $180M spike, 8-week window'] },
    { id:'s4sb', pipeline:'surge', agent:'surge', agentName:'Surge Offer Designer', dur:3, isLaneStage:true,
      lines:['1 concept + wind-down plan...','Offer: "PetBoost Starter Kit" — $29 intro bundle','Surge pipeline complete'] }
  ];

  const microPipeline = [
    { id:'s1m', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Analyst', dur:5, isLaneStage:true,
      lines:['PESTEL + Ansoff scan...','23 trend signals across Technology, Social, Economic','Signal: post-Snowden privacy awareness accelerating in mobile','Moment-community scan from trigger library','Qualified 18 micro-trends'] },
    { id:'s2m', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Persona Builder', dur:5, isLaneStage:true,
      lines:['Extracting identity variations...','Clustering by identity overlap','Privacy cluster: 3 segments — OPSEC pros, crypto-native, corporate whistleblowers','Deduplicating: merged 3 overlapping segments','Generated 94 unique persona cards'] },
    { id:'s3m', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Opportunity Analyst', dur:4, isLaneStage:true,
      lines:['Two-pass scoring...','8 INVEST, 12 EXPLORE, 14 NICHE, 60 IGNORE','#2: "Privacy-First Mobile Seeker" — Score 8.4','Top: "Anxious Millennial Pet Parent" — Score 8.7'] },
    { id:'s4ma', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Identity Analyst', dur:5, isLaneStage:true,
      lines:['4A-Lite: 4 factors, 20 Q&As...','Demand snapshot: $4.2B pet wellness market, 12% CAGR','Privacy mobile: $1.8B addressable, 28% CAGR'] },
    { id:'s4mb', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Value Prop Designer', dur:4, isLaneStage:true,
      lines:['Concept A: "PetCalm Club" — monthly wellness box + vet chat','Concept B: "Specter" — privacy-first MVNO, E2E encrypted','Interception: trigger at SIM-swap event or carrier breach news','Go/No-Go: GO on both — Micro pipeline complete'] }
  ];

  const macroPipeline = [
    { id:'s1mt', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Analyst', dur:5, isLaneStage:true,
      lines:['PESTEL institutional scan...','Structural shift 1: humanization of pets as family members','Structural shift 2: post-breach privacy consciousness — 68% of adults concerned about carrier tracking','Qualified: "Pet-as-Family Megatrend" + "Privacy-First Digital Life"'] },
    { id:'s15mt', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Moment Mapper', dur:3, isLaneStage:true,
      lines:['Transition inventory...','Top transition: "First Pet Adoption" (Composite 4.2)','#2: "SIM-Swap Attack / Data Breach" (Composite 3.9)'] },
    { id:'s2mt', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Persona Builder', dur:4, isLaneStage:true,
      lines:['Two-tier extraction...','Tier 1: "Pet-as-Family Americans" (~85M, 30M+ addressable)','Tier 1: "Privacy-Conscious Professionals" (~12M, 5M+ addressable)','Identity Community Map: r/PetHealth, r/Privacy, r/OPSEC'] },
    { id:'s3mt', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Opportunity Analyst', dur:4, isLaneStage:true,
      lines:['Identity Intensity: 4.2/5','Brand-Equity Potential: 4.5/5','Quadrant: BUILD — invest deeply in durable identity brand'] },
    { id:'s4mta', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Identity Analyst', dur:5, isLaneStage:true,
      lines:['Full 5-factor + switching profile, 50 Q&As...','Factor 5: wants brand that validates pet-parent identity'] },
    { id:'s4mtb', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Value Prop Designer', dur:4, isLaneStage:true,
      lines:['Concept: "PetFamily+" — premium wellness ecosystem','Brand strategy: durable identity brand — Macro pipeline complete'] }
  ];

  const sharedStages = [
    { id:'campaign', pipeline:'shared', agent:'campaign', agentName:'Tier 3 Campaign', dur:10, isLaneStage:false,
      lines:['Ingesting outputs from all 3 pipelines...','Brief Writer: generating marketing briefs...','2 brand tracks identified: PetCalm (wellness) + Specter (privacy mobile)','Landing Page Builder: 3 landing pages per track...','Ads Creative Studio: 9 ad variants per brand...','Campaign plans ready'] },
    { id:'partner', pipeline:'shared', agent:'partner', agentName:'Tier 4 Partners', dur:6, isLaneStage:false,
      lines:['Generating affiliate packages...','Surge: flash affiliate deal, 48-hour window','Micro: creator network, 20% rev share','Macro: premium partner program, co-branding','Influencer briefs: 30 creators across 3 tiers','All deliverables packaged'] }
  ];

  const iterations = {
    1: { ctr:'1.8%', ctrD:'Baseline', bounce:'72%', bounceD:'Not yet diagnosed', inf:'\u2014', infD:'Not launched yet', cac:'$55', cacD:'Projected', ctrC:'#737373', bounceC:'#f0c27a', infC:'#737373', cacC:'#f0c27a' },
    2: { ctr:'3.2%', ctrD:'+40% vs Variant A', bounce:'68%', bounceD:'CTA below fold', inf:'450', infD:'3x affiliate channel', cac:'$41', cacD:'Target: $35', ctrC:'#10b981', bounceC:'#e17055', infC:'#10b981', cacC:'#f0c27a' },
    3: { ctr:'4.1%', ctrD:'+28% from new variants', bounce:'34%', bounceD:'Fixed: CTA above fold', inf:'820', infD:'Budget reallocated', cac:'$33', cacD:'Below target', ctrC:'#10b981', bounceC:'#10b981', infC:'#10b981', cacC:'#10b981' },
    4: { ctr:'4.8%', ctrD:'Converging on ceiling', bounce:'29%', bounceD:'Optimized', inf:'1,640', infD:'Scaled 2x', cac:'$26', cacD:'34% below target', ctrC:'#10b981', bounceC:'#10b981', infC:'#10b981', cacC:'#10b981' }
  };

  const diagnosisCards = {
    2: [
      { icon:'\u26a0\ufe0f', title:'CTA Position Issue', desc:'Primary CTA sits below the fold on mobile. 68% of visitors never scroll past hero section. Recommendation: move CTA above fold with sticky mobile bar.', agent:'Performance Analyst' },
      { icon:'\ud83d\udcc8', title:'Affiliate Channel Outperforming', desc:'Influencer-driven traffic converting at 3x paid search. Reallocating 20% of paid budget to creator partnerships.', agent:'Channel Optimizer' }
    ],
    3: [
      { icon:'\u2705', title:'CTA Fix Validated', desc:'Above-fold CTA reduced bounce rate from 68% to 34%. Mobile conversion rate up 2.1x. Rolling out to all landing page variants.', agent:'Performance Analyst' },
      { icon:'\ud83c\udfaf', title:'Micro-Segment Discovery', desc:'"Privacy-first OPSEC professionals aged 25-50" identified as high-intent segment. Specter brand brief generated and passed to Brand Creation pipeline.', agent:'Persona Refinement Agent' }
    ],
    4: [
      { icon:'\ud83d\ude80', title:'Scale Signal Detected', desc:'Unit economics positive across both brand tracks. PetCalm CAC $26 vs LTV $180. Specter CAC $31 vs LTV $220. Ready for Scale Engine.', agent:'Growth Strategist' },
      { icon:'\ud83d\udd04', title:'Flywheel Active', desc:'Affiliate-driven customers referring 1.4 new customers each. Organic acquisition now 22% of total. CAC trending toward $20.', agent:'Flywheel Monitor' }
    ]
  };

  const personaData = {
    left: {
      title: 'Burned-Out Remote Worker',
      driver: 'Stress Relief & Emotional Support',
      quote: '"I just need something that makes my apartment feel less like a prison and more like a home. My therapist actually suggested getting a pet."',
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      accentColor: '#74b9ff',
      landing: {
        headline: 'Your calm starts here.',
        sub: 'Science-backed pet wellness for the overwhelmed.',
        cta: 'Start Your Calm Journey',
        style: 'Soft blues, breathing animations, minimal copy'
      },
      ad: { hook: '"I was burned out. Then I got Luna."', format: 'UGC-style testimonial, muted tones, 15s', channel: 'Instagram Stories, Reddit r/RemoteWork' },
      channels: [
        { name: 'Reddit', pct: 35, color: '#74b9ff' },
        { name: 'Instagram', pct: 28, color: '#a29bfe' },
        { name: 'Podcast Ads', pct: 22, color: '#f0c27a' },
        { name: 'Email', pct: 15, color: '#10b981' }
      ],
      influencer: { type: 'Micro-influencer (10K-50K)', niche: 'Mental health & WFH lifestyle', tone: 'Authentic, vulnerable, "real talk"', deliverable: '1 Reel + 3 Stories showing pet as stress relief' },
      affiliate: { commission: '15% recurring', window: '30-day cookie', assets: 'Custom landing page + discount code', tier: 'Wellness Creator Tier' },
      economics: { cac: '$38', ltv: '$210', payback: '2.1 months', margin: '82%' }
    },
    right: {
      title: 'Aspiring Content Creator',
      driver: 'Aesthetic & Social Currency',
      quote: '"My followers LOVE pet content. If I can find a premium brand that matches my aesthetic, it\'s content gold AND a genuine rec."',
      gradient: 'linear-gradient(135deg, #2d1b69 0%, #6c5ce7 50%, #a29bfe 100%)',
      accentColor: '#a29bfe',
      landing: {
        headline: 'Pet wellness, but make it aesthetic.',
        sub: 'Premium. Photogenic. Actually works.',
        cta: 'Join the Creator Program',
        style: 'Bold gradients, product shots, social proof'
      },
      ad: { hook: '"POV: Your pet has better skincare than you"', format: 'TikTok native, trending audio, 30s', channel: 'TikTok, YouTube Shorts, Pinterest' },
      channels: [
        { name: 'TikTok', pct: 40, color: '#e17055' },
        { name: 'YouTube', pct: 25, color: '#a29bfe' },
        { name: 'Pinterest', pct: 20, color: '#74b9ff' },
        { name: 'Affiliate', pct: 15, color: '#f0c27a' }
      ],
      influencer: { type: 'Mid-tier creator (50K-200K)', niche: 'Lifestyle, aesthetics, pet fashion', tone: 'Aspirational, playful, trend-aware', deliverable: '1 TikTok + 1 YouTube Short + affiliate link' },
      affiliate: { commission: '20% + bonus tiers', window: '60-day cookie', assets: 'Branded content kit + product samples', tier: 'Creator Partner Tier' },
      economics: { cac: '$28', ltv: '$165', payback: '1.8 months', margin: '78%' }
    }
  };


  /* ═══════════════════════════════════════════
     CSS
     ═══════════════════════════════════════════ */

  function injectCSS() {
    if (document.getElementById('scene2-styles')) return;
    const style = document.createElement('style');
    style.id = 'scene2-styles';
    style.textContent = `
/* ── Scene 2 Scoped Styles ── */

.scene2 {
  width: 100%;
  padding: 40px 40px;
  color: #e2e2f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scene2 * { box-sizing: border-box; }

/* Sub-tabs */
.scene2 .sub-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding-bottom: 0;
}
.scene2 .sub-tab {
  padding: 10px 18px;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 400;
  color: #666;
  cursor: pointer;
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  transition: all 0.25s;
  letter-spacing: 0.02em;
}
.scene2 .sub-tab:hover { color: #999; }
.scene2 .sub-tab.active {
  color: #e2e2f0;
  border-bottom-color: #e2e2f0;
}

.scene2 .sub-panel { display: none; }
.scene2 .sub-panel.active { display: flex; flex-direction: column; flex: 1; min-height: 0; }

/* ── Demo 1 ── */
.scene2 .input-phase {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex: 1;
}
.scene2 .input-phase.hidden { display: none; }
.scene2 .input-phase input {
  flex: 1;
  max-width: 360px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: #e2e2f0;
  font-size: 14px;
  font-family: 'JetBrains Mono', monospace;
  outline: none;
  transition: border-color 0.3s;
}
.scene2 .input-phase input:focus { border-color: rgba(255,255,255,0.25); }
.scene2 .input-phase input::placeholder { color: #555; }
.scene2 .launch-btn {
  padding: 10px 24px;
  border-radius: 10px;
  border: 1px solid rgba(16,185,129,0.3);
  background: rgba(16,185,129,0.1);
  color: #10b981;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 0.03em;
}
.scene2 .launch-btn:hover { background: rgba(16,185,129,0.18); border-color: rgba(16,185,129,0.5); }
.scene2 .launch-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.scene2 .mission-control {
  display: none;
  grid-template-columns: 320px 1fr 260px;
  gap: 16px;
  flex: 1;
  min-height: 0;
}
.scene2 .mission-control.visible { display: grid; }

/* Pipeline column */
.scene2 .pipeline-col {
  overflow-y: auto;
  padding-right: 6px;
}
.scene2 .pipeline-col::-webkit-scrollbar { width: 4px; }
.scene2 .pipeline-col::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

.scene2 .shared-stage-section { margin-bottom: 14px; }
.scene2 .lane-header {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 14px 0 8px;
  padding-left: 2px;
}
.scene2 .lane-header.surge { color: #e17055; }
.scene2 .lane-header.micro { color: #74b9ff; }
.scene2 .lane-header.macro { color: #a29bfe; }
.scene2 .lane-header.shared { color: #f0c27a; }

.scene2 .stage-card {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
  margin-bottom: 6px;
}
.scene2 .stage-card.pending { opacity: 0.35; }
.scene2 .stage-card.running {
  opacity: 1;
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 0 20px rgba(255,255,255,0.05);
}
.scene2 .stage-card.done {
  opacity: 1;
  border-color: rgba(16,185,129,0.3);
}
.scene2 .stage-card .stage-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.scene2 .stage-card .stage-name {
  font-size: 11px;
  font-weight: 500;
  color: #e2e2f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
.scene2 .stage-card .stage-timer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #737373;
}
.scene2 .stage-card .stage-timer.running { color: #f0c27a; }
.scene2 .stage-card .stage-timer.done { color: #10b981; }
.scene2 .stage-card .progress-track {
  height: 2px;
  background: rgba(255,255,255,0.06);
  border-radius: 1px;
  overflow: hidden;
}
.scene2 .stage-card .progress-fill {
  height: 100%;
  width: 0%;
  border-radius: 1px;
  transition: width 0.3s linear;
}
.scene2 .stage-card.surge .progress-fill { background: linear-gradient(90deg, #e17055, #e17055cc); }
.scene2 .stage-card.micro .progress-fill { background: linear-gradient(90deg, #74b9ff, #74b9ffcc); }
.scene2 .stage-card.macro .progress-fill { background: linear-gradient(90deg, #a29bfe, #a29bfecc); }
.scene2 .stage-card.shared .progress-fill { background: linear-gradient(90deg, #f0c27a, #f0c27acc); }

/* Output panel */
.scene2 .output-panel {
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 16px;
  overflow-y: auto;
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.7;
}
.scene2 .output-panel::-webkit-scrollbar { width: 4px; }
.scene2 .output-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
.scene2 .output-panel .log-line {
  margin-bottom: 4px;
  opacity: 0;
  animation: scene2FadeIn 0.3s forwards;
}
@keyframes scene2FadeIn { to { opacity: 1; } }
.scene2 .output-panel .log-tag {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  margin-right: 6px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.scene2 .log-tag.surge { background: rgba(225,112,85,0.15); color: #e17055; }
.scene2 .log-tag.micro { background: rgba(116,185,255,0.15); color: #74b9ff; }
.scene2 .log-tag.macro { background: rgba(162,155,254,0.15); color: #a29bfe; }
.scene2 .log-tag.shared { background: rgba(240,194,122,0.15); color: #f0c27a; }

.scene2 .cost-reveal {
  display: none;
  flex-shrink: 0;
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(16,185,129,0.2);
  background: rgba(16,185,129,0.04);
}
.scene2 .cost-reveal.visible { display: block; }
.scene2 .cost-reveal h4 {
  font-family: 'Instrument Serif', serif;
  font-size: 16px;
  color: #e2e2f0;
  margin-bottom: 12px;
  font-weight: 400;
}
.scene2 .cost-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.scene2 .cost-card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  text-align: center;
}
.scene2 .cost-card .cost-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #737373;
  margin-bottom: 6px;
}
.scene2 .cost-card .cost-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 600;
}
.scene2 .cost-card .cost-sub {
  font-size: 10px;
  color: #737373;
  margin-top: 4px;
}

/* Activity feed */
.scene2 .activity-feed {
  overflow-y: auto;
  padding-right: 4px;
}
.scene2 .activity-feed::-webkit-scrollbar { width: 4px; }
.scene2 .activity-feed::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
.scene2 .activity-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  opacity: 0;
  animation: scene2FadeIn 0.3s forwards;
}
.scene2 .activity-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #555;
  margin-bottom: 3px;
}
.scene2 .activity-text {
  font-size: 11px;
  color: #999;
}

.scene2 .agent-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
}
.scene2 .agent-badge.surge { background: rgba(225,112,85,0.12); color: #e17055; }
.scene2 .agent-badge.micro { background: rgba(116,185,255,0.12); color: #74b9ff; }
.scene2 .agent-badge.macro { background: rgba(162,155,254,0.12); color: #a29bfe; }
.scene2 .agent-badge.shared { background: rgba(240,194,122,0.12); color: #f0c27a; }
.scene2 .agent-badge.campaign { background: rgba(240,194,122,0.12); color: #f0c27a; }
.scene2 .agent-badge.partner { background: rgba(240,194,122,0.12); color: #f0c27a; }
.scene2 .agent-badge.trigger { background: rgba(240,194,122,0.12); color: #f0c27a; }

/* ── Demo 2 ── */
.scene2 .split-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.scene2 .persona-col {
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
}
.scene2 .persona-header {
  padding: 24px 20px 18px;
  position: relative;
}
.scene2 .persona-header h3 {
  font-family: 'Instrument Serif', serif;
  font-size: 20px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 4px;
}
.scene2 .persona-header .persona-driver {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.scene2 .persona-body {
  padding: 0 20px 20px;
  background: rgba(0,0,0,0.4);
}
.scene2 .persona-section {
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.4s ease;
}
.scene2 .persona-section.revealed {
  opacity: 1;
  transform: translateY(0);
}
.scene2 .persona-section:last-child { border-bottom: none; }
.scene2 .persona-section-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #737373;
  margin-bottom: 8px;
}
.scene2 .persona-quote {
  font-style: italic;
  font-size: 13px;
  color: #999;
  line-height: 1.6;
  padding-left: 12px;
  border-left: 2px solid rgba(255,255,255,0.1);
}
.scene2 .landing-preview {
  padding: 16px;
  border-radius: 10px;
  text-align: center;
}
.scene2 .landing-preview h4 {
  font-family: 'Instrument Serif', serif;
  font-size: 18px;
  font-weight: 400;
  color: #fff;
  margin-bottom: 4px;
}
.scene2 .landing-preview p {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 10px;
}
.scene2 .landing-preview .preview-cta {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  border: none;
  cursor: default;
}
.scene2 .landing-preview .preview-style {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #555;
  margin-top: 8px;
}
.scene2 .channel-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.scene2 .channel-bar .ch-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #999;
  width: 70px;
  flex-shrink: 0;
}
.scene2 .channel-bar .ch-track {
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: hidden;
}
.scene2 .channel-bar .ch-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}
.scene2 .channel-bar .ch-pct {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #737373;
  width: 30px;
  text-align: right;
}
.scene2 .detail-row {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 11px;
}
.scene2 .detail-row .detail-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #555;
  min-width: 80px;
  flex-shrink: 0;
}
.scene2 .detail-row .detail-value {
  color: #999;
  font-size: 11px;
}
.scene2 .econ-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.scene2 .econ-card {
  padding: 10px;
  border-radius: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  text-align: center;
}
.scene2 .econ-card .econ-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #555;
  margin-bottom: 4px;
}
.scene2 .econ-card .econ-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  color: #10b981;
}

.scene2 .vote-section {
  margin-top: 28px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  text-align: center;
}
.scene2 .vote-section h4 {
  font-family: 'Instrument Serif', serif;
  font-size: 18px;
  font-weight: 400;
  color: #e2e2f0;
  margin-bottom: 6px;
}
.scene2 .vote-section p {
  font-size: 12px;
  color: #737373;
  margin-bottom: 14px;
}
.scene2 .vote-btns {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.scene2 .vote-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: #e2e2f0;
  transition: all 0.25s;
}
.scene2 .vote-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
.scene2 .vote-btn.voted {
  background: rgba(16,185,129,0.15);
  border-color: rgba(16,185,129,0.4);
  color: #10b981;
}

/* ── Demo 3 ── */
.scene2 .timeline-row {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 28px;
  position: relative;
}
.scene2 .timeline-line {
  position: absolute;
  top: 50%;
  left: 40px;
  right: 40px;
  height: 2px;
  background: rgba(255,255,255,0.08);
  z-index: 0;
}
.scene2 .timeline-node {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.scene2 .timeline-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #404040;
  background: #1a1a1a;
  transition: all 0.3s;
  margin-bottom: 8px;
}
.scene2 .timeline-node.active .timeline-dot {
  border-color: #10b981;
  background: #10b981;
  box-shadow: 0 0 12px rgba(16,185,129,0.3);
}
.scene2 .timeline-node.past .timeline-dot {
  border-color: #10b981;
  background: rgba(16,185,129,0.3);
}
.scene2 .timeline-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #555;
  transition: color 0.3s;
}
.scene2 .timeline-node.active .timeline-label,
.scene2 .timeline-node.past .timeline-label { color: #e2e2f0; }

.scene2 .metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.scene2 .metric-card {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  text-align: center;
  transition: border-color 0.4s;
}
.scene2 .metric-card .metric-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #737373;
  margin-bottom: 8px;
}
.scene2 .metric-card .metric-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 600;
  transition: color 0.4s;
}
.scene2 .metric-card .metric-desc {
  font-size: 10px;
  color: #737373;
  margin-top: 4px;
}

.scene2 .diagnosis-section {
  margin-bottom: 24px;
}
.scene2 .diagnosis-section h4 {
  font-family: 'Instrument Serif', serif;
  font-size: 16px;
  font-weight: 400;
  color: #e2e2f0;
  margin-bottom: 12px;
}
.scene2 .diagnosis-card {
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  margin-bottom: 10px;
  display: flex;
  gap: 12px;
}
.scene2 .diagnosis-icon {
  font-size: 18px;
  flex-shrink: 0;
  width: 28px;
  text-align: center;
}
.scene2 .diagnosis-content { flex: 1; }
.scene2 .diagnosis-title {
  font-size: 13px;
  font-weight: 600;
  color: #e2e2f0;
  margin-bottom: 4px;
}
.scene2 .diagnosis-desc {
  font-size: 11px;
  color: #999;
  line-height: 1.5;
}
.scene2 .diagnosis-agent {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #6c5ce7;
  margin-top: 6px;
}

.scene2 .confidence-section {
  margin-bottom: 24px;
}
.scene2 .confidence-section h4 {
  font-family: 'Instrument Serif', serif;
  font-size: 16px;
  font-weight: 400;
  color: #e2e2f0;
  margin-bottom: 12px;
}
.scene2 .confidence-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.scene2 .conf-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #999;
  width: 120px;
  flex-shrink: 0;
}
.scene2 .conf-track {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 3px;
  overflow: hidden;
}
.scene2 .conf-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #6c5ce7, #a29bfe);
  transition: width 0.6s ease;
}
.scene2 .conf-pct {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #737373;
  width: 36px;
  text-align: right;
}

.scene2 .revisions-section {
  margin-bottom: 24px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(108,92,231,0.2);
  background: rgba(108,92,231,0.04);
}
.scene2 .revisions-section h4 {
  font-family: 'Instrument Serif', serif;
  font-size: 16px;
  font-weight: 400;
  color: #e2e2f0;
  margin-bottom: 12px;
}
.scene2 .revision-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.scene2 .revision-item:last-child { border-bottom: none; }
.scene2 .revision-bullet {
  color: #6c5ce7;
  font-size: 14px;
  line-height: 1.3;
  flex-shrink: 0;
}

.scene2 .flywheel-quote {
  padding: 20px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  text-align: center;
  font-family: 'Instrument Serif', serif;
  font-size: 18px;
  font-style: italic;
  color: #e2e2f0;
  line-height: 1.6;
}
.scene2 .flywheel-attr {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-style: normal;
  color: #555;
  margin-top: 8px;
}

/* Responsive */
@media (max-width: 900px) {
  .scene2 .mission-control { grid-template-columns: 1fr; }
  .scene2 .split-view { grid-template-columns: 1fr; }
  .scene2 .metric-grid { grid-template-columns: repeat(2, 1fr); }
}
`;
    document.head.appendChild(style);
  }


  /* ═══════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════ */

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function formatTime(sec) {
    return sec.toFixed(1) + 's';
  }

  function pipelineColor(p) {
    return COLORS[p] || COLORS.shared;
  }


  /* ═══════════════════════════════════════════
     DEMO 1: Zero to Campaign
     ═══════════════════════════════════════════ */

  function buildDemo1(panel) {
    // Input phase
    const inputDiv = el('div', 'input-phase');
    const inp = el('input');
    inp.type = 'text'; inp.placeholder = 'e.g. Personas with unmet needs'; inp.value = 'Personas with unmet needs';
    const btn = el('button', 'launch-btn', 'Launch Pipeline');
    inputDiv.appendChild(inp);
    inputDiv.appendChild(btn);
    panel.appendChild(inputDiv);

    // Mission control
    const mc = el('div', 'mission-control');
    const pipeCol = el('div', 'pipeline-col');
    const outputPanel = el('div', 'output-panel');
    const actFeed = el('div', 'activity-feed');
    mc.appendChild(pipeCol);
    mc.appendChild(outputPanel);
    mc.appendChild(actFeed);
    panel.appendChild(mc);

    // Cost reveal
    const costReveal = el('div', 'cost-reveal');
    costReveal.innerHTML = `
      <h4>Cost Comparison</h4>
      <div class="cost-grid">
        <div class="cost-card">
          <div class="cost-label">Traditional Agency</div>
          <div class="cost-value" style="color:#e17055">$45,000</div>
          <div class="cost-sub">6-8 weeks timeline</div>
        </div>
        <div class="cost-card">
          <div class="cost-label">Gather Pipeline</div>
          <div class="cost-value" style="color:#10b981">$2.40</div>
          <div class="cost-sub">90 seconds, 14 AI agents</div>
        </div>
      </div>
    `;
    panel.appendChild(costReveal);

    // Build pipeline cards
    function buildStageCards() {
      pipeCol.innerHTML = '';

      // Trigger (shared upstream)
      const trigSec = el('div', 'shared-stage-section');
      trigSec.innerHTML = '<div class="lane-header shared">Shared Upstream</div>';
      const trigCard = createStageCard(triggerStage);
      trigSec.appendChild(trigCard);
      pipeCol.appendChild(trigSec);

      // 3 parallel lanes
      const lanes = [
        { key: 'surge', label: 'Surge Pipeline', stages: surgePipeline },
        { key: 'micro', label: 'Micro Pipeline', stages: microPipeline },
        { key: 'macro', label: 'Macro Pipeline', stages: macroPipeline }
      ];

      const laneCards = {};
      lanes.forEach(lane => {
        const sec = el('div');
        sec.innerHTML = `<div class="lane-header ${lane.key}">${lane.label}</div>`;
        laneCards[lane.key] = [];
        lane.stages.forEach(s => {
          const card = createStageCard(s);
          sec.appendChild(card);
          laneCards[lane.key].push({ card, stage: s });
        });
        pipeCol.appendChild(sec);
      });

      // Shared downstream
      const sharedSec = el('div', 'shared-stage-section');
      sharedSec.innerHTML = '<div class="lane-header shared">Shared Downstream</div>';
      const sharedCards = [];
      sharedStages.forEach(s => {
        const card = createStageCard(s);
        sharedSec.appendChild(card);
        sharedCards.push({ card, stage: s });
      });
      pipeCol.appendChild(sharedSec);

      return { trigCard, laneCards, sharedCards };
    }

    function createStageCard(stage) {
      const card = el('div', `stage-card ${stage.pipeline} pending`);
      card.dataset.id = stage.id;
      card.innerHTML = `
        <div class="stage-top">
          <div class="stage-name">${stage.agentName}</div>
          <div class="stage-timer">--</div>
        </div>
        <div class="progress-track"><div class="progress-fill"></div></div>
      `;
      return card;
    }

    // Animation engine
    let running = false;
    let abortController = null;

    btn.addEventListener('click', () => {
      if (running) return;
      running = true;
      btn.disabled = true;
      inputDiv.classList.add('hidden');
      mc.classList.add('visible');
      outputPanel.innerHTML = '';
      actFeed.innerHTML = '';
      costReveal.classList.remove('visible');

      const { trigCard, laneCards, sharedCards } = buildStageCards();
      abortController = new AbortController();

      runPipeline(trigCard, triggerStage, laneCards, sharedCards, outputPanel, actFeed, costReveal, abortController.signal).then(() => {
        running = false;
        btn.disabled = false;
      });
    });
  }

  async function runPipeline(trigCard, trigStage, laneCards, sharedCards, outputPanel, actFeed, costReveal, signal) {
    const startTime = Date.now();
    function elapsed() { return ((Date.now() - startTime) / 1000).toFixed(1); }

    // Run trigger
    await runStage(trigCard, trigStage, outputPanel, actFeed, elapsed, signal);
    if (signal.aborted) return;

    // Run 3 lanes in parallel
    const lanePromises = ['surge', 'micro', 'macro'].map(key => {
      return runLaneSequential(laneCards[key], outputPanel, actFeed, elapsed, signal);
    });
    await Promise.all(lanePromises);
    if (signal.aborted) return;

    // Run shared downstream sequentially
    for (const { card, stage } of sharedCards) {
      await runStage(card, stage, outputPanel, actFeed, elapsed, signal);
      if (signal.aborted) return;
    }

    // Cost reveal
    addLogLine(outputPanel, 'shared', 'Pipeline complete. Total cost: $2.40');
    addActivity(actFeed, elapsed(), 'All deliverables packaged and ready');
    costReveal.classList.add('visible');
  }

  async function runLaneSequential(items, outputPanel, actFeed, elapsed, signal) {
    for (const { card, stage } of items) {
      await runStage(card, stage, outputPanel, actFeed, elapsed, signal);
      if (signal.aborted) return;
    }
  }

  async function runStage(card, stage, outputPanel, actFeed, elapsed, signal) {
    // Start
    card.classList.remove('pending');
    card.classList.add('running');
    const timerEl = card.querySelector('.stage-timer');
    const fillEl = card.querySelector('.progress-fill');
    timerEl.className = 'stage-timer running';

    addActivity(actFeed, elapsed(), `${stage.agentName} started`);

    const dur = stage.dur * 200; // speed up for demo: dur * 200ms
    const lineInterval = dur / (stage.lines.length + 1);
    let lineIdx = 0;

    const start = Date.now();

    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (signal.aborted) { clearInterval(interval); resolve(); return; }
        const prog = Math.min((Date.now() - start) / dur, 1);
        fillEl.style.width = (prog * 100) + '%';
        timerEl.textContent = formatTime((Date.now() - start) / 1000);

        // Emit lines
        const expectedLines = Math.floor(prog * (stage.lines.length + 0.5));
        while (lineIdx < expectedLines && lineIdx < stage.lines.length) {
          addLogLine(outputPanel, stage.pipeline, stage.lines[lineIdx]);
          lineIdx++;
        }

        if (prog >= 1) {
          clearInterval(interval);
          // Emit remaining lines
          while (lineIdx < stage.lines.length) {
            addLogLine(outputPanel, stage.pipeline, stage.lines[lineIdx]);
            lineIdx++;
          }
          card.classList.remove('running');
          card.classList.add('done');
          timerEl.className = 'stage-timer done';
          timerEl.textContent = formatTime((Date.now() - start) / 1000);
          addActivity(actFeed, elapsed(), `${stage.agentName} complete`);
          resolve();
        }
      }, 50);
    });
  }

  function addLogLine(panel, pipeline, text) {
    const line = el('div', 'log-line');
    line.innerHTML = `<span class="log-tag ${pipeline}">${pipeline}</span>${escHtml(text)}`;
    panel.appendChild(line);
    panel.scrollTop = panel.scrollHeight;
  }

  function addActivity(feed, time, text) {
    const item = el('div', 'activity-item');
    item.innerHTML = `<div class="activity-time">${time}s</div><div class="activity-text">${escHtml(text)}</div>`;
    feed.appendChild(item);
    feed.scrollTop = feed.scrollHeight;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }


  /* ═══════════════════════════════════════════
     DEMO 2: The Fork in the Road
     ═══════════════════════════════════════════ */

  function buildDemo2(panel) {
    const splitView = el('div', 'split-view');

    ['left', 'right'].forEach(side => {
      const pd = personaData[side];
      const col = el('div', 'persona-col');

      // Header
      const header = el('div', 'persona-header');
      header.style.background = pd.gradient;
      header.innerHTML = `
        <h3>${pd.title}</h3>
        <div class="persona-driver" style="color:${pd.accentColor}">${pd.driver}</div>
      `;
      col.appendChild(header);

      // Body
      const body = el('div', 'persona-body');

      // Quote
      const quoteSection = buildPersonaSection('Interview Quote', `<div class="persona-quote">${escHtml(pd.quote)}</div>`);
      body.appendChild(quoteSection);

      // Landing page
      const lpHtml = `
        <div class="landing-preview" style="background:${pd.gradient}">
          <h4>${escHtml(pd.landing.headline)}</h4>
          <p>${escHtml(pd.landing.sub)}</p>
          <span class="preview-cta" style="background:${pd.accentColor}">${escHtml(pd.landing.cta)}</span>
          <div class="preview-style">${escHtml(pd.landing.style)}</div>
        </div>
      `;
      body.appendChild(buildPersonaSection('Landing Page', lpHtml));

      // Ad Creative
      const adHtml = `
        <div class="detail-row"><span class="detail-label">Hook</span><span class="detail-value">${escHtml(pd.ad.hook)}</span></div>
        <div class="detail-row"><span class="detail-label">Format</span><span class="detail-value">${escHtml(pd.ad.format)}</span></div>
        <div class="detail-row"><span class="detail-label">Channel</span><span class="detail-value">${escHtml(pd.ad.channel)}</span></div>
      `;
      body.appendChild(buildPersonaSection('Ad Creative', adHtml));

      // Channel Mix
      let chHtml = '';
      pd.channels.forEach(ch => {
        chHtml += `
          <div class="channel-bar">
            <span class="ch-name">${ch.name}</span>
            <div class="ch-track"><div class="ch-fill" style="width:${ch.pct}%;background:${ch.color}"></div></div>
            <span class="ch-pct">${ch.pct}%</span>
          </div>
        `;
      });
      body.appendChild(buildPersonaSection('Channel Mix', chHtml));

      // Influencer Brief
      const infHtml = `
        <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${escHtml(pd.influencer.type)}</span></div>
        <div class="detail-row"><span class="detail-label">Niche</span><span class="detail-value">${escHtml(pd.influencer.niche)}</span></div>
        <div class="detail-row"><span class="detail-label">Tone</span><span class="detail-value">${escHtml(pd.influencer.tone)}</span></div>
        <div class="detail-row"><span class="detail-label">Deliverable</span><span class="detail-value">${escHtml(pd.influencer.deliverable)}</span></div>
      `;
      body.appendChild(buildPersonaSection('Influencer Brief', infHtml));

      // Affiliate Package
      const affHtml = `
        <div class="detail-row"><span class="detail-label">Commission</span><span class="detail-value">${escHtml(pd.affiliate.commission)}</span></div>
        <div class="detail-row"><span class="detail-label">Window</span><span class="detail-value">${escHtml(pd.affiliate.window)}</span></div>
        <div class="detail-row"><span class="detail-label">Assets</span><span class="detail-value">${escHtml(pd.affiliate.assets)}</span></div>
        <div class="detail-row"><span class="detail-label">Tier</span><span class="detail-value">${escHtml(pd.affiliate.tier)}</span></div>
      `;
      body.appendChild(buildPersonaSection('Affiliate Package', affHtml));

      // Economics
      const econHtml = `
        <div class="econ-grid">
          <div class="econ-card"><div class="econ-label">CAC</div><div class="econ-value">${pd.economics.cac}</div></div>
          <div class="econ-card"><div class="econ-label">LTV</div><div class="econ-value">${pd.economics.ltv}</div></div>
          <div class="econ-card"><div class="econ-label">Payback</div><div class="econ-value">${pd.economics.payback}</div></div>
          <div class="econ-card"><div class="econ-label">Margin</div><div class="econ-value">${pd.economics.margin}</div></div>
        </div>
      `;
      body.appendChild(buildPersonaSection('Economics', econHtml));

      col.appendChild(body);
      splitView.appendChild(col);
    });

    panel.appendChild(splitView);

    // Staggered reveal
    setTimeout(() => {
      const sections = panel.querySelectorAll('.persona-section');
      sections.forEach((sec, i) => {
        setTimeout(() => sec.classList.add('revealed'), i * 150);
      });
    }, 100);

    // Vote section
    const voteDiv = el('div', 'vote-section');
    voteDiv.innerHTML = `
      <h4>Which persona would you target first?</h4>
      <p>Both are viable. The pipeline generates both simultaneously.</p>
      <div class="vote-btns">
        <button class="vote-btn" data-vote="left">Burned-Out Worker</button>
        <button class="vote-btn" data-vote="right">Content Creator</button>
      </div>
    `;
    panel.appendChild(voteDiv);

    voteDiv.querySelectorAll('.vote-btn').forEach(b => {
      b.addEventListener('click', () => {
        voteDiv.querySelectorAll('.vote-btn').forEach(x => x.classList.remove('voted'));
        b.classList.add('voted');
      });
    });
  }

  function buildPersonaSection(title, contentHtml) {
    const sec = el('div', 'persona-section');
    sec.innerHTML = `<div class="persona-section-title">${title}</div>${contentHtml}`;
    return sec;
  }


  /* ═══════════════════════════════════════════
     DEMO 3: The Living Campaign
     ═══════════════════════════════════════════ */

  function buildDemo3(panel) {
    const days = [
      { label: 'Day 1', idx: 1 },
      { label: 'Day 3', idx: 2 },
      { label: 'Day 6', idx: 3 },
      { label: 'Day 10', idx: 4 }
    ];

    // Timeline
    const timelineRow = el('div', 'timeline-row');
    timelineRow.innerHTML = '<div class="timeline-line"></div>';
    days.forEach((d, i) => {
      const node = el('div', `timeline-node ${i === 0 ? 'active' : ''}`);
      node.dataset.idx = d.idx;
      node.innerHTML = `<div class="timeline-dot"></div><div class="timeline-label">${d.label}</div>`;
      timelineRow.appendChild(node);
    });
    panel.appendChild(timelineRow);

    // Metrics container
    const metricsDiv = el('div', 'metric-grid');
    metricsDiv.id = 's2-metrics';
    panel.appendChild(metricsDiv);

    // Diagnosis container
    const diagDiv = el('div', 'diagnosis-section');
    diagDiv.id = 's2-diagnosis';
    panel.appendChild(diagDiv);

    // Confidence container
    const confDiv = el('div', 'confidence-section');
    confDiv.id = 's2-confidence';
    panel.appendChild(confDiv);

    // Revisions
    const revDiv = el('div', 'revisions-section');
    revDiv.id = 's2-revisions';
    panel.appendChild(revDiv);

    // Flywheel quote
    const fwDiv = el('div', 'flywheel-quote');
    fwDiv.innerHTML = `
      "The campaign doesn't end at launch. Every data point teaches the system.<br>
      By Day 10, the pipeline knows your customer better than any team could in 6 months."
      <div class="flywheel-attr">-- Gather Flywheel Engine</div>
    `;
    panel.appendChild(fwDiv);

    // Render initial state
    renderIteration(1, panel);

    // Wire timeline clicks
    timelineRow.querySelectorAll('.timeline-node').forEach(node => {
      node.addEventListener('click', () => {
        const idx = parseInt(node.dataset.idx);
        renderIteration(idx, panel);
        // Update timeline visual
        timelineRow.querySelectorAll('.timeline-node').forEach(n => {
          const nIdx = parseInt(n.dataset.idx);
          n.classList.remove('active', 'past');
          if (nIdx === idx) n.classList.add('active');
          else if (nIdx < idx) n.classList.add('past');
        });
      });
    });
  }

  function renderIteration(idx, panel) {
    const data = iterations[idx];

    // Metrics
    const metricsDiv = panel.querySelector('#s2-metrics');
    metricsDiv.innerHTML = `
      <div class="metric-card" style="border-color:${data.ctrC}22">
        <div class="metric-label">CTR</div>
        <div class="metric-value" style="color:${data.ctrC}">${data.ctr}</div>
        <div class="metric-desc">${data.ctrD}</div>
      </div>
      <div class="metric-card" style="border-color:${data.bounceC}22">
        <div class="metric-label">Bounce Rate</div>
        <div class="metric-value" style="color:${data.bounceC}">${data.bounce}</div>
        <div class="metric-desc">${data.bounceD}</div>
      </div>
      <div class="metric-card" style="border-color:${data.infC}22">
        <div class="metric-label">Influencer Conv.</div>
        <div class="metric-value" style="color:${data.infC}">${data.inf}</div>
        <div class="metric-desc">${data.infD}</div>
      </div>
      <div class="metric-card" style="border-color:${data.cacC}22">
        <div class="metric-label">Blended CAC</div>
        <div class="metric-value" style="color:${data.cacC}">${data.cac}</div>
        <div class="metric-desc">${data.cacD}</div>
      </div>
    `;

    // Diagnosis
    const diagDiv = panel.querySelector('#s2-diagnosis');
    const cards = diagnosisCards[idx];
    if (cards && cards.length > 0) {
      let html = '<h4>Agent Diagnosis</h4>';
      cards.forEach(c => {
        html += `
          <div class="diagnosis-card">
            <div class="diagnosis-icon">${c.icon}</div>
            <div class="diagnosis-content">
              <div class="diagnosis-title">${escHtml(c.title)}</div>
              <div class="diagnosis-desc">${escHtml(c.desc)}</div>
              <div class="diagnosis-agent">${escHtml(c.agent)}</div>
            </div>
          </div>
        `;
      });
      diagDiv.innerHTML = html;
      diagDiv.style.display = 'block';
    } else {
      diagDiv.innerHTML = '<h4>Agent Diagnosis</h4><div style="font-size:12px;color:#555;padding:8px 0;">No diagnosis yet. Gathering baseline data...</div>';
      diagDiv.style.display = 'block';
    }

    // Confidence
    const confDiv = panel.querySelector('#s2-confidence');
    const confLevels = {
      1: [{ label:'Persona Accuracy', pct:35 },{ label:'Channel Fit', pct:25 },{ label:'Offer Resonance', pct:20 },{ label:'Scale Readiness', pct:10 }],
      2: [{ label:'Persona Accuracy', pct:58 },{ label:'Channel Fit', pct:65 },{ label:'Offer Resonance', pct:45 },{ label:'Scale Readiness', pct:30 }],
      3: [{ label:'Persona Accuracy', pct:78 },{ label:'Channel Fit', pct:82 },{ label:'Offer Resonance', pct:72 },{ label:'Scale Readiness', pct:60 }],
      4: [{ label:'Persona Accuracy', pct:92 },{ label:'Channel Fit', pct:94 },{ label:'Offer Resonance', pct:88 },{ label:'Scale Readiness', pct:85 }]
    };
    let confHtml = '<h4>Confidence Meters</h4>';
    confLevels[idx].forEach(c => {
      confHtml += `
        <div class="confidence-bar">
          <span class="conf-label">${c.label}</span>
          <div class="conf-track"><div class="conf-fill" style="width:${c.pct}%"></div></div>
          <span class="conf-pct">${c.pct}%</span>
        </div>
      `;
    });
    confDiv.innerHTML = confHtml;

    // Revisions
    const revDiv = panel.querySelector('#s2-revisions');
    const revisions = {
      1: ['Baseline campaign launched across all channels', 'A/B test initiated: 3 landing page variants', 'Influencer outreach queued for Day 3'],
      2: ['CTA repositioned above fold on mobile variants', 'Budget shift: +20% to affiliate, -20% from paid search', 'New ad creative: UGC testimonial variant added', 'Specter privacy brand: passing to Brand Creation pipeline'],
      3: ['Dedicated landing page for first-time pet parents live', 'Influencer content performing 2.3x above benchmark', 'Specter brand assets generated — queued for Scale Engine', 'Email nurture sequence triggered for high-intent visitors'],
      4: ['Scale budget approved: 3x increase recommended', 'Organic referral loop active: 1.4 customers per customer', 'Both PetCalm + Specter tracks showing positive unit economics', 'Flywheel metrics: CAC trending toward $20 by Day 14']
    };
    let revHtml = '<h4>Auto-Generated Revisions</h4>';
    revisions[idx].forEach(r => {
      revHtml += `<div class="revision-item"><span class="revision-bullet">\u25b8</span>${escHtml(r)}</div>`;
    });
    revDiv.innerHTML = revHtml;
  }


  /* ═══════════════════════════════════════════
     MAIN INIT
     ═══════════════════════════════════════════ */

  function initScene2(container) {
    injectCSS();

    container.innerHTML = '';
    const root = el('div', 'scene2');

    // Only show Demo 1 (Pipeline Run) — no sub-tabs
    const panel = el('div', 'sub-panel active');
    buildDemo1(panel);
    root.appendChild(panel);
    container.appendChild(root);
  }

  // Expose globally
  window.initScene2 = initScene2;

})();
