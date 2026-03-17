// scene-5-missioncontrol.js — Mission Control (Brand Health Dashboard)
// Exports: window.initScene5(container)

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     DATA — ALL HARDCODED FROM REAL SNAPSHOT
     ═══════════════════════════════════════════ */

  const BRAND = { name: 'Meow Mobile', slug: 'meow-mobile', segment_type: 'identity-specific', status: 'live', launched_at: '2026-01-16' };

  const SNAPSHOT = { subscribers: 116, mrr: 7263.53, cac: 42.33, churn_rate: 0.0, activation_rate: 100.0 };

  const AGENTS = [
    { id: 'concierge', name: 'Concierge Agent', status: 'idle', summary: '10 stalled, 5 escalated, 5 conversations', department: 'Customer Support' },
    { id: 'pulse', name: 'Signal Agent', status: 'active', summary: 'monitoring signal health', department: 'DevOps & Infrastructure' },
    { id: 'fraud', name: 'Fraud Watch Agent', status: 'idle', summary: 'abuse resolved \u2192 enforcement policy updated', department: 'Compliance & Fraud' },
    { id: 'rca', name: 'RCA Agent', status: 'idle', summary: 'last triage: triage posted \u2014 #12531', department: 'Incidents' },
    { id: 'internal_health', name: 'Internal Health Monitor', status: 'active', summary: 'forecasts db pool exhaustion in 2.3h', department: 'DevOps & Infrastructure', parent: 'Signal Agent' },
    { id: 'vendor_health', name: 'Vendor Health Monitor', status: 'idle', summary: '2 scans \u2014 all clear', department: 'DevOps & Infrastructure', parent: 'Signal Agent' },
    { id: 'deploy_health', name: 'Deployment Health Guardian', status: 'idle', summary: '1 scans \u2014 all clear', department: 'DevOps & Infrastructure' },
    { id: 'data_pipeline', name: 'Data Pipeline Monitor', status: 'idle', summary: '1 scans \u2014 all clear', department: 'DevOps & Infrastructure' },
    { id: 'concierge_qa', name: 'Concierge Quality Agent', status: 'idle', summary: '1 scans \u2014 all clear', department: 'Customer Support' },
    { id: 'bad_actor', name: 'Bad Actor Agent', status: 'idle', summary: 'last: referral fraud cluster detected \u2014 7 accounts suspended', department: 'Compliance & Fraud' },
    { id: 'reg_monitor', name: 'Regulatory Change Monitor', status: 'idle', summary: 'last: cpni data access audit \u2014 compliant', department: 'Compliance & Fraud' },
    { id: 'channel_perf', name: 'Channel Performance Agent', status: 'idle', summary: 'last: meta cac spiked \u2014 ad set paused', department: 'Growth & Finance' },
    { id: 'conv_funnel', name: 'Conversion Funnel Agent', status: 'idle', summary: '2 scans \u2014 all clear', department: 'Growth & Finance' },
    { id: 'financial_health', name: 'Financial Health Agent', status: 'idle', summary: '2 scans \u2014 all clear', department: 'Growth & Finance' },
    { id: 'db_health', name: 'Database Health Agent', status: 'idle', summary: '2 scans \u2014 all clear', department: 'Incidents' },
    { id: 'vendor_outage', name: 'Vendor Outage Agent', status: 'idle', summary: '3 scans \u2014 all clear', department: 'Incidents' },
  ];

  const FILTER_TABS = [
    { key: null, label: 'Overview' },
    { key: 'devops', label: 'DevOps', depts: ['DevOps & Infrastructure'] },
    { key: 'support', label: 'Support', depts: ['Customer Support'] },
    { key: 'compliance', label: 'Compliance', depts: ['Compliance & Fraud'] },
    { key: 'growth', label: 'Growth & Finance', depts: ['Growth & Finance'] },
    { key: 'incidents', label: 'Incidents', depts: ['Incidents'] },
  ];

  const DEPT_SIGNAL_GROUPS = {
    overview: [
      { title: 'Growth', signals: [{ key: 'traffic', label: 'Traffic' }, { key: 'conversion', label: 'Conversion' }, { key: 'activation', label: 'Activation' }] },
      { title: 'Stability', signals: [{ key: 'escalation', label: 'Escalation' }, { key: 'incidents', label: 'Incidents' }, { key: 'interventions', label: 'Interventions' }] },
    ],
    devops: [{ title: 'Infrastructure', signals: [{ key: 'uptime', label: 'Uptime' }, { key: 'sla_breaches', label: 'SLA Breaches' }, { key: 'error_rate', label: 'Error Rate' }, { key: 'latency', label: 'Latency (p95)' }] }],
    support: [{ title: 'Support Quality', signals: [{ key: 'escalation', label: 'Escalation' }, { key: 'resolution', label: 'Resolution' }, { key: 'repeat_contact', label: 'Repeat Contact' }, { key: 'sentiment', label: 'Sentiment' }] }],
    compliance: [{ title: 'Risk Surface', signals: [{ key: 'fraud', label: 'Fraud Flags' }, { key: 'reg_alerts', label: 'Regulatory' }] }],
    growth: [{ title: 'Acquisition', signals: [{ key: 'traffic', label: 'Traffic' }, { key: 'conversion', label: 'Conversion' }, { key: 'cac', label: 'CAC' }, { key: 'activation', label: 'Activation' }, { key: 'churn', label: 'Churn' }] }],
    incidents: [{ title: 'Incident Response', signals: [{ key: 'incidents', label: 'Incidents' }, { key: 'mttr', label: 'MTTR' }, { key: 'customer_impact', label: 'Customers Affected' }, { key: 'repeat_incidents', label: 'Repeat Incidents' }] }],
  };

  /* ─── Date helpers ─── */
  const GRID_START = new Date('2025-12-01'); // heatmap grid starts here (pre-launch = grey)
  const LAUNCH_DATE = '2026-01-16';
  const END_DATE = new Date('2026-03-12');

  function daysBetween(a, b) {
    return Math.round((b - a) / 86400000);
  }

  function dateStr(d) {
    return d.toISOString().slice(0, 10);
  }

  function allDays() {
    const days = [];
    const d = new Date(GRID_START);
    while (d <= END_DATE) {
      days.push(dateStr(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }

  const ALL_DAYS = allDays(); // ~102 days (Dec 1 → Mar 12)
  const POST_LAUNCH_DAYS = ALL_DAYS.filter(function (d) { return d >= LAUNCH_DATE; });

  /* ─── Seeded pseudo-random for simulated signals ─── */
  function seedHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return h;
  }

  function seededRandom(seed) {
    let s = seedHash(seed);
    return function () {
      s = (s * 1664525 + 1013904223) & 0x7fffffff;
      return s / 0x7fffffff;
    };
  }

  function simSignal(seedPrefix, days, low, high, healthFn) {
    return days.filter(function (d) { return d >= LAUNCH_DATE; }).map(function (day, i) {
      var rng = seededRandom(seedPrefix + '-' + day);
      var val = Math.round(low + rng() * (high - low) * 100) / 100;
      if (Number.isInteger(low) && Number.isInteger(high)) {
        val = Math.round(val);
      }
      return { day: day, value: val, health: healthFn(val) };
    });
  }

  /* ─── Overview signals (post-launch only) ─── */
  // Traffic: pageviews per day, thresholds >=200 green, >=50 yellow, <50 red
  var SIGNALS = {};

  SIGNALS.traffic = (function () {
    // Realistic traffic pattern: low early, ramps up, with spikes
    return POST_LAUNCH_DAYS.map(function (day, i) {
      var rng = seededRandom('traffic-' + day);
      var base;
      if (i < 7) base = 10 + Math.round(rng() * 20);        // week 1: low
      else if (i < 14) base = 25 + Math.round(rng() * 35);   // week 2: growing
      else if (i < 21) base = 40 + Math.round(rng() * 60);   // week 3: mixed
      else if (i < 35) base = 80 + Math.round(rng() * 150);  // weeks 4-5: ramp
      else base = 120 + Math.round(rng() * 200);              // weeks 6+: strong
      var health = base >= 200 ? 'green' : base >= 50 ? 'yellow' : 'red';
      return { day: day, value: base, health: health };
    });
  })();

  SIGNALS.conversion = (function () {
    // Conversion rate %, thresholds >=5 green, >=2 yellow, <2 red
    return POST_LAUNCH_DAYS.map(function (day, i) {
      var rng = seededRandom('conversion-' + day);
      var base;
      if (i < 10) base = 1 + rng() * 6;     // early: volatile
      else if (i < 25) base = 2 + rng() * 5;
      else base = 3 + rng() * 8;
      base = Math.round(base * 10) / 10;
      var health = base >= 5 ? 'green' : base >= 2 ? 'yellow' : 'red';
      return { day: day, value: base, health: health };
    });
  })();

  SIGNALS.activation = (function () {
    // Activation rate %, thresholds >=80 green, >=50 yellow, <50 red
    return POST_LAUNCH_DAYS.map(function (day, i) {
      var rng = seededRandom('activation-' + day);
      var base;
      if (i < 5) base = 50 + rng() * 50;
      else if (i < 15) base = 60 + rng() * 40;
      else base = 75 + rng() * 25;
      base = Math.round(base * 10) / 10;
      // Some days have no signups
      if (rng() < 0.15) return { day: day, value: null, health: 'grey' };
      var health = base >= 80 ? 'green' : base >= 50 ? 'yellow' : 'red';
      return { day: day, value: base, health: health };
    });
  })();

  SIGNALS.escalation = (function () {
    // Escalation rate %, <=15 green, <=30 yellow, >30 red
    return POST_LAUNCH_DAYS.map(function (day, i) {
      var rng = seededRandom('escalation-' + day);
      var base;
      if (i < 10) base = rng() * 20;
      else if (i < 30) base = 5 + rng() * 35;
      else base = 10 + rng() * 45;
      base = Math.round(base * 10) / 10;
      if (rng() < 0.1) return { day: day, value: null, health: 'grey' };
      var health = base <= 15 ? 'green' : base <= 30 ? 'yellow' : 'red';
      return { day: day, value: base, health: health };
    });
  })();

  SIGNALS.incidents = (function () {
    // Count per day, 0=green, <=2 yellow, >2 red
    return POST_LAUNCH_DAYS.map(function (day) {
      var rng = seededRandom('incidents-' + day);
      var val = Math.floor(rng() * 5);
      if (rng() > 0.3) val = 0; // Most days no incidents
      var health = val === 0 ? 'green' : val <= 2 ? 'yellow' : 'red';
      return { day: day, value: val, health: health };
    });
  })();

  SIGNALS.interventions = (function () {
    // Count per day, 0=grey, <=15 green, <=30 yellow, >30 red
    return POST_LAUNCH_DAYS.map(function (day, i) {
      var rng = seededRandom('interventions-' + day);
      var val;
      if (i < 10) val = Math.floor(rng() * 5);
      else if (i < 30) val = Math.floor(rng() * 15);
      else val = 2 + Math.floor(rng() * 20);
      var health = val === 0 ? 'grey' : val <= 15 ? 'green' : val <= 30 ? 'yellow' : 'red';
      return { day: day, value: val, health: health };
    });
  })();

  /* ─── Department-specific signals (simulated) ─── */

  // DevOps
  SIGNALS.uptime = simSignal('uptime', ALL_DAYS, 99.0, 100.0, function (v) {
    return v >= 99.5 ? 'green' : v >= 99.0 ? 'yellow' : 'red';
  });
  SIGNALS.uptime = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('uptime-' + day);
    var val = 99.5 + rng() * 0.5;
    if (rng() < 0.08) val = 99.0 + rng() * 0.5; // rare yellow
    val = Math.round(val * 100) / 100;
    return { day: day, value: val, health: val >= 99.5 ? 'green' : val >= 99.0 ? 'yellow' : 'red' };
  });

  SIGNALS.sla_breaches = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('sla-' + day);
    var val = Math.floor(rng() * 4);
    if (rng() > 0.25) val = 0;
    return { day: day, value: val, health: val === 0 ? 'green' : val === 1 ? 'yellow' : 'red' };
  });

  SIGNALS.error_rate = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('errorrate-' + day);
    var val = rng() * 2.0;
    if (rng() > 0.3) val = rng() * 0.5; // mostly low
    val = Math.round(val * 100) / 100;
    return { day: day, value: val, health: val < 0.5 ? 'green' : val <= 1.0 ? 'yellow' : 'red' };
  });

  SIGNALS.latency = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('latency-' + day);
    var val = 15 + Math.round(rng() * 105);
    if (rng() > 0.25) val = 15 + Math.round(rng() * 45); // mostly low
    return { day: day, value: val, health: val < 50 ? 'green' : val <= 80 ? 'yellow' : 'red' };
  });

  // Support
  SIGNALS.resolution = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('resolution-' + day);
    var val = 80 + Math.round(rng() * 20 * 10) / 10;
    if (rng() < 0.1) return { day: day, value: null, health: 'grey' };
    return { day: day, value: val, health: val > 90 ? 'green' : val >= 80 ? 'yellow' : 'red' };
  });

  SIGNALS.repeat_contact = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('repeat-' + day);
    var val = Math.round(rng() * 25 * 10) / 10;
    if (rng() < 0.1) return { day: day, value: null, health: 'grey' };
    return { day: day, value: val, health: val < 10 ? 'green' : val <= 15 ? 'yellow' : 'red' };
  });

  // Sentiment mirrors escalation
  SIGNALS.sentiment = SIGNALS.escalation.map(function (e) {
    return { day: e.day, value: e.value, health: e.health };
  });

  // Compliance
  SIGNALS.fraud = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('fraud-' + day);
    var val = Math.floor(rng() * 5);
    if (rng() > 0.3) val = Math.floor(rng() * 2);
    return { day: day, value: val, health: val <= 1 ? 'green' : val === 2 ? 'yellow' : 'red' };
  });

  SIGNALS.reg_alerts = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('reg-' + day);
    var val = Math.floor(rng() * 3);
    if (rng() > 0.2) val = 0;
    return { day: day, value: val, health: val === 0 ? 'green' : val === 1 ? 'yellow' : 'red' };
  });

  // Growth
  SIGNALS.cac = (function () {
    // 40 entries from Jan 16 to Feb 24
    var cacDays = POST_LAUNCH_DAYS.slice(0, 40);
    return cacDays.map(function (day) {
      var rng = seededRandom('cac-' + day);
      var val = 15 + Math.round(rng() * 50 * 100) / 100;
      return { day: day, value: val, health: val <= 25 ? 'green' : val <= 40 ? 'yellow' : 'red' };
    });
  })();

  SIGNALS.churn = []; // no churn data exists

  // Incidents
  SIGNALS.mttr = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('mttr-' + day);
    // Many days have no incidents so no MTTR
    if (rng() > 0.35) return { day: day, value: null, health: 'grey' };
    var val = 5 + Math.round(rng() * 115);
    return { day: day, value: val, health: val < 30 ? 'green' : val <= 60 ? 'yellow' : 'red' };
  });

  SIGNALS.customer_impact = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('impact-' + day);
    if (rng() > 0.35) return { day: day, value: 0, health: 'green' };
    var val = Math.round(rng() * 50);
    return { day: day, value: val, health: val < 10 ? 'green' : val <= 25 ? 'yellow' : 'red' };
  });

  SIGNALS.repeat_incidents = POST_LAUNCH_DAYS.map(function (day) {
    var rng = seededRandom('repinc-' + day);
    var val = Math.floor(rng() * 4);
    if (rng() > 0.2) val = 0;
    return { day: day, value: val, health: val === 0 ? 'green' : val === 1 ? 'yellow' : 'red' };
  });


  /* ─── Activity entries ─── */
  var ACTIVITY = [
    // Today — Mar 12
    { timestamp: '2026-03-12T09:30:00Z', agent: 'Fraud Watch Agent', action: 'abuse resolved \u2192 enforcement policy updated', detail: 'Updated from Bad Actor Agent: referral fraud cluster detected \u2014 7 accounts suspended', type: 'compliance', bau: false },
    { timestamp: '2026-03-12T09:29:00Z', agent: 'Bad Actor Agent', action: 'referral fraud cluster detected \u2014 7 accounts suspended', detail: '7 accounts linked to same device ID across 3 referral chains. All suspended pending review. Referral credits clawed back ($210). Pattern: rotating email domains with shared IDFV.', type: 'compliance', bau: false },
    { timestamp: '2026-03-12T09:15:00Z', agent: 'Signal Agent', action: 'internal health critical \u2192 heatmap updated \u2014 operator attention needed', detail: 'Escalated from Internal Health Monitor: forecasts DB pool exhaustion in 2.3h. Pool at 78% and climbing 12%/hr. Root cause: leaked connections from order-status poller. Fix staged \u2014 awaiting deploy approval.', type: 'devops', bau: false, urgent: true, flagged: true },
    { timestamp: '2026-03-12T09:14:00Z', agent: 'Internal Health Monitor', action: 'forecasts DB pool exhaustion in 2.3h', detail: 'Pool at 78% and climbing 12%/hr. Root cause: leaked connections from order-status poller. Fix staged \u2014 awaiting deploy approval. ETA to critical: ~2.3h at current rate.', type: 'devops', bau: false, urgent: true, flagged: true },
    { timestamp: '2026-03-12T08:45:00Z', agent: 'Regulatory Change Monitor', action: 'CPNI data access audit \u2014 compliant', detail: 'Quarterly CPNI access log review complete. 0 unauthorized access attempts. All API endpoints properly gated.', type: 'compliance', bau: true },
    { timestamp: '2026-03-12T08:30:00Z', agent: 'Financial Health Agent', action: 'unit economics snapshot \u2014 91% profitable', detail: 'Daily unit econ check: 91% of active subscribers are profitable. Weighted average LTV:CAC ratio 3.2x. MRR growth +2.1% WoW.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T08:15:00Z', agent: 'Regulatory Change Monitor', action: 'regulatory scan \u2014 no new filings', detail: 'FCC ECFS scan complete. 0 new MVNO-relevant dockets. Next scan in 24h.', type: 'compliance', bau: true },
    { timestamp: '2026-03-12T08:00:00Z', agent: 'Regulatory Change Monitor', action: 'state-level scan \u2014 0 new MVNO-relevant bills', detail: 'Scanned 50 state legislatures. No new telecom bills affecting MVNO operations. Florida TCPA amendment still in committee.', type: 'compliance', bau: true },
    { timestamp: '2026-03-12T07:45:00Z', agent: 'Channel Performance Agent', action: 'Meta CAC spiked \u2014 ad set paused', detail: 'Meta CAC jumped to $52 (vs $38 target). Ad set "cat-lovers-lookalike-v3" paused. Cause: audience fatigue after 14 days. Recommendation: rotate creative or narrow targeting.', type: 'monitoring', bau: false },
    { timestamp: '2026-03-12T07:30:00Z', agent: 'Regulatory Change Monitor', action: 'E-911 quarterly compliance report filed', detail: 'Q1 2026 E-911 compliance report auto-generated and filed. All 116 active lines confirmed E-911 capable. Database sync verified.', type: 'compliance', bau: false },
    { timestamp: '2026-03-12T07:15:00Z', agent: 'Vendor Health Monitor', action: 'vendor health check \u2014 all partners green', detail: 'ConnectX: 99.94% uptime. Stripe: 99.99%. SM-DP+: 99.91%. AT&T NPAC: 99.87%.', type: 'devops', bau: true },
    { timestamp: '2026-03-12T07:00:00Z', agent: 'Conversion Funnel Agent', action: 'hourly check \u2014 no drop-off anomalies', detail: 'Funnel conversion rates within 1 std dev across all stages. Landing \u2192 signup: 8.2%, signup \u2192 payment: 34%, payment \u2192 activation: 91%.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T06:45:00Z', agent: 'Bad Actor Agent', action: 'referral program audit \u2014 clean', detail: 'Scanned 23 recent referrals. No device ID clusters, no velocity anomalies. 2 flagged for manual review (borderline).', type: 'compliance', bau: true },
    { timestamp: '2026-03-12T06:30:00Z', agent: 'Deployment Health Guardian', action: 'canary analysis: no regression detected', detail: 'Canary deployment v2.14.3 running 15 min. Error rate 0.02% (baseline 0.03%). Latency p95: 42ms (baseline 44ms). Promoting to full rollout.', type: 'devops', bau: true },
    { timestamp: '2026-03-12T06:15:00Z', agent: 'Channel Performance Agent', action: 'attribution validation \u2014 platform vs actual', detail: 'Meta reports 12 conversions, PostHog shows 9. Delta: 25% over-attribution. Google reports 4, PostHog shows 4. Within tolerance.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T06:10:00Z', agent: 'Vendor Outage Agent', action: 'vendor SLA compliance check \u2014 all green', detail: 'ConnectX: 99.94% uptime (SLA 99.9%). Stripe: 99.99%. SM-DP+: 99.91%. AT&T NPAC: 99.87%.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T06:05:00Z', agent: 'Vendor Outage Agent', action: 'vendor SLA compliance check \u2014 all green', detail: 'All vendor endpoints reachable. Response times within SLA. No degradation patterns detected.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T06:00:00Z', agent: 'Vendor Outage Agent', action: 'vendor SLA compliance check \u2014 all green', detail: 'Cross-vendor correlation scan \u2014 no anomalies. All error rates independent.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T05:45:00Z', agent: 'Concierge Quality Agent', action: 'resolution rate check \u2014 94% same-session', detail: '94% of conversations resolved in single session. 6% required follow-up. 0 negative sentiment escalations.', type: 'support', bau: true },
    { timestamp: '2026-03-12T05:30:00Z', agent: 'Conversion Funnel Agent', action: 'mobile vs desktop split \u2014 mobile converting better', detail: 'Mobile: 6.1% landing-to-signup (vs 4.8% desktop). Mobile share: 72% of traffic. Recommendation: prioritize mobile landing page optimization.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T05:15:00Z', agent: 'Bad Actor Agent', action: 'SIM swap fraud scan \u2014 0 suspicious requests', detail: 'Scanned all number change requests in last 24h. 0 flagged. No velocity anomalies on any accounts.', type: 'compliance', bau: true },
    { timestamp: '2026-03-12T05:00:00Z', agent: 'Database Health Agent', action: 'storage utilization forecast \u2014 68 days runway', detail: 'Aurora storage: 312/500GB (62.4%). Growth rate: 2.8GB/day. 68 days until 95% threshold. No action needed.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T04:45:00Z', agent: 'Channel Performance Agent', action: 'attribution validation \u2014 platform vs actual', detail: 'Nightly reconciliation complete. Total platform-reported: 18, PostHog actual: 14. Adjustment factor applied to dashboards.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T04:30:00Z', agent: 'Channel Performance Agent', action: 'attribution validation \u2014 platform vs actual', detail: 'Google Ads: 3 reported, 3 confirmed. TikTok: 2 reported, 1 confirmed. Organic: 8 confirmed (no platform attribution).', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T04:15:00Z', agent: 'Internal Health Monitor', action: 'infrastructure health check \u2014 green', detail: 'CPU: 34%, Memory: 61%, Disk: 62%, Network: nominal. All thresholds within green range.', type: 'devops', bau: true },
    { timestamp: '2026-03-12T04:00:00Z', agent: 'Data Pipeline Monitor', action: 'all pipelines healthy \u2014 0 backlog', detail: 'Databricks ETL: 0 failed jobs. Fivetran sync: all connectors healthy. PostHog events: <2s ingestion lag.', type: 'devops', bau: true },
    { timestamp: '2026-03-12T03:45:00Z', agent: 'Bad Actor Agent', action: 'CDR anomaly scan \u2014 usage patterns normal', detail: 'Scanned 116 active lines. No abnormal usage patterns. Top user: 42GB data (within plan). No international toll fraud.', type: 'compliance', bau: true },
    { timestamp: '2026-03-12T03:30:00Z', agent: 'Financial Health Agent', action: 'daily reconciliation \u2014 MRR $14,280', detail: 'Stripe MRR: $14,280. Active subscriptions: 116. ARPU: $123.10. Delinquent: 0. Upcoming renewals (7d): 18.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-12T01:54:00Z', agent: 'Concierge Agent', action: 'Order #23120 \u2014 stalled, 3 contacts, escalated', detail: 'Customer paid 5 days ago, stuck at number selection. 3 support contacts. Auto-escalated to human agent. Port-in request may be blocking.', type: 'support', bau: false, urgent: true, flagged: true,
      conversation: {
        topic: 'Number selection \u2014 port-in blocked', status: 'escalated', message_count: 11, contact_count: 3,
        evaluation: { grade: 'fair', summary: 'Mochi correctly identified port-in as the blocker but lacked carrier API access to resolve directly.', signals: ['Port-in status check attempted on contact 1', 'Correct escalation after AT&T delay confirmed', 'Customer reassured about billing pause'] },
        messages: [
          { role: 'user', content: 'I paid 5 days ago but I\u2019m still stuck on the number selection screen. It says my port-in is pending.', timestamp: '2026-03-08T10:20:00Z' },
          { role: 'assistant', content: 'Let me check your port-in status. I can see order #23120 \u2014 your number transfer from AT&T is in progress but hasn\u2019t been released yet. This typically takes 1\u20133 business days.', timestamp: '2026-03-08T10:20:30Z' },
          { role: 'user', content: 'It\u2019s been 5 days already. When will it go through?', timestamp: '2026-03-08T10:21:00Z' },
          { role: 'assistant', content: 'I understand your frustration. The delay appears to be on AT&T\u2019s side. I\u2019ve flagged your case for our carrier relations team to follow up directly with AT&T. You won\u2019t be charged for any days until your number is active.', timestamp: '2026-03-08T10:21:30Z' },
          { role: 'user', content: 'Any update? Still stuck.', timestamp: '2026-03-10T14:15:00Z' },
          { role: 'assistant', content: 'I\u2019m sorry \u2014 the port-in is still showing as pending with AT&T. Our team has submitted a second request. I\u2019ll notify you the moment it clears.', timestamp: '2026-03-10T14:15:30Z' },
          { role: 'user', content: 'This is really frustrating. I need my number transferred ASAP.', timestamp: '2026-03-12T01:50:00Z' },
          { role: 'assistant', content: 'I completely understand. I\u2019m escalating this to a human agent who can contact AT&T directly. Someone will reach out to you within a few hours.', timestamp: '2026-03-12T01:50:30Z' }
        ]
      }
    },
    { timestamp: '2026-03-12T00:43:00Z', agent: 'Concierge Agent', action: 'Order #23610 \u2014 stalled, 7 contacts, escalated', detail: 'Customer paid 8 days ago, stuck at eSIM activation. 7 support contacts over 6 days. Pattern: device compatibility issue (older iPhone SE). Escalated with full conversation history.', type: 'support', bau: false, urgent: true, flagged: true,
      conversation: {
        topic: 'eSIM activation failure', status: 'escalated', message_count: 24, contact_count: 7,
        evaluation: { grade: 'poor', summary: 'Mochi identified the device issue by contact 3 but could not resolve without human intervention. Customer experienced significant frustration over 6 days.', signals: ['Device compatibility check delayed until 3rd contact', 'Repeated regeneration attempts wasted customer time', 'Escalation should have triggered after contact 2'] },
        messages: [
          { role: 'user', content: 'Hi, I paid for my plan 8 days ago but still can\u2019t activate. The QR code doesn\u2019t work.', timestamp: '2026-03-04T14:30:00Z' },
          { role: 'assistant', content: 'I\u2019m sorry to hear that. Let me look into order #23610. Can you confirm which device you\u2019re trying to activate on?', timestamp: '2026-03-04T14:31:00Z' },
          { role: 'user', content: 'iPhone SE. I\u2019ve scanned the QR code multiple times but it says \u201ceSIM not supported\u201d.', timestamp: '2026-03-04T14:32:00Z' },
          { role: 'assistant', content: 'The iPhone SE (1st generation) doesn\u2019t support eSIM, but the SE 2nd gen and later do. Could you check Settings > General > About and tell me your model number?', timestamp: '2026-03-04T14:33:00Z' },
          { role: 'user', content: 'It says Model MHGP3LL/A', timestamp: '2026-03-05T09:15:00Z' },
          { role: 'assistant', content: 'That\u2019s an iPhone SE (2nd generation) which supports eSIM. Let me regenerate your QR code. Please try scanning again in a few minutes.', timestamp: '2026-03-05T09:16:00Z' },
          { role: 'user', content: 'Still the same error. \u201cUnable to activate eSIM. Contact your carrier.\u201d', timestamp: '2026-03-05T10:00:00Z' },
          { role: 'assistant', content: 'I\u2019m escalating this to our technical team. They\u2019ll be in touch within 24 hours. Your plan is active and we won\u2019t charge for days without service.', timestamp: '2026-03-05T10:01:00Z' },
          { role: 'user', content: 'Any update on my eSIM?', timestamp: '2026-03-06T11:00:00Z' },
          { role: 'assistant', content: 'Our team is still investigating. I\u2019ll notify you as soon as there\u2019s an update.', timestamp: '2026-03-06T11:01:00Z' },
          { role: 'user', content: 'It\u2019s been 3 days. This is ridiculous.', timestamp: '2026-03-08T16:00:00Z' },
          { role: 'assistant', content: 'I understand your frustration. Escalating again with higher priority.', timestamp: '2026-03-08T16:01:00Z' },
          { role: 'user', content: 'I still cannot activate my eSIM. I\u2019ve tried everything you suggested.', timestamp: '2026-03-12T00:40:00Z' },
          { role: 'assistant', content: 'I\u2019m truly sorry. I\u2019ve flagged this for immediate human review with your full conversation history.', timestamp: '2026-03-12T00:41:00Z' }
        ],
        prior_conversations: [
          { customer_message: 'Any update on my eSIM?', bot_response: 'Our team is still investigating.', message_count: 3, was_escalated: false, timestamp: '2026-03-06T11:00:00Z' },
          { customer_message: 'It\u2019s been 3 days. This is ridiculous.', bot_response: 'Escalating again with higher priority.', message_count: 4, was_escalated: true, timestamp: '2026-03-08T16:00:00Z' },
          { customer_message: 'I still cannot activate.', bot_response: 'Flagged for immediate human review.', message_count: 2, was_escalated: true, timestamp: '2026-03-12T00:40:00Z' }
        ]
      }
    },
    { timestamp: '2026-03-12T02:30:00Z', agent: 'Concierge Agent', action: 'Visitor \u2014 checkout abandoned', detail: 'Visitor reached payment page but did not complete. Session duration: 4m 12s. Came from Meta ad (cat-lovers-lookalike-v3).', type: 'monitoring', bau: false },
    { timestamp: '2026-03-12T03:15:00Z', agent: 'Concierge Agent', action: 'Order #25440 \u2014 checkout abandoned', detail: 'Order created but payment not completed within 2h. User returned to plan comparison page 3 times. Possible price sensitivity.', type: 'monitoring', bau: false },

    // Yesterday — Mar 11
    { timestamp: '2026-03-11T18:00:00Z', agent: 'Concierge Agent', action: '18 drop-offs this week', detail: 'Weekly checkout abandonment summary: 18 users reached payment but did not complete. Conversion rate holding at 34%. Top drop-off reason: plan comparison indecision.', type: 'monitoring', bau: false },
    { timestamp: '2026-03-11T15:30:00Z', agent: 'RCA Agent', action: 'Triage posted \u2014 #12531', detail: 'Incident #12531: ConnectX API returned stale order status for 3 users. Root cause: caching layer TTL too aggressive (was 60s, should be 10s). Fix deployed. Post-mortem scheduled.', type: 'support', bau: false,
      rca: {
        severity: 'warning',
        summary: 'ConnectX API returned stale order status for 3 users. Orders appeared stuck at "processing" despite being completed on ConnectX side.',
        verdict: 'Caching layer TTL too aggressive at 60s caused stale reads during high-traffic window.',
        tickets: [
          { id: 12531, subject: 'Stale order status from ConnectX API', status: 'solved', priority: 'high', url: '#' }
        ],
        steps: [
          { step: 1, name: 'API Response Check', status: 'fail', finding: 'ConnectX GET /orders returning 60s-old data for 3 order IDs' },
          { step: 2, name: 'Cache Layer Inspection', status: 'fail', finding: 'Redis cache TTL set to 60s; ConnectX webhook updates not invalidating cache' },
          { step: 3, name: 'Webhook Delivery', status: 'pass', finding: 'All webhooks delivered within 2s' },
          { step: 4, name: 'Database Consistency', status: 'pass', finding: 'Primary DB had correct status; issue isolated to cache layer' },
          { step: 5, name: 'Customer Impact', status: 'warn', finding: '3 users saw stale status for up to 60s; no failed activations' }
        ],
        timeline: [
          { time: '14:42', event: 'Alert triggered: 3 orders showing status mismatch between cache and source' },
          { time: '14:44', event: 'Automated investigation started \u2014 querying ConnectX API directly' },
          { time: '14:45', event: 'Root cause identified: Redis TTL=60s, webhook not invalidating cache' },
          { time: '14:48', event: 'Fix deployed: TTL reduced to 10s, cache-aside invalidation on webhook' },
          { time: '14:52', event: 'Verification: all 3 orders now showing correct status' },
          { time: '15:30', event: 'Triage report posted, post-mortem scheduled' }
        ],
        actions_taken: ['Reduced Redis cache TTL from 60s to 10s', 'Added webhook-triggered cache invalidation', 'Verified all 3 affected orders now showing correct status'],
        recommendations: ['Add cache-aside pattern for all ConnectX endpoints', 'Set up stale-data monitoring alert with 30s threshold']
      }
    },
    { timestamp: '2026-03-11T12:00:00Z', agent: 'Concierge Agent', action: 'Order #23910 \u2014 stalled, 8 contacts, escalated', detail: 'Customer paid 12 days ago, activation failed 3 times. 8 support contacts. Device: Samsung Galaxy A14. eSIM not supported on this model. Escalated for manual SIM ship.', type: 'support', bau: false, urgent: true, flagged: true,
      conversation: {
        topic: 'eSIM not supported \u2014 physical SIM needed', status: 'escalated', message_count: 28, contact_count: 8,
        evaluation: { grade: 'poor', summary: 'Critical miss: Galaxy A14 does not support eSIM. Mochi attempted activation 3 times before identifying the hardware limitation. Should have checked device compatibility on first contact.', signals: ['Device compatibility not checked until contact 3', '3 failed activation attempts before diagnosis', 'Customer without service for 12 days', 'Physical SIM shipment required \u2014 not in automated flow'] },
        messages: [
          { role: 'user', content: 'I\u2019ve been trying to activate my eSIM for days. The QR code just gives an error.', timestamp: '2026-02-28T10:00:00Z' },
          { role: 'assistant', content: 'I\u2019m sorry you\u2019re having trouble. Let me regenerate your eSIM QR code. What device are you using?', timestamp: '2026-02-28T10:01:00Z' },
          { role: 'user', content: 'Samsung Galaxy A14.', timestamp: '2026-02-28T10:02:00Z' },
          { role: 'assistant', content: 'Let me send you a new QR code. Please go to Settings > Connections > SIM manager and tap "Add eSIM".', timestamp: '2026-02-28T10:03:00Z' },
          { role: 'user', content: 'I don\u2019t see an "Add eSIM" option. There\u2019s only SIM card manager with physical SIM slots.', timestamp: '2026-03-01T14:00:00Z' },
          { role: 'assistant', content: 'I\u2019ve checked and unfortunately the Samsung Galaxy A14 does not support eSIM. It only has physical SIM card slots. I\u2019m escalating this for a physical SIM to be shipped to you.', timestamp: '2026-03-01T14:01:00Z' },
          { role: 'user', content: 'So I\u2019ve been waiting 12 days for nothing? Can you ship the SIM today?', timestamp: '2026-03-11T11:55:00Z' },
          { role: 'assistant', content: 'I sincerely apologize for the delay. I\u2019ve flagged this for immediate physical SIM shipment with expedited delivery. A human agent will confirm shipping details with you.', timestamp: '2026-03-11T11:56:00Z' }
        ]
      }
    },
    { timestamp: '2026-03-11T10:00:00Z', agent: 'Signal Agent', action: 'vendor health yellow \u2192 heatmap updated', detail: 'Updated from Vendor Health Monitor: ConnectX API latency elevated (520ms vs 340ms baseline). Monitoring.', type: 'devops', bau: false },
    { timestamp: '2026-03-11T08:30:00Z', agent: 'Fraud Watch Agent', action: 'abuse alert \u2192 enforcement policy updated', detail: 'Updated from Bad Actor Agent: suspicious referral velocity from 2 accounts. Referral credits frozen pending review.', type: 'compliance', bau: false },
    { timestamp: '2026-03-11T06:00:00Z', agent: 'Financial Health Agent', action: 'daily reconciliation \u2014 MRR $14,210', detail: 'Stripe MRR: $14,210. Active subscriptions: 115. ARPU: $123.57. Delinquent: 0.', type: 'monitoring', bau: true },
    { timestamp: '2026-03-11T05:00:00Z', agent: 'Deployment Health Guardian', action: 'deploy v2.14.2 \u2014 canary passed', detail: 'Canary analysis clean. Error rate 0.01%. Promoting to production.', type: 'devops', bau: true },

    // Mar 10
    { timestamp: '2026-03-10T14:00:00Z', agent: 'Concierge Agent', action: 'Order #24200 \u2014 stalled, 2 contacts', detail: 'Customer stuck at number selection for 3 days. 2 contacts asking about port-in timeline. Port-in pending AT&T approval.', type: 'support', bau: false },
    { timestamp: '2026-03-10T11:00:00Z', agent: 'Channel Performance Agent', action: 'TikTok CPM spiked 40%', detail: 'TikTok CPM increased from $8.20 to $11.50 overnight. Likely auction competition. Budget rebalanced to Meta.', type: 'monitoring', bau: false },
    { timestamp: '2026-03-10T08:00:00Z', agent: 'Bad Actor Agent', action: 'CDR anomaly \u2014 1 account flagged', detail: 'Account #4582 showing 180GB data usage in 48h. Possible tethering abuse. Usage cap warning sent.', type: 'compliance', bau: false },

    // Mar 9
    { timestamp: '2026-03-09T16:00:00Z', agent: 'Concierge Agent', action: 'Order #22800 \u2014 completed, 1 contact', detail: 'Customer activated after 2 days. 1 support contact (asked about data speed). Resolved same-session.', type: 'support', bau: false },
    { timestamp: '2026-03-09T10:00:00Z', agent: 'RCA Agent', action: 'Triage posted \u2014 #12498', detail: 'Incident #12498: eSIM QR code generation failed for 2 orders. Root cause: SM-DP+ rate limit hit during batch processing. Fix: staggered QR generation.', type: 'support', bau: false,
      rca: {
        severity: 'critical',
        summary: 'eSIM QR code generation failed for 2 orders during a batch processing window. Customers received blank QR codes.',
        verdict: 'SM-DP+ rate limit (5 req/s) exceeded when 8 orders hit QR generation simultaneously.',
        tickets: [
          { id: 12498, subject: 'eSIM QR generation failure \u2014 2 orders affected', status: 'solved', priority: 'urgent', url: '#' }
        ],
        steps: [
          { step: 1, name: 'QR Generation API', status: 'fail', finding: 'SM-DP+ returned 429 (rate limited) for 2 of 8 concurrent requests' },
          { step: 2, name: 'Retry Logic', status: 'fail', finding: 'No retry mechanism in place for SM-DP+ 429 responses' },
          { step: 3, name: 'Queue Processing', status: 'warn', finding: 'Batch processor sending all pending QR requests simultaneously' },
          { step: 4, name: 'Customer Notification', status: 'pass', finding: 'Affected customers notified within 15 min of detection' },
          { step: 5, name: 'Data Integrity', status: 'pass', finding: 'No duplicate profiles created; failed requests cleanly rolled back' }
        ],
        timeline: [
          { time: '08:30', event: 'Batch processor triggered for 8 pending QR generations' },
          { time: '08:30', event: 'SM-DP+ rate limit hit \u2014 2 requests rejected with 429' },
          { time: '08:31', event: 'Alert: 2 orders stuck at QR generation step' },
          { time: '08:35', event: 'Root cause identified: concurrent batch exceeds 5 req/s limit' },
          { time: '08:45', event: 'Manual QR regeneration for 2 affected orders' },
          { time: '09:15', event: 'Fix deployed: staggered queue with 200ms delay between requests' },
          { time: '10:00', event: 'Triage posted, monitoring confirmed stable' }
        ],
        actions_taken: ['Manually regenerated QR codes for 2 affected orders', 'Deployed staggered queue processing (200ms delay between requests)', 'Added retry logic with exponential backoff for SM-DP+ 429 responses'],
        recommendations: ['Request rate limit increase from SM-DP+ provider', 'Add circuit breaker for SM-DP+ API calls', 'Pre-generate QR codes during off-peak hours']
      }
    },

    // Mar 8
    { timestamp: '2026-03-08T14:00:00Z', agent: 'Concierge Agent', action: 'Order #22510 \u2014 stalled, 4 contacts, escalated', detail: 'Port-in from T-Mobile stuck for 7 days. Customer frustrated. AT&T NPAC shows pending. Escalated to carrier relations.', type: 'support', bau: false, urgent: true, flagged: true },
    { timestamp: '2026-03-08T09:00:00Z', agent: 'Fraud Watch Agent', action: 'enforcement action \u2014 2 accounts suspended', detail: 'Two accounts sharing device fingerprint with previously suspended fraud account. Proactive suspension. Credits reversed ($60).', type: 'compliance', bau: false },

    // Mar 7
    { timestamp: '2026-03-07T12:00:00Z', agent: 'Concierge Agent', action: 'Order #22100 \u2014 completed, 0 contacts', detail: 'Fully autonomous activation. Customer signed up, paid, selected number, activated eSIM. Zero support contacts. Time to activate: 14 minutes.', type: 'support', bau: false,
      conversation: {
        topic: 'Autonomous activation', status: 'resolved', message_count: 0, contact_count: 0,
        evaluation: { grade: 'good', summary: 'Zero-touch activation. Customer completed entire flow without any support contact. 14-minute end-to-end time.', signals: ['No friction detected at any stage', 'Payment to activation: 14 minutes', 'Organic search acquisition \u2014 high intent'] },
        journey: [
          { stage: 'Landing', status: 'completed', time: '11:46', detail: 'Arrived via organic search' },
          { stage: 'Signup', status: 'completed', time: '11:48', detail: 'Account created' },
          { stage: 'Plan Selection', status: 'completed', time: '11:49', detail: 'Selected Unlimited plan' },
          { stage: 'Payment', status: 'completed', time: '11:51', detail: '$65/mo charged successfully' },
          { stage: 'Number Selection', status: 'completed', time: '11:53', detail: 'New number selected' },
          { stage: 'eSIM Activation', status: 'completed', time: '12:00', detail: 'QR scanned, eSIM active' }
        ]
      }
    },
    { timestamp: '2026-03-07T08:00:00Z', agent: 'Channel Performance Agent', action: 'Google Ads ROAS dropped below target', detail: 'Google search ads ROAS: 1.8x (target 2.5x). Keyword "cheap phone plan" CPC up 30%. Pausing underperforming keywords.', type: 'monitoring', bau: false },

    // Mar 5
    { timestamp: '2026-03-05T15:00:00Z', agent: 'Concierge Agent', action: 'Order #21800 \u2014 stalled, 5 contacts, escalated', detail: 'Customer stuck in identity verification loop. ConnectX returning "document unclear" on valid passport. 5 contacts over 4 days. Escalated.', type: 'support', bau: false, urgent: true, flagged: true },
    { timestamp: '2026-03-05T10:00:00Z', agent: 'RCA Agent', action: 'Triage posted \u2014 #12410', detail: 'Incident #12410: payment webhook delivery delayed 8 min. Root cause: Stripe infrastructure incident. No customer impact (retry succeeded).', type: 'support', bau: false,
      rca: {
        severity: 'ok',
        summary: 'Stripe webhook delivery delayed by ~8 minutes due to Stripe-side infrastructure incident. No customer impact thanks to retry mechanism.',
        verdict: 'Stripe infrastructure incident caused webhook queue backup. Our retry logic handled it correctly.',
        tickets: [
          { id: 12410, subject: 'Stripe webhook delivery delay', status: 'solved', priority: 'normal', url: '#' }
        ],
        steps: [
          { step: 1, name: 'Webhook Delivery', status: 'warn', finding: '3 payment webhooks delayed 8 min (normally <2s)' },
          { step: 2, name: 'Stripe Status', status: 'fail', finding: 'Stripe status page confirmed degraded webhook delivery 09:42\u201309:58 UTC' },
          { step: 3, name: 'Retry Mechanism', status: 'pass', finding: 'All 3 webhooks successfully processed on first retry' },
          { step: 4, name: 'Customer Impact', status: 'pass', finding: 'Zero customer-visible impact \u2014 payment confirmations delayed but orders processed' },
          { step: 5, name: 'Data Integrity', status: 'pass', finding: 'All payment records consistent between Stripe and our DB' }
        ],
        timeline: [
          { time: '09:42', event: 'First webhook delivery timeout detected' },
          { time: '09:44', event: 'Alert: 3 pending webhooks past SLA' },
          { time: '09:45', event: 'Checked Stripe status page \u2014 confirmed degraded' },
          { time: '09:50', event: 'Retry mechanism triggered for all 3 webhooks' },
          { time: '09:50', event: 'All retries succeeded \u2014 payments processed' },
          { time: '09:58', event: 'Stripe reports incident resolved' },
          { time: '10:00', event: 'Triage posted \u2014 no action required' }
        ],
        actions_taken: ['Monitored Stripe incident through resolution', 'Verified all 3 affected payments processed correctly', 'No code changes needed \u2014 retry logic worked as designed'],
        recommendations: ['Consider adding Stripe status page integration to Signal Agent for proactive alerts']
      }
    },

    // Mar 3
    { timestamp: '2026-03-03T11:00:00Z', agent: 'Concierge Agent', action: 'Order #21200 \u2014 completed, 2 contacts', detail: 'Customer needed help with eSIM installation on Pixel 8. 2 contacts. Resolved with step-by-step guide. Activated same day.', type: 'support', bau: false },
    { timestamp: '2026-03-03T08:00:00Z', agent: 'Bad Actor Agent', action: 'referral velocity spike \u2014 3 accounts flagged', detail: '3 accounts created 8 referrals each in 24h. Same IP range. Credits frozen pending review. Pattern consistent with referral farming.', type: 'compliance', bau: false },

    // Feb 28
    { timestamp: '2026-02-28T14:00:00Z', agent: 'Concierge Agent', action: 'Order #20500 \u2014 stalled, 6 contacts, escalated', detail: 'Port-in from Verizon failed twice. Customer on day 10 without service. Emergency escalation to carrier ops.', type: 'support', bau: false, urgent: true, flagged: true },
    { timestamp: '2026-02-28T09:00:00Z', agent: 'Fraud Watch Agent', action: 'mass signup attempt blocked', detail: '14 signup attempts from same IP in 5 minutes. Rate limiter triggered. All accounts held for review. 12/14 using disposable email domains.', type: 'compliance', bau: false },

    // Feb 25
    { timestamp: '2026-02-25T12:00:00Z', agent: 'Concierge Agent', action: 'Order #19800 \u2014 completed, 1 contact', detail: 'Quick activation. Customer asked about international roaming. Directed to FAQ. Activated in 22 minutes.', type: 'support', bau: false },
    { timestamp: '2026-02-25T08:00:00Z', agent: 'RCA Agent', action: 'Triage posted \u2014 #12320', detail: 'Incident #12320: PostHog event ingestion lag spiked to 45s. Root cause: Kafka partition rebalance. Self-healed in 3 min.', type: 'support', bau: false },

    // Feb 22
    { timestamp: '2026-02-22T15:00:00Z', agent: 'Concierge Agent', action: 'Order #19200 \u2014 stalled, 3 contacts', detail: 'Customer confused by number selection UI. 3 contacts asking same question. UX improvement ticket created.', type: 'support', bau: false },
    { timestamp: '2026-02-22T10:00:00Z', agent: 'Fraud Watch Agent', action: 'SIM swap attempt blocked', detail: 'Unauthorized number transfer request intercepted. Account holder notified. Device fingerprint flagged.', type: 'compliance', bau: false },

    // Feb 19
    { timestamp: '2026-02-19T13:00:00Z', agent: 'Concierge Agent', action: 'Order #18500 \u2014 completed, 0 contacts', detail: 'Autonomous activation. Signed up via organic search. Payment to activation: 8 minutes. Zero friction.', type: 'support', bau: false },
    { timestamp: '2026-02-19T09:00:00Z', agent: 'Bad Actor Agent', action: 'CDR audit \u2014 all clear', detail: 'Monthly CDR deep scan. 98 active lines. No toll fraud. No abnormal international calling patterns. 1 high-data user (legit tethering plan).', type: 'compliance', bau: false },
  ];

  // Sort activity by timestamp descending
  ACTIVITY.sort(function (a, b) { return b.timestamp.localeCompare(a.timestamp); });


  /* ═══════════════════════════════════════════
     STYLES
     ═══════════════════════════════════════════ */

  function injectStyles() {
    if (document.getElementById('scene5-styles')) return;
    var style = document.createElement('style');
    style.id = 'scene5-styles';
    style.textContent = `
      .scene5 {
        display: flex;
        flex-direction: column;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #fff;
        background: #0a0a0a;
      }

      /* ── Brand Header ── */
      .scene5 .s5-brand-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 24px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: rgba(15,15,15,0.9);
        flex-shrink: 0;
      }
      .scene5 .s5-brand-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .scene5 .s5-brand-logo {
        height: 22px;
        opacity: 0.7;
      }
      .scene5 .s5-brand-name {
        font-family: 'Instrument Serif', Georgia, serif;
        font-size: 20px;
        font-weight: 400;
        color: #fff;
        letter-spacing: -0.01em;
      }
      .scene5 .s5-segment-badge {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #888;
        padding: 3px 8px;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 4px;
      }
      .scene5 .s5-status-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #10b981;
      }
      .scene5 .s5-status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #10b981;
        animation: s5-pulse 2s ease-in-out infinite;
      }
      @keyframes s5-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      .scene5 .s5-brand-right {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #555;
      }

      /* ── Body layout ── */
      .scene5 .s5-body {
        display: flex;
        flex: 1;
        min-height: 0;
        overflow: hidden;
      }
      .scene5 .s5-main {
        flex: 1;
        overflow-y: auto;
        padding: 24px 28px;
        min-width: 0;
      }
      .scene5 .s5-agent-panel {
        width: 380px;
        flex-shrink: 0;
        border-left: 1px solid rgba(255,255,255,0.06);
        display: flex;
        flex-direction: column;
        background: rgba(12,12,12,0.6);
      }

      /* ── KPI Cards ── */
      .scene5 .s5-kpi-row {
        display: flex;
        align-items: stretch;
        background: rgba(20,20,20,0.8);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 10px;
        margin-bottom: 24px;
        overflow: hidden;
      }
      .scene5 .s5-kpi-card {
        flex: 1;
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .scene5 .s5-kpi-card + .s5-kpi-card {
        border-left: 1px solid rgba(255,255,255,0.06);
      }
      .scene5 .s5-kpi-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: #666;
      }
      .scene5 .s5-kpi-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 22px;
        font-weight: 500;
        color: #fff;
        font-variant-numeric: tabular-nums;
      }

      /* ── Department Tabs ── */
      .scene5 .s5-dept-tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      .scene5 .s5-dept-tab {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 400;
        color: #666;
        padding: 6px 14px;
        border: none;
        background: transparent;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;
      }
      .scene5 .s5-dept-tab:hover {
        color: #999;
      }
      .scene5 .s5-dept-tab.active {
        color: #fff;
        background: rgba(255,255,255,0.06);
      }

      /* ── Section Labels ── */
      .scene5 .s5-section-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #555;
      }

      /* ── Heatmap header row (label left, legend right) ── */
      .scene5 .s5-heatmap-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      /* ── Heatmap ── */
      .scene5 .s5-heatmap-wrap {
        margin-bottom: 32px;
      }
      .scene5 .s5-heatmap-card {
        background: rgba(20,20,20,0.6);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 12px;
        padding: 20px 12px 16px;
        overflow: hidden;
      }
      .scene5 .s5-heatmap-inner {
        display: flex;
        min-width: 0;
      }
      /* Vertical group title strip on far left */
      .scene5 .s5-heatmap-group-title-col {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        flex-shrink: 0;
        margin-right: 4px;
      }
      .scene5 .s5-heatmap-group-title {
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        font-family: 'JetBrains Mono', monospace;
        font-size: 8px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #444;
        white-space: nowrap;
      }
      .scene5 .s5-heatmap-grid {
        flex: 1;
        min-width: 0;
      }
      .scene5 .s5-heatmap-months {
        display: flex;
        margin-left: 140px; /* 20px title col + 120px signal label */
        margin-bottom: 6px;
        position: relative;
        height: 14px;
      }
      .scene5 .s5-month-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        color: #555;
        position: absolute;
      }
      .scene5 .s5-heatmap-row {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
      }
      .scene5 .s5-heatmap-signal-label {
        width: 120px;
        font-size: 12px;
        color: #999;
        padding-right: 12px;
        flex-shrink: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .scene5 .s5-heatmap-cells {
        display: flex;
        gap: 3px;
        flex-wrap: nowrap;
      }
      .scene5 .s5-heatmap-cell {
        width: 13px;
        height: 13px;
        border-radius: 2px;
        cursor: pointer;
        transition: transform 0.1s, box-shadow 0.1s;
      }
      .scene5 .s5-heatmap-cell:hover {
        transform: scale(1.3);
        box-shadow: 0 0 6px rgba(255,255,255,0.15);
        z-index: 2;
        position: relative;
      }
      .scene5 .s5-heatmap-cell.health-green { background: rgba(64, 192, 96, 0.7); }
      .scene5 .s5-heatmap-cell.health-yellow { background: #fbbf24; }
      .scene5 .s5-heatmap-cell.health-red { background: #ef4444; }
      .scene5 .s5-heatmap-cell.health-grey { background: rgba(255,255,255,0.04); }

      .scene5 .s5-legend {
        display: flex;
        gap: 16px;
      }
      .scene5 .s5-legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        color: #666;
      }
      .scene5 .s5-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      /* ── Activity Timeline ── */
      .scene5 .s5-activity-wrap {
        position: relative;
      }
      .scene5 .s5-activity-day-header {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 8px;
        margin-top: 20px;
      }
      .scene5 .s5-activity-day-header:first-child {
        margin-top: 0;
      }
      .scene5 .s5-activity-day-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 500;
        color: #ccc;
      }
      .scene5 .s5-activity-day-date {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #555;
      }

      /* Agent summary bar */
      .scene5 .s5-agents-summary {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        margin-bottom: 12px;
        background: rgba(20,20,20,0.6);
        border: 1px solid rgba(255,255,255,0.04);
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.15s;
      }
      .scene5 .s5-agents-summary:hover {
        background: rgba(30,30,30,0.8);
      }
      .scene5 .s5-agents-summary-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10b981;
        flex-shrink: 0;
      }
      .scene5 .s5-agents-summary-text {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #999;
        flex: 1;
      }
      .scene5 .s5-agents-summary-chevron {
        font-size: 10px;
        color: #555;
        transition: transform 0.2s;
      }
      .scene5 .s5-agents-summary-chevron.expanded {
        transform: rotate(90deg);
      }
      .scene5 .s5-agents-detail {
        display: none;
        padding: 0 12px 12px;
        margin-bottom: 8px;
      }
      .scene5 .s5-agents-detail.visible {
        display: block;
      }
      .scene5 .s5-agent-active-line {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
      }
      .scene5 .s5-agent-blink {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10b981;
        animation: s5-blink 1.5s ease-in-out infinite;
      }
      @keyframes s5-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.2; }
      }
      .scene5 .s5-agent-active-name {
        font-size: 12px;
        color: #ccc;
      }
      .scene5 .s5-agent-active-summary {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #666;
      }
      .scene5 .s5-agents-idle-line {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #555;
        padding: 6px 0 0;
      }

      /* BAU group */
      .scene5 .s5-bau-group {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        margin-bottom: 6px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s;
      }
      .scene5 .s5-bau-group:hover {
        background: rgba(255,255,255,0.03);
      }
      .scene5 .s5-bau-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(255,255,255,0.12);
        flex-shrink: 0;
      }
      .scene5 .s5-bau-text {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #555;
        flex: 1;
      }
      .scene5 .s5-bau-chevron {
        font-size: 10px;
        color: #444;
        transition: transform 0.2s;
      }
      .scene5 .s5-bau-chevron.expanded {
        transform: rotate(90deg);
      }
      .scene5 .s5-bau-entries {
        display: none;
        padding-left: 14px;
        margin-bottom: 8px;
      }
      .scene5 .s5-bau-entries.visible {
        display: block;
      }

      /* Activity entry */
      .scene5 .s5-entry {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 6px;
        margin-bottom: 2px;
        transition: background 0.15s;
        cursor: default;
      }
      .scene5 .s5-entry:hover {
        background: rgba(255,255,255,0.02);
      }
      .scene5 .s5-entry-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-top: 5px;
        flex-shrink: 0;
      }
      .scene5 .s5-entry-dot.urgent {
        animation: s5-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        position: relative;
      }
      .scene5 .s5-entry-dot.urgent::after {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: inherit;
        opacity: 0;
        animation: s5-ping-ring 1.5s cubic-bezier(0,0,0.2,1) infinite;
      }
      @keyframes s5-ping {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes s5-ping-ring {
        0% { transform: scale(1); opacity: 0.4; }
        100% { transform: scale(2); opacity: 0; }
      }
      .scene5 .s5-entry-content {
        flex: 1;
        min-width: 0;
      }
      .scene5 .s5-entry-agent {
        font-size: 12px;
        font-weight: 600;
        color: #ccc;
        margin-bottom: 2px;
      }
      .scene5 .s5-entry-action {
        font-size: 12px;
        color: #999;
        margin-bottom: 3px;
      }
      .scene5 .s5-entry-detail {
        font-size: 11px;
        color: #555;
        line-height: 1.4;
      }
      .scene5 .s5-entry-link {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #666;
        cursor: pointer;
        margin-top: 4px;
        display: inline-block;
      }
      .scene5 .s5-entry-link:hover {
        color: #999;
      }
      .scene5 .s5-entry-time {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #444;
        white-space: nowrap;
        flex-shrink: 0;
        margin-top: 4px;
      }

      /* ── Agent Panel ── */
      .scene5 .s5-panel-header {
        padding: 20px 24px 16px;
        border-bottom: 1px solid rgba(255,255,255,0.04);
      }
      .scene5 .s5-panel-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: #555;
      }
      .scene5 .s5-panel-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
      }
      .scene5 .s5-panel-default {
        font-size: 13px;
        color: #666;
        line-height: 1.5;
        margin-bottom: 24px;
      }
      .scene5 .s5-panel-suggestions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 24px;
      }
      .scene5 .s5-suggest-btn {
        display: block;
        width: 100%;
        text-align: left;
        padding: 10px 14px;
        font-size: 12px;
        color: #888;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 8px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;
      }
      .scene5 .s5-suggest-btn:hover {
        background: rgba(255,255,255,0.06);
        color: #ccc;
        border-color: rgba(255,255,255,0.1);
      }
      .scene5 .s5-panel-input-wrap {
        margin-top: auto;
        padding-top: 16px;
        border-top: 1px solid rgba(255,255,255,0.04);
      }
      .scene5 .s5-panel-input-row {
        display: flex;
        gap: 8px;
      }
      .scene5 .s5-panel-input {
        flex: 1;
        padding: 10px 14px;
        font-size: 12px;
        color: #999;
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 8px;
        outline: none;
        font-family: inherit;
      }
      .scene5 .s5-panel-input::placeholder {
        color: #444;
      }
      .scene5 .s5-panel-send {
        padding: 10px 18px;
        font-size: 12px;
        font-weight: 500;
        color: #444;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 8px;
        cursor: not-allowed;
        font-family: inherit;
      }

      /* ── Slide-over Detail Panel ── */
      .s5-overlay-backdrop {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.4);
        z-index: 200;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
      }
      .s5-overlay-backdrop.open {
        opacity: 1;
        pointer-events: auto;
      }
      .s5-overlay-panel {
        position: fixed;
        top: 0; right: 0; bottom: 0;
        width: 520px;
        max-width: 90vw;
        background: #111111;
        border-left: 1px solid rgba(255,255,255,0.08);
        z-index: 201;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.25s ease-out;
      }
      .s5-overlay-panel.open {
        transform: translateX(0);
      }
      .s5-overlay-panel.wide {
        width: 680px;
      }
      .s5-overlay-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        flex-shrink: 0;
      }
      .s5-overlay-header-title {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #555;
      }
      .s5-overlay-close {
        background: none;
        border: none;
        color: #555;
        font-size: 18px;
        cursor: pointer;
        padding: 4px 8px;
        line-height: 1;
      }
      .s5-overlay-close:hover { color: #999; }
      .s5-overlay-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }
      .s5-detail-status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 3px 10px;
        border-radius: 9999px;
        margin-bottom: 16px;
      }
      .s5-detail-status.urgent {
        color: #ef4444;
        background: rgba(239,68,68,0.08);
      }
      .s5-detail-status.ok {
        color: #10b981;
        background: rgba(16,185,129,0.08);
      }
      .s5-detail-status.watch {
        color: #fbbf24;
        background: rgba(251,191,36,0.08);
      }
      .s5-detail-title {
        font-size: 15px;
        font-weight: 500;
        color: #fff;
        margin-bottom: 4px;
      }
      .s5-detail-agent {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #666;
        margin-bottom: 20px;
      }
      .s5-detail-section-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #555;
        margin-bottom: 8px;
        margin-top: 20px;
      }
      .s5-detail-section-label:first-of-type { margin-top: 0; }
      .s5-detail-body {
        font-size: 13px;
        color: #999;
        line-height: 1.6;
        margin-bottom: 16px;
      }
      .s5-detail-meta-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255,255,255,0.04);
      }
      .s5-detail-meta-label {
        font-size: 11px;
        color: #666;
      }
      .s5-detail-meta-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        color: #ccc;
      }
      .s5-detail-callout {
        border-left: 3px solid;
        padding: 10px 14px;
        margin: 12px 0;
        border-radius: 0 6px 6px 0;
        font-size: 12px;
        line-height: 1.5;
        color: #bbb;
      }
      .s5-detail-callout.danger {
        border-color: #ef4444;
        background: rgba(239,68,68,0.06);
      }
      .s5-detail-callout.warning {
        border-color: #fbbf24;
        background: rgba(251,191,36,0.06);
      }
      .s5-detail-callout.success {
        border-color: #10b981;
        background: rgba(16,185,129,0.06);
      }
      .s5-detail-callout.info {
        border-color: #3b82f6;
        background: rgba(59,130,246,0.06);
      }
      .s5-detail-timeline {
        position: relative;
        padding-left: 20px;
        margin: 12px 0;
      }
      .s5-detail-timeline::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 4px;
        bottom: 4px;
        width: 1px;
        background: rgba(255,255,255,0.08);
      }
      .s5-detail-tl-item {
        position: relative;
        padding: 6px 0;
        font-size: 12px;
        color: #999;
      }
      .s5-detail-tl-item::before {
        content: '';
        position: absolute;
        left: -18px;
        top: 12px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #333;
        border: 1px solid #555;
      }
      .s5-detail-tl-item.active::before {
        background: #10b981;
        border-color: #10b981;
      }
      .s5-detail-tl-item.failed::before {
        background: #ef4444;
        border-color: #ef4444;
      }
      .s5-detail-tl-item.pending::before {
        background: #fbbf24;
        border-color: #fbbf24;
      }
      .s5-detail-tl-label {
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #555;
      }
      .s5-detail-tl-text {
        color: #bbb;
        margin-top: 2px;
      }
      .s5-detail-step {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 6px 0;
        font-size: 12px;
      }
      .s5-detail-step-icon {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        flex-shrink: 0;
        width: 16px;
        text-align: center;
      }
      .s5-detail-step-icon.pass { color: #10b981; }
      .s5-detail-step-icon.fail { color: #ef4444; }
      .s5-detail-step-icon.warn { color: #fbbf24; }
      .s5-detail-step-text { color: #999; }
      .s5-detail-step-finding {
        font-size: 11px;
        color: #666;
        margin-top: 2px;
      }

      /* ── Tooltip ── */
      .scene5 .s5-tooltip {
        position: fixed;
        z-index: 1000;
        padding: 8px 12px;
        background: #1a1a1a;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        pointer-events: none;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        color: #ccc;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      }
      .scene5 .s5-tooltip-day {
        color: #888;
        margin-bottom: 2px;
      }
      .scene5 .s5-tooltip-value {
        color: #fff;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
  }


  /* ═══════════════════════════════════════════
     DOM HELPER
     ═══════════════════════════════════════════ */

  function el(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!attrs.hasOwnProperty(k)) continue;
        var v = attrs[k];
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
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null) continue;
      if (typeof c === 'string' || typeof c === 'number') {
        e.appendChild(document.createTextNode(String(c)));
      } else if (Array.isArray(c)) {
        c.forEach(function (ch) { if (ch) e.appendChild(ch); });
      } else {
        e.appendChild(c);
      }
    }
    return e;
  }


  /* ═══════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════ */

  var TYPE_COLORS = {
    support: '#10b981',
    knowledge: '#34d399',
    compliance: '#60a5fa',
    monitoring: '#fbbf24',
    devops: '#4ecdc4',
  };

  var DEPT_FILTER_MAP = {
    devops: ['DevOps & Infrastructure'],
    support: ['Customer Support'],
    compliance: ['Compliance & Fraud'],
    growth: ['Growth & Finance'],
    incidents: ['Incidents'],
  };

  function agentDept(agentName) {
    for (var i = 0; i < AGENTS.length; i++) {
      if (AGENTS[i].name === agentName) return AGENTS[i].department;
    }
    return null;
  }

  function formatTime(ts) {
    var d = new Date(ts);
    var now = new Date('2026-03-12T10:00:00Z');
    var diffMs = now - d;
    var diffMin = Math.round(diffMs / 60000);
    if (diffMin < 60) return diffMin + 'm ago';
    var diffHr = Math.round(diffMin / 60);
    if (diffHr < 12) return diffHr + 'h ago';
    var h = d.getUTCHours();
    var m = d.getUTCMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  }

  function dayKey(ts) {
    return ts.slice(0, 10);
  }

  function dayLabel(dk) {
    if (dk === '2026-03-12') return 'Today';
    if (dk === '2026-03-11') return 'Yesterday';
    var d = new Date(dk);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate();
  }

  function dayDateSuffix(dk) {
    if (dk === '2026-03-12') return 'Mar 12';
    if (dk === '2026-03-11') return 'Mar 11';
    return '';
  }

  function monthPositions() {
    // Returns { label, offset } for month markers above heatmap
    var positions = [];
    var prevMonth = -1;
    for (var i = 0; i < ALL_DAYS.length; i++) {
      var m = new Date(ALL_DAYS[i]).getMonth();
      if (m !== prevMonth) {
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        positions.push({ label: months[m], offset: i * (13 + 3) });
        prevMonth = m;
      }
    }
    return positions;
  }


  /* ═══════════════════════════════════════════
     MAIN INIT
     ═══════════════════════════════════════════ */

  window.initScene5MC = function (container) {
    injectStyles();

    // Clean up any previous overlay elements
    document.querySelectorAll('.s5-overlay-backdrop, .s5-overlay-panel').forEach(function (el) { el.remove(); });

    var activeTab = null; // null = overview
    var tooltip = null;

    var root = el('div', { className: 'scene5' });

    /* ── Brand Header (no logo — global nav already has it) ── */
    var brandHeader = el('div', { className: 's5-brand-header' },
      el('div', { className: 's5-brand-left' },
        el('span', { className: 's5-brand-name' }, BRAND.name),
        el('span', { className: 's5-segment-badge' }, BRAND.segment_type),
        el('span', { className: 's5-status-pill' },
          el('span', { className: 's5-status-dot' }),
          'LIVE'
        )
      ),
      el('span', { className: 's5-brand-right' }, 'LAUNCHED JAN 16, 2026')
    );
    root.appendChild(brandHeader);

    /* ── Body (main + agent panel) ── */
    var mainArea = el('div', { className: 's5-main' });
    var agentPanel = el('div', { className: 's5-agent-panel' });
    var body = el('div', { className: 's5-body' }, mainArea, agentPanel);
    root.appendChild(body);

    /* ═══ LEFT: Main Dashboard ═══ */

    /* ── KPI Cards ── */
    var kpiRow = el('div', { className: 's5-kpi-row' },
      kpiCard('SUBS', String(SNAPSHOT.subscribers)),
      kpiCard('MRR', '$' + SNAPSHOT.mrr.toLocaleString('en-US', { minimumFractionDigits: 2 })),
      kpiCard('CAC', '$' + SNAPSHOT.cac.toFixed(2)),
      kpiCard('CHURN', SNAPSHOT.churn_rate.toFixed(0) + '%'),
      kpiCard('ACTIVATION', SNAPSHOT.activation_rate.toFixed(0) + '%')
    );
    mainArea.appendChild(kpiRow);

    function kpiCard(label, value) {
      return el('div', { className: 's5-kpi-card' },
        el('div', { className: 's5-kpi-label' }, label),
        el('div', { className: 's5-kpi-value' }, value)
      );
    }

    /* ── Department Tabs ── */
    var tabsRow = el('div', { className: 's5-dept-tabs' });
    var tabButtons = [];
    FILTER_TABS.forEach(function (tab) {
      var btn = el('button', {
        className: 's5-dept-tab' + (tab.key === null ? ' active' : ''),
        onClick: function () {
          activeTab = tab.key;
          tabButtons.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          renderHeatmap();
          renderActivity();
        }
      }, tab.label);
      tabButtons.push(btn);
      tabsRow.appendChild(btn);
    });
    mainArea.appendChild(tabsRow);

    /* ── Signal Health Heatmap ── */
    var heatmapSection = el('div', { className: 's5-heatmap-wrap' });
    mainArea.appendChild(heatmapSection);

    function renderHeatmap() {
      heatmapSection.innerHTML = '';

      // Header row: "SIGNAL HEALTH" left, legend right
      var legend = el('div', { className: 's5-legend' },
        legendItem('rgba(64,192,96,0.7)', 'healthy'),
        legendItem('#fbbf24', 'watch'),
        legendItem('#ef4444', 'alert')
      );
      heatmapSection.appendChild(
        el('div', { className: 's5-heatmap-header' },
          el('div', { className: 's5-section-label' }, 'SIGNAL HEALTH'),
          legend
        )
      );

      var tabKey = activeTab || 'overview';
      var groups = DEPT_SIGNAL_GROUPS[tabKey] || [];

      // Card container
      var card = el('div', { className: 's5-heatmap-card' });
      heatmapSection.appendChild(card);

      // Calculate how many cells fit: measure available width after card is in DOM
      requestAnimationFrame(function () {
        var CELL = 13, GAP = 3;
        var cardWidth = card.clientWidth;
        // Available = card inner width - title col (20) - signal label (120) - some padding
        var available = cardWidth - 20 - 120 - 12;
        var maxCells = Math.floor((available + GAP) / (CELL + GAP));
        // Trim ALL_DAYS from left to fit
        var visibleDays = ALL_DAYS.slice(Math.max(0, ALL_DAYS.length - maxCells));

        card.innerHTML = '';

        // Month markers
        var monthsBar = el('div', { className: 's5-heatmap-months' });
        var prevMonth = -1;
        for (var di = 0; di < visibleDays.length; di++) {
          var m = new Date(visibleDays[di]).getMonth();
          if (m !== prevMonth) {
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            monthsBar.appendChild(el('span', { className: 's5-month-label', style: { left: (di * (CELL + GAP)) + 'px' } }, months[m]));
            prevMonth = m;
          }
        }
        card.appendChild(monthsBar);

        groups.forEach(function (group) {
          var inner = el('div', { className: 's5-heatmap-inner' });

          var titleCol = el('div', { className: 's5-heatmap-group-title-col' },
            el('span', { className: 's5-heatmap-group-title' }, group.title)
          );
          inner.appendChild(titleCol);

          var grid = el('div', { className: 's5-heatmap-grid' });

          group.signals.forEach(function (sig) {
            var data = SIGNALS[sig.key] || [];
            var row = el('div', { className: 's5-heatmap-row' });
            row.appendChild(el('div', { className: 's5-heatmap-signal-label' }, sig.label));

            var cellsWrap = el('div', { className: 's5-heatmap-cells' });

            var lookup = {};
            data.forEach(function (d) { lookup[d.day] = d; });

            visibleDays.forEach(function (day) {
              var entry = lookup[day];
              var isPreLaunch = day < LAUNCH_DATE;
              var health = isPreLaunch ? 'grey' : (entry ? entry.health : 'grey');
              var cell = el('div', {
                className: 's5-heatmap-cell health-' + health,
                onMouseenter: function (e) { showTooltip(e, day, sig.label, entry, isPreLaunch); },
                onMouseleave: hideTooltip,
              });
              cellsWrap.appendChild(cell);
            });

            row.appendChild(cellsWrap);
            grid.appendChild(row);
          });

          inner.appendChild(grid);
          card.appendChild(inner);
        });
      });
    }

    function legendItem(color, label) {
      return el('div', { className: 's5-legend-item' },
        el('span', { className: 's5-legend-dot', style: { background: color } }),
        label
      );
    }

    function showTooltip(e, day, signalLabel, entry, isPreLaunch) {
      hideTooltip();
      var valueText = isPreLaunch ? 'pre-launch' : entry ? String(entry.value) : 'no data';
      var healthColor = isPreLaunch ? '#333' : !entry ? '#333' : entry.health === 'green' ? 'rgba(64,192,96,0.7)' : entry.health === 'yellow' ? '#fbbf24' : entry.health === 'red' ? '#ef4444' : '#333';
      tooltip = el('div', { className: 's5-tooltip' },
        el('div', { className: 's5-tooltip-day' }, day + ' \u00b7 ' + signalLabel),
        el('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
          el('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: healthColor, flexShrink: '0' } }),
          el('span', { className: 's5-tooltip-value' }, valueText)
        )
      );
      document.body.appendChild(tooltip);
      positionTooltip(e);
    }

    function positionTooltip(e) {
      if (!tooltip) return;
      tooltip.style.left = (e.clientX + 12) + 'px';
      tooltip.style.top = (e.clientY - 30) + 'px';
    }

    function hideTooltip() {
      if (tooltip && tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
      tooltip = null;
    }

    // Track mouse for tooltip positioning
    document.addEventListener('mousemove', function (e) {
      if (tooltip) positionTooltip(e);
    });


    /* ── Activity Timeline ── */
    var activitySection = el('div', { className: 's5-activity-wrap' });
    mainArea.appendChild(activitySection);

    function renderActivity() {
      activitySection.innerHTML = '';
      var sectionLabel = el('div', { className: 's5-section-label' }, 'ACTIVITY');
      activitySection.appendChild(sectionLabel);

      // Filter by department tab
      var filtered = ACTIVITY;
      if (activeTab) {
        var depts = DEPT_FILTER_MAP[activeTab] || [];
        filtered = ACTIVITY.filter(function (entry) {
          var dept = agentDept(entry.agent);
          return dept && depts.indexOf(dept) !== -1;
        });
      }

      // Group by day
      var dayGroups = [];
      var dayMap = {};
      filtered.forEach(function (entry) {
        var dk = dayKey(entry.timestamp);
        if (!dayMap[dk]) {
          dayMap[dk] = [];
          dayGroups.push(dk);
        }
        dayMap[dk].push(entry);
      });

      dayGroups.forEach(function (dk, idx) {
        var entries = dayMap[dk];

        // Day header
        var header = el('div', { className: 's5-activity-day-header' },
          el('span', { className: 's5-activity-day-label' }, dayLabel(dk)),
          dayDateSuffix(dk) ? el('span', { className: 's5-activity-day-date' }, dayDateSuffix(dk)) : null
        );
        activitySection.appendChild(header);

        // Agent summary (only for Today)
        if (dk === '2026-03-12' && !activeTab) {
          var activeAgents = AGENTS.filter(function (a) { return a.status === 'active'; });
          var idleCount = AGENTS.length - activeAgents.length;

          var summaryDetail = el('div', { className: 's5-agents-detail' });
          activeAgents.forEach(function (a) {
            summaryDetail.appendChild(
              el('div', { className: 's5-agent-active-line' },
                el('span', { className: 's5-agent-blink' }),
                el('span', { className: 's5-agent-active-name' }, a.name),
                el('span', { className: 's5-agent-active-summary' }, ' \u2014 ' + a.summary)
              )
            );
          });
          summaryDetail.appendChild(
            el('div', { className: 's5-agents-idle-line' }, idleCount + ' idle \u2014 all clear')
          );

          var chevron = el('span', { className: 's5-agents-summary-chevron' }, '\u25B8');
          var summaryBar = el('div', { className: 's5-agents-summary', onClick: function () {
            var isExpanded = summaryDetail.classList.toggle('visible');
            chevron.classList.toggle('expanded', isExpanded);
          } },
            el('span', { className: 's5-agents-summary-dot' }),
            el('span', { className: 's5-agents-summary-text' }, AGENTS.length + ' agents online / ' + activeAgents.length + ' active'),
            chevron
          );
          activitySection.appendChild(summaryBar);
          activitySection.appendChild(summaryDetail);
        }

        // Separate BAU vs non-BAU
        var bauEntries = entries.filter(function (e) { return e.bau; });
        var nonBauEntries = entries.filter(function (e) { return !e.bau; });

        // Render non-BAU entries
        nonBauEntries.forEach(function (entry) {
          activitySection.appendChild(renderEntry(entry));
        });

        // Render BAU group (collapsed)
        if (bauEntries.length > 0) {
          var bauUniqueAgents = {};
          bauEntries.forEach(function (e) { bauUniqueAgents[e.agent] = true; });
          var bauAgentCount = Object.keys(bauUniqueAgents).length;

          var bauEntriesEl = el('div', { className: 's5-bau-entries' });
          bauEntries.forEach(function (entry) {
            bauEntriesEl.appendChild(renderEntry(entry));
          });

          var bauChevron = el('span', { className: 's5-bau-chevron' }, '\u25B8');
          var bauGroup = el('div', { className: 's5-bau-group', onClick: function () {
            var isExpanded = bauEntriesEl.classList.toggle('visible');
            bauChevron.classList.toggle('expanded', isExpanded);
          } },
            el('span', { className: 's5-bau-dot' }),
            el('span', { className: 's5-bau-text' }, bauEntries.length + ' routine scans \u2014 ' + bauAgentCount + ' agents, all healthy'),
            bauChevron
          );
          activitySection.appendChild(bauGroup);
          activitySection.appendChild(bauEntriesEl);
        }
      });
    }

    function renderEntry(entry) {
      var dotColor = entry.urgent ? '#ef4444' : (TYPE_COLORS[entry.type] || '#fbbf24');
      var dot = el('div', {
        className: 's5-entry-dot' + (entry.urgent ? ' urgent' : ''),
        style: { background: dotColor }
      });

      var content = el('div', { className: 's5-entry-content' },
        el('span', { className: 's5-entry-agent' }, entry.agent),
        el('div', { className: 's5-entry-action' }, entry.action)
      );

      if (entry.detail) {
        content.appendChild(el('div', { className: 's5-entry-detail' }, entry.detail));
      }

      if (!entry.bau) {
        var link = el('span', { className: 's5-entry-link', onClick: function (ev) {
          ev.stopPropagation();
          showEntryDetail(entry);
        } }, 'View details >');
        content.appendChild(link);
      }

      var timeStr = formatTime(entry.timestamp);
      var time = el('span', { className: 's5-entry-time' }, timeStr);

      return el('div', { className: 's5-entry' }, dot, content, time);
    }


    /* ═══ RIGHT: Agent Panel ═══ */

    agentPanel.appendChild(
      el('div', { className: 's5-panel-header' },
        el('div', { className: 's5-panel-label' }, 'AGENT')
      )
    );

    var panelBody = el('div', { className: 's5-panel-body' });
    agentPanel.appendChild(panelBody);

    function defaultPanelContent() {
      return [
        el('div', { className: 's5-panel-default' }, 'Click a heatmap cell or activity entry to investigate, or ask anything.'),
        el('div', { className: 's5-panel-suggestions' },
          el('button', { className: 's5-suggest-btn' }, 'How is this brand doing overall?'),
          el('button', { className: 's5-suggest-btn' }, 'What are the biggest risks right now?'),
          el('button', { className: 's5-suggest-btn' }, 'Why is sentiment showing so many alerts?')
        ),
        el('div', { className: 's5-panel-input-wrap' },
          el('div', { className: 's5-panel-input-row' },
            el('input', { className: 's5-panel-input', type: 'text', placeholder: 'Ask about this brand...' }),
            el('button', { className: 's5-panel-send', disabled: 'disabled' }, 'Send')
          )
        )
      ];
    }

    // Default panel content
    defaultPanelContent().forEach(function (c) { panelBody.appendChild(c); });

    /* ── Slide-over Detail Panel ── */
    var overlayBackdrop = el('div', { className: 's5-overlay-backdrop' });
    var overlayPanel = el('div', { className: 's5-overlay-panel' });
    var overlayBody = el('div', { className: 's5-overlay-body' });

    var overlayHeader = el('div', { className: 's5-overlay-header' },
      el('span', { className: 's5-overlay-header-title' }, ''),
      el('button', { className: 's5-overlay-close', onClick: closeOverlay }, '\u00d7')
    );
    overlayPanel.appendChild(overlayHeader);
    overlayPanel.appendChild(overlayBody);
    document.body.appendChild(overlayBackdrop);
    document.body.appendChild(overlayPanel);

    overlayBackdrop.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlayPanel.classList.contains('open')) closeOverlay();
    });

    function openOverlay(title, isWide) {
      overlayBody.innerHTML = '';
      overlayHeader.querySelector('.s5-overlay-header-title').textContent = title || '';
      if (isWide) { overlayPanel.classList.add('wide'); } else { overlayPanel.classList.remove('wide'); }
      // Force reflow before adding open class for transition
      void overlayPanel.offsetWidth;
      overlayBackdrop.classList.add('open');
      overlayPanel.classList.add('open');
    }

    function closeOverlay() {
      overlayBackdrop.classList.remove('open');
      overlayPanel.classList.remove('open');
    }

    function metaRow(label, value) {
      return el('div', { className: 's5-detail-meta-row' },
        el('span', { className: 's5-detail-meta-label' }, label),
        el('span', { className: 's5-detail-meta-value' }, value)
      );
    }

    function showEntryDetail(entry) {
      var agent = entry.agent;
      if (agent === 'Concierge Agent') {
        showConciergeDetail(entry);
      } else if (agent === 'RCA Agent') {
        showRCADetail(entry);
      } else if (agent === 'Signal Agent' || agent === 'Internal Health Monitor' || agent === 'Deployment Health Guardian' || agent === 'Vendor Health Monitor' || agent === 'Vendor Outage Agent' || agent === 'Data Pipeline Monitor' || agent === 'Database Health Agent') {
        showDevOpsDetail(entry);
      } else if (agent === 'Fraud Watch Agent' || agent === 'Bad Actor Agent' || agent === 'Regulatory Change Monitor') {
        showComplianceDetail(entry);
      } else {
        showMonitoringDetail(entry);
      }
    }

    function statusDot() {
      return el('span', { style: { width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' } });
    }

    function sectionLabel(text, countVal) {
      var label = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: '24px' } });
      var span = el('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', fontWeight: '600' } }, text);
      label.appendChild(span);
      if (countVal !== undefined) {
        label.appendChild(el('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#555', opacity: '0.5' } }, String(countVal)));
      }
      label.appendChild(el('span', { style: { flex: '1', height: '1px', background: 'rgba(255,255,255,0.06)' } }));
      return label;
    }

    function renderMessage(role, content) {
      var isUser = role === 'user';
      var color = isUser ? '#666' : '#10b981';
      var wrap = el('div', { style: { borderLeft: '2px solid ' + color, paddingLeft: '10px', marginBottom: '8px' } });
      wrap.appendChild(el('span', { style: { fontSize: '9px', fontWeight: '500', display: 'block', marginBottom: '2px', color: color } }, isUser ? 'Customer' : 'Mochi'));
      wrap.appendChild(el('p', { style: { fontSize: '12px', color: '#ddd', lineHeight: '1.5', opacity: isUser ? '0.9' : '0.6', margin: '0' } }, content));
      return wrap;
    }

    function renderEvaluation(evalData) {
      if (!evalData) return el('span');
      var gradeColors = { poor: '#ef4444', fair: '#fbbf24', good: '#10b981' };
      var gradeBg = { poor: 'rgba(239,68,68,0.08)', fair: 'rgba(251,191,36,0.08)', good: 'rgba(16,185,129,0.08)' };
      var c = gradeColors[evalData.grade] || '#fbbf24';
      var bg = gradeBg[evalData.grade] || 'rgba(251,191,36,0.08)';

      var card = el('div', { style: { background: bg, border: '1px solid ' + c, borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', opacity: '0.95' } });

      // Grade header
      var header = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } });
      header.appendChild(el('span', { style: { fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', color: c } }, 'Mochi performance: ' + evalData.grade));
      card.appendChild(header);

      // Summary
      card.appendChild(el('p', { style: { fontSize: '12px', color: '#ddd', opacity: '0.8', lineHeight: '1.5', marginBottom: '8px' } }, evalData.summary));

      // Signals
      evalData.signals.forEach(function (s) {
        var row = el('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '3px' } });
        row.appendChild(el('span', { style: { width: '4px', height: '4px', borderRadius: '50%', background: c, flexShrink: '0', marginTop: '5px' } }));
        row.appendChild(el('span', { style: { fontSize: '11px', color: '#ddd', opacity: '0.6' } }, s));
        card.appendChild(row);
      });

      return card;
    }

    /* ── Concierge Detail ── */
    function showConciergeDetail(entry) {
      var convo = entry.conversation;
      openOverlay('Concierge Agent', false);

      // Header area: status + contact count
      var statusClass = entry.urgent ? 'urgent' : (entry.flagged ? 'watch' : 'ok');
      var statusText = entry.urgent ? 'Escalated' : (entry.flagged ? 'Flagged' : 'Resolved');
      var headerRow = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' } });
      headerRow.appendChild(el('div', { className: 's5-detail-status ' + statusClass }, statusDot(), statusText));
      if (convo && convo.contact_count > 1) {
        headerRow.appendChild(el('span', { style: { fontSize: '10px', padding: '3px 10px', borderRadius: '9999px', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: '500' } }, convo.contact_count + ' contacts'));
      }
      overlayBody.appendChild(headerRow);

      // Title
      if (convo) {
        overlayBody.appendChild(el('div', { className: 's5-detail-title' }, convo.topic));
      } else {
        overlayBody.appendChild(el('div', { className: 's5-detail-title' }, entry.action));
      }
      overlayBody.appendChild(el('div', { className: 's5-detail-agent' }, entry.agent + ' \u00b7 ' + formatTime(entry.timestamp)));

      // Friction callout
      var calloutClass = entry.urgent ? 'danger' : (entry.flagged ? 'warning' : 'success');
      overlayBody.appendChild(el('div', { className: 's5-detail-callout ' + calloutClass }, entry.detail));

      // Evaluation card (if conversation data exists)
      if (convo && convo.evaluation) {
        overlayBody.appendChild(renderEvaluation(convo.evaluation));
      }

      // Journey stages (if explicit journey data)
      if (convo && convo.journey) {
        overlayBody.appendChild(sectionLabel('Journey'));
        var timeline = el('div', { className: 's5-detail-timeline' });
        convo.journey.forEach(function (s) {
          var itemClass = s.status === 'completed' ? 'active' : (s.status === 'failed' ? 'failed' : 'pending');
          var item = el('div', { className: 's5-detail-tl-item ' + itemClass });
          var labelRow = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } });
          labelRow.appendChild(el('span', { className: 's5-detail-tl-label' }, s.stage));
          if (s.time) labelRow.appendChild(el('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#444' } }, s.time));
          item.appendChild(labelRow);
          if (s.detail) item.appendChild(el('div', { className: 's5-detail-tl-text' }, s.detail));
          timeline.appendChild(item);
        });
        overlayBody.appendChild(timeline);
      } else {
        // Inferred stages from action text
        var isStalled = entry.action.indexOf('stalled') !== -1;
        var isCompleted = entry.action.indexOf('completed') !== -1;
        var isAbandoned = entry.action.indexOf('abandoned') !== -1;
        var stages = [];
        if (isAbandoned) {
          stages = [{ l: 'Landing', s: 'active' }, { l: 'Checkout', s: 'active' }, { l: 'Payment', s: 'failed' }];
        } else if (isStalled) {
          var stalledAt = 'Activation';
          if (entry.detail.indexOf('number selection') !== -1) stalledAt = 'Number Selection';
          else if (entry.detail.indexOf('eSIM') !== -1 || entry.detail.indexOf('activation') !== -1) stalledAt = 'eSIM Activation';
          else if (entry.detail.indexOf('identity') !== -1) stalledAt = 'Identity Verification';
          else if (entry.detail.indexOf('port-in') !== -1 || entry.detail.indexOf('Port-in') !== -1) stalledAt = 'Port-In';
          stages = [{ l: 'Signup', s: 'active' }, { l: 'Payment', s: 'active' }, { l: stalledAt, s: 'failed' }, { l: 'Activation', s: 'pending' }];
        } else if (isCompleted) {
          stages = [{ l: 'Signup', s: 'active' }, { l: 'Payment', s: 'active' }, { l: 'Number Selection', s: 'active' }, { l: 'eSIM Activation', s: 'active' }];
        }
        if (stages.length > 0) {
          overlayBody.appendChild(sectionLabel('Journey Stages'));
          var tl = el('div', { className: 's5-detail-timeline' });
          stages.forEach(function (st) { tl.appendChild(el('div', { className: 's5-detail-tl-item ' + st.s }, el('div', { className: 's5-detail-tl-label' }, st.l))); });
          overlayBody.appendChild(tl);
        }
      }

      // Conversation messages
      if (convo && convo.messages && convo.messages.length > 0) {
        var hasRepeats = convo.contact_count > 1 && convo.prior_conversations && convo.prior_conversations.length > 0;

        if (hasRepeats) {
          overlayBody.appendChild(sectionLabel('Contact Timeline', (convo.prior_conversations.length + 1) + ' sessions'));

          // Build sessions: initial + prior + latest
          var sessions = [];
          // Initial conversation (first messages)
          sessions.push({ timestamp: convo.messages[0].timestamp, messages: convo.messages.slice(0, 4), isLatest: false, wasEscalated: false });
          // Prior conversations
          convo.prior_conversations.forEach(function (p) {
            sessions.push({ timestamp: p.timestamp, messages: null, customerMsg: p.customer_message, botMsg: p.bot_response, msgCount: p.message_count, isLatest: false, wasEscalated: p.was_escalated });
          });
          // Latest
          if (convo.messages.length > 4) {
            sessions.push({ timestamp: convo.messages[convo.messages.length - 2].timestamp, messages: convo.messages.slice(-2), isLatest: true, wasEscalated: convo.status === 'escalated' });
          }

          var timelineWrap = el('div', { style: { position: 'relative', marginLeft: '4px' } });
          // Vertical line
          timelineWrap.appendChild(el('div', { style: { position: 'absolute', left: '4px', top: '8px', bottom: '8px', width: '1px', background: 'rgba(255,255,255,0.06)' } }));

          sessions.forEach(function (sess, si) {
            var sessColor = sess.wasEscalated ? '#ef4444' : (sess.isLatest ? (convo.status === 'escalated' ? '#ef4444' : '#10b981') : '#fbbf24');
            var sessLabel = sess.wasEscalated ? 'Escalated' : (sess.isLatest ? (convo.status === 'escalated' ? 'Escalated' : 'Resolved') : 'Unresolved');
            var sessBg = sess.wasEscalated ? 'rgba(239,68,68,0.1)' : (sess.isLatest ? 'rgba(16,185,129,0.1)' : 'rgba(251,191,36,0.1)');

            var sessEl = el('div', { style: { position: 'relative', paddingLeft: '24px', paddingBottom: '20px' } });

            // Dot
            var dotStyle = { position: 'absolute', left: '0', top: '5px', width: '9px', height: '9px', borderRadius: '50%', background: sessColor };
            if (sess.isLatest) dotStyle.boxShadow = '0 0 0 2px #111, 0 0 0 4px ' + sessColor;
            sessEl.appendChild(el('span', { style: dotStyle }));

            // Session header
            var sessHead = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' } });
            sessHead.appendChild(el('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#666' } }, formatTime(sess.timestamp)));
            sessHead.appendChild(el('span', { style: { fontSize: '9px', padding: '1px 6px', borderRadius: '9999px', background: sessBg, color: sessColor, fontWeight: '500' } }, sessLabel));
            if (sess.isLatest) sessHead.appendChild(el('span', { style: { fontSize: '9px', padding: '1px 6px', borderRadius: '9999px', background: 'rgba(124,106,240,0.1)', color: '#7c6af0', fontWeight: '500' } }, 'latest'));
            sessEl.appendChild(sessHead);

            // Messages
            if (sess.messages) {
              sess.messages.forEach(function (m) { sessEl.appendChild(renderMessage(m.role, m.content)); });
            } else {
              sessEl.appendChild(renderMessage('user', sess.customerMsg));
              if (sess.botMsg) sessEl.appendChild(renderMessage('assistant', sess.botMsg));
              if (sess.msgCount > 2) {
                sessEl.appendChild(el('div', { style: { paddingLeft: '12px', fontSize: '10px', color: '#555', opacity: '0.4' } }, '+ ' + (sess.msgCount - 2) + ' more messages'));
              }
            }

            // Escalation callout
            if (sess.wasEscalated) {
              var escRow = el('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', marginLeft: '12px' } });
              escRow.appendChild(el('span', { style: { fontSize: '10px', fontWeight: '500', color: '#ef4444' } }, 'Escalated to human agent'));
              sessEl.appendChild(escRow);
            }

            timelineWrap.appendChild(sessEl);

            // Gap between sessions
            if (si < sessions.length - 1) {
              var currTs = new Date(sess.timestamp).getTime();
              var nextTs = new Date(sessions[si + 1].timestamp).getTime();
              var gapH = Math.round((nextTs - currTs) / 3600000);
              if (gapH >= 1) {
                var gapD = Math.floor(gapH / 24);
                var gapText = gapD > 0 ? gapD + 'd ' + (gapH % 24) + 'h later' : gapH + 'h later';
                var gapEl = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '11px', paddingTop: '4px', paddingBottom: '12px' } });
                gapEl.appendChild(el('div', { style: { flex: '1', height: '1px', background: 'rgba(255,255,255,0.04)' } }));
                gapEl.appendChild(el('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#555', opacity: '0.4' } }, gapText));
                gapEl.appendChild(el('div', { style: { flex: '1', height: '1px', background: 'rgba(255,255,255,0.04)' } }));
                timelineWrap.appendChild(gapEl);
              }
            }
          });
          overlayBody.appendChild(timelineWrap);

        } else {
          // Single conversation
          overlayBody.appendChild(sectionLabel('Conversation', convo.message_count + ' msgs'));
          var maxShow = Math.min(convo.messages.length, 6);
          for (var mi = 0; mi < maxShow; mi++) {
            overlayBody.appendChild(renderMessage(convo.messages[mi].role, convo.messages[mi].content));
          }
          if (convo.messages.length > maxShow) {
            overlayBody.appendChild(el('div', { style: { paddingLeft: '12px', fontSize: '10px', color: '#555', opacity: '0.5', marginTop: '4px' } }, '+ ' + (convo.messages.length - maxShow) + ' more messages'));
          }

          // Outcome line
          var outcomeColor = convo.status === 'escalated' ? '#ef4444' : '#10b981';
          var outcome = el('div', { style: { borderLeft: '3px solid ' + outcomeColor, paddingLeft: '12px', paddingTop: '8px', paddingBottom: '8px', marginTop: '16px' } });
          outcome.appendChild(el('span', { style: { fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '500', color: outcomeColor, display: 'block', marginBottom: '4px' } }, convo.status === 'escalated' ? 'Escalated to human' : 'Resolved by Mochi'));
          outcome.appendChild(el('p', { style: { fontSize: '11px', color: '#ddd', opacity: '0.7', lineHeight: '1.5', margin: '0' } }, convo.status === 'escalated' ? 'Bot could not resolve after ' + convo.message_count + ' messages. Conversation was handed to a human agent.' : 'Mochi handled this in ' + convo.message_count + ' messages without escalation.'));
          overlayBody.appendChild(outcome);
        }
      }

      // Meta footer
      overlayBody.appendChild(sectionLabel('Details'));
      var orderMatch = entry.action.match(/#(\d+)/);
      if (orderMatch) overlayBody.appendChild(metaRow('Order', '#' + orderMatch[1]));
      overlayBody.appendChild(metaRow('Timestamp', entry.timestamp.replace('T', ' ').replace('Z', ' UTC')));
      if (entry.urgent) overlayBody.appendChild(metaRow('Escalation', 'Auto-escalated to human agent'));
    }

    /* ── RCA Detail ── */
    function showRCADetail(entry) {
      var rca = entry.rca;
      openOverlay('Zara Agent Triage', true);

      if (rca) {
        // Severity badge
        var sevMap = { critical: { cls: 'urgent', text: 'Critical' }, warning: { cls: 'watch', text: 'Warning' }, ok: { cls: 'ok', text: 'All Clear' } };
        var sev = sevMap[rca.severity] || sevMap.warning;
        overlayBody.appendChild(el('div', { className: 's5-detail-status ' + sev.cls }, statusDot(), sev.text));

        overlayBody.appendChild(el('div', { className: 's5-detail-title' }, entry.action));
        overlayBody.appendChild(el('div', { className: 's5-detail-agent' }, entry.agent + ' \u00b7 ' + formatTime(entry.timestamp)));

        // Issue summary card
        overlayBody.appendChild(sectionLabel('Issue Summary'));
        var sevColors = { critical: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' }, warning: { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' }, ok: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' } };
        var sc = sevColors[rca.severity] || sevColors.warning;
        var summaryCard = el('div', { style: { background: sc.bg, border: '1px solid ' + sc.border, borderRadius: '8px', padding: '14px' } });
        summaryCard.appendChild(el('p', { style: { fontSize: '13px', color: '#ddd', lineHeight: '1.5', margin: '0' } }, rca.summary));

        // Tickets
        if (rca.tickets && rca.tickets.length > 0) {
          var ticketRow = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid ' + sc.border } });
          rca.tickets.forEach(function (t) {
            var prioColors = { urgent: '#ef4444', high: '#fbbf24', normal: '#ddd', low: '#666' };
            var chip = el('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '4px', background: '#0a0a0a', fontSize: '11px' } });
            chip.appendChild(el('span', { style: { fontFamily: "'JetBrains Mono', monospace", color: '#ddd' } }, '#' + t.id));
            chip.appendChild(el('span', { style: { color: '#666' } }, t.subject.length > 40 ? t.subject.slice(0, 37) + '...' : t.subject));
            chip.appendChild(el('span', { style: { fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', color: prioColors[t.priority] || '#666' } }, t.priority));
            ticketRow.appendChild(chip);
          });
          summaryCard.appendChild(ticketRow);
        }
        overlayBody.appendChild(summaryCard);

        // Root cause analysis
        overlayBody.appendChild(sectionLabel('Root Cause Analysis'));
        if (rca.verdict && rca.verdict !== rca.summary) {
          overlayBody.appendChild(el('p', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#ddd', lineHeight: '1.5', marginBottom: '14px' } }, rca.verdict));
        }

        // Failed/warned steps
        var failedSteps = rca.steps.filter(function (s) { return s.status === 'fail' || s.status === 'warn'; });
        var passedSteps = rca.steps.filter(function (s) { return s.status === 'pass'; });
        failedSteps.forEach(function (step) {
          var iconColor = step.status === 'fail' ? '#ef4444' : '#fbbf24';
          var icon = step.status === 'fail' ? '\u2717' : '!';
          overlayBody.appendChild(el('div', { className: 's5-detail-step' },
            el('span', { style: { color: iconColor, fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: '700', flexShrink: '0', width: '16px', textAlign: 'center' } }, icon),
            el('div', { style: { flex: '1', minWidth: '0' } },
              el('span', { style: { fontSize: '12px', fontWeight: '500', color: '#ddd' } }, step.name),
              el('p', { style: { fontSize: '11px', color: '#888', lineHeight: '1.4', margin: '2px 0 0' } }, step.finding)
            )
          ));
        });
        // Passed checks (collapsed)
        if (passedSteps.length > 0) {
          var passLine = el('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' } });
          passLine.appendChild(el('span', { style: { fontSize: '10px', color: '#10b981' } }, '\u2713'));
          passLine.appendChild(el('span', { style: { fontSize: '11px', color: '#888' } }, passedSteps.length + ' check' + (passedSteps.length !== 1 ? 's' : '') + ' passed'));
          passLine.appendChild(el('span', { style: { fontSize: '11px', color: '#555', opacity: '0.5' } }, '(' + passedSteps.map(function (s) { return s.name; }).join(', ') + ')'));
          overlayBody.appendChild(passLine);
        }

        // Investigation timeline
        if (rca.timeline && rca.timeline.length > 0) {
          overlayBody.appendChild(sectionLabel('Investigation Timeline', rca.timeline.length));
          var tl = el('div', { style: { position: 'relative', paddingLeft: '24px' } });
          tl.appendChild(el('div', { style: { position: 'absolute', left: '9px', top: '4px', bottom: '4px', width: '1px', background: 'rgba(255,255,255,0.06)' } }));
          rca.timeline.forEach(function (evt) {
            var row = el('div', { style: { position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '6px 0' } });
            row.appendChild(el('div', { style: { position: 'absolute', left: '-18px', top: '10px', width: '5px', height: '5px', borderRadius: '50%', background: '#666' } }));
            row.appendChild(el('span', { style: { flexShrink: '0', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#666', width: '40px', textAlign: 'right', tabularNums: true } }, evt.time));
            row.appendChild(el('p', { style: { fontSize: '12px', color: '#ddd', lineHeight: '1.4', margin: '0' } }, evt.event));
            tl.appendChild(row);
          });
          overlayBody.appendChild(tl);
        }

        // Actions taken
        overlayBody.appendChild(sectionLabel('Action Taken'));
        if (rca.actions_taken) {
          rca.actions_taken.forEach(function (a) {
            overlayBody.appendChild(el('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '4px 0' } },
              el('span', { style: { fontSize: '10px', color: '#10b981', marginTop: '3px', flexShrink: '0' } }, '\u2713'),
              el('p', { style: { fontSize: '12px', color: '#ddd', lineHeight: '1.4', margin: '0' } }, a)
            ));
          });
        }
        if (rca.recommendations && rca.recommendations.length > 0) {
          overlayBody.appendChild(el('div', { style: { fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', opacity: '0.6', marginTop: '14px', marginBottom: '6px' } }, 'Recommendations'));
          rca.recommendations.forEach(function (r, i) {
            overlayBody.appendChild(el('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '3px 0' } },
              el('span', { style: { fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#666', marginTop: '3px', flexShrink: '0' } }, (i + 1) + '.'),
              el('p', { style: { fontSize: '12px', color: '#ddd', lineHeight: '1.4', margin: '0' } }, r)
            ));
          });
        }

        // Footer
        var footer = el('div', { style: { marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' } });
        footer.appendChild(el('span', { style: { fontSize: '10px', color: '#666' } }, 'Triage completed ' + formatTime(entry.timestamp)));
        footer.appendChild(el('span', { style: { fontSize: '10px', color: '#555', opacity: '0.5' } }, entry.agent));
        overlayBody.appendChild(footer);

      } else {
        // Fallback for RCA entries without structured data
        overlayBody.appendChild(el('div', { className: 's5-detail-status watch' }, statusDot(), 'Triage Complete'));
        overlayBody.appendChild(el('div', { className: 's5-detail-title' }, entry.action));
        overlayBody.appendChild(el('div', { className: 's5-detail-agent' }, entry.agent + ' \u00b7 ' + formatTime(entry.timestamp)));
        overlayBody.appendChild(el('div', { className: 's5-detail-callout info' }, entry.detail));

        var rootCause = entry.detail.match(/Root cause: ([^.]+)/);
        var fix = entry.detail.match(/Fix[: ]+([^.]+)/);
        overlayBody.appendChild(sectionLabel('Investigation'));
        if (rootCause) {
          overlayBody.appendChild(el('div', { className: 's5-detail-step' },
            el('span', { style: { color: '#fbbf24', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: '700', width: '16px', textAlign: 'center' } }, '!'),
            el('div', {},
              el('span', { style: { fontSize: '12px', fontWeight: '500', color: '#ddd' } }, 'Root cause'),
              el('p', { style: { fontSize: '11px', color: '#888', margin: '2px 0 0' } }, rootCause[1])
            )
          ));
        }
        if (fix) {
          overlayBody.appendChild(el('div', { className: 's5-detail-step' },
            el('span', { style: { color: '#10b981', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: '700', width: '16px', textAlign: 'center' } }, '\u2713'),
            el('div', {},
              el('span', { style: { fontSize: '12px', fontWeight: '500', color: '#ddd' } }, 'Remediation'),
              el('p', { style: { fontSize: '11px', color: '#888', margin: '2px 0 0' } }, fix[1])
            )
          ));
        }
        overlayBody.appendChild(sectionLabel('Details'));
        overlayBody.appendChild(metaRow('Agent', entry.agent));
        overlayBody.appendChild(metaRow('Timestamp', entry.timestamp.replace('T', ' ').replace('Z', ' UTC')));
      }
    }

    /* ── DevOps Detail ── */
    function showDevOpsDetail(entry) {
      openOverlay('Infrastructure', false);

      var sevClass = entry.urgent ? 'urgent' : (entry.flagged ? 'watch' : 'ok');
      var sevText = entry.urgent ? 'Critical' : (entry.flagged ? 'Warning' : 'Healthy');
      overlayBody.appendChild(el('div', { className: 's5-detail-status ' + sevClass }, statusDot(), sevText));

      overlayBody.appendChild(el('div', { className: 's5-detail-title' }, entry.action));
      overlayBody.appendChild(el('div', { className: 's5-detail-agent' }, entry.agent + ' \u00b7 ' + formatTime(entry.timestamp)));

      var calloutClass = entry.urgent ? 'danger' : (entry.flagged ? 'warning' : 'info');
      overlayBody.appendChild(el('div', { className: 's5-detail-callout ' + calloutClass }, entry.detail));

      // Parse metrics from detail text
      var metrics = [];
      var poolMatch = entry.detail.match(/Pool at (\d+%)/);
      if (poolMatch) metrics.push(['DB Pool Usage', poolMatch[1]]);
      var uptimeMatch = entry.detail.match(/(\d+\.\d+%)\s*uptime/);
      if (uptimeMatch) metrics.push(['Uptime', uptimeMatch[1]]);
      var errorMatch = entry.detail.match(/Error rate (\d+\.\d+%)/);
      if (errorMatch) metrics.push(['Error Rate', errorMatch[1]]);
      var latencyMatch = entry.detail.match(/p95: (\d+ms)/);
      if (latencyMatch) metrics.push(['Latency p95', latencyMatch[1]]);
      var etaMatch = entry.detail.match(/ETA[^:]*: ([^.]+)/);
      if (etaMatch) metrics.push(['ETA to Critical', etaMatch[1]]);
      var cpuMatch = entry.detail.match(/CPU: (\d+%)/);
      if (cpuMatch) metrics.push(['CPU', cpuMatch[1]]);
      var memMatch = entry.detail.match(/Memory: (\d+%)/);
      if (memMatch) metrics.push(['Memory', memMatch[1]]);

      if (metrics.length > 0) {
        overlayBody.appendChild(sectionLabel('Metrics'));
        metrics.forEach(function (m) { overlayBody.appendChild(metaRow(m[0], m[1])); });
      }

      overlayBody.appendChild(sectionLabel('Details'));
      overlayBody.appendChild(metaRow('Agent', entry.agent));
      overlayBody.appendChild(metaRow('Category', 'DevOps'));
      overlayBody.appendChild(metaRow('Timestamp', entry.timestamp.replace('T', ' ').replace('Z', ' UTC')));
    }

    /* ── Compliance Detail ── */
    function showComplianceDetail(entry) {
      openOverlay('Compliance & Fraud', false);

      var sevClass = entry.urgent ? 'urgent' : 'watch';
      var sevText = entry.urgent ? 'Action Required' : 'Enforcement';
      overlayBody.appendChild(el('div', { className: 's5-detail-status ' + sevClass }, statusDot(), sevText));

      overlayBody.appendChild(el('div', { className: 's5-detail-title' }, entry.action));
      overlayBody.appendChild(el('div', { className: 's5-detail-agent' }, entry.agent + ' \u00b7 ' + formatTime(entry.timestamp)));

      overlayBody.appendChild(el('div', { className: 's5-detail-callout warning' }, entry.detail));

      // Parse enforcement actions
      var accountsMatch = entry.detail.match(/(\d+) accounts?\s*(suspended|flagged|held|frozen)/);
      var creditsMatch = entry.detail.match(/\$(\d+)/);
      var signupsMatch = entry.detail.match(/(\d+) signup attempts?/);

      overlayBody.appendChild(sectionLabel('Enforcement Actions'));
      if (accountsMatch) overlayBody.appendChild(metaRow('Accounts ' + accountsMatch[2], accountsMatch[1]));
      if (creditsMatch) overlayBody.appendChild(metaRow('Credits affected', '$' + creditsMatch[1]));
      if (signupsMatch) overlayBody.appendChild(metaRow('Signup attempts blocked', signupsMatch[1]));
      overlayBody.appendChild(metaRow('Agent', entry.agent));
      overlayBody.appendChild(metaRow('Timestamp', entry.timestamp.replace('T', ' ').replace('Z', ' UTC')));
    }

    /* ── Monitoring Detail ── */
    function showMonitoringDetail(entry) {
      openOverlay('Signal Detail', false);

      overlayBody.appendChild(el('div', { className: 's5-detail-status ok' }, statusDot(), 'Monitoring'));

      overlayBody.appendChild(el('div', { className: 's5-detail-title' }, entry.action));
      overlayBody.appendChild(el('div', { className: 's5-detail-agent' }, entry.agent + ' \u00b7 ' + formatTime(entry.timestamp)));

      overlayBody.appendChild(sectionLabel('Summary'));
      overlayBody.appendChild(el('div', { className: 's5-detail-body' }, entry.detail));

      // Parse any metrics from text
      var metricPairs = [];
      var mrrMatch = entry.detail.match(/MRR[: ]*\$([\d,]+)/);
      if (mrrMatch) metricPairs.push(['MRR', '$' + mrrMatch[1]]);
      var arpuMatch = entry.detail.match(/ARPU[: ]*\$([\d.]+)/);
      if (arpuMatch) metricPairs.push(['ARPU', '$' + arpuMatch[1]]);
      var cacMatch = entry.detail.match(/CAC[^$]*\$(\d+)/);
      if (cacMatch) metricPairs.push(['CAC', '$' + cacMatch[1]]);
      var roasMatch = entry.detail.match(/ROAS[: ]*([\d.]+x)/);
      if (roasMatch) metricPairs.push(['ROAS', roasMatch[1]]);
      var convMatch = entry.detail.match(/(\d+\.?\d*%)\s*landing/);
      if (convMatch) metricPairs.push(['Landing conversion', convMatch[1]]);
      var cpmMatch = entry.detail.match(/CPM[^$]*\$([\d.]+)/);
      if (cpmMatch) metricPairs.push(['CPM', '$' + cpmMatch[1]]);

      if (metricPairs.length > 0) {
        overlayBody.appendChild(sectionLabel('Metrics'));
        metricPairs.forEach(function (m) { overlayBody.appendChild(metaRow(m[0], m[1])); });
      }

      overlayBody.appendChild(sectionLabel('Details'));
      overlayBody.appendChild(metaRow('Agent', entry.agent));
      overlayBody.appendChild(metaRow('Category', entry.type));
      overlayBody.appendChild(metaRow('Timestamp', entry.timestamp.replace('T', ' ').replace('Z', ' UTC')));
    }


    /* ═══ Initial Render ═══ */
    renderHeatmap();
    renderActivity();

    container.appendChild(root);
  };

})();
