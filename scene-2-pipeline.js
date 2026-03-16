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
    id:'trigger', pipeline:'shared', agent:'trigger', agentName:'Trigger Analyst', dur:90, isLaneStage:false,
    lines:['Step 1: Scanning life-transitions across 6 dimensions — geographic, relationship, family, financial, career, crisis','Step 2: Scoring trigger events — decomposing Switching Intent (Compulsion × Friction), Predictability, Frequency, Data Accessibility','Step 2.5: Classifying events — tagging Switching Type, Telco Pain, Switching Origin, Emotional State','Step 3: Classifying windows — Flash / Short / Extended / Rolling with peak-intent timing','Step 4: Mapping overlaps — flagging compound moments that amplify switching intent','Step 5: Qualifying triggers — 22 events passed all gates (Intent ≥ 3.0, Frequency ≥ 2, 3+ signals)','Library ready — distributing trigger event library to all 3 pipelines']
  };

  const surgePipeline = [
    { id:'s1s', pipeline:'surge', agent:'surge', agentName:'Surge Trend Scanner', dur:90, isLaneStage:true,
      lines:['Step 1: Velocity-first environmental scan — social trending, search spikes, app store surges, news acceleration, spend evidence','Step 2: Velocity scoring — demand acceleration, signal recency, independent signal volume, spend/sign-up evidence','Step 3: Classifying surge sub-types — Opportunity-Window / Escalating / Structural / Innovation Wave','Step 4: Compressed sustainability check — community, infrastructure, identity, institutional loops assessed','Step 5: Comparable precedent lookup — matching 1-2 historical surges with actual outcomes','Step 6: Decay indicator assessment — signal decay + arc trajectory for Innovation Wave candidates','Qualification gates passed: 12 surges qualified (Velocity 3.0+, spend evidence, enduring window Short+)'] },
    { id:'s2s', pipeline:'surge', agent:'surge', agentName:'Surge Persona Builder', dur:60, isLaneStage:true,
      lines:['Step 1: Demand variation extraction — listing distinct buying populations per surge by trigger, urgency, price sensitivity','Step 2: Deduplication & merge — merging on demand-signal overlap, keeping separate when demand dynamics differ','Step 3: Surge-persona card generation — 7 core fields per card: name, demand signal, window, velocity, volume, channels, originating surges','Output: 28 surge-personas after dedup, organized by originating surge'] },
    { id:'s3s', pipeline:'surge', agent:'surge', agentName:'Surge Opportunity Analyst', dur:60, isLaneStage:true,
      lines:['Single-pass scoring on 4 dimensions — Demand Velocity (35%), Window Economics (30%), Capture Feasibility (20%), Competitive Speed (15%)','Speed-adjusted confidence rated — High / Medium / Low based on demand-signal reliability','GO/MONITOR/SKIP assignment — composite 3.5+ with Medium+ confidence = GO','Days-to-launch estimated for GO and MONITOR surge-personas vs. remaining window','Results: 4 GO, 3 MONITOR, 21 SKIP — top GO composite 4.2, window 6 weeks'] },
    { id:'s4sa', pipeline:'surge', agent:'surge', agentName:'Surge Demand Analyst', dur:60, isLaneStage:true,
      lines:['Section 1: Expanded demand snapshot — trigger, volume, decay trajectory model, seasonal pattern, precedent outcomes, revenue window','Section 2: Factor analysis — Factor 2 (Spending & Financial Habits) + Factor 5 (Product Landscape & Switching), 3 Q&As each','Section 3: Surge brief summary — price sensitivity, acquisition channels, launch timeline, go/no-go reaffirmation','Output: 800-1,500 word surge briefs for each GO persona'] },
    { id:'s4sb', pipeline:'surge', agent:'surge', agentName:'Surge Offer Designer', dur:90, isLaneStage:true,
      lines:['Step 1: Demand-response mapping — they want / we offer / the hook / the proof','Step 2: Offer architecture — single plan, 3-5 features, single price point, same-day activation, no contracts','Step 3: Minimal brand — name + tagline + one color, disposable','Step 4: Non-telco bundle evaluation — 1 candidate scored on 5 dimensions','Step 5: Transition plan — trigger, timeline, evolved offer, migration path, pipeline handoff to Micro/Macro','Step 7: Campaign economics — budget, conversions, revenue window, break-even, ROAS target, kill threshold','Step 8: 3 validation hypotheses — switching intent (Gate), offer resonance (Optimize), price point (Optimize)','Step 9: Launch kit assembled — ad copy, channel sequence, budget allocation, A/B tests, kill criteria'] }
  ];

  const microPipeline = [
    { id:'s1m', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Analyst', dur:90, isLaneStage:true,
      lines:['Step 1: PESTEL environmental scan — Political, Economic, Social, Technological, Environmental, Legal signals with sources','Step 1B: Moment-community scan — filtering trigger event library for Short/Extended windows with Intent ≥ 3.0, checking community evidence','Step 2: Ansoff signal scoring — relevance, impact, time horizon for each identified signal','Step 3: Trend pyramid classification — filtering to micro-trend tier (3 months – 3 years only)','Step 3B: Sustainability assessment — reclassifying surges with structural drivers + 2+ reinforcement loops as early micro-trends','Step 4: Rogers adoption lifecycle positioning — Innovators through Laggards placement','Step 5: Qualification gates — micro-trend tier + 3+ sourced signals + identity community check','Dual-entry tagging: Path A (PESTEL), Path B (moment-driven), Path A+B entries flagged for 1.15x confidence boost','Output: 22 qualified micro-trends with identity community evidence'] },
    { id:'s2m', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Persona Builder', dur:75, isLaneStage:true,
      lines:['Step 1: Population extraction — listing 3-8 distinct populations per micro-trend, asking "who is living this trend?"','Step 2: Deduplication & merge — merging on identity overlap ("would they recognize each other as same group?"), keeping separate when identity differs','Step 3: Persona card generation — 8 fields per card: name, description, population, demand window, originating trends, acquisition moment, window type, switching origin','Acquisition moment fields populated from trigger event library; N/A for personas without moment enrichment','Output: 98 persona cards after dedup, organized by originating micro-trend'] },
    { id:'s3m', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Opportunity Analyst', dur:75, isLaneStage:true,
      lines:['Pass 1: Persona attractiveness — Identity Intensity (40%), Carrier Mobility (25%), Pain & Demand (20%), Market Size (15%)','Pass 2: Competitive landscape — Carrier Presence, Differentiation Potential, Regulatory Barriers','Confidence modifier applied — data quality rated 1-5, combined score multiplied by confidence/5','2x2 quadrant assignment — INVEST / EXPLORE / NICHE / IGNORE based on attractiveness × competitive landscape','Path A+B personas receiving 1.15x confidence multiplier','Results: 8 INVEST, 12 EXPLORE, 14 NICHE, 64 IGNORE — shortlisted top 6 with rationale'] },
    { id:'s4ma', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Identity Analyst', dur:90, isLaneStage:true,
      lines:['4A-Lite: Demand snapshot — demand signal, trigger, addressable population, window duration','Factor 2: Spending & Financial Habits — quantitative data + 5 Q&As (40-60 words each, first-person voice)','Factor 3: Needs & Aspirations — stated needs, unstated needs, identity aspirations, self-perception gaps','Factor 4: Fears & Pain Points — anxieties, barriers, emotional tensions surfaced through interviews','Factor 5: Product Landscape & Switching Behavior — current solutions, switching triggers, competitive gaps','Switching Profile Module: trigger mechanism + force score, annual volume, interception channels, window structure (moment-enriched personas only)','Executive brief: key insights, top 3 needs, go/no-go recommendation incorporating switching profile findings','Output: 2,000-4,000 word rapid persona briefs per shortlisted persona'] },
    { id:'s4mb', pipeline:'micro', agent:'micro', agentName:'Micro-Trend Value Prop Designer', dur:90, isLaneStage:true,
      lines:['Step R1: Job extraction — top 3 jobs from 4A-Lite brief using "When I [situation], help me [job], so I can [outcome]"','Step R2: Alternatives snapshot — mapping current solutions per job, verdict: unserved / underserved / well-served','Step R3: Viability gate — demand window, competitive intensity, feasibility check','Step R4: Concept design — 1-2 identity concepts with single plan, non-telco bundle evaluation (5 dimensions, threshold 3.0+), micro-brand, pricing','Step R5: Wind-down plan — sunset trigger, migration path, estimated sunset date, subscriber communication','Step R6: Interception concept — moment job map, offer-window fit, channel-specific interception design (moment-enriched personas only)','Step R7: Campaign activation plan — primary channel, lead message, budget range, success metric per concept','Step R8: Hypothesis generation — 5-7 testable hypotheses per concept, classified Gate vs Optimize, prioritized TEST NOW / VALIDATE / PARK / SKIP'] }
  ];

  const macroPipeline = [
    { id:'s1mt', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Analyst', dur:120, isLaneStage:true,
      lines:['Step 1: PESTEL scan with institutional weighting — prioritizing signals with policy, regulatory, and demographic backing (5-10 year lookback)','Step 1B: Durable moment-community scan — filtering trigger events for Rolling/Extended windows, Intent ≥ 3.5, volume ≥ 1M/year, 3+ year community persistence','Step 2: Ansoff signal scoring with elevated Level 3+ threshold — opportunity shape visible, population estimable','Step 3: Trend pyramid classification — filtering to macro-trend (3-10 yr) and megatrend (10-30+ yr) only','Step 4: Rogers adoption positioning — strategic focus on Early Adopters and Early Majority as prime investment windows','Step 5: Identity community scan — self-labels, tribal language, rituals, gathering points, identity tension scored 1-5','Step 6: Qualification gates — Ansoff 3+, macro/megatrend tier, 4+ sourced signals, identity community 3+, Rogers positioning','Dual-entry tagging: Path A (PESTEL+institutional), Path B (moment-born), Path A+B flagged for 1.15x confidence','Output: 14 qualified macro-trends/megatrends with identity community evidence'] },
    { id:'s15mt', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Moment Mapper', dur:90, isLaneStage:true,
      lines:['Step 1: Transition inventory — identifying 3-5 recurring life transitions per macro-trend across 6 dimensions','Scoring: decomposed Switching Intent (Compulsion × 0.6 + Friction × 0.4), Predictability, Frequency, Data Accessibility','Classification tags assigned: Switching Type, Telco Pain, Switching Origin, Emotional State per transition','Window classification: Flash / Short / Extended / Rolling with peak-intent timing and intent decay','Step 2: Telco pain map — mapping primary and secondary telco friction per transition','Step 3: Cross-pipeline integration — checking overlap with Moments trigger events (High/Medium/Low/Gap)','Step 4: Moment-enriched trend summary — highest-intent, highest-volume, most detectable transitions identified','Telco relevance score assigned per macro-trend (1-5)'] },
    { id:'s2mt', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Persona Builder', dur:75, isLaneStage:true,
      lines:['Step 0: Ingesting Macro-Moment Map — noting best acquisition moments, window types, pipeline gaps per trend','Step 1A: Tier 1 broad persona extraction — full addressable population per macro-trend (30M-50M+ target)','Step 1B: Tier 2 identity-community variation — 1-2 distinct self-organizing communities per Tier 1 persona','Step 2: Deduplication & merge at both tiers — identity overlap test with merge rationale','Step 3: Persona card generation — 9 fields: name, description, population, identity markers, community infrastructure, originating trends, acquisition moment, window type, switching origin','Identity Community Map output: platforms, gathering points, tribal language, rituals per persona','Output: 12 Tier 1 broad personas + 22 Tier 2 identity-community sub-segments'] },
    { id:'s3mt', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Opportunity Analyst', dur:90, isLaneStage:true,
      lines:['Pass 1: Persona attractiveness — Identity Intensity (35%), Carrier Mobility (20%), Pain & Demand (20%), Market Size (15%), Brand-Equity Potential (10%)','Pass 2: Enhanced competitive landscape — Carrier Presence, Differentiation Potential, Regulatory Barriers, Brand Loyalty of Incumbents','Confidence modifier applied — institutional and longitudinal data quality weighted, multiplied by confidence/5','Path A+B personas receiving 1.15x confidence multiplier','2x2 quadrant assignment: BUILD / COMPETE / NICHE / IGNORE','BUILD personas route to full 4M-T-A (50 Q&As, 5 factors) + full 4M-T-B (3-5 concepts)','Results: 4 BUILD, 3 COMPETE, 3 NICHE, 24 IGNORE — shortlisted top 7 with rationale'] },
    { id:'s4mta', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Identity Analyst', dur:120, isLaneStage:true,
      lines:['Section 1: Segment overview — definition, market sizing, 4-tier stratification totaling 100%, 5 notable profiles, named persona','Factor 1: Social Life & Leisure (anchor) — community participation, social signaling, influence networks, identity expression, 10 Q&As','Factor 2: Spending & Financial Habits — identity-driven spending, price sensitivity, subscription behavior, 10 Q&As','Factor 3: Needs & Aspirations — stated needs, unstated needs, identity aspirations, self-perception gaps, 10 Q&As','Factor 4: Fears & Pain Points — identity threats, practical frustrations, market failures, 10 Q&As','Factor 5: Product Landscape & Switching — current solutions, satisfaction gaps, switching history, 10 Q&As','Factor 6: Switching Profile — 6 dimensions: trigger mechanism, volume, interception channels, window structure, decision architecture, moment personas (moment-enriched only)','Tier-variant interview — 10 additional Q&As covering Factors 2, 3, 5 across stratification tiers','Section 3: Executive summary — 5-7 key insights, identity tensions, strategic recommendations, success metrics, go/no-go','Output: 5,000-8,000 word full ethnographic persona reports'] },
    { id:'s4mtb', pipeline:'macro', agent:'macro', agentName:'Macro-Trend Value Prop Designer', dur:120, isLaneStage:true,
      lines:['Step 1: Full JTBD job map — 3-5 core jobs ranked by Frequency × Importance × Emotional Intensity','Step 2: Alternatives analysis — competitive landscape per job, named competitors, unserved/underserved/well-served verdicts','Step 3: Full Kano classification — Table Stakes / Differentiators / Delighters with identity-fit scoring and ritual testing','Step 4: Concept design (3-5 concepts) — multi-tier plans, 3 non-telco candidates evaluated per concept, full micro-brand identity','Step 5: Interception concepts — 1-2 moment-driven concepts with moment job map, offer-window fit, channel-specific interception (moment-enriched only)','Step 6: Community strategy — how the brand integrates with existing identity community infrastructure','Step 7: Campaign activation + hypotheses — 7-10 testable hypotheses per concept, Gate vs Optimize, TEST NOW / VALIDATE / PARK / SKIP','No wind-down plan — macro-trend brands are durable by design','Output: 10,000-15,000 word full value proposition packages'] }
  ];

  const sharedStages = [
    { id:'survey-arch', pipeline:'shared', agent:'shared', agentName:'Survey Architect', dur:120, isLaneStage:false,
      lines:['Ingesting Stage 4 outputs from all 3 pipelines — identity briefs, value prop packages, opportunity scores','Screening section (S1-S5): designing 3-5 behavioral screeners with Prolific prescreener integration, targeting 60-80% qualification rate','Section A: Segment validation — 5-7 questions confirming persona clusters exist and behave as hypothesized','Section B: Needs prioritization — MaxDiff best-worst scaling (12 items, 3 sets of 4), forced-choice, Likert grids','Section C: Value proposition testing — positioning variant test, message resonance grid with generic control, Van Westendorp pricing (4 open-ended)','Section D-E: Demographics for tier stratification + open-ended questions (biggest frustration, credibility test)','Analysis plan: 11 sections — power analysis, hypothesis testing plan, Van Westendorp/MaxDiff specs, Green/Yellow/Red decision framework','Study parameters: n=300-600, under 5 minutes, 20-25 questions, 3-day iteration cycles, max 3 iterations per persona'] },
    { id:'survey-anal', pipeline:'shared', agent:'shared', agentName:'Survey Analyst', dur:120, isLaneStage:false,
      lines:['Running statistical toolkit — MaxDiff hierarchical Bayes, Van Westendorp price curves, chi-square, Wilcoxon, logistic regression','Hypothesis verdicts assigned: CONFIRMED / PARTIALLY CONFIRMED / REFUTED with test statistic, p-value, effect size','Van Westendorp analysis: computing PMC, IDP, OPP, PME intersection points with 2+ subgroup splits','MaxDiff utility rankings: aggregate and subgroup scores, top/bottom 3, cluster analysis','Composite switching intent model: logistic regression with switching intent predictors','3-tier decision framework: Green (proceed to campaign) / Yellow (revise and retest in 2-3 days) / Red (deprioritize)','Feedback loops triggered — updating Opportunity Analyst confidence scores, Persona Builder card fields, Value Prop pricing adjustments','Verdicts: 3 Green, 2 Yellow (next iteration specified), 1 Red — feedback dispatched to pipeline agents'] },
    { id:'brief', pipeline:'shared', agent:'campaign', agentName:'Brief Writer', dur:90, isLaneStage:false,
      lines:['Step 1: Locating 4A persona reports and 4B value prop packages across all 3 pipelines','Step 2: Extracting from 4A — segment definition, market sizing, stratification, named persona, notable profiles, executive summary','Step 3: Extracting from 4B — job hierarchy, alternatives analysis, opportunity scoring, tiered value canvas, positioning, competitive landscape','Step 4: Ranking concepts — primary sort by execution feasibility (Proven > Untested > Unproven), tiebreak by non-telco viability score','Step 5: Generating briefs in parallel — one per concept with brand identity, plan architecture, features, non-telco bundle, competitive context','Step 6: Converting to PDF — pandoc + weasyprint with branded CSS styling','Output: marketing briefs generated for all Green-light concepts across pipelines'] }
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
    inp.type = 'text'; inp.placeholder = 'e.g. analyze surge, micro and macro persona trends'; inp.value = 'analyze surge, micro and macro persona trends';
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

      const { trigCard, laneCards, sharedCards } = buildStageCards();
      abortController = new AbortController();

      runPipeline(trigCard, triggerStage, laneCards, sharedCards, outputPanel, actFeed, abortController.signal).then(() => {
        running = false;
        btn.disabled = false;
      });
    });
  }

  async function runPipeline(trigCard, trigStage, laneCards, sharedCards, outputPanel, actFeed, signal) {
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

    addLogLine(outputPanel, 'shared', 'Pipeline complete.');
    addActivity(actFeed, elapsed(), 'All deliverables packaged and ready');
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
