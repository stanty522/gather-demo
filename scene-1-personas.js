// scene-1-personas.js — Persona Explorer (Scene 1)
// Self-contained module. Call initScene1(container) to mount.

function initScene1(container) {
  // ─── DATA ───────────────────────────────────────────────────────────────────

  const personas = [
    {id:'s1',name:'The TikTok Pet Wellness Convert',pipe:'surge',quad:'go',desc:'Impulse-driven pet owners who discovered supplements through viral TikTok content. High urgency, low research.',pop:'2.4M active',popNum:2400000,popSource:'TikTok + Google Trends spike',intensity:4,score:8.1,
     markers:['First-time supplement buyer','TikTok daily user','Dog owner 1-3 years','Urban/suburban millennial'],
     community:['#PetTok','r/DogCare','BarkBox subscribers'],
     moment:'Viral vet content wave — 6-week window closing',momentWindow:'6 weeks',
     confidence:{identity:62,price:38,channel:72},
     interview:[
      {q:'What made you first look into pet supplements?',a:'My FYP was suddenly all these vets talking about joint health and I panicked. My dog is only four but I started googling everything. I bought three different things that week — I didn\u2019t even compare them, I just wanted to feel like I was doing something.',insight:'Impulse triggered by authority content on social media. Decision speed > research depth.'},
      {q:'How do you decide what to trust?',a:'Honestly? If a vet on TikTok recommends it and the comments aren\u2019t full of horror stories, that\u2019s enough for me. I know that sounds bad. I did look at the ingredients for like\u2026 thirty seconds.',insight:'Trust delegated to parasocial authority figures. Comment section serves as social proof layer.'},
      {q:'What would make you switch brands?',a:'If another TikTok vet I follow said something better existed. Or if my dog didn\u2019t seem different after a month. I\u2019m not loyal yet — I\u2019m still figuring out what works.',insight:'Zero brand loyalty in discovery phase. Switching cost is near-zero. Window to capture is narrow.'}
     ]},
    {id:'s2',name:'The Pandemic Puppy Parent',pipe:'surge',quad:'go',desc:'Got a dog during COVID lockdowns, now navigating real-world pet ownership costs and wellness for the first time.',pop:'4.8M households',popNum:4800000,popSource:'APPA 2021-2023 adoption data',intensity:3,score:7.6,markers:['COVID-era adopter','First-time dog owner','Experiencing vet cost shock'],community:['r/puppy101','Nextdoor pet groups'],moment:'Post-pandemic vet cost reality hitting',momentWindow:'12 months',confidence:{identity:55,price:48,channel:45}},
    {id:'s3',name:'The Subscription Canceller',pipe:'surge',quad:'monitor',desc:'Actively cancelling pet subscription boxes, looking for better value or more targeted solutions.',pop:'1.1M churned',popNum:1100000,popSource:'BarkBox/Chewy churn data estimates',intensity:3,score:6.4,markers:['Former BarkBox/Chewy subscriber','Price-sensitive','Seeking targeted solutions'],community:['r/dogs deal threads','Facebook pet groups'],moment:'Subscription fatigue + price sensitivity spike',momentWindow:'3 months',confidence:{identity:42,price:65,channel:38}},
    {id:'s4',name:'The Vet Bill Shock Responder',pipe:'surge',quad:'go',desc:'Just received an unexpected large vet bill, now urgently seeking preventive wellness to avoid future costs.',pop:'8.2M annually',popNum:8200000,popSource:'AVMA veterinary spending data',intensity:5,score:8.4,markers:['Recent $500+ vet bill','Preventive mindset shift','Price-comparison active'],community:['r/AskVet','pet insurance forums'],moment:'48-72 hours post-bill — emotional + financial pain peak',momentWindow:'1 week',confidence:{identity:71,price:55,channel:60}},
    {id:'s5',name:'The CBD-Curious Pet Owner',pipe:'surge',quad:'monitor',desc:'Exploring CBD/alternative supplements for pet anxiety or pain, overwhelmed by unregulated market.',pop:'3.1M searching',popNum:3100000,popSource:'Google Trends + Brightfield Group',intensity:2,score:5.9,markers:['Searching CBD for pets','Confused by regulations','Dog anxiety or senior pain'],community:['r/CBD','holistic pet Facebook groups'],moment:'Pet anxiety event (fireworks, thunderstorm, separation)',momentWindow:'Seasonal + event-driven',confidence:{identity:35,price:30,channel:42}},

    {id:'m1',name:'The Anxious Millennial Pet Parent',pipe:'micro',quad:'invest',desc:'Over-indexes on pet health research, treats pet as child-substitute, willing to pay premium for peace of mind.',pop:'12.8M addressable',popNum:12800000,popSource:'Pew + APPA cross-reference',intensity:5,score:8.7,
     markers:['Millennial 28-38','Pet = family member identity','Health anxiety extends to pet','Premium buyer ($50-150/mo on pet wellness)'],
     community:['r/DogCare (890K)','The Dodo followers','@DrKarenBecker','Pet parent Facebook groups (2.3M combined)'],
     moment:'First health scare or annual vet checkup revealing issue',momentWindow:'2-4 weeks post-vet visit',
     confidence:{identity:78,price:42,channel:68},
     interview:[
      {q:'Tell me about your relationship with your pet\u2019s health.',a:'I just want to know I\u2019m not failing my dog, you know? Like, I read this thing about how most commercial dog food is basically garbage and I spiraled for three days. I spent $200 on a DNA test for my cat. Don\u2019t judge me. I need data to feel okay.',insight:'Identity tension: "good pet parent" identity requires constant validation through purchases and research. Health anxiety is a feature, not a bug.'},
      {q:'How do you decide what products to buy?',a:'I research everything. Like, embarrassingly. I\u2019ll spend four hours reading reviews, checking ingredients against studies I barely understand, asking in three different Reddit threads. And then I\u2019ll still feel uncertain. The brands that make me feel least anxious win — not the cheapest ones.',insight:'Decision paralysis from over-research. Brands that reduce anxiety (not just provide information) will capture. Trust > price.'},
      {q:'What would an ideal pet wellness brand look like to you?',a:'Something that feels like it was made by people who actually lose sleep over their pets too. Not corporate. Not preachy. Just\u2026 obsessive in the right way. And transparent — show me the studies, show me where it\u2019s made, let me talk to a real person if I need to.',insight:'Wants brand that mirrors their own identity: obsessive, anxious, transparent. Community + expertise + authenticity is the triangle.'}
     ]},
    {id:'m2',name:'The Holistic Wellness Devotee',pipe:'micro',quad:'invest',desc:'Already committed to holistic health for themselves, extending philosophy to pets. Seeks clean, natural, science-backed products.',pop:'6.4M',popNum:6400000,popSource:'Natural pet product market analysis',intensity:4,score:7.8,markers:['Personal holistic health practitioner','Clean label obsessive','Willing to pay 2-3x for natural'],community:['r/HolisticPets','@rodalesorganic followers'],moment:'Extending personal wellness journey to pet',momentWindow:'Ongoing',confidence:{identity:72,price:35,channel:55}},
    {id:'m3',name:'The Premium Pet Parent',pipe:'micro',quad:'invest',desc:'High-income household treating pet as luxury lifestyle extension. Brand-conscious, quality-first.',pop:'5.2M households',popNum:5200000,popSource:'Affluent pet owner segment analysis',intensity:4,score:7.5,markers:['HHI $150K+','Brand-loyal across categories','Instagram aesthetic matters'],community:['@WildOne followers','luxury pet boutique shoppers'],moment:'Upgrading pet lifestyle to match personal lifestyle',momentWindow:'Ongoing',confidence:{identity:65,price:25,channel:58}},
    {id:'m4',name:'The Grief-Aware Navigator',pipe:'micro',quad:'explore',desc:'Lost a pet or has aging pet, hyper-focused on preventive care and quality of life extension.',pop:'3.9M',popNum:3900000,popSource:'AVMA pet loss + senior pet data',intensity:5,score:7.2,markers:['Senior pet owner (8+ years)','Previous pet loss experience','Preventive care obsessive'],community:['r/OldManDog','pet hospice support groups'],moment:'Pet aging milestone or health diagnosis',momentWindow:'6-12 months',confidence:{identity:80,price:20,channel:50}},
    {id:'m5',name:'The Multi-Pet Household Optimizer',pipe:'micro',quad:'explore',desc:'3+ pets household seeking efficiency and bulk solutions. Price-conscious but volume buyer.',pop:'7.1M households',popNum:7100000,popSource:'APPA multi-pet household data',intensity:3,score:6.8,markers:['3+ pets','Budget-conscious on per-unit','Seeks bundles and subscriptions'],community:['r/MultiPetHousehold','Chewy power users'],moment:'Adding another pet to household',momentWindow:'1-2 months post-adoption',confidence:{identity:45,price:70,channel:52}},
    {id:'m6',name:'The Senior Pet Caregiver',pipe:'micro',quad:'invest',desc:'Dedicated to extending and improving quality of life for aging pets. High emotional investment, willing to spend.',pop:'9.5M',popNum:9500000,popSource:'Senior pet population estimates',intensity:5,score:8.0,markers:['Pet 8+ years old','Mobility or health issues','Vet relationship active'],community:['r/SeniorDogs','pet arthritis support groups'],moment:'First mobility issue or chronic diagnosis',momentWindow:'Ongoing after trigger',confidence:{identity:75,price:30,channel:62}},
    {id:'m7',name:'The Pet Tech Early Adopter',pipe:'micro',quad:'explore',desc:'Uses smart pet devices, GPS trackers, auto-feeders. Interested in data-driven pet health.',pop:'4.3M',popNum:4300000,popSource:'Pet tech market analysis',intensity:3,score:6.5,markers:['Smart home user','Data-driven decisions','Early adopter personality'],community:['r/PetTech','ProductHunt pet category'],moment:'New pet tech device purchase',momentWindow:'1-2 months post-purchase',confidence:{identity:50,price:45,channel:65}},

    {id:'M1',name:'The Pet-as-Family Advocate',pipe:'macro',quad:'build',desc:'Deeply identifies as pet parent. Pet is integral to family identity. Seeks brands that validate this worldview.',pop:'85M pet owners (30M+ addressable)',popNum:30000000,popSource:'APPA National Pet Owners Survey',intensity:5,score:9.1,
     markers:['Pet = family member (not property)','Identity-driven purchasing','Community-organized','Long-term brand relationship seeker'],
     community:['r/PetHealth (340K)','BarkPost (12M reach)','@DrKarenBecker (4.2M)','Pet parent identity communities (est. 45M)'],
     moment:'Pet adoption + first major health decision',momentWindow:'Extended (years)',
     confidence:{identity:85,price:40,channel:55},
     interview:[
      {q:'How would you describe your relationship with your pet?',a:'Being a good pet parent is literally part of my identity now. It\u2019s not something I do, it\u2019s who I am. I judge people by how they treat their animals. I can\u2019t help it. When someone says "it\u2019s just a dog," I physically recoil.',insight:'Identity is fully fused with pet parenthood. Brand opportunity: validate and signal this identity. This is tribal.'},
      {q:'What do you look for in pet wellness products?',a:'I want a brand that gets it. That doesn\u2019t talk down to me or treat this like it\u2019s frivolous. I spend more on my dog\u2019s food than my own groceries some months and I\u2019m not embarrassed about it. I want a brand I\u2019d put a sticker on my car for.',insight:'Seeking identity-signaling brand. Willingness to be a visible advocate = organic growth engine. Brand must feel worthy of tribal membership.'},
      {q:'What\u2019s missing in the market?',a:'Nobody owns this space yet. There\u2019s no Nike of pet wellness. No brand that makes me feel like they\u2019re as obsessive about my dog\u2019s health as I am. Everyone\u2019s either too clinical or too cutesy. I want serious + warm. Science + soul.',insight:'Massive brand vacuum. The "Nike of pet wellness" positioning is available. Must balance scientific credibility with emotional warmth.'}
     ]},
    {id:'M2',name:'The Wellness Optimizer',pipe:'macro',quad:'build',desc:'Applies human biohacking/wellness optimization mindset to pet health. Data-driven, supplement-savvy.',pop:'8.5M',popNum:8500000,popSource:'Wellness market cross-reference',intensity:4,score:7.9,markers:['Personal supplement user','Quantified self mindset','Willing to pay for optimization'],community:['r/Biohacking pet threads','wellness podcast audiences'],moment:'Extending personal optimization to pet',momentWindow:'Ongoing',confidence:{identity:68,price:35,channel:48}},
    {id:'M3',name:'The Animal Welfare Activist',pipe:'macro',quad:'compete',desc:'Values ethical sourcing, sustainability, animal testing policies. Will pay premium for aligned brands.',pop:'14.2M',popNum:14200000,popSource:'Ethical consumer segment analysis',intensity:4,score:7.1,markers:['Ethical consumer across categories','Sustainability-focused','Vocal about animal welfare'],community:['r/AnimalRights','ethical consumer blogs'],moment:'Brand ethics scandal in pet industry',momentWindow:'Event-driven',confidence:{identity:70,price:30,channel:45}},
    {id:'M4',name:'The Vet Trust Seeker',pipe:'macro',quad:'build',desc:'Trusts veterinarian recommendations above all. Wants vet-endorsed, clinically validated products.',pop:'22M',popNum:22000000,popSource:'AVMA client trust data',intensity:3,score:7.4,markers:['Regular vet visits (2+/year)','Clinical evidence matters','Brand trust = vet endorsement'],community:['AVMA client networks','vet clinic communities'],moment:'Vet recommendation during checkup',momentWindow:'1-2 weeks post-visit',confidence:{identity:55,price:45,channel:70}},
    {id:'M5',name:'The Pet Philosophy Thinker',pipe:'macro',quad:'compete',desc:'Intellectualizes pet ownership, interested in the cultural shift of human-animal relationships.',pop:'3.8M',popNum:3800000,popSource:'Academic + cultural analysis',intensity:2,score:5.8,markers:['Reads longform content','Cultural critic mindset','Values brand storytelling'],community:['literary pet essays','NYT pet culture readers'],moment:'Cultural moment or viral essay about pets',momentWindow:'Event-driven',confidence:{identity:60,price:50,channel:35}}
  ];

  const triggerEvents = [
    {rank:1,name:'Child Aging Off Family Plan',composite:4.6,axes:{compulsion:5,friction:5,intent:4,predictability:5,frequency:4,dataAccessibility:4},switchingType:'Forced',telcoPain:['Must find individual coverage','Loss of family discount','New plan research required'],emotionalState:'Anxiety + urgency',windowType:'Hard deadline (birthday)',peakIntent:'2-4 weeks before birthday',seasonal:'Back-to-school spike (Aug-Sep)',annualVolume:'4.2M events/year',overlapFlags:['College transition','First job'],interceptionChannels:['University partnerships','Parent-targeted social','SMS at billing change'],supportingSignals:['Age verification data','Family plan metadata','College enrollment timing'],qualification:'Tier 1 — Highest composite. Forced switch with hard deadline. Emotionally charged, highly predictable, interceptable via billing data.'},
    {rank:2,name:'ACP/Lifeline Subsidy Loss',composite:4.5,axes:{compulsion:5,friction:5,intent:5,predictability:4,frequency:3,dataAccessibility:5},switchingType:'Forced',telcoPain:['Sudden price increase','Service disruption risk','Limited affordable options'],emotionalState:'Panic + financial stress',windowType:'Policy-driven deadline',peakIntent:'Immediately upon notification',seasonal:'Policy change cycles',annualVolume:'23M enrolled (at risk)',overlapFlags:['Income change','Government policy shifts'],interceptionChannels:['Community organizations','Social services','Direct mail'],supportingSignals:['Subsidy enrollment data','Income verification','Policy change announcements'],qualification:'Tier 1 — Massive vulnerable population. Extremely high intent at notification moment.'},
    {rank:3,name:'Immigration / New U.S. Arrival',composite:4.4,axes:{compulsion:4,friction:5,intent:5,predictability:4,frequency:4,dataAccessibility:3},switchingType:'Forced',telcoPain:['No credit history','Language barriers','Plan confusion'],emotionalState:'Overwhelm + determination',windowType:'Extended (first 90 days)',peakIntent:'First 2 weeks in-country',seasonal:'Visa cycle peaks',annualVolume:'3.8M arrivals/year',overlapFlags:['Housing search','Job search','Banking setup'],interceptionChannels:['Immigration services','Community organizations','Airport/port of entry'],supportingSignals:['Visa processing data','Community org partnerships','Airport advertising'],qualification:'Tier 1 — Extended high-intent window. Language and trust barriers create loyalty lock-in opportunity.'},
    {rank:4,name:'Divorce / Household Split',composite:4.3,axes:{compulsion:4,friction:4,intent:4,predictability:3,frequency:4,dataAccessibility:3},switchingType:'Forced',telcoPain:['Shared plan dissolution','New individual plan needed','Emotional decision-making'],emotionalState:'Stress + independence seeking',windowType:'Extended (1-3 months)',peakIntent:'Week of separation',seasonal:'January spike (post-holidays)',annualVolume:'2.4M divorces/year',overlapFlags:['Housing change','Financial restructuring'],interceptionChannels:['Legal services partnerships','Life transition apps','Social media targeting'],supportingSignals:['Address change data','Name change records','Legal filing timing'],qualification:'Tier 1 — Emotionally charged, extended window. Multiple life transitions create cross-sell opportunity.'},
    {rank:5,name:'Job Loss / Career Disruption',composite:4.2,axes:{compulsion:4,friction:4,intent:5,predictability:3,frequency:4,dataAccessibility:4},switchingType:'Economic',telcoPain:['Budget cuts needed','Plan downgrade pressure','Employer plan loss'],emotionalState:'Anxiety + cost-consciousness',windowType:'Immediate (1-2 weeks)',peakIntent:'First week post-job-loss',seasonal:'Layoff cycles (Q1, Q4)',annualVolume:'6.1M layoffs/year',overlapFlags:['Insurance loss','Budget restructuring'],interceptionChannels:['Job boards','LinkedIn','Unemployment services'],supportingSignals:['Employment data','LinkedIn status changes','Unemployment claims'],qualification:'Tier 1 — High urgency, cost-driven. Capture with value messaging at vulnerability moment.'},
    {rank:6,name:'New Small Business Launch',composite:4.1,axes:{compulsion:4,friction:4,intent:4,predictability:4,frequency:4,dataAccessibility:3},switchingType:'Expansion',telcoPain:['Separate business line needed','Multi-device management','Cost scaling concerns'],emotionalState:'Excitement + overwhelm',windowType:'Extended (first 60 days)',peakIntent:'Business registration week',seasonal:'January + September peaks',annualVolume:'5.4M new businesses/year',overlapFlags:['Banking setup','Insurance needs'],interceptionChannels:['SBA partnerships','Business registration','Coworking spaces'],supportingSignals:['Business registration data','SBA loan applications','Domain registrations'],qualification:'Tier 1 — Multiple lines of revenue per customer. High lifetime value potential.'},
    {rank:7,name:'College Move-In / First Independence',composite:4.0,axes:{compulsion:4,friction:3,intent:4,predictability:5,frequency:4,dataAccessibility:4},switchingType:'Forced',telcoPain:['Leaving family plan','First time choosing own plan','Budget constraints'],emotionalState:'Excitement + anxiety',windowType:'Hard deadline (move-in)',peakIntent:'2-3 weeks before move-in',seasonal:'August peak',annualVolume:'3.6M freshmen/year',overlapFlags:['Child aging off plan','Banking setup'],interceptionChannels:['University partnerships','Campus events','Parent-student channels'],supportingSignals:['Enrollment data','Campus housing records','Orientation schedules'],qualification:'Tier 2 — Highly predictable, concentrated window. University partnerships are key channel.'},
    {rank:8,name:'Military Deployment / PCS Move',composite:3.9,axes:{compulsion:5,friction:4,intent:4,predictability:4,frequency:3,dataAccessibility:3},switchingType:'Forced',telcoPain:['International coverage needs','Plan suspension/change','Family plan restructuring'],emotionalState:'Duty + logistics stress',windowType:'Hard deadline (orders)',peakIntent:'2-4 weeks before deployment',seasonal:'PCS season (May-Aug)',annualVolume:'1.3M PCS moves/year',overlapFlags:['Housing change','Family separation'],interceptionChannels:['Military base services','MWR programs','Military spouse networks'],supportingSignals:['PCS orders','Base housing data','Military family networks'],qualification:'Tier 2 — High loyalty potential. Military community word-of-mouth is powerful.'},
    {rank:9,name:'Retirement Transition',composite:3.8,axes:{compulsion:3,friction:3,intent:4,predictability:4,frequency:3,dataAccessibility:4},switchingType:'Economic',telcoPain:['Fixed income budget','Employer plan loss','Usage pattern change'],emotionalState:'Reflection + caution',windowType:'Extended (3-6 months)',peakIntent:'Month of retirement',seasonal:'Year-round, slight Q4 peak',annualVolume:'4.1M retirements/year',overlapFlags:['Medicare enrollment','Downsizing'],interceptionChannels:['AARP partnerships','Financial advisors','Senior centers'],supportingSignals:['Social Security data','Medicare enrollment','401k distributions'],qualification:'Tier 2 — Large volume, extended window. Value and simplicity messaging resonates.'},
    {rank:10,name:'Domestic Violence Escape',composite:3.7,axes:{compulsion:5,friction:5,intent:5,predictability:2,frequency:3,dataAccessibility:2},switchingType:'Forced',telcoPain:['Shared plan escape','Privacy/safety needs','Financial control issues'],emotionalState:'Fear + determination',windowType:'Immediate (hours-days)',peakIntent:'Moment of leaving',seasonal:'Holiday spikes',annualVolume:'1.3M incidents/year',overlapFlags:['Housing crisis','Legal proceedings'],interceptionChannels:['DV shelters','Hotlines','Legal aid'],supportingSignals:['Shelter partnerships','Court records','Hotline referrals'],qualification:'Tier 2 — Highest emotional intensity. Safety-first messaging. Partnership with advocacy organizations essential.'},
    {rank:11,name:'Natural Disaster Displacement',composite:3.6,axes:{compulsion:5,friction:4,intent:5,predictability:2,frequency:2,dataAccessibility:4},switchingType:'Forced',telcoPain:['Service disruption','Device loss','Temporary housing'],emotionalState:'Crisis + urgency',windowType:'Immediate (days)',peakIntent:'First 48 hours',seasonal:'Hurricane/fire seasons',annualVolume:'14.5M affected/year',overlapFlags:['Housing loss','Insurance claims'],interceptionChannels:['Emergency services','FEMA partnerships','Community organizations'],supportingSignals:['FEMA data','Weather data','Utility outage data'],qualification:'Tier 2 — Unpredictable but high-volume when occurring. Rapid response capability needed.'},
    {rank:12,name:'International Student Arrival',composite:3.5,axes:{compulsion:4,friction:4,intent:4,predictability:5,frequency:3,dataAccessibility:3},switchingType:'Forced',telcoPain:['No U.S. plan','Visa requirements','Family communication needs'],emotionalState:'Excitement + overwhelm',windowType:'First 2 weeks',peakIntent:'Orientation week',seasonal:'August-September',annualVolume:'1.1M students/year',overlapFlags:['Immigration','College move-in'],interceptionChannels:['University international offices','Airport kiosks','Student organizations'],supportingSignals:['I-20 data','University enrollment','Orientation schedules'],qualification:'Tier 2 — Concentrated window, high predictability. Campus partnerships essential.'},
    {rank:13,name:'First Child Born',composite:3.4,axes:{compulsion:3,friction:3,intent:3,predictability:4,frequency:4,dataAccessibility:3},switchingType:'Expansion',telcoPain:['Family plan evaluation','Budget re-prioritization','New connectivity needs'],emotionalState:'Joy + responsibility',windowType:'Extended (prenatal-6mo)',peakIntent:'Third trimester',seasonal:'Year-round',annualVolume:'3.6M births/year',overlapFlags:['Insurance change','Housing change'],interceptionChannels:['Parenting platforms','Hospital partnerships','Baby registries'],supportingSignals:['Birth records','Registry data','Insurance enrollment'],qualification:'Tier 3 — Life expansion event. Family plan opportunity but lower urgency.'},
    {rank:14,name:'Elderly Parent Care Transition',composite:3.3,axes:{compulsion:3,friction:4,intent:3,predictability:3,frequency:3,dataAccessibility:2},switchingType:'Expansion',telcoPain:['Managing parent plan','Accessibility needs','Remote monitoring'],emotionalState:'Concern + responsibility',windowType:'Extended (months)',peakIntent:'After health incident',seasonal:'Year-round',annualVolume:'5.5M transitions/year',overlapFlags:['Medical events','Housing changes'],interceptionChannels:['Elder care services','AARP','Medical providers'],supportingSignals:['Medicare data','Care facility records','Medical device purchases'],qualification:'Tier 3 — Growing demographic. Multi-line opportunity with accessibility features.'},
    {rank:15,name:'Incarceration Release',composite:3.2,axes:{compulsion:4,friction:5,intent:4,predictability:3,frequency:2,dataAccessibility:2},switchingType:'Forced',telcoPain:['No existing plan','Credit barriers','Digital re-entry'],emotionalState:'Hope + anxiety',windowType:'First 72 hours',peakIntent:'Day of release',seasonal:'Year-round',annualVolume:'600K releases/year',overlapFlags:['Housing search','Job search'],interceptionChannels:['Re-entry programs','Parole offices','Community organizations'],supportingSignals:['DOC release data','Parole records','Re-entry program partnerships'],qualification:'Tier 3 — Underserved market with high loyalty potential. Partnership with re-entry organizations key.'},
    {rank:16,name:'Cross-Country Relocation',composite:3.1,axes:{compulsion:3,friction:3,intent:3,predictability:3,frequency:3,dataAccessibility:3},switchingType:'Voluntary',telcoPain:['Coverage area change','Plan re-evaluation','New local needs'],emotionalState:'Excitement + logistics',windowType:'2-4 weeks',peakIntent:'Week of move',seasonal:'Summer peak (Jun-Aug)',annualVolume:'8.4M moves/year',overlapFlags:['Job change','Housing change'],interceptionChannels:['Moving companies','Real estate platforms','Utility services'],supportingSignals:['USPS address changes','Utility connects','Moving company data'],qualification:'Tier 3 — High volume but moderate intent. Coverage messaging is key differentiator.'},
    {rank:17,name:'Rural-to-Urban Migration',composite:3.0,axes:{compulsion:3,friction:3,intent:3,predictability:3,frequency:2,dataAccessibility:2},switchingType:'Voluntary',telcoPain:['Coverage expectation change','Plan upgrade needed','New use patterns'],emotionalState:'Adjustment',windowType:'First month',peakIntent:'First 2 weeks',seasonal:'Year-round',annualVolume:'2.1M moves/year',overlapFlags:['Job change','Education'],interceptionChannels:['Employment services','Housing platforms','Community organizations'],supportingSignals:['Address change data','Utility connections','Employment records'],qualification:'Tier 3 — Coverage upgrade opportunity. Urban plan features become relevant.'},
    {rank:18,name:'Gig Economy Entry',composite:2.9,axes:{compulsion:3,friction:2,intent:3,predictability:3,frequency:4,dataAccessibility:3},switchingType:'Expansion',telcoPain:['Need reliable mobile data','Multi-device for work','Cost vs. usage optimization'],emotionalState:'Entrepreneurial + cost-conscious',windowType:'First month',peakIntent:'First week of gig work',seasonal:'Year-round, slight Q1 peak',annualVolume:'12M gig workers (growing)',overlapFlags:['Job change','Side hustle start'],interceptionChannels:['Gig platforms','Freelancer communities','Rideshare driver groups'],supportingSignals:['Gig platform signup data','Tax filing changes','App download data'],qualification:'Tier 3 — Growing segment. Data-heavy plans with flexible pricing resonate.'},
    {rank:19,name:'Empty Nest Transition',composite:2.8,axes:{compulsion:2,friction:2,intent:3,predictability:4,frequency:3,dataAccessibility:3},switchingType:'Economic',telcoPain:['Oversized family plan','Cost optimization opportunity','Usage pattern change'],emotionalState:'Reflection + freedom',windowType:'Extended (6-12 months)',peakIntent:'Month after last child leaves',seasonal:'August-September',annualVolume:'2.8M households/year',overlapFlags:['Plan downsizing','Retirement planning'],interceptionChannels:['Parenting platforms','Travel services','Financial advisors'],supportingSignals:['Family plan changes','Address data','College enrollment of children'],qualification:'Tier 4 — Moderate intent but plan optimization opportunity. Right-sizing messaging.'},
    {rank:20,name:'Health Diagnosis / Chronic Condition',composite:2.7,axes:{compulsion:3,friction:3,intent:2,predictability:2,frequency:3,dataAccessibility:2},switchingType:'Need-based',telcoPain:['Telehealth needs','Medical device connectivity','Emergency communication'],emotionalState:'Fear + adaptation',windowType:'Extended (months)',peakIntent:'First month post-diagnosis',seasonal:'Year-round',annualVolume:'8M new chronic diagnoses/year',overlapFlags:['Insurance change','Lifestyle adaptation'],interceptionChannels:['Healthcare providers','Patient communities','Medical device companies'],supportingSignals:['Healthcare data (limited)','Medical device purchases','Support group membership'],qualification:'Tier 4 — Telehealth and connectivity features. Sensitivity required in messaging.'},
    {rank:21,name:'Foster Care Placement',composite:2.6,axes:{compulsion:4,friction:4,intent:3,predictability:2,frequency:2,dataAccessibility:2},switchingType:'Expansion',telcoPain:['Additional line needed quickly','Budget constraints','Safety/monitoring needs'],emotionalState:'Responsibility + urgency',windowType:'Immediate (days)',peakIntent:'Day of placement',seasonal:'Year-round',annualVolume:'250K placements/year',overlapFlags:['Family expansion','Social services'],interceptionChannels:['Foster care agencies','Social workers','Foster parent networks'],supportingSignals:['Foster care agency partnerships','Court records','Social service referrals'],qualification:'Tier 4 — Small but underserved. Social impact positioning.'},
    {rank:22,name:'Study Abroad Departure',composite:2.5,axes:{compulsion:3,friction:3,intent:3,predictability:5,frequency:2,dataAccessibility:4},switchingType:'Temporary',telcoPain:['International plan needed','Plan suspension vs. change','Return plan uncertainty'],emotionalState:'Excitement',windowType:'2-3 weeks before departure',peakIntent:'Week before departure',seasonal:'January + August',annualVolume:'350K students/year',overlapFlags:['College transition','International travel'],interceptionChannels:['University study abroad offices','Travel agencies','Student organizations'],supportingSignals:['University enrollment data','Visa applications','Travel booking data'],qualification:'Tier 4 — Small volume but highly predictable. International plan opportunity.'},
    {rank:23,name:'Seasonal Worker Arrival',composite:2.4,axes:{compulsion:3,friction:3,intent:3,predictability:4,frequency:3,dataAccessibility:2},switchingType:'Temporary',telcoPain:['Short-term plan needed','Potential language barrier','Cost sensitivity'],emotionalState:'Practical + budget-focused',windowType:'First week',peakIntent:'Day of arrival',seasonal:'Agricultural + tourism seasons',annualVolume:'800K H-2A/H-2B workers',overlapFlags:['Immigration','Rural location'],interceptionChannels:['Employer partnerships','Worker organizations','Community services'],supportingSignals:['Visa data','Employer records','Agricultural calendars'],qualification:'Tier 4 — Seasonal and temporary. Prepaid/flexible plans best fit.'},
    {rank:24,name:'Digital Nomad Transition',composite:2.3,axes:{compulsion:2,friction:2,intent:3,predictability:2,frequency:2,dataAccessibility:2},switchingType:'Voluntary',telcoPain:['International coverage needs','Data-heavy requirements','Multiple country support'],emotionalState:'Freedom + optimization',windowType:'Extended',peakIntent:'Month before departure',seasonal:'Year-round',annualVolume:'500K Americans (growing)',overlapFlags:['Job change','International move'],interceptionChannels:['Remote work communities','Travel platforms','Co-living spaces'],supportingSignals:['Travel booking data','Remote work platform usage','Co-living memberships'],qualification:'Tier 4 — Niche but growing. Premium international plans.'},
    {rank:25,name:'Pet Adoption',composite:2.2,axes:{compulsion:2,friction:1,intent:2,predictability:3,frequency:4,dataAccessibility:3},switchingType:'Expansion',telcoPain:['Pet camera/tracker connectivity','Smart home integration','Minimal direct plan impact'],emotionalState:'Joy + nesting',windowType:'First month',peakIntent:'First week',seasonal:'Holiday spikes',annualVolume:'6.5M adoptions/year',overlapFlags:['Life milestone','Smart home expansion'],interceptionChannels:['Shelter partnerships','Pet stores','Vet clinics'],supportingSignals:['Adoption records','Pet store purchases','Vet registration'],qualification:'Tier 4 — Weak direct telco connection but large volume. IoT/smart home angle.'}
  ];

  const macroTrends = [
    {id:'MT-01',name:'Pet Humanization Megatrend',signal:'Cultural',direction:'Accelerating',confidence:'95%',impact:'Structural'},
    {id:'MT-02',name:'Preventive Pet Healthcare Shift',signal:'Health',direction:'Growing',confidence:'88%',impact:'High'},
    {id:'MT-03',name:'DTC Pet Brand Proliferation',signal:'Market',direction:'Accelerating',confidence:'82%',impact:'High'},
    {id:'MT-04',name:'Pet Insurance Adoption Wave',signal:'Financial',direction:'Growing',confidence:'79%',impact:'Medium'},
    {id:'MT-05',name:'Clean Label Pet Products',signal:'Consumer',direction:'Accelerating',confidence:'85%',impact:'High'},
    {id:'MT-06',name:'Pet Tech Integration',signal:'Technology',direction:'Emerging',confidence:'72%',impact:'Medium'},
    {id:'MT-07',name:'Vet Telehealth Expansion',signal:'Health',direction:'Growing',confidence:'78%',impact:'Medium'},
    {id:'MT-08',name:'Pet Mental Health Awareness',signal:'Cultural',direction:'Emerging',confidence:'65%',impact:'Medium'}
  ];

  const microTrends = [
    {id:'MT-01',name:'Adaptogenic Pet Supplements',signal:'Product',velocity:'High',confidence:'78%',window:'12 months'},
    {id:'MT-02',name:'Pet DNA Testing Boom',signal:'Technology',velocity:'High',confidence:'82%',window:'18 months'},
    {id:'MT-03',name:'Raw/Fresh Pet Food Movement',signal:'Consumer',velocity:'Medium',confidence:'85%',window:'24+ months'},
    {id:'MT-04',name:'Pet CBD Regulation Clarity',signal:'Policy',velocity:'Medium',confidence:'60%',window:'6-12 months'},
    {id:'MT-05',name:'Pet Subscription Box Fatigue',signal:'Market',velocity:'High',confidence:'75%',window:'6 months'},
    {id:'MT-06',name:'Vet-Influencer Trust Economy',signal:'Social',velocity:'Very High',confidence:'80%',window:'12 months'},
    {id:'MT-07',name:'Pet Anxiety Treatment Market',signal:'Health',velocity:'High',confidence:'77%',window:'18 months'},
    {id:'MT-08',name:'Multi-Species Household Trend',signal:'Demographic',velocity:'Medium',confidence:'70%',window:'24+ months'}
  ];

  // ─── CONSTANTS ──────────────────────────────────────────────────────────────

  const PIPE_COLORS = { surge: '#e17055', micro: '#74b9ff', macro: '#a29bfe' };
  const PIPE_LABELS = { surge: 'Surge', micro: 'Micro', macro: 'Macro' };
  const AMBER = '#f0c27a';
  const GREEN = '#10b981';

  // ─── STATE ──────────────────────────────────────────────────────────────────

  let activeFilter = 'all';
  let activeSort = 'score';
  let activeContextTab = 'trigger';
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
  padding: 40px 0 60px;
}
.scene1 *, .scene1 *::before, .scene1 *::after { box-sizing: border-box; }

