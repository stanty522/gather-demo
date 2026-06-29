// scene-1-personas.js — "Who we serve"
// 5-persona investor narrative. Self-contained. Call initScene1(container) to mount.

async function initScene1(container) {

  // ─── DATA ───────────────────────────────────────────────────────────────────

  const HERO_IMG = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80&fit=crop&auto=format';

  const personas = [
    {
      id: 'p-elderly',
      navLabel: 'Aging parents',
      photo: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?w=1200&fit=crop',
      photoPos: 'center 35%',
      moduleName: 'Shield',
      moduleSkills: 'Scam detection · Spam blocking · Deepfake detection · SIM swap protection · Call notes · Real-time translation',
      title: 'Shield for Aging Parents',
      sub: 'Margaret, 74 · 54M Americans 65+',
      context: "She's 74. She lives alone. She's sharp, reads two novels a week, walks the neighborhood every morning. But her phone has become a problem she can't solve. She answers every call because her doctor calls from different numbers. Last March, someone called pretending to be the IRS.",
      quote: {
        text: "They told me I'd be arrested in 48 hours if I didn't wire the money. I believed them.",
        attr: 'Margaret, after the call'
      },
      rows: [
        { before: 'IRS scammer calls. Caller ID says "US Government." She wires $3,000 that afternoon. Daughter finds out 3 days later.', skill: 'Scam detection', skillDesc: 'Spots manipulation tactics mid-call', after: "AI whispers at 0:47: \"Sounds like a scam. You don't have to stay on.\" She hangs up. Her savings stay hers." },
        { before: 'Falls at 2am. Calls 911. Goes to the ER alone. Family finds out at 2pm the next day.', skill: '911 family alert', skillDesc: '911 events trigger instant family notification', after: "Paramedics arrive with her medical history, meds, and emergency contacts already pulled. She's not alone in the ER." },
        { before: 'Phone has been off since 8am. Nobody notices until evening.', skill: 'Daily check-in', skillDesc: 'Detects breaks in routine, escalates automatically', after: "The AI calls her first. She answers, says she slept in. No false alarm, no family panic. If she hadn't answered, help would already be on the way." },
        { before: 'Mom calls after a doctor\'s appointment: "They changed one of my medications but I can\'t remember which one or why."', skill: 'Call notes', skillDesc: 'Summary texted after every call. Searchable history.', after: "Text to Margaret: \"Dr. Park changed Lisinopril to 20mg. Refill at CVS Friday. Follow-up April 28.\" She doesn't have to hold it in her head." }
      ],
      also: 'Deepfake detection · SIM swap protection'
    },

    {
      id: 'p-caregiver',
      navLabel: 'Caregiver',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80&fit=crop&auto=format',
      photoPos: 'center 30%',
      moduleName: 'Shield + Guardian',
      moduleSkills: '911 alerts · Daily check-in · Doctor summaries · Care sharing · Rx refills · Behavior alerts',
      title: 'Guardian for the Caregiver',
      sub: 'Sarah, 42 · 53M US caregivers',
      context: "She calls her mom every morning at 9am just to hear her voice. If Mom doesn't pick up by the second ring, her stomach drops. She's tried Life360 (Mom won't install it), Apple Watch (Mom won't wear it), Medical Guardian pendant (drawer after one week).",
      quote: {
        text: "I've looked at every product on the market. They all require [her] to cooperate. She doesn't want to feel watched. I just want to know she's okay.",
        attr: 'Sarah, interview'
      },
      rows: [
        { before: 'Mom called 911 at 2am. She was in the ER for 10 hours alone. Daughter found out at 2pm the next day.', skill: '911 family alert', skillDesc: 'Mom calls 911, you know in 60 seconds', after: "Daughter's phone buzzes at 2:01am. No app on Mom's phone. No device. No cooperation required. Just the phone plan." },
        { before: "Neurologist changed Dad's meds. Karen told siblings at 9pm from memory. Versions diverged. Argument followed.", skill: 'Doctor call summary', skillDesc: 'Plain-English recap shared with every sibling', after: "Same summary sent to all three siblings: \"Donepezil 10mg to 5mg. Start Memantine 5mg. Follow-up 6 weeks.\" The argument doesn't happen." },
        { before: "Mom's blood pressure meds ran out. Pharmacy closes at 6. She forgot to call. Two days without Lisinopril.", skill: 'Prescription refill', skillDesc: 'Calls the pharmacy, confirms the refill', after: "AI calls CVS at 2pm. Text to Mom: \"Lisinopril ready for pickup by 4pm.\" Text to daughter: \"Refill handled.\"" },
        { before: "Mom's phone hasn't moved since breakfast. Daughter keeps calling. No answer. Drives 40 minutes to check.", skill: 'Daily check-in', skillDesc: 'Detects when the phone goes quiet', after: "Text at 11am: \"Margaret hasn't used her phone since 7am. Usually calls Linda by 10. Want me to check in?\"" },
        { before: "Mom used to call three friends a week. It's been a month. Daughter only notices at Thanksgiving.", skill: 'Isolation watch', skillDesc: 'Flags drop-off in calls and texts', after: "\"Margaret's outgoing calls dropped 70% over 3 weeks. She hasn't called Linda or Doris. Worth a visit.\"" }
      ],
      also: 'Care team sharing'
    },

    {
      id: 'p-family',
      navLabel: 'Parents of pre-teens',
      photo: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?w=1200&fit=crop',
      photoPos: 'center 20%',
      moduleName: 'Shield + Family',
      moduleSkills: 'Restricted line · Call screening · Daily brief · Caller background check · Community match',
      title: 'Family for Parents of Pre-teens',
      sub: 'Rachel & James · 73M US parents',
      context: "They gave their 12-year-old a phone for middle school so she could reach them. They regretted it within a month. Unknown numbers calling. They can't tell which are friends' parents from work phones and which are something else. Reading her texts feels invasive. They promised privacy. Taking the phone away means she can't call home.",
      quote: null,
      rows: [
        { before: "Unknown numbers call after school. Can't tell friends' parents from strangers. No way to screen voice calls.", skill: 'Call screening', skillDesc: 'Unknown callers screened before phone rings', after: "Unknown callers screened at the network. Numbers not in contacts don't ring during school hours." },
        { before: "Phone rings at 11pm. You installed a parental control app. She deleted it.", skill: 'Restricted line', skillDesc: 'Approved contacts and hours, network-level', after: "After 9pm, only saved contacts ring through. Network-level. No app to delete." },
        { before: '"We didn\'t want to spy on her. But not knowing who\'s calling her feels irresponsible."', skill: 'Daily brief', skillDesc: 'Who called, how long, any flags. No transcripts.', after: "Daily digest: 4 calls today. 2 saved contacts. 2 screened (1 survey, 1 spam). No flags. No transcripts. Just enough." },
        { before: "Strange 917 number calls three times. Can't tell if it's a classmate's dad or someone she shouldn't talk to.", skill: 'Caller background check', skillDesc: 'Cross-references unknown numbers', after: "Flag in the daily brief: \"917 number: registered to Mark Chen, parent at Lincoln Middle. Likely safe.\"" },
        { before: "New town, no friends yet. She sits in her room on Discord talking to strangers on the internet.", skill: 'Community match', skillDesc: 'Finds kids nearby with shared interests', after: "Text to Mom: \"3 kids at Lincoln Middle also into anime and soccer. Two moms opted in. Want intros?\"" }
      ],
      also: null
    },

    {
      id: 'p-professional',
      navLabel: 'Busy professional',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&q=80&fit=crop&auto=format',
      photoPos: 'center 25%',
      moduleName: 'Shield + Autopilot',
      moduleSkills: 'Wait on hold · Cancel anything · Lower bills · Find & book · Call notes · Voicemail digest',
      title: 'Autopilot for the Busy Professional',
      sub: 'David, 38 · Phone on silent 9 to 5',
      context: "By the time he checks his phone at the end of the day, the dentist, pharmacy, insurance, bank, and gym have all closed too. The only time he can call is the time he can't. Weekends, everyone's closed. The list rolls to next week.",
      quote: null,
      rows: [
        { before: 'Gym charged $237 over 3 months. Two cancellation attempts. Retention pitch both times. Gave up.', skill: 'Cancel anything', skillDesc: 'Handles retention scripts, gets confirmation', after: "AI calls, survives the retention pitch. Text: \"Cancelled. Confirmation #GX-44891. No further charges.\"" },
        { before: 'Internet bill jumped to $89/mo. Kept meaning to call. 4 months of overpaying. $120 gone.', skill: 'Lower your bills', skillDesc: 'Calls provider, negotiates a better rate', after: "AI calls Comcast, talks to retentions. Text: \"New rate: $59/mo for 12 months. Annual savings: $360.\"" },
        { before: 'Wife asked for a dinner reservation. Thursday evening. No energy to call 5 restaurants.', skill: 'Find & book', skillDesc: 'Calls restaurants and books availability', after: "AI calls 5 restaurants. Text: \"Monteverde, 7:30 Saturday, table for 2. Confirmed.\" Wife asks if he found a place. He says yes." },
        { before: 'Insurance claim. 45 minutes on hold. He hangs up after 20. Tries again next day. Same result.', skill: 'Wait on hold', skillDesc: 'AI holds the line, texts when a human picks up', after: "AI dials, waits 38 minutes. Text: \"Agent on the line, tap to connect.\" He joins in 3 seconds." },
        { before: 'Five voicemails at 5pm. Dentist, insurance, the gym again, two unknown. No time to listen to all of them.', skill: 'Voicemail digest', skillDesc: 'Summarizes and prioritizes voicemails', after: "One text: \"Dentist needs to reschedule Tue. Insurance approved claim, check mail. Gym = spam. Skip the rest.\"" }
      ],
      also: 'Call notes'
    },

    {
      id: 'p-business',
      navLabel: 'Small business',
      photo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=80&fit=crop&auto=format',
      photoPos: 'center 30%',
      moduleName: 'Shield + Autopilot + Business Line',
      moduleSkills: 'Smart screening · Invoice follow-up · After-hours · Urgency triage · Book & dispatch',
      title: 'Business Line for the Operator',
      sub: 'Marcus, 31 · 64M US freelancers',
      context: "Drives for Uber mornings. Freelance graphic design afternoons. One phone for everything. In February, a $4,500 client called while he was driving on I-25. Went to voicemail. No message. She hired someone else. He also has $2,800 in unpaid invoices he won't chase because it's awkward.",
      quote: null,
      rows: [
        { before: '$4,500 client called while driving. Voicemail. No message. She hired someone else.', skill: 'Smart screening', skillDesc: 'AI answers, qualifies, texts you the summary', after: "AI answered as \"Marcus Design Studio.\" Qualified the lead: $4,500 rebrand, 3-week timeline. Callback booked for 2pm." },
        { before: '$1,800 invoice outstanding since November. He designed their logo. Can\'t bring himself to chase the money.', skill: 'Invoice follow-up', skillDesc: 'Calls clients about overdue invoices', after: "AI calls from his number: \"Calling on behalf of Marcus Design Studio regarding invoice #1247.\" Payment scheduled for Friday." },
        { before: '10pm Saturday. Customer calls about a broken AC. Voicemail. They call his competitor.', skill: 'After-hours answering', skillDesc: 'Answers the business line nights and weekends', after: "AI picks up as \"Marcus Design Studio.\" Takes the details, promises a callback Monday 9am. Customer doesn't shop around." },
        { before: "Eight voicemails Monday morning. Three are emergencies, five are quote requests. He can't tell until he listens to all of them.", skill: 'Urgency triage', skillDesc: 'Sorts emergencies from quote requests', after: "Text: \"2 urgent (logo revision due today, client sign-off needed). 5 quotes, no rush. 1 spam.\" Emergencies handled first." },
        { before: 'Client wants to book a consult. Back-and-forth texts about calendar slots. Takes 3 days to pin down a time.', skill: 'Book & dispatch', skillDesc: 'Checks calendar, books, sends confirmation', after: "AI offers 3 slots live on the call. Books Wednesday 2pm. Confirmation text sent. Calendar blocked. Done." },
        { before: 'Uber riders texting personal cell. Clients calling at midnight. One phone, two lives blurring together.', skill: 'Separate business line', skillDesc: 'One phone, two lines, separate rules', after: "Business line rings until 7pm, then AI takes over. Personal line stays quiet. Same device, different worlds." }
      ],
      also: null
    }
  ];

  // ─── CSS ────────────────────────────────────────────────────────────────────

  const css = `
.scene1-root {
  height: 100%;
  overflow-y: auto;
  color: #1c1917;
  background: #faf8f3;
  font-family: 'Source Serif 4', Georgia, serif;
  -webkit-font-smoothing: antialiased;
}
.scene1-root *, .scene1-root *::before, .scene1-root *::after { box-sizing: border-box; }

/* ── Hero ── */
.s1-hero {
  position: relative;
  min-height: 56vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: #f5f0e8;
}
.s1-hero-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: saturate(0.55) brightness(0.95);
  opacity: 0.55;
}
.s1-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(250,248,243,0.2) 0%, rgba(250,248,243,0.55) 50%, rgba(250,248,243,0.92) 100%);
}
.s1-hero-inner {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 96px 32px 72px;
  width: 100%;
}
.s1-hero-eyebrow {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: #b45309;
  margin-bottom: 20px;
}
.s1-hero-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 64px; font-weight: 700;
  color: #1c1917;
  line-height: 1.05;
  letter-spacing: -1.5px;
  margin-bottom: 20px;
  max-width: 680px;
}
.s1-hero-title em { color: #b45309; font-style: italic; font-weight: 400; }
.s1-hero-sub {
  font-size: 19px;
  color: #57534e;
  max-width: 560px;
  line-height: 1.65;
}

/* ── Personas layout ── */
.s1-personas-wrap {
  max-width: 1280px;
  margin: 0 auto;
  padding: 72px 32px 100px;
}
.s1-personas-row {
  display: flex;
  gap: 56px;
  position: relative;
}
.s1-sidebar {
  width: 200px;
  flex-shrink: 0;
  display: none;
}
@media (min-width: 1024px) { .s1-sidebar { display: block; } }
.s1-sidebar-inner {
  position: sticky;
  top: 32px;
}
.s1-sidebar-label {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: #b45309;
  margin-bottom: 20px;
}
.s1-sidebar-list { display: flex; flex-direction: column; gap: 4px; }
.s1-sidebar-link {
  font-size: 14px; font-weight: 400;
  color: #a8a29e;
  padding: 6px 0 6px 14px;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
  text-decoration: none;
}
.s1-sidebar-link:hover { color: #57534e; }
.s1-sidebar-link.active {
  color: #1c1917;
  border-left-color: #b45309;
  font-weight: 600;
}

.s1-main {
  flex: 1;
  min-width: 0;
}

/* ── Persona block ── */
.s1-persona {
  margin-bottom: 144px;
  scroll-margin-top: 32px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.s1-persona.visible { opacity: 1; transform: translateY(0); }

.s1-photo {
  position: relative;
  height: 340px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 36px;
  border: 1px solid rgba(0,0,0,0.06);
}
.s1-photo img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: saturate(0.7) brightness(0.95);
}
.s1-photo-fade {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(28,25,23,0.25) 0%, transparent 55%);
}
.s1-module-pill {
  position: absolute;
  bottom: 14px; left: 20px;
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  background: rgba(250,248,243,0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 7px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}
.s1-module-pill .s1-module-name { color: #1c1917; font-weight: 700; }
.s1-module-pill .s1-module-skills { color: #b45309; }

.s1-persona-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 36px; font-weight: 700;
  color: #1c1917;
  margin-bottom: 12px;
  letter-spacing: -0.8px;
  line-height: 1.15;
}
.s1-persona-sub {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: #b45309;
  margin-bottom: 20px;
}
.s1-persona-context {
  font-size: 17px;
  color: #57534e;
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 640px;
}

.s1-quote {
  border-left: 2px solid #b45309;
  padding: 10px 0 10px 28px;
  margin-bottom: 44px;
  max-width: 680px;
}
.s1-quote-text {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 24px; font-style: italic;
  font-weight: 400;
  color: #1c1917;
  line-height: 1.4;
}
.s1-quote-attr {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #a8a29e;
  margin-top: 14px;
}

.s1-changes-header {
  border-top: 1px solid rgba(0,0,0,0.08);
  padding-top: 28px;
  margin-bottom: 24px;
}
.s1-changes-label {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: #b45309;
}

.s1-table-head {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 12px;
}
.s1-th {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: #a8a29e;
}
.s1-th.s1-th-after { color: #b45309; }

.s1-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  padding: 18px 0;
  border-top: 1px solid rgba(0,0,0,0.06);
}
.s1-row-cell { font-size: 15px; line-height: 1.6; padding-right: 16px; }
.s1-row-before { color: #a8a29e; }
.s1-row-skill-name { color: #1c1917; font-weight: 600; line-height: 1.3; }
.s1-row-skill-desc { color: #a8a29e; font-size: 14px; margin-top: 4px; line-height: 1.5; }
.s1-row-after { color: #1c1917; }

.s1-also {
  font-size: 13px;
  color: #a8a29e;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid rgba(0,0,0,0.05);
}
.s1-also-label { color: #57534e; font-weight: 600; }

@media (max-width: 768px) {
  .s1-hero-title { font-size: 40px; }
  .s1-photo { height: 240px; }
  .s1-table-head, .s1-row { grid-template-columns: 1fr; }
  .s1-personas-wrap { padding: 40px 20px; }
}
`;

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  function renderPersona(p) {
    const quoteHtml = p.quote ? `
      <div class="s1-quote">
        <p class="s1-quote-text">"${esc(p.quote.text)}"</p>
        <p class="s1-quote-attr">${esc(p.quote.attr)}</p>
      </div>
    ` : '';

    const alsoHtml = p.also ? `
      <p class="s1-also"><span class="s1-also-label">Also includes:</span> ${esc(p.also)}</p>
    ` : '';

    const rowsHtml = p.rows.map(r => `
      <div class="s1-row">
        <p class="s1-row-cell s1-row-before">${esc(r.before)}</p>
        <div class="s1-row-cell">
          <p class="s1-row-skill-name">${esc(r.skill)}</p>
          <p class="s1-row-skill-desc">${esc(r.skillDesc)}</p>
        </div>
        <p class="s1-row-cell s1-row-after">${esc(r.after)}</p>
      </div>
    `).join('');

    return `
      <div id="${p.id}" class="s1-persona">
        <div class="s1-photo">
          <img src="${esc(p.photo)}" alt="${esc(p.title)}" style="object-position: ${esc(p.photoPos)};">
          <div class="s1-photo-fade"></div>
          <div class="s1-module-pill">
            <span class="s1-module-name">${esc(p.moduleName)}</span>
            <span class="s1-module-skills"> · ${esc(p.moduleSkills)}</span>
          </div>
        </div>

        <h3 class="s1-persona-title">${esc(p.title)}</h3>
        <p class="s1-persona-sub">${esc(p.sub)}</p>
        <p class="s1-persona-context">${esc(p.context)}</p>

        ${quoteHtml}

        <div class="s1-changes-header">
          <p class="s1-changes-label">What changes</p>
        </div>
        <div class="s1-table-head">
          <p class="s1-th">Before</p>
          <p class="s1-th">Skill</p>
          <p class="s1-th s1-th-after">After</p>
        </div>
        <div>${rowsHtml}</div>

        ${alsoHtml}
      </div>
    `;
  }

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  const sidebarHtml = personas.map(p =>
    `<a class="s1-sidebar-link" data-target="${p.id}" href="#${p.id}">${esc(p.navLabel)}</a>`
  ).join('');

  const personasHtml = personas.map(renderPersona).join('');

  container.innerHTML = `
    <style>${css}</style>
    <div class="scene1-root">
      <section class="s1-hero">
        <img class="s1-hero-img" src="${HERO_IMG}" alt="">
        <div class="s1-hero-overlay"></div>
        <div class="s1-hero-inner">
          <p class="s1-hero-eyebrow">Who we serve</p>
          <h1 class="s1-hero-title">Your number.<br><em>Now with a brain.</em></h1>
          <p class="s1-hero-sub">Not an app. Not a service. The number itself becomes intelligent.</p>
        </div>
      </section>

      <section class="s1-personas-wrap">
        <div class="s1-personas-row">
          <aside class="s1-sidebar">
            <div class="s1-sidebar-inner">
              <p class="s1-sidebar-label">Personas</p>
              <div class="s1-sidebar-list">${sidebarHtml}</div>
            </div>
          </aside>

          <div class="s1-main">${personasHtml}</div>
        </div>
      </section>
    </div>
  `;

  // ─── INTERACTIVITY ──────────────────────────────────────────────────────────

  const root = container.querySelector('.scene1-root');
  const sections = container.querySelectorAll('.s1-persona');
  const links = container.querySelectorAll('.s1-sidebar-link');

  // Fade-in on scroll
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, root: root });
  sections.forEach(s => fadeObs.observe(s));

  // Scroll spy: highlight sidebar link for persona closest to top of viewport
  const spyObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const id = entry.target.id;
        const active = container.querySelector(`.s1-sidebar-link[data-target="${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { root: root, rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => spyObs.observe(s));

  // Sidebar click → smooth scroll within the scene
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-target');
      const target = container.querySelector('#' + id);
      if (!target || !root) return;
      const rootRect = root.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const top = root.scrollTop + (targetRect.top - rootRect.top) - 24;
      root.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

window.initScene1 = initScene1;