/* Header */
.s1-header { text-align: center; margin-bottom: 48px; }
.s1-header h2 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 42px; font-weight: 400; margin: 0 0 8px; color: #e2e2f0;
  letter-spacing: -0.5px;
}
.s1-header .s1-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; color: #737373; letter-spacing: 2px; text-transform: uppercase;
}

/* Filter Bar */
.s1-filterbar {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  margin-bottom: 32px; flex-wrap: wrap;
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

  // Header
  var header = document.createElement('div');
  header.className = 's1-header';
  header.innerHTML = '<h2>Persona Explorer</h2><div class="s1-subtitle">Pipeline Intelligence \u00b7 17 Personas</div>';
  container.appendChild(header);

  // Filter bar
  var filterBar = document.createElement('div');
  filterBar.className = 's1-filterbar';
  var filters = [
    { key: 'all', label: 'All', cls: '' },
    { key: 'surge', label: 'Surge', cls: 's1-pill--surge' },
    { key: 'micro', label: 'Micro', cls: 's1-pill--micro' },
    { key: 'macro', label: 'Macro', cls: 's1-pill--macro' }
  ];
  filters.forEach(function(f) {
    var pill = document.createElement('button');
    pill.className = 's1-pill ' + f.cls + (f.key === activeFilter ? ' s1-pill--active' : '');
    pill.textContent = f.label;
    pill.dataset.filter = f.key;
    pill.addEventListener('click', function() {
      activeFilter = f.key;
      renderFilters();
      renderGrid();
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
  container.appendChild(filterBar);

  // Context panels
  var contextSection = document.createElement('div');
  contextSection.className = 's1-context';

  var contextTabs = document.createElement('div');
  contextTabs.className = 's1-context-tabs';
  var tabs = [
    { key: 'trigger', label: 'Trigger Events' },
    { key: 'macro', label: 'Macro-Trends' },
    { key: 'micro', label: 'Micro-Trends' },
    { key: 'surge', label: 'Surge' }
  ];
  tabs.forEach(function(t) {
    var tab = document.createElement('div');
    tab.className = 's1-context-tab' + (t.key === activeContextTab ? ' s1-context-tab--active' : '');
    tab.textContent = t.label;
    tab.dataset.tab = t.key;
    tab.addEventListener('click', function() {
      activeContextTab = t.key;
      renderContextTabs();
      renderContextBody();
    });
    contextTabs.appendChild(tab);
  });
  contextSection.appendChild(contextTabs);

  var contextBody = document.createElement('div');
  contextBody.className = 's1-context-body';
  contextSection.appendChild(contextBody);
  container.appendChild(contextSection);

  // Grid
  var grid = document.createElement('div');
  grid.className = 's1-grid';
  container.appendChild(grid);

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

  container.appendChild(overlay);

  // ─── RENDER FUNCTIONS ───────────────────────────────────────────────────────

  function renderFilters() {
    var pills = filterBar.querySelectorAll('.s1-pill');
    pills.forEach(function(p) {
      p.classList.toggle('s1-pill--active', p.dataset.filter === activeFilter);
    });
  }

  function renderContextTabs() {
    var tabEls = contextTabs.querySelectorAll('.s1-context-tab');
    tabEls.forEach(function(t) {
      t.classList.toggle('s1-context-tab--active', t.dataset.tab === activeContextTab);
    });
  }

  function renderContextBody() {
    var html = '';
    if (activeContextTab === 'trigger') {
      html += '<div class="s1-trigger-header"><span>#</span><span>Event</span><span>Score</span><span>Type</span><span>Volume</span><span>Emotion</span></div>';
      triggerEvents.forEach(function(ev) {
        html += '<div class="s1-trigger-row">' +
          '<span class="s1-trigger-rank">' + ev.rank + '</span>' +
          '<span class="s1-trigger-name">' + esc(ev.name) + '</span>' +
          '<span class="s1-trigger-composite">' + ev.composite.toFixed(1) + '</span>' +
          '<span class="s1-trigger-type">' + esc(ev.switchingType) + '</span>' +
          '<span class="s1-trigger-vol">' + esc(ev.annualVolume) + '</span>' +
          '<span class="s1-trigger-emotion">' + esc(ev.emotionalState) + '</span>' +
          '</div>';
      });
    } else if (activeContextTab === 'macro') {
      html += '<div class="s1-trend-header"><span>ID</span><span>Trend</span><span>Signal</span><span>Confidence</span><span>Impact</span></div>';
      macroTrends.forEach(function(t) {
        html += '<div class="s1-trend-row">' +
          '<span class="s1-trend-id">' + esc(t.id) + '</span>' +
          '<span class="s1-trend-name">' + esc(t.name) + '</span>' +
          '<span class="s1-trend-signal">' + esc(t.signal) + '</span>' +
          '<span class="s1-trend-conf">' + esc(t.confidence) + '</span>' +
          '<span class="s1-trend-extra">' + esc(t.impact) + '</span>' +
          '</div>';
      });
    } else if (activeContextTab === 'micro') {
      html += '<div class="s1-trend-header"><span>ID</span><span>Trend</span><span>Signal</span><span>Confidence</span><span>Window</span></div>';
      microTrends.forEach(function(t) {
        html += '<div class="s1-trend-row">' +
          '<span class="s1-trend-id">' + esc(t.id) + '</span>' +
          '<span class="s1-trend-name">' + esc(t.name) + '</span>' +
          '<span class="s1-trend-signal">' + esc(t.signal) + '</span>' +
          '<span class="s1-trend-conf">' + esc(t.confidence) + '</span>' +
          '<span class="s1-trend-extra">' + esc(t.window) + '</span>' +
          '</div>';
      });
    } else if (activeContextTab === 'surge') {
      var surgePersonas = personas.filter(function(p) { return p.pipe === 'surge'; });
      html += '<div class="s1-surge-grid">';
      surgePersonas.forEach(function(p) {
        html += '<div class="s1-surge-card">' +
          '<h4>' + esc(p.name) + '</h4>' +
          '<div class="s1-surge-meta">' + esc(p.pop) + ' &middot; Score ' + p.score + ' &middot; Window: ' + esc(p.momentWindow) + '</div>' +
          '<p>' + esc(p.moment) + '</p>' +
          '</div>';
      });
      html += '</div>';
    }
    contextBody.innerHTML = html;
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

  // ─── INITIAL RENDER ─────────────────────────────────────────────────────────

  renderContextBody();
  renderGrid();
}
