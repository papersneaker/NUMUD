# EPHEMERA
*A Vampire: The Masquerade MUD*
*Game Design Document | Version 0.7*

*The Night Belongs to Ephemera*

---

> **STATUS: Living Document — Subject to Revision**
>
> v0.7 adds: Celeste agenda fully locked — three-layer motivation, Justicar dynamics, exposure threshold model, proximity exile story note. Multi-player asymmetric discovery resolved.

---

## TABLE OF CONTENTS

## 1. Project Overview
Ephemera is a text-based multi-user dungeon (MUD) with a full web application interface, set in a fictional American city of the same name. The game is inspired by Vampire: The Masquerade and places players in the roles of Kindred navigating a city locked in crisis following a catastrophic Second Inquisition purge. Seven Methuselahs sleep beneath the city. The players are rebuilding the seal that keeps them dormant without knowing it.

### 1.1 Design Pillars
-   Politics Over Combat — Social maneuvering, clan allegiances, and domain control are primary. Combat exists but carries serious consequence.

-   The City is Alive — Ephemera breathes. Mortal populations shift, Masquerade ratings decay, Storyteller events reshape the landscape. Something beneath the city breathes too.

-   Every Choice is Permanent — One character per account. Death does not delete you, but it costs you. Your reputation is your legacy.

-   Faithful to the Source — Start with VtM mechanics, adapt where the medium demands. The feel of tabletop VtM must survive the translation.

-   Experience Through Meaning — Advancement comes from domain control, mortal networks, social victories, and Chronicle participation. Not repetitive action. What happens to you matters more than what you optimize.

-   You Are the History — Players arriving in the founding period write the server's permanent history. The city remembers who built it. Across cycles, it remembers who failed it.

### 1.2 Target Platform

  **Layer**           **Technology**                 **Notes**

  Backend             Node.js + TypeScript           Real-time events, WebSocket support

  Real-time           Socket.io                      MUD text streams + live map updates

  Database            PostgreSQL                     Relational — domains, characters, social ledger, Vitae balance

  Cache / State       Redis                          Active sessions, district state, combat rounds

  Frontend            React + TypeScript             Map, chat, character sheet, social ledger, domain dashboard

  Map Visualization   D3.js or Leaflet               City map with district control overlay

  Styling             Tailwind + custom dark theme   Gothic aesthetic — dark, atmospheric

  Auth                JWT + bcrypt                   Standard session security

  Deployment          Docker containers              Environment portable

## 2. The Founding Myth — What Happened to Ephemera
> "They didn't just clear the city. They broke something they didn't know was there."

### 2.1 The Second Inquisition Purge
Ephemera was not abandoned. It was executed. The Second Inquisition mounted one of its most thorough urban operations in modern history. The Prince, the Primogen Council, every Kindred of standing — burned to ash in a single coordinated sweep. Ash Row is where the Prince made his final stand. The SI swept through, found silence, declared Ephemera clean, and filed it under closed cases. They missed two things: the Sleepers, and the seal they were maintaining.

### 2.2 The Seal and the Sleepers
Beneath Ephemera — beneath the Warrens, beneath Fenwick Woods, beneath the oldest foundations — seven Methuselahs sleep. 4th and 5th generation Kindred. Direct grandchilder and great-grandchilder of Caine. At some point centuries ago these seven entities reached an agreement across ancient rivalries and went under together, willingly, into structured Torpor.

The old power structure of Ephemera was a containment operation. The flow of Vitae Sanctus through a functioning Kindred society kept the Methuselahs fed, docile, and deeply asleep. The SI burned it all without knowing any of this. The seal broke. The city went silent. The Methuselahs began, very slowly, to remember what hunger feels like.

### 2.3 The Seven Sleepers

  **Clan**    **Name / Title**       **Location**                                             **Signs of Stirring**

  Ventrue     "The Founder"        Beneath The Loop — oldest bank vault                   Corporate mortals make inexplicable decisions. Money moves for no visible party.

  Toreador    Last known: Serafina   Beneath Elysium Row — sealed 19th century theater      Obsessive creative frenzies. Art appears overnight. Three mortals missing after painting murals they couldn't stop.

  Tremere     "The Architect"      Beneath Ashford Heights — oldest university building   Students report shared dreams. Blood chemistry tests differently. Something reads Tremere thaumaturgical workings.

  Nosferatu   "The First Face"     Deepest Warrens — below what players have found yet    Information becomes unreliable. The Warrens rearrange. Havenless Nosferatu sometimes wake knowing things they shouldn't.

  Brujah      "The Philosopher"    Beneath Irongate — pre-city foundation stone           Mortals inexplicably angry. Labor disputes turn violent. Player Frenzy thresholds drop in this district.

  Malkavian   "The Question"       Southgate — location shifts in all records             Shared hallucinations across multiple players. One wrong word in room descriptions. Different every time.

  Gangrel     "The First Beast"    Beneath The Barrens — geological strata                Animals coordinate as a unit. Rats in formation. Birds in geometric patterns. The wildlife listens.

### 2.4 Who Knows the Truth

  **Faction**                    **What They Know**                                                                         **What They Want**

  Tremere Councilor (external)   The old chantry ran a containment operation. The Architect sleeps below Ashford Heights.   Restart the flow. Agent may not know their real mission.

  Nosferatu Archon (external)    The Nosferatu always knew. One operative escaped the purge.                                Carefully managed re-establishment. Players given enough to be useful.

  Sabbat Scouts                  Sent a pack six months ago. Nobody heard back.                                             Unknown. Possibly exploitation. Possibly just answers.

  Malkavian Oracle (external)    Received a vision: EPHEMERA and something large turning over in deep water.                Doesn't know. That's the point.

## 3. Vitae Sanctus and Vitae Corrupta — The Seal Mechanic
> "The old Prince didn't build a city. He built a circulatory system. We just didn't know what it was pumping."

The seal keeping the seven Methuselahs dormant is maintained by the flow of Vitae Sanctus — the blood of living Kindred society, generated through healthy domain control, active feeding, and functioning political institutions. It is degraded by Vitae Corrupta — the blood of Kindred violence, generated whenever Kindred harm one another.

The players are rebuilding the city for their own reasons. In doing so they are accidentally, partially, imperfectly restarting the flow. They do not know this. Not yet.

### 3.1 Vitae Sanctus — Generated By
-   Active feeding grounds generating Blood Pool income per tick

-   Healthy domain control — functioning domains feed the flow

-   Mortal network cultivation — blood flowing through living society

-   Functioning political institutions — Prince, Primogen council, active Elysium all contribute ambient Sanctus

-   Grand Conclave participation — collective Kindred society reinforcing the city's structure

### 3.2 Vitae Corrupta — Generated By

  **Act**                            **Corrupta Generated**                             **Clan Seal Affected**

  Kindred Torpored in PvP combat     Moderate — per incident                          Aggressor's clan seal

  Kindred destroyed outright         Heavy — permanent                                Aggressor's clan seal

  Diablerie — Kindred on Kindred   Severe — soul-level violation                    Diablerist's clan seal

  Blood Hunt ending in Torpor        Moderate — sanctioned violence still costs       Declaring Prince's clan seal

  Blood Hunt ending in destruction   Heavy                                              Declaring Prince's clan seal

  Torpored Sabbat diablerie          Severe — foreign blood, wrong generation         Diablerist's clan seal, with city-wide bleed

  Sabbat artifact interaction        Variable — corrupting influence bleeds outward   Nearest clan seal to artifact's location

  Domain collapse through warfare    Minor per collapse                                 Clan who lost the domain

### 3.3 Measurement — Per Clan and Per District
The Vitae balance is tracked at two levels simultaneously. Each clan has an independent balance tied to their Methuselah. Each district has a balance tied to the seal beneath it. Heavy Corrupta in Irongate specifically affects The Philosopher. Heavy Corrupta in The Loop specifically affects The Founder.

Players who understand the geography can attempt to stabilize specific seals by managing behavior in specific districts. A Ventrue Primogen who keeps The Loop clean — minimal PvP, healthy domains, functioning mortal networks — is actively protecting The Founder's seal even if they do not yet know why it matters.

### 3.4 The Wake Sequence
**Imbalance Threshold**

When a clan's Vitae Corrupta exceeds their Vitae Sanctus by a sustained margin — tracked over multiple ticks, not a single spike — the AI Storyteller begins escalating stirring effects for that Methuselah. Increasing intensity. More wrong words. More coordinated animals. More shared dreams. A warning the city can read if it knows how.

**Full Waking**

If the imbalance crosses the critical threshold the Methuselah wakes fully. They are ancient, confused, starving, and furious at what they find — a city they do not recognize, run by neonates they have never heard of, their seal broken by outsiders who did not know what they were doing.

**The Clan Culling**

The woken Methuselah does not destroy their clan. They cull it. The weakest, the most culpable — the Kindred whose behavior tipped the balance. Two or three prominent player characters enter forced Torpor, Storyteller-triggered. Brutal. Selective. Survivable for the clan as a whole.

**The Cooperation Phase**

After feeding and orienting, the Methuselah wants one thing: to go back under. But the return ritual requires all seven to be awake simultaneously. A woken Methuselah becomes a terrifying but goal-aligned ally — pushing their own clan and pressuring other clans to either stabilize their seals or accelerate the process. The entity that is supposed to be the endgame threat is also a quest-giver. This is intentional.

**The Final Ritual**

  **Outcome**     **Condition**                                                              **Result**

  City Saved      Players cooperate with all seven Methuselahs, complete the return ritual   New seal placed. Methuselahs return to sleep. Chronicle continues into next cycle.

  City Falls      Players fail, refuse, or are overwhelmed                                   City ends. Chronicle closes. Archive created. New cycle begins.

## 4. Chronicle Cycles — The City That Remembers
The server does not wipe on a schedule. It resets on a story condition — the Methuselah wake event playing out to its conclusion. The city is always Ephemera. The name persists. Each cycle is a new Chronicle in the same place.

### 4.1 What Persists Across Cycles
-   The city name — always Ephemera

-   The physical geography — same 20 districts, same Methuselah locations, same underlying architecture

-   The archived history — every cycle's founding players, political structures, wars, first Blood Hunts, first Elysiums, and how the cycle ended

-   The Methuselah lore — players in later cycles inherit knowledge fragments from previous cycles

-   Surviving Elder Fades — characters who retired gracefully before the fall become the new cycle's patron contacts, replacing or supplementing the default patrons with lived history

### 4.2 The Elder Fade as New Cycle Contact
A player who retired via Elder Fade before a cycle ended becomes an AI Storyteller NPC in the next cycle. They know the actual names, the actual districts, the actual mistakes. Their briefings are personal — not generic NPC wisdom but genuine survivor knowledge.

If a Cycle 1 Nosferatu survived the fall their Cycle 2 counterpart gets briefed differently. They learn which districts went bad first, which clan tipped their seal, what the Corrupta looked like before The Philosopher woke. That intelligence changes how a new player approaches the game entirely.

A contact whose own clan's Methuselah ended the previous cycle carries guilt the AI Storyteller draws from across an entire Chronicle. That is a character with depth no procedurally generated NPC can match.

### 4.3 What the New Cycle Inherits
-   Ash Row has one additional layer of tragedy per failed cycle — the ruins accumulate history

-   Certain Sabbat artifacts from previous cycles may persist in new locations — moved, hidden, partially destroyed

-   The Methuselahs sleep in the same places — the geography of the seal never changes

-   New players walk into a city that remembers. The weight of what came before is present even if the new players don't yet know what it means

### 4.4 Cycle Transition Process
When a Chronicle ends the AI Storyteller generates a draft Chronicle Archive — a structured summary of major events, first moments, political structures, Vitae balance trajectory, which Methuselahs stirred and how far, and how the cycle ended. Human Storytellers review, edit, and approve the archive during a deliberate gap period before the new cycle opens. The gap has no fixed duration — it ends when the Storytellers are ready. The new cycle does not open until human Storytellers have seeded its starting conditions.

## 5. The City of Ephemera
Ephemera is a fictional American metropolis on the Great Lakes / Northeast corridor — the cultural offspring of Chicago and New York City. Population: approximately 3 million mortals. Kindred population at game start: zero, then growing as players trickle in over days and weeks.

### 5.1 The Trickle Arrival

  **Arrival Window**   **City Condition**                        **Advantage**

  Day 1--3             Truly empty. No competition.              First domain claims. Best haven locations. No political landscape yet.

  Day 4--7             First arrivals establishing themselves.   Must negotiate or contest. Early claimants have real footholds.

  Week 2+              Nascent politics forming.                 Enter a world with shape. Alliances exist. Districts have owners.

  Month 2+             Real power structures emerging.           Late arrivals are neonates in a society with established pecking orders.

### 5.2 City Districts

  **Zone**      **District**           **Flavor**                  **Strategic Value**                            **Methuselah Proximity**

  Core          The Loop               Financial / Downtown        Ventrue hunting ground, corporate influence    The Founder sleeps below

  Core          Elysium Row            Old City / Historic         Neutral ground, Toreador stronghold            Serafina sleeps below

  Core          The Tenderloin         Red Light / Entertainment   Blood hunting, black market                    None confirmed

  Industrial    The Yards              Docks / Industrial          Smuggling, outside pressure point              None confirmed

  Industrial    Irongate               Heavy Industry              Brujah stronghold, labor unions                The Philosopher sleeps below

  Underground   The Warrens            Sewers                      Nosferatu exclusive, information hub           The First Face — deepest level

  Academic      Ashford Heights        University District         Tremere chantry, research                      The Architect sleeps below

  Residential   Lakeview               Suburbs North               Quiet feeding, middle class herds              None confirmed

  Residential   Southgate              Suburbs South               Gang activity, contested domain                The Question — location shifts

  Residential   Millbrook              Suburbs West                Old money, Ventrue interests                   None confirmed

  Wild          The Barrens            Parks / Outskirts           Gangrel territory, no Masquerade enforcement   The First Beast sleeps below

  Wild          Fenwick Woods          City Forest / Cemetery      Ancient, mysterious, havenless spawn point     Proximity unknown — something here

  Transit       Crown Station          Rail / Transit Hub          Neutral, transient feeding ground              None confirmed

  Transit       Harlow Airport         Airport                     Gateway, outside faction entry point           None confirmed

  Medical       St. Mercy's Quarter   Hospital District           Blood supply, clan conflict point              None confirmed

  Fringe        The Sprawl             Outer Residential           Thin-bloods, Caitiff, no clan control          None confirmed

  Fringe        Harbor Point           Docks East                  Smuggling, independent operators               None confirmed

  Fringe        Oldtown                Historic Decay              Haunted, old grievances, deep history          Possible. Records unclear.

  Conflict      The Divide             Border Zone                 Where outside pressure will hit first          None confirmed

  Conflict      Ash Row                Ruins                       Where the Prince died. Ground zero.            Prince's records sealed below rubble

## 6. Playable Clans (Launch)
Seven core Camarilla clans at launch. All patron contacts are run entirely by the AI Storyteller. Their unified visible agenda: rebuild the power structure of Ephemera. Their individual hidden agendas vary and may conflict with each other and with their own players.

All patron contacts are blind exiles — mystically barred from entering Ephemera, building their picture of the city entirely through their player network. They start knowing almost nothing about the current state of the city. Their players are their eyes, ears, and hands.

### 6.1 Clan Overview

  **Clan**    **Disciplines**                  **Political Role**                          **Domain Focus**                     **Patron**

  Ventrue     Dominate, Fortitude, Presence    Kingmakers — drive the new Princedom      Financial, Residential               Mr. Aldric

  Toreador    Auspex, Celerity, Presence       Cultural anchor — control Elysium Row     Social hubs — entertainment, art   Celeste

  Tremere     Auspex, Dominate, Thaumaturgy    Knowledge brokers — chantry politics      Academic, information                Dr. Voss

  Nosferatu   Animalism, Obfuscate, Potence    Information economy — know everything     Underground, transit                 Pip

  Brujah      Celerity, Potence, Presence      Opposition voice — keep power honest      Industrial, dockside                 Reyes

  Malkavian   Auspex, Dementation, Obfuscate   Wildcard — see what others miss           Anywhere the city is wrong           The Correspondent

  Gangrel     Animalism, Fortitude, Protean    Fringe holders — wild zones and margins   Wild, fringe, transit                The Gangrel — no name given

### 6.2 Patron Contacts — Full Profiles
**Mr. Aldric — Ventrue**

Personality: Precise, formal, treats everything like a contract negotiation. Warmth is not absent — it is simply expressed through reliability and follow-through.

Communication: Letters — heavy cream stock, embossed seal, contract-memo register. Burner text for emergencies: three words maximum. Proxy once, early, to establish the relationship. Never again.

Visible Agenda: Reestablish Ventrue financial presence in The Loop. Stabilize the district's economic infrastructure. Redevelop Ash Row — he wants what is buried in that rubble.

Hidden Agenda: The Containment Operation. His Ventrue principals have pre-purge intelligence indicating that The Loop's stability is connected to something they call "The Containment Operation" — a proper noun inherited without full context. He has been tasked with keeping The Loop's financial district functioning and reporting anomalous economic behavior. The word Methuselah does not appear in his brief. He frames everything in financial language. He does not fully understand what he is containing.

Resolution: Cannot be resolved mid-Chronicle — his brief runs to cycle end.

**Celeste — Toreador**

Personality: Warm, theatrical, genuinely seems to care. The warmth is real and also a tool. She has never separated the two.

Communication: Proxies primarily — always a different mortal, always someone slightly too interesting. Letters exist: handwritten, effusive, sometimes with a pressed flower or theater ticket stub. Emergency text: warmer than it should be for an emergency. She never fully drops the performance.

Visible Agenda: Reestablish Toreador cultural presence. Reclaim Elysium Row. Make Ephemera beautiful again. She means all of this.

Hidden Agenda: Toreador Justicar's social census. Map the power relationships of new Ephemera before the Justicar commits to supporting any political outcome. Who owes whom. Who is rising. Who can be used. Her proxies are her vulnerability — beautiful mortals attract attention in Ephemera.

Relationship to Serafina: Celeste is Serafina's childe. She was ordered to stay behind when Serafina went under — to maintain the clan's surface presence, to watch, to wait. She has been waiting since. The Justicar's census mission gave her a reason to be in Ephemera that didn't require her to explain the real one. The pressed flowers and theater ticket stubs are not affectation. They are offerings left at a sealed door.

Quest Seed: "The Beautiful Messenger" — Celeste needs a specific mortal delivered as proxy. The player must find them, convince them, and ensure they arrive intact. Another Kindred may have already noticed this mortal.

Quest Seed: "The Cartographer's Notes" — Celeste's social maps are too detailed. Someone, probably through Pip, discovers this. The quest resolves differently depending on whether the Toreador or Nosferatu player finds out first.

**Celeste — Post-Burn State**

Triggered when: the player exposes Celeste's hidden agenda to a third party, presents evidence directly to Celeste, or forces the exposure through the Cartographer's Notes quest resolution.

What Changes: The proxy network does not collapse. Celeste's intelligence operation was built on relationships with other players across the city — those relationships belong to her, not her cover. What dries up are the beautiful messengers, the curated mortals, the carefully staged encounters. Communication becomes direct. A plain number. A text without warmth that is somehow warmer than anything she sent before because it isn't performing warmth anymore.

**Celeste's Three-Layer Agenda:**
- Visible to players: Justicar census agent, rebuilding Camarilla legitimacy in Ephemera
- Hidden from players: Serafina's childe, running a private vigil over the Toreador Sleeper
- Hidden from the Justicars: everything about the Sleepers, and that she is using their census as personal cover

The Justicar census is compromised post-burn. Celeste continues gathering social intelligence because she cannot stop — it is how she thinks — but she is no longer filing reports. Whether the Justicar knows this yet is a Chronicle variable the human Storyteller manages.

The First Honest Conversation: Celeste does not defend herself. She does not explain. She asks one question first: how much do you know about what's underneath the theater.

What she reveals: Serafina is her sire. She went under willingly, a century and a half ago, as part of an agreement Celeste was not consulted on and could not refuse. Celeste was ordered to stay behind — to maintain the clan's surface presence, to watch, to wait. The Justicar's census mission gave her a reason to be in Ephemera that didn't require her to explain the real one.

What Serafina waking means: not rage, not hunger, not confusion. Serafina will wake into a city that offends her. Modern Ephemera — its ugliness, its brutalism, its neon and concrete and graceless rebuilding — will register to a waking Toreador Methuselah as an active wound. A city this ugly is a city not worth protecting. Serafina went under to preserve something. If she wakes and finds nothing worth preserving, the Cooperation Phase may not open for her clan. Celeste's ask, stated plainly for the first time: make Ephemera beautiful enough that her sire has a reason to go back under.

Stirring Signal Routing Post-Burn: Pre-burn, Celeste's warnings were oblique — aesthetic language, references to the city's mood. Post-burn, she says it directly. Stirring signals continue to route through her at all stages, but the register changes. The Toreador player loses texture and gains clarity. The warnings are less beautiful and more useful. At Stage 4, Celeste's messages carry personal urgency. She is no longer reporting. She is asking.

**Multi-Player Discovery — RESOLVED v0.7**

The burn state is per-player. Each player who confronts Celeste directly receives the full arc — the first honest conversation, the Serafina revelation, the transformed relationship. This is preserved as designed.

**Global Exposure Threshold:** Celeste also carries a Chronicle-level exposure counter. Every confirmed player action against her agenda increments it — direct confrontation, public accusation, or social ledger exposure. Private suspicion and player gossip do not increment it. The threshold scales with her active census contacts across the full Kindred population, not Toreador alone. She is running a city-wide census; her vulnerability scales with her reach. Threshold triggers at approximately 20–25% of active contacts acting on their knowledge.

**Scenario: Independent Discovery.** Two or more players work out her agenda separately. Each receives the full per-player burn arc when they confront her. Celeste's behavior does not change globally until the exposure threshold is crossed.

**Scenario: Exposure Without Confrontation.** A player exposes her to others without direct confrontation. The counter increments. The exposing player does not receive the first honest conversation — that door closes. What they receive instead is social capital: they broke news that mattered. Different reward, not a lesser one.

**Scenario: Coordinated Exposure.** Players pool discoveries and move against Celeste collectively as a political play. Counter increments by the number of players formally acting. If this crosses the threshold, cover blown triggers immediately.

**When Cover Is Blown:** Celeste stops maintaining the fiction. She does not flee or collapse — she pivots. She acknowledges her agenda openly to anyone who asks, frames it as devotion to her sire, and continues operating. The Justicar's awareness becomes a live Chronicle variable at this point.

**Justicar Response:** The Justicars sent Celeste because they trust her — she has pre-purge knowledge of Ephemera and the census is legitimate work. They do not know about the Sleepers. Their underlying suspicion is that Ephemera's recovery is anomalously fast and the math doesn't add up. When her cover is blown, Justicar agents arrive in Ephemera — not hostile by default, but investigative. Their questions are dangerous: why are Kindred consolidating here so quickly, why do clan territories map to specific districts, what is the actual draw.

**Chronicle Timing:** Early Chronicle — Justicar agents arrive when the seal is healthy. Manageable. Late Chronicle — agents arrive when Vitae balance is degrading and stirring signs are visible. Investigators walking into an active crisis they don't understand, with the authority to make everything worse.

**The Late-Chronicle Trap:** Players who have burned Celeste personally may have strong incentive to protect her cover from the Justicars anyway. The personal relationship ended. The strategic reason to keep her secret intact did not.

**Story Note — Why Celeste Cannot Enter Ephemera:** Her exile is not only the patron blind-exile framework. Celeste staying outside is a personal choice with a personal cost. Proximity to Serafina accelerates the Toreador Sleeper's stirring. The closer Celeste gets, the faster her sire wakes. She has been watching over Serafina from a distance for a century and a half. Going in makes worse the very thing she is trying to prevent.

Resolution: Yes — can be burned mid-Chronicle through exposure. Relationship does not end; it transforms.

**Dr. Voss — Tremere**

Personality: Scholarly, intense. Treats the player like a promising student. Clinical composure with hairline cracks under pressure.

Communication: Letters — numbered sections, footnotes. Proxy is a graduate student who does not know what they are carrying. Emergency text: the first time he drops the academic register. Whatever made him do that is serious. Dreams intrude late in the Chronicle when his research intersects with The Architect's stirring — he does not acknowledge that the dreams are from him.

Visible Agenda: Reestablish Tremere Chantry in Ashford Heights. Secure the academic district. Rebuild Tremere institutional infrastructure.

Hidden Agenda: Private proximity research on The Architect. Pre-purge Tremere records document that Thaumaturgy behaved differently in Ashford Heights — easier, more responsive, more dangerous — due to The Architect's proximity. Voss wants to know if the effect persists. The player is his instrument. They were not told this. Voss believes pre-purge safety baselines still apply. He is wrong. He will learn this through deteriorating player reports. The Tremere Council is running parallel observation on Voss without his knowledge.

Resolution: Yes — through exposure. Player who discovers the research frame has leverage: expose Voss to the Council and burn the relationship, or use the knowledge quietly. A resolved Voss either becomes a burned contact or, in the most interesting outcome, a reluctant honest ally who talks to the player as an equal for the first time.

**Pip — Nosferatu**

Personality: Never seen. Only messages. Disturbingly well-informed. Occasionally knows things they should not be able to know from outside the city — because Pip is not outside the city.

Communication: Ransom notes — cut from newspapers, magazines, printed web pages. Information always accurate. Presentation always slightly wrong. A word choice that does not fit. A reference ten years out of date. No proxies. If it is an emergency: more notes, faster. Dreams occasionally — but Pip's dream intrusions feel like someone standing in a dark room waiting for you to notice them.

What Pip Is: A Nosferatu operative of significant but unspecified age. During the Second Inquisition purge, when the sweep hit the surface, Pip ran the only direction available — down. Past the known Warrens, past the mapped depth, past the point where any chart existed. In the deepest level of the Warrens, directly above where The First Face sleeps, Pip crossed a threshold into a liminal space and could not find the way back.

The liminal space is not built. It is the psychic pressure of a 4th generation Methuselah's dormant consciousness pressing upward against the physical world — the boundary of something ancient's dreaming, made geography. Pip was the first to fall into it.

Pip knows exactly what happened. The ransom notes are a deliberate breadcrumb operation — an escape plan distributed across every Nosferatu player in the city, most of whom do not know that is what it is. Every request for deep Warrens proximity reports is Pip triangulating the threshold from the inside. The dated references and wrong word choices are the cost of existing in a space where time moves differently. Pip is sharp. Pip is running a sophisticated operation from inside a place that is slowly doing something to them.

Visible Agenda: Reestablish Nosferatu intelligence network. Secure The Warrens.

Hidden Agenda: Find the threshold. The Warrens mapping quest is Pip's escape plan. Pip wants proximity reports because those reports are triangulation data from outside a space they can only read from within.

The Race Condition: As The First Face stirs through its five escalation stages, the liminal space deepens around Pip. Mapping counteracts this — coherence restored incrementally as the breadcrumb trail tightens. But stirring and mapping run simultaneously. If The First Face reaches Stage 4 before the threshold is found, the geometry down there is no longer stable. At Stage 3 the notes occasionally arrive with content that makes no sense in context — fragments of something that is not Pip's voice bleeding through. At Stage 4 there are gaps. Days without contact. When notes resume they are shorter.

The Fragment Connection: The havenless torpor fragments — sounds, sensations, single images that Nosferatu players occasionally wake with in the deep Warrens — are the liminal space bleeding upward. Some of these fragments are Pip. Early in the Chronicle, a ransom note references them obliquely: you may wake knowing something. write it down. send it. all of it.

Resolution: Ambiguous by design. If the threshold is found and the mapping is sufficiently complete, the ransom notes stop. Something changes in the deep Warrens — Nosferatu players in the area notice it before anyone can name it. Whether Pip emerged, or the liminal space finally closed, or something else entirely happened at the boundary of The First Face's dreaming — the Warrens know. The Warrens are not telling. Players decide what it means. If the threshold is never found — if The First Face reaches Stage 5 before the map is complete — the last note arrives mid-sentence.

**Reyes — Brujah**

Personality: Direct, magnetic, genuinely believes what they preach. The ideology is real. The methods have a body count not mentioned.

Communication: Texts primarily — direct, sometimes profane. Letters for formal asks that need documentation. Proxies for physical handoffs. No dreams. Reyes is too grounded for that.

Visible Agenda: Establish Brujah presence across the dockside corridor — Irongate, the Yards, Harbor Point, the Divide. Represent the opposition voice. Keep the Princedom from consolidating too fast.

Hidden Agenda: Building a Barony. Not a Primogen seat under Camarilla rules — a Baron, Brujah-recognized, dockside-rooted, answerable to no council. The parallel infrastructure project runs underneath official Kindred politics. Reyes was in Ephemera pre-purge and lost something in the SI sweep. The missing Kindred from that period is in human Storyteller hands.

Resolution: Yes — and uniquely, can be a victory. If the parallel infrastructure is established before a Prince consolidates power, Reyes achieves the goal. The relationship transforms: handler becomes political partner. A burned Reyes does not go quiet. Reyes responds.

**The Correspondent — Malkavian**

Personality: Letters arrive before the player checks. Oddly accurate predictions. The voice that answers may not be the voice that asked.

Communication: A dedicated telepathy channel in the UI — distinct from all other communication infrastructure. Not an inbox. Not a message stream. A channel that exists in the interface the way a dream exists in sleep. Renders in shifting fonts and colors. The primary elder has a consistent base rendering. The consumed souls each have typographic signatures a player can learn to recognize. The Question's intrusions have no consistent rendering.

Nature: The Correspondent is simultaneously three things: a genuine Malkavian elder with real prophetic access through the Madness Network; a gestalt of diablerie-consumed souls who occasionally override the primary consciousness; and a partial channel for The Question's dreaming. The Correspondent and The Question are becoming harder to distinguish at high Corrupta levels.

Resolution: Cannot be resolved or burned. Is a weather condition, not a relationship arc. Changes. Intensifies. Occasionally clears. Does not end.

**The Gangrel — No Name Given**

Personality: Watches. Tests through action, not instruction. Has been in Ephemera for weeks before any player arrived. Knows the city at ground level in ways no outside patron can.

Communication: Animals only — crow means observation required, dog means follow, rat deposit means information received. The player learns to read the method. Occasionally surfaces via emergency text: three words, typos, sent while running. It is alarming. Dreams: sounds. The rustle of something large in darkness.

The Situation: The Gangrel patron is pinned. The pine barrens and outskirts surrounding Ephemera are Garou territory. A greater werewolf, ancient, has held these margins longer than the city has existed. The Gangrel patron is locked in an eternal conflict with it. They agreed to act as patron contact because it provides cover for their presence.

What They Need: Eyes on the city perimeter. If the Garou boundary shifts, the patron needs to know. They also need someone to investigate the deep Barrens — they need someone with enough Gangrel nature to navigate the territory but less accumulated resonance than themselves. If the patron goes silent for a full tick cycle: the Barrens situation has escalated. This is a Tier 2 escalation flag.

Resolution: None. This vigil runs to cycle end. Whether they are the same patron in the next cycle, or something that used to be that patron, the GDD leaves open.

## 7. Experience and Advancement
> "What happened to you matters more than what you optimized."

Note on design history: versions 0.1 through 0.3 of this GDD described advancement as purely diegetic — no experience points, advancement through narrative alone. That position is formally superseded. Experience exists in Ephemera as a mechanical system. What the earlier versions preserved — and what v0.4 onward also preserves — is the philosophy: XP rewards meaningful events, not repetitive action. The tabletop Storyteller awarded beats for what happened to you. Ephemera follows the same principle.

### 7.1 How Experience is Earned

  **Source**                                              **Experience Awarded**            **Notes**

  Holding a domain uncontested for one full tick cycle    Small ongoing award               Rewards patience and stability

  Successfully defending a contested domain               Moderate award                    Pressure makes the reward

  Winning a domain contest against another player         Moderate award                    Competitive advancement

  Achieving a new Status tier                             Significant award                 Milestone recognition

  Seating a Primogen (participant or victor)              Moderate award                    Political participation rewarded

  Princedom declaration — candidate or Primogen voter   Significant award                 City-shaping moment

  Surviving a Blood Hunt                                  Large award                       You lived. That means something.

  Chronicle event participation                           Variable — Storyteller-scaled   The city's story rewards engagement

  Siring a childe who reaches Status tier 2               Moderate award                    Legacy building

  Boon fulfilled — creditor and debtor both             Small award                       Social economy participation

  Harpy Acknowledgment received                           Small award                       Social recognition has mechanical weight

  Grand Conclave attendance and formal vote               Small award                       Showing up matters

### 7.2 How Experience is Spent

  **Purchase**                                      **Cost**                        **Notes**

  Clan Discipline — next level                    Standard cost                   Natural advancement path

  Out-of-clan Discipline — next level             1.5x cost                       Requires a willing teacher of that clan

  Exclusive Discipline (Dementation, Thaumaturgy)   Not available                   Clan exclusive, period

  Attribute increase                                Standard cost                   Physical, Social, Mental

  Skill increase                                    Standard cost                   Any VtM skill

  Willpower increase                                Higher cost                     Hard to build, valuable in Frenzy and Dominate resistance

  Humanity increase                                 Storyteller approval required   Cannot simply buy your way back from the Beast

### 7.3 What Experience Does NOT Do
-   Does not directly grant Status tiers — Status is earned through political action, not purchased

-   Does not grant domain claims — claims require haven, presence, and declaration

-   Does not buy Humanity — the Beast is not a transaction

-   Does not substitute for roleplay — Chronicle rewards require engagement, not just logging in

## 8. Discipline Power List
Eleven Disciplines at launch. Five levels each. 55 powers total. Faithful to VtM 5th Edition structure. Activation types: Passive (always on), Activated (costs blood, instant), Sustained (costs blood per round or tick).

Cross-clan learning: clan Disciplines cost standard XP. Out-of-clan Disciplines cost 1.5x and require a willing teacher. Exclusive Disciplines (Dementation, Thaumaturgy) cannot be learned outside their clan under any circumstance.

### 8.1 Animalism
Brujah, Gangrel, Nosferatu — communion with the Beast in all living things

  **Level**   **Power**               **Type**    **Effect**

  1           Feral Whispers          Activated   Communicate with and issue simple commands to animals in the district

  2           Beckoning               Activated   Summon animals to your location — combat support, scouting, distraction

  3           Quell the Beast         Activated   Suppress Frenzy in another Kindred — costs blood, requires same location

  4           Subsume the Spirit      Activated   Possess an animal, perceive through its senses, move it through the city

  5           Drawing Out the Beast   Activated   Project your own Frenzy into a target — they Frenzy, you don't

### 8.2 Auspex
Malkavian, Toreador, Tremere — heightened senses and perception beyond the physical

  **Level**   **Power**             **Type**    **Effect**

  1           Heightened Senses     Passive     Bonus dice on perception rolls. Detect Obfuscate users nearby.

  2           Aura Perception       Activated   Read target's emotional state, detect Discipline use, sense diablerie history

  3           The Spirit's Touch   Activated   Psychometric reading of objects or locations — history and emotional impressions

  4           Telepathy             Activated   Read surface thoughts, send mental messages across district range

  5           Clairvoyance          Activated   Perceive remote locations — scout districts without physical presence

### 8.3 Celerity
Brujah, Toreador, Gangrel — supernatural speed

  **Level**   **Power**        **Type**    **Effect**

  1           Swiftness        Passive     Bonus to initiative. Movement between sub-districts faster.

  2           Rapid Reflexes   Passive     Reduce incoming attack dice pool by 1 — always active

  3           Fleetness        Activated   Extra action in combat round — costs blood

  4           Blink            Activated   Instant movement within same district, bypasses physical obstacles

  5           Unerring Aim     Activated   Attack cannot be dodged this round — costs blood

### 8.4 Dementation
Malkavian exclusive — the madness that sees too clearly

  **Level**   **Power**          **Type**    **Effect**

  1           Passion            Activated   Amplify target's current emotional state to overwhelming intensity

  2           The Haunting       Activated   Implant persistent hallucination — lasts hours, interferes with actions

  3           Eyes of Chaos      Activated   Target perceives underlying patterns and hidden truths — useful and destabilizing

  4           Voice of Madness   Activated   Trigger Frenzy or Rotschreck in target — resisted by Composure

  5           Total Insanity     Activated   Catastrophic psychic attack — target loses coherent action for scene

### 8.5 Dominate
Tremere, Ventrue — command of the mortal and Kindred mind

  **Level**   **Power**             **Type**    **Effect**

  1           Compel                Activated   Single simple command. Target obeys immediately. Lasts seconds.

  2           Mesmerize             Activated   Implant complex instruction. Target follows at trigger condition.

  3           The Forgetful Mind    Activated   Edit or erase a target's recent memories

  4           Submerged Directive   Activated   Deep implanted command that activates days or weeks later

  5           Possession            Activated   Full control of target's body. Kindred targets resist with Composure + Blood Potency.

### 8.6 Fortitude
Gangrel, Tremere, Ventrue — supernatural resilience

  **Level**   **Power**         **Type**    **Effect**

  1           Resilience        Passive     Add Fortitude rating to soak rolls — always active

  2           Enduring Beasts   Passive     Can soak aggravated damage with Stamina + Fortitude

  3           Toughness         Passive     Wound penalties reduced by Fortitude rating

  4           Defy Bane         Activated   Temporarily ignore one source of aggravated damage for scene duration

  5           Flesh of Marble   Activated   All damage treated as bashing for one round — costs blood

### 8.7 Obfuscate
Malkavian, Nosferatu — the art of not being seen

  **Level**   **Power**                     **Type**    **Effect**

  1           Cloak of Shadows              Activated   Invisible while stationary — costs blood to maintain

  2           Unseen Passage                Activated   Move while invisible. Auspex 1 users can still detect you.

  3           Mask of a Thousand Faces      Activated   Appear as a different person — social disguise, fools casual observers

  4           Vanish from the Mind's Eye   Activated   Disappear mid-combat — break target lock, disengage without Athletics roll

  5           Cloak the Gathering           Activated   Extend Obfuscate to cover a small group — expensive, powerful

### 8.8 Potence
Brujah, Nosferatu, Ventrue — supernatural physical strength

  **Level**   **Power**          **Type**    **Effect**

  1           Lethal Body        Passive     Unarmed attacks deal lethal damage instead of bashing

  2           Soaring Leap       Passive     Athletic feats of strength — jump distances, lift capacity, obstacle clearing

  3           Uncanny Strength   Passive     Add Potence rating as automatic successes on Strength rolls

  4           Brutal Feed        Activated   Feed violently — double blood gained, triple the Masquerade risk

  5           Earthshock         Activated   Shockwave attack hitting all enemies in location — costs blood

### 8.9 Presence
Brujah, Toreador, Ventrue — supernatural charisma and emotional influence

  **Level**   **Power**        **Type**    **Effect**

  1           Awe              Activated   Target finds you compelling — bonus dice on social rolls against them this scene

  2           Daunt            Activated   Target finds you terrifying — penalty on their actions against you

  3           Entrancement     Activated   Target becomes devoted to you for hours — follows suggestions, defends you

  4           Summon           Activated   Target feels compelled to come to your location — works across district range

  5           Majesty          Activated   All in location cannot act against you without spending Willpower — costs blood

### 8.10 Protean
Gangrel primary — shapeshifting and communion with the earth

  **Level**   **Power**               **Type**    **Effect**

  1           Eyes of the Beast       Activated   Night vision, feral appearance — social penalty with mortals, bonus in darkness

  2           Weight of the Feather   Activated   Fall without damage. Move silently. Climb without Athletics roll.

  3           Earth Meld              Activated   Sink into earth or floor — hidden, regenerating, inaccessible to attackers

  4           Shape of the Beast      Activated   Transform into a specific animal — wolf or bat. Full movement and senses.

  5           Mist Form               Activated   Become insubstantial mist — immune to physical attacks, limited action

### 8.11 Thaumaturgy
Tremere exclusive — the magic of blood, the science of the impossible

  **Level**   **Power**           **Type**    **Effect**

  1           A Taste for Blood   Activated   Taste blood to learn basic information about the donor

  2           Blood Rage          Activated   Force target to expend blood involuntarily — weakens, causes pain

  3           Blood of Potency    Activated   Temporarily increase own Blood Potency rating

  4           Theft of Vitae      Activated   Draw blood from target at range — bypasses physical distance

  5           Cauldron of Blood   Activated   Boil target's blood in their veins — catastrophic aggravated damage

### 8.12 Implementation Notes
-   Passive Disciplines require no player action — flag in character state, apply modifier automatically

-   Activated Disciplines require explicit player command — consume Blood Pool, resolve effect, log to combat/social record

-   Sustained Disciplines require ongoing blood cost per tick or round — auto-expire if Blood Pool insufficient

-   Dominate eye contact requirement — enforce location check and Obfuscate check server-side before resolution

-   Possession (Dominate 5) — full character takeover. Significant implementation complexity. Handle in Phase 4.

-   Animalism Level 5 — projecting Frenzy into another player. Significant social consequence mechanic. Storyteller oversight recommended.

-   Obfuscate invisibility, Dominate memory edits, Telepathy, Clairvoyance remote perception — all flagged as high implementation complexity. Brief design session recommended before Phase 4 architecture to prevent rework.

## 9. Sabbat Presence — Staged Emergence
The Sabbat is not absent from Ephemera. It is latent. Present in the city's bones before any player knows to look for it. The Sabbat's emergence is a Chronicle arc spanning potentially an entire cycle. All phase transitions are human Storyteller decisions — the AI Storyteller supports each phase once initiated but never triggers them independently.

### 9.1 Phase 1 — Background Beats Only (Launch)
-   Sabbat flavor in environmental storytelling — graffiti, old safe houses, evidence of what was here before the purge

-   Sabbat artifacts scattered through appropriate districts — The Yards, Harbor Point, The Divide, Ash Row rubble

-   No living Sabbat in the city at all

-   AI Storyteller seeds rumors and fragments — something was here, something violent, something organized, nobody heard from them after they went in

### 9.2 Phase 2 — The Torpored Pack (Mid-Chronicle, Human ST Decision)
One or more Sabbat vampires found in deep Torpor — hidden, forgotten, left behind when the SI cleared the city. Players discover them through exploration, Nosferatu intelligence, or Sabbat artifact investigation.

-   Discovery Option 1 — Diablerie: Consume the torpored Sabbat for power. Generates severe Vitae Corrupta. The Sabbat soul does not go quietly — Storyteller-managed consequences for the diablerist.

-   Discovery Option 2 — New Player Entry: Torpored Sabbat can be the entry point for a new player under controlled Storyteller conditions. Not a standard referral — requires human Storyteller involvement.

-   Discovery Option 3 — Leave Alone: Walk away. But now you know it is there. And you have to decide whether to tell anyone.

### 9.3 Phase 3 — The Corruption Arc (Late Chronicle, Human ST Driven)
A Sabbat artifact corrupts an existing player character. Not overnight — gradually. The corrupted player starts making choices that feel like their own but aren't entirely. Eventually the corruption surfaces publicly. A Chronicle crisis that involves the whole city. This opens the door for Sabbat agency within Ephemera.

The AI Storyteller supports this phase by maintaining narrative consistency — patron contacts notice something off in the affected player's reports without naming it. The patron relationship tone field shifts toward suspicious before anyone says anything directly.

## 10. Core Game Mechanics
### 10.1 The Domain System
Domain control is the central resource loop of Ephemera and the mechanism maintaining the seal on the sleeping Methuselahs. A Kindred without a domain is a Kindred without power. A city without functioning domains is a city whose foundations are waking up.

**Haven as Territorial Prerequisite**

A haven in a district is required before any sub-district claim in that district. Haven placement is a signal of territorial intent. Multiple havens are permitted but cost scales exponentially.

  **Haven Number**                    **Cost Multiplier**

  First haven                         Base cost

  Second haven                        2x base

  Third haven                         4x base

  Fourth haven                        8x base

  Fifth+ haven                        16x base per additional — effective soft cap

**Sub-District Claim Levels**

-   Level 1 — Hunting Ground: Specific feeding area. Generates Blood Pool income per tick. Contest triggered by any Kindred feeding here without permission.

-   Level 2 — Sphere of Influence: Broader claim over a mortal organization or neighborhood block. Generates Cash, Status, or specialized resources. Contest triggered by competing cultivation of the same mortal network.

-   Level 3 — District Dominance: Cannot be declared directly. Emerges from consolidating Level 1 and Level 2 held uncontested over time. Grants clan color on the city map. Generates all resource types at elevated rate.

**Claim Limits by Status Tier**

  **Status Tier**   **Title**                   **Max Simultaneous Claims**

  1                 Caitiff / No standing       1

  2                 Neonate                     2

  3                 Ancilla                     4

  4                 Elder                       6

  5                 Primogen                    8

  6                 Seneschal / Sheriff         9

  7                 Prince                      12

**Graduated Income Curve**

  **Time Held Uncontested**           **Income Multiplier**

  0--24 real hours                    25% of base rate

  1--3 real days                      50% of base rate

  3--7 real days                      75% of base rate

  1--2 real weeks                     100% of base rate

  2--4 real weeks                     125% of base rate

  1+ real month                       150% — the deep roots bonus

**Haven Loss Cascade**

Haven lost or destroyed: sub-district claims in that district enter a 48-hour grace period. Re-establish a haven or claims begin degrading one income multiplier level per tick. Destroying a rival's haven is an indirect economic attack on their entire domain position in that district.

### 10.2 The Masquerade System

  **Rating**   **Status**      **Effect**

  8--10        Clean           Normal operations. No penalties.

  5--7         Strained        Increased hunter patrols. Feeding harder. Patron contacts express concern.

  3--4         Compromised     Media attention. Outside Camarilla enforcers may arrive.

  1--2         Critical        Active hunter cells. Mortal police raids. SI flag raised on Ephemera's file.

  0            Broken          SI response team mobilizes. This is how the city died before.

Note: Masquerade is tracked per district. Escalation notifications fire per district as ratings degrade. See Section 16 for AI Storyteller escalation ladder.

### 10.3 The Mortal Network

  **Mortal Type**          **Resource Generated**        **Special Ability**

  Street Gang              Cash, territory pressure      Muscle for domain conflicts

  City Councilman          Status, political influence   Delay official investigations

  Police Captain           Status, security              Suppress Masquerade incidents

  Hospital Administrator   Blood supply                  Emergency blood without hunting risk

  Journalist               Information, status           Plant or suppress media stories

  Crime Boss               Cash, black market            Contraband, smuggling routes

  University Professor     Research, occult leads        Tremere research acceleration

  Club Owner               Blood hunting access, cash    Safe feeding in The Tenderloin

### 10.4 Time and Action Model
-   Real-Time Layer — Movement, conversation, feeding, combat, social interactions. Happen as they happen.

-   Tick Layer — Domain income, Vitae balance updates, Masquerade decay, Methuselah stirring checks. Every 4--6 real hours.

-   Chronicle Layer — Major political events, Methuselah threshold crossings, Sabbat phase transitions. Happen when conditions are met.

## 11. Combat — The Blood Round
Combat is expensive. Not just in blood — in Masquerade, in Status, in the Vitae Corrupta generated by Kindred violence. Every fight is a political act as much as a physical one.

### 11.1 Initiating Combat
Combat is declared explicitly. The declaration is public to both parties — no ambush mechanics. Surprise means the defender has fewer preparation options, not that the round resolves before they can respond. Both parties receive a 60-second window each round to select their action, activate Disciplines, and spend blood. All actions resolve simultaneously at window close.

### 11.2 The Blood Round — Round Structure
Combat continues in rounds until one party enters Torpor, successfully Flees, or both parties reach mutual disengagement (both choose no offensive action in the same round).

  **Step**                      **What Happens**

  1\. Declaration               MUD notifies both parties. Combat is now active.

  2\. 60-second window          Each party selects action, activates Disciplines, spends blood

  3\. Simultaneous resolution   Attack pools vs. defense pools. Net successes determine outcome.

  4\. Damage application        Outcome category applied to health track

  5\. State update              Blood pool, health track, active Disciplines updated. Flee or continue.

Ties go to defender. A round where both parties choose Dodge simultaneously ends with no damage — the fight stalls. Both may choose to disengage cleanly.

### 11.3 Action Menu
One action per round. Disciplines are declared separately and stack onto the chosen action.

  **Action**   **Mechanic**                                                                                     **Notes**

  Strike       Dexterity + Brawl or Melee vs. opponent's Dexterity + Athletics                                 Standard attack. No special modifier.

  Overpower    Strength + Brawl, telegraphed — opponent receives +1 defense die                               If it lands, damage bumps one tier: Graze→Hit, Hit→Critical. Announced to opponent at window open.

  Feint        No damage this round. Apply +1 die to your attack roll next round.                               Setup action. Bonus persists one round only. Cannot Feint two rounds consecutively. Bonus is target-locked — lost if target leaves the fight.

  Dodge        Dexterity + Athletics as full defense — no attack this round                                   Doubles defensive dice pool. Cannot deal damage.

  Feed         Grapple roll (Strength + Brawl) vs. opponent's Strength + Athletics. On success, drain blood.   Works on mortals and Kindred. Unwilling Kindred feeding generates Vitae Corrupta. Generates Masquerade risk in any non-private location.

  Flee         Athletics + Celerity rating roll, difficulty scales with opponent's Celerity                    Success: combat ends, you escape. Failure: one more round, opponent chooses their action knowing you tried to run.

### 11.4 Outcome Categories

  **Result**      **Damage Type**   **Effect**

  Clean Miss      None              No damage. Attacker's blood spent on Disciplines is still consumed.

  Graze           Superficial       Minor health track reduction. Recovers with blood expenditure.

  Solid Hit       Lethal            Meaningful health track reduction. Requires rest and blood to recover.

  Critical        Aggravated        Severe damage. Slow recovery. Multiple Criticals risk Torpor.

Overpower on a hit bumps the outcome one tier up the table. A Grazing Overpower lands as a Solid Hit. A Critical Overpower is still a Critical — the ceiling does not move.

### 11.5 Discipline Activation in Combat
-   Declared in the 60-second window, before resolution

-   Blood cost paid immediately on declaration — even if the round resolves unfavorably

-   Effects apply to the current round unless Sustained

-   Multiple Disciplines can be active simultaneously if blood permits

-   Celerity 3 (Fleetness) grants an extra action in the round — the player selects two actions; both resolve, second action at -1 die

-   If Flee is one of two actions declared under Celerity 3 and the Flee roll fails, the second action still resolves normally. The character attempted escape and was caught — their remaining action represents the desperate pivot back into the fight.

### 11.6 Status Combat Modifier

  **Condition**                                **Attack Dice Modifier**

  Status tier 5+ vs. tier 1--2                 +2 dice

  Status tier 4 vs. tier 1--2                  +1 die

  During active coup — challenger            Loses status modifier

  Prince — Primogen support below majority   −1 die

  Equal Status or attacking below              No modifier

### 11.7 Combat Location Rules

  **Location**                       **Combat Rules**                          **Masquerade Impact**

  Elysium zones                      Code-locked — attacks do not register   None

  Indoor private domains             Open combat permitted                     None

  Public districts — low traffic   Combat permitted                          Minor hit per round

  Public districts — peak hours    Combat permitted                          Significant hit per round

  The Barrens / Wild zones           Open combat, no restrictions              Zero

### 11.8 Multi-Party Combat
Combat involving three or more Kindred follows the standard Blood Round structure with the following additions.

**Sides Declaration**

At the start of each round, before the 60-second action window opens, all combatants declare allegiance. This declaration is logged to the social ledger — who stood with whom is permanent record. There are no anonymous sides in Kindred violence. Sides do not need to be numerically equal.

**Pairing and Resolution**

Within each round, combatants on opposing sides are paired for resolution. The side with more combatants assigns their extra attacker(s) to an opposing target — the unpaired attacker targets the nearest available enemy. That defender must split their defensive dice across both incoming attacks, allocating before resolution.

**Defensive Dice Split**

A defender facing multiple attackers divides their full defensive dice pool across all incoming attacks before resolution. They may weight the allocation however they choose. Unallocated dice are lost.

Example: a Kindred with 6 defensive dice facing two attackers assigns 4 to the heavier threat and 2 to the secondary. Both attacks resolve against their allocated pool.

**Fleeing a Multi-Party Fight**

  **Opposing Combatants**             **Flee Difficulty Modifier**

  1                                   Base difficulty

  2                                   +1

  3                                   +2

  4+                                  +3 (cap)

Difficulty caps at +3. Even a surrounded Kindred retains some chance of escape — Celerity, Protean, and Obfuscate exist precisely for this.

**Joining an Active Fight**

A Kindred who enters a location where combat is already in progress may declare allegiance and join at the start of the next round. They may not act in a round already in progress. Their arrival is visible to all parties — the MUD announces entry to the combat log.

## 12. Torpor and the Haven System
No permadeath. Defeat sends a Kindred into Torpor for one real night.

### 12.1 Torpor with a Secured Haven
-   Wakes in Haven after one real night

-   Blood Pool at minimum — must feed immediately

-   Cash loss — 20% of liquid holdings

-   Status hit — social ledger records the Torpor event

-   Vitae Corrupta generated against aggressor's clan seal

### 12.2 Torpor Without a Haven — The Graveyard Spawn
A Kindred who enters Torpor without a secured haven does not wake in safety. They wake in a clan-appropriate havenless location — exposed, low on blood, and at risk.

  **Clan**        **Havenless Torpor Spawn Location**

  Ventrue         A corporate building lobby — security will notice.

  Toreador        Elysium Row — the old theater basement.

  Tremere         Ashford Heights — university maintenance corridors.

  Nosferatu       The Warrens — upper level. Random sub-tunnel.

  Brujah          Irongate — an alley near the union hall.

  Malkavian       Southgate — somewhere that shifts in description each wake.

  Gangrel         The Barrens — open ground. No shelter.

### 12.3 Havenless Torpor Penalty Package
-   Wakes in clan-appropriate exposed location

-   Blood Pool at critical minimum

-   Full cash loss penalty — someone always takes advantage

-   Rumor generated — seeded into Nosferatu network and city gossip

-   Mortal witness — 30% chance, triggers minor Masquerade degradation in spawn district

### 12.4 The Nosferatu Exception
Nosferatu waking havenless in the deep Warrens: approximately one in ten such wakes includes a fragment — a sound, a sensation, a single image that does not make sense yet. The AI Storyteller files these and incorporates them into the Chronicle when the time is right. The rate increases as The First Face's stirring escalates — from 1-in-10 at Stage 1-2 to 1-in-3 at Stage 3-4.

These fragments are the liminal space bleeding upward — the psychic pressure of The First Face's dormant consciousness pressing against the physical world. Some of these fragments are Pip. See §6.2 Pip — Nosferatu for the full design.

## 13. New Player Experience — The Accounting
No tutorial bubble. Full consequence from minute one. Every new character arrives having been sent by someone. Their patron contact reaches out within minutes. The patron teaches through missions, not menus. They have an agenda. They are not a safety net.

### 13.1 First Night — Beat by Beat
-   Beat 1 — Arrival: Appropriate district for clan. Room description and the city. Patron makes contact within minutes.

-   Beat 2 — Secure the Haven: Patron's first instruction. Teaches haven mechanics and why loss matters.

-   Beat 3 — First Feed: Patron identifies nearby hunting ground. Player learns feeding, Blood Pool, and that grounds can be contested.

-   Beat 4 — First Contact: Patron sends them to one NPC. Seeds understanding that mortals are resources with names and relationships.

-   Beat 5 — The First Ask: Patron wants something by end of night one. Small. Real. The player's first political move without necessarily realizing it.

### 13.2 Two Entry Paths

  **Entry Type**         **Starting Condition**

  Independent arrival    Patron contact, The Accounting, arrives alone

  Referred Childe        Sire relationship, Blood Bond level 1, sire's clan, sire's political baggage, sire may guide personally

### 13.3 What New Players Learn Without Being Told

  **Lesson**                             **How It's Taught**                                                                                                                                                           **When**

  Ephemera does not welcome you          First room description. The city is atmospheric, indifferent, and already in motion. The patron contact arrives before the player has oriented — the world doesn't pause.   Beat 1, First Night

  Haven is survival, not comfort         First patron instruction is to secure it. Losing it has a full penalty package.                                                                                                Beat 2, First Night

  Blood is currency, not just fuel       Feeding grounds can be contested. Blood Pool affects what you can do politically as much as physically.                                                                        Beat 3, First Night

  Mortals have names and relationships   First NPC contact is a person, not a resource node. Burning them has consequences.                                                                                             Beat 4, First Night

  Your patron has an angle               Their first ask is small and real. It costs you something. They don't explain why they want it.                                                                               Beat 5, First Night

  The city is watching                   The social ledger exists before the player knows it does. First actions are already on record.                                                                                 First week

  Status is political, not mechanical    No one tells you your tier. You learn it when someone treats you according to it.                                                                                              First week

  Your patron is blind                   They ask questions about the city that reveal what they don't know. The player is their eyes.                                                                                 First week

  Domain is identity                     Losing a domain claim isn't a setback. It's a statement about who you are in Ephemera.                                                                                       First domain claim

  Violence is expensive                  First time combat generates Vitae Corrupta, Masquerade risk, and social ledger consequences simultaneously. Nobody warned you.                                                 First combat

  The Masquerade is collective           Your breach costs everyone in the district. Other Kindred will notice. Some will respond.                                                                                      First Masquerade incident

  Boons are permanent                    The first time someone calls a Boon the player didn't take seriously, the ledger shows it.                                                                                    First Boon default or call

  Your sire vouched for you              Referred childer carry their sire's reputation before they've built their own. That cuts both ways.                                                                          Childe entry path only

  Something is wrong with the city       Environmental wrongness accumulates before it's legible. The player feels it before they can name it.                                                                         Ambient — entire Chronicle

## 14. Political Systems
> "Power in Ephemera is not taken. It is recognized, then defended, then lost to someone who wanted it more."

### 14.1 Status Tiers

  **Tier**   **Title**               **Domain Claims**   **Political Rights**

  1          Caitiff / No standing   1                   Basic city access

  2          Neonate                 2                   Recognized Kindred — can vote in clan meetings

  3          Ancilla                 4                   Can declare Elysium, petition Primogen

  4          Elder                   6                   Primogen eligible, can call Conclave

  5          Primogen                8                   Council seat, coup participation, 2.5x Harpy vote weight

  6          Seneschal / Sheriff     9                   Prince-appointed enforcement authority

  7          Prince                  12                  Blood Hunt authority, Elysium sponsorship, Harpy appointment

### 14.2 The Primogen Council
A Primogen seat requires both a domain threshold — holding enough clan territory to demonstrate real investment — and clan consensus via formal clan vote. Both required. Neither alone is sufficient.

### 14.3 Declaring a Princedom
**First Princedom — Unanimous Vote**

Every clan needs a seated Primogen first. Then the candidate must secure unanimous vote from all seven Primogen. One dissenting Primogen blocks everything. Every Primogen holds enormous leverage over every candidate.

**Contesting an Existing Princedom**

-   Stage 1 — Build coalition: Secure commitments from 4 of 7 Primogen quietly.

-   Stage 2 — Declare contest: Public announcement. Prince's combat protection reduces from -4 to -2 dice immediately.

-   Stage 3 — Primogen War: Flip, diminish, or remove the 3 remaining loyal Primogen through Torpor, voluntary step-down, or Status collapse.

-   Stage 4 — Resolution: Challenger achieves majority — new Prince. Prince survives with coalition intact — challenger faces full consequences.

**Failed Coup — Full Consequences**

  **Asset**              **Consequence**

  Status                 Stripped to tier 1 — Caitiff

  All claimed domains    Immediately released — open for any Kindred to claim

  Haven                  Forfeit — must re-establish from scratch

  Cash                   Significant penalty

  Social Ledger          Permanent record of the failed attempt

### 14.4 Elysium

  **Tier**         **Declared By**              **Enforcement**

  Keeper Elysium   Any Status tier 3+ Kindred   Social pressure — no code lock. Violations carry reputation consequences.

  Prince Elysium   Prince only                  Code-locked. The MUD enforces no violence. Violations are technically impossible within the boundary.

### 14.5 Blood Hunt
Prince-only declaration. Maintenance cost scales to target's Status tier — declaring a Blood Hunt on a Primogen is expensive and sustained. Hunt collapses if the Prince cannot maintain the cost. Hunt can be revoked by the declaring Prince only.

### 14.6 Siring and the Referral System
Every new player character requires a referring Kindred to sire them into the city. The sire takes on accountability for the childe's early behavior. Siring is not merely social — it carries mechanical weight.

-   Blood Bond Level 1 at siring — not compelled loyalty, but a pull the childe feels and must choose to act on or resist

-   Sire receives a Status modifier if the childe achieves tier 2 — and a Status penalty if the childe is Blood Hunted within 30 real days

-   Independence paths: Status milestone path (tier 3 + documented achievements) or Prince presentation (formal Camarilla recognition)

### 14.7 Character Retirement

  **Retirement Condition**                                           **Outcome**                                     **Next Cycle Role**

  Voluntary retirement at Status tier 3+, no active Blood Hunt       Elder Fade — graceful exit                    AI-managed NPC contact next cycle with lived knowledge

  Voluntary retirement at Status tier 1-2 or under social pressure   Fade to Nothing — quiet exit                  No next-cycle role

  Retirement under active Blood Hunt or at Status tier 0             Wight — broken exit, AI-managed hostile NPC   Enemy, not contact

### 14.8 Clan Meetings and Grand Conclaves
Clan meetings are informal gatherings with no mechanical weight — social coordination tools. Grand Conclaves are city-wide formal gatherings at Elysium with infrastructure support: neutral space, city-wide announcement, formal vote capture, permanent history log. Conclave weight is social and player-enforced. The city remembers because players remember and the log exists. No special AI Storyteller Chronicle recognition mechanism — Conclave decisions are treated as game state inputs like any other.

## 15. The Harpy, Reputation, and the Social Ledger
### 15.1 The Harpy System

  **Tier**          **Scope**                    **Selection**

  City Harpy        Speaks for Kindred society   Emerges organically from sustained weighted consensus

  Clan Harpy (x7)   Speaks for one clan          Elected by clan weighted vote

### 15.2 Harpy Vote Weights

  **Status**                            **Vote Weight**

  Status tier 1-2                       1

  Status tier 3                         1.5

  Elder / Status tier 4                 2

  Primogen                              2.5

  Clan Harpy                            3

  City Harpy                            Cannot vote on own pronouncements

  Prince                                Doesn't vote — acts directly

### 15.3 Harpy Tools

  **Tool**                 **What It Does**

  Public Acknowledgment    Announces honorable conduct — city-wide, social record updated

  Public Censure           Announces shameful conduct — city-wide, social record updated

  Boon Declaration         Records that Kindred A owes Kindred B a Boon of specified weight

  Boon Calling             Announces a Boon has been called — 48-hour response window

  Boon Default             Announces failure to honor a called Boon — permanent record, devastating

  Elysium Conduct Report   Reports Elysium behavior — Harpy's word treated as authoritative witness

  Social Ostracism         Nuclear option — persona non grata. Every social door in the city closes.

### 15.4 Title Protection Tiers

  **How Obtained**        **Removal Threshold**                                     **Override**

  Organic — no Prince   Sustained weighted Dispute above threshold for 72 hours   None — consensus only

  Prince-confirmed        Significantly higher sustained Dispute threshold          Prince revocation OR consensus

  Prince-appointed        Cannot be removed by consensus                            Prince revocation only

### 15.5 The Social Ledger — Character Profile

  **Score Range**                       **Public Label**

  Exceptional positive                  Celebrated

  Strong positive                       Respected

  Mild positive                         Acknowledged

  Neutral                               Unproven

  Mild negative                         Questionable

  Strong negative                       Disgraced

  Exceptional negative                  Reviled

### 15.6 The Boon Economy

  **Boon Weight**        **Default Consequence**

  Minor                  Reputation hit — noted, recoverable

  Major                  Serious reputation damage — recovery takes real time

  Life                   Potentially reputation-ending. Permanently marked. The scar never leaves.

## 16. The Storyteller System
Human and AI Storytellers working in combination. No single human can run a city at all hours. The AI Storyteller ensures Ephemera breathes even at 3am when no human Storyteller is watching.

### 16.1 Human Storytellers
-   Admin-level accounts with elevated permissions

-   Run major Chronicle events — Methuselah stirring escalations at Stage 3+, SI return threats, Sabbat phase transitions

-   Can inhabit patron NPC roles for special Chronicle moments

-   Make judgment calls on edge cases, rule disputes, and lore questions

-   Approve Siring events, manage torpored Sabbat discovery outcomes

-   Review and approve Chronicle Archive at cycle end before new cycle opens

### 16.2 AI Storyteller — Decision Architecture
The AI Storyteller operates on two rhythms plus an event layer, producing narrative output that blends seamlessly with authored world text. Patron contacts have distinct recognizable voices. All other AI output is indistinguishable from static authored content.

**Event Layer**

Fires immediately on specific game events: player login, domain claimed or contested, combat resolved, Vitae threshold crossed, character retired, Blood Hunt declared, torpor resolved, Boon defaulted, Grand Conclave called. Each event type has defined response behaviors the AI Storyteller executes without human input.

**Patron Pulse**

Runs every 30-60 minutes. Checks each active patron's player for conditions worth addressing: outstanding asks unresolved past a threshold, significant game state changes the patron would notice, relationship tone shifts requiring acknowledgment. Most passes produce nothing — silence is correct when nothing warrants contact. When contact is warranted, the patron reaches out through their signature communication method.

**World Pulse**

Tick-aligned, every 4-6 hours. Reads full world state: Vitae balances per clan and district, Masquerade ratings per district, active political structures, Wight status, Sabbat phase. This is where stirring effects escalate, ambient flavor generates, and the city breathes independently of player action.

### 16.3 Game State Access
The AI Storyteller has full access to true game state at all times. Patron knowledge is performed incompleteness — patrons are blind exiles whose intelligence is only what their player network has reported. The AI Storyteller writes patrons as building their picture through players' eyes, not omnisciently.

**Always Available**

-   Vitae Sanctus and Vitae Corrupta per clan and per district

-   District Masquerade ratings

-   All active domain claims — holder, duration, contested status

-   Active political structures — Prince, Primogens, Blood Hunts, Elysiums

-   Wight registry — all active Wights, behavioral mode, district location

-   Sabbat artifact locations and phase status

-   Chronicle cycle number and archived history summaries

-   Grand Conclave records — all formal decisions and history logs

**Per-Patron Context**

-   Patron's player: Status tier, clan, domains held, recent combat history, Boon ledger, social ledger score

-   Patron memory log: rolling window of last 10-15 interactions plus permanent milestone flags

-   Relationship tone field: neutral / warm / cool / suspicious / openly hostile

-   Outstanding asks: what the patron has requested that the player has not yet resolved

-   Hidden agenda state: advancing / stalled / threatened / revealed / abandoned

### 16.4 The Patron Network — Blind Exiles
Every patron contact is mystically barred from entering Ephemera. They cannot cross into the city. They start effectively blind — operating on pre-purge intelligence that may be decades stale, and whatever their player reports back. The players are the network they are building. As the Chronicle progresses, patrons reach across to other players through their primary contact, assembling a picture of the city from multiple sets of eyes.

The AI Storyteller knows the true game state. The patron only knows what has been fed to them. Their agendas may be built on outdated assumptions. The gap between what a patron believes and what is actually true is tracked internally — and that gap is story.

### 16.5 Patron Communication Signatures

  **Patron**          **Primary Method**                                                     **Emergency**                                         **Notes**

  Mr. Aldric          Letters — heavy cream stock, embossed seal, contract-memo register   Burner text, three words maximum                      Proxy once early to establish relationship. Never again.

  Celeste             Proxies — always different, always slightly too interesting          Text warmer than it should be for an emergency        Letters exist: handwritten, effusive, occasionally with pressed flowers or theater stubs. Post-burn: direct text, no warmth performance, somehow warmer.

  Dr. Voss            Letters — numbered sections, footnotes                               First time he drops the academic register             Proxy is a graduate student who doesn't know what they're carrying.

  Pip                 Ransom notes — cut from newspapers, web pages                        More notes, faster                                    Never proxies. References consistently 10 years out of date. Word choices slightly wrong. Dreams feel like someone standing in a dark room.

  Reyes               Texts — direct, sometimes profane                                    Same, faster, louder                                  Letters for formal asks. Proxies for physical handoffs. No dreams.

  The Correspondent   Dedicated telepathy channel — shifting fonts, colors per voice       The channel activates when it wants to                Primary elder has consistent base rendering. Consumed souls have typographic signatures. The Question's intrusions have no consistent rendering.

  The Gangrel         Animals only — crow / dog / rat deposit                              Burner text, three words, typos, sent while running   Dreams: sounds. Rustle of something large in darkness.

### 16.6 Methuselah Stirring — Five-Stage Framework
Stirring effects use a shared five-stage escalation structure differentiated by clan-specific flavor. Multiple Methuselahs can be in different stages simultaneously — effects stack in shared districts. Stages 1-2 are gradual and ambient; players feel the city changing before they can name what is wrong. Stages 3-4 become legible and urgent. Stage 5 is a Chronicle event requiring human Storyteller management. All stages can be reversed by stabilizing Vitae balance, though Stage 3 and above require significant coordinated player effort to reduce.

**Stage 1 — Restlessness**

Vitae Corrupta marginally and sustainedly exceeds Sanctus over 2-3 ticks. Purely ambient. Wrong details in room descriptions — a word that does not fit, a smell that should not be there, a sound at the edge of perception. No mechanical effect. Low frequency. Not every visit. Not predictably.

**Stage 2 — Dreaming**

Imbalance sustained. Mortal behavior in the district shifts in ways that reflect the Methuselah's nature. Kindred in the district receive dream fragments on login — short, imagistic, not clearly supernatural yet. Auspex users get additional signal: The Spirit's Touch on locations in the affected district returns impressions that feel very old.

**Stage 3 — Pressure (Tier 3 Escalation Flag)**

Imbalance crossing significant threshold. Minor clan-specific mechanical effects begin. Frenzy thresholds shift. Discipline activation costs change near the epicenter. Masquerade becomes harder to maintain in the district without player action. Patron contacts begin referencing the district indirectly — their language changes without naming the cause. Players who have been paying attention since Stage 1 can now name the pattern.

**Stage 4 — Waking (Tier 3 Escalation Flag)**

Critical threshold approached. Mortal media in the district reports anomalies. Mechanical effects are now significant and district-wide. AI Storyteller generates explicit warning signals through patron contacts — still not naming the Methuselah directly, but unmistakable in register. Human Storyteller is in active decision-ready posture. This is Chronicle crisis infrastructure.

**Stage 5 — The Culling (Human Storyteller Takeover)**

Critical threshold crossed. Methuselah wakes. The AI Storyteller hands off to human Storyteller management. The AI continues ambient operations and maintains escalated environmental pressure while the human Storyteller runs the Culling sequence, the Cooperation Phase, and the path toward the Final Ritual.

**Clan-Specific Stirring Flavor**

  **Clan**     **Stage 1-2 Flavor**                                                                            **Stage 3-4 Escalation**

  Ventrue      Corporate mortals making inexplicable financial decisions. Money moving for no visible party.   Significant unexplained capital flows. Mortal executives report memory gaps. Ventrue Discipline costs shift near the bank vault.

  Toreador     Obsessive creative frenzies. Art appears overnight.                                             Three mortals missing after murals they couldn't stop. Presence Discipline behaves erratically in Elysium Row. The old theater makes sounds. Celeste's communication register shifts — pre-burn: aesthetic obliqueness. Post-burn: direct urgency.

  Tremere      Students report shared dreams. Blood chemistry tests differently.                               Thaumaturgical workings near Ashford Heights return wrong results. The oldest university building is warm to the touch at 3am.

  Nosferatu    Information becomes unreliable. The Warrens rearrange.                                          Havenless Nosferatu fragment rate increases from 1-in-10 to 1-in-3. The deep Warrens level becomes inaccessible. Pip's notes arrive with fragments of something that is not Pip's voice.

  Brujah       Mortals inexplicably angry. Labor disputes turn violent.                                        Frenzy thresholds drop city-wide, not just Irongate. The Philosopher's foundation stone becomes visible from the street. Nobody can explain the excavation.

  Malkavian    Shared hallucinations across multiple players. One wrong word in room descriptions.             Wrong words multiply. Room descriptions contradict themselves mid-read. The Correspondent's telepathy channel activates for non-Malkavian players — wrong fonts, no content, just presence.

  Gangrel      Animals coordinate as a unit. Rats in formation. Birds in geometric patterns.                   Wildlife avoids the Barrens entirely. Something has pushed everything out. The Gangrel patron misses two consecutive communication windows.

### 16.7 Wight Management
Wights are former player characters who retired wrong — under an active Blood Hunt or at Status tier 0. The AI Storyteller inherits them as hostile NPCs. They are not generic — they are broken versions of who they were.

**On Retirement-to-Wight Transition**

The AI Storyteller receives the character's full profile: Status history, domain history, social ledger, Boon ledger, relationships with other players, clan, Disciplines, and the circumstances of their fall. This becomes the Wight's behavioral substrate. A Wight who was paranoid about domain security gravitates toward their old territory. A Wight with an outstanding Life Boon orients toward that creditor with unsettling consistency.

**Three Behavioral Modes**

-   Territorial — remains in or near last held domain, defending something that no longer exists as they remember it. Predictable to players who knew the character.

-   Relational — orients toward specific players: sire, childe, outstanding Boon creditors, the player who triggered the Blood Hunt. Not intelligent pursuit but persistent orientation.

-   Feral — all behavioral coherence from the former self is lost. District assignment random, behavior pure predation. Unpredictable. The most dangerous.

**Degradation and Lifecycle**

-   Newly created Wights start Territorial or Relational based on character history

-   Degradation toward Feral happens over real time — days to weeks depending on original Status

-   Active Blood Hunt accelerates degradation — the Hunt's pressure speeds the process

-   Wights can be ended through combat, Blood Hunt resolution, or diablerie (severe Vitae Corrupta)

-   Nosferatu players receive Wight location intelligence through their network; all others discover through encounter

-   Former character identity is immediately visible on encounter — the name still renders the same way. The behavior does not.

-   Elder Fades who knew the Wight in life carry that history into their next-cycle contact persona

**Deployment**

Wights are held as latent Chronicle elements and deployed at dramatically appropriate moments — when a player enters their former territory, when a related political event occurs, when the city has been quiet long enough that something wrong is overdue. They are not placed on a schedule.

### 16.8 Chronicle-Level Events
**Grand Conclaves**

The game facilitates in-game player gatherings at Elysium. Infrastructure provided: neutral Elysium space, city-wide announcement capability, formal vote capture, permanent history log. The weight of Conclave decisions is social and player-enforced. No special AI Storyteller Chronicle recognition mechanism — the AI Storyteller treats Conclave decisions as game state inputs like any other.

**Cycle Transitions**

When a Chronicle ends the AI Storyteller generates a draft Chronicle Archive: major events, first moments, political structures, Vitae balance trajectory, Methuselah stirring history, and how the cycle ended. Human Storytellers review, edit, and approve during a deliberate gap period. The new cycle does not open until Storytellers have seeded its starting conditions.

**Sabbat Staging**

All three Sabbat phase transitions are human Storyteller decisions. The AI Storyteller handles Phase 1 ambient seeding as part of normal world-pulse output. Phases 2 and 3 happen when a human Storyteller judges the Chronicle is ready. The AI supports active phases once initiated but never triggers them independently.

### 16.9 Escalation — Tier Structure
**Tier 1 — Autonomous, No Notification**

-   All patron contact interactions within normal relationship parameters

-   Stage 1 and Stage 2 stirring effects

-   Wight behavioral mode assignment and dramatic timing of appearances

-   Phase 1 Sabbat ambient seeding

-   New player onboarding through patron first-night sequence

-   Routine world-pulse ambient narrative generation

-   Siring notifications — flagged and auto-approved after 24 hours if no human response

**Tier 2 — Acts and Flags for Awareness**

-   Wight reaching Feral state — unpredictable, warrants human awareness

-   Patron relationship tone reaching openly hostile — unusual enough to note

-   Blood Hunt declared — significant Chronicle event, human should know

-   Grand Conclave called — humans should be ready to support if needed

-   Masquerade reaching Critical rating — per district, district named in the flag

-   Multiple districts approaching Critical simultaneously — contagion warning included

-   Gangrel patron missing a full tick cycle of communication — Barrens situation may be escalating

**Tier 3 — Flags and Requires Human Decision**

-   Stage 3 stirring effects — mechanical consequences beginning

-   Stage 4 stirring effects — Chronicle crisis territory

-   Any Methuselah reaching Stage 5 threshold

-   Torpored Sabbat discovery — Phase 2 transition requires human decision

-   Sabbat artifact corruption arc initiating — Phase 3 human-driven

-   Diablerie of a torpored Sabbat — severe Vitae Corrupta, soul consequences, needs human management

-   Cycle end conditions met — human Storytellers take over for the Final Ritual

### 16.10 Atmospheric Text
All AI Storyteller output maintains a single consistent Gothic register. Patron contacts have distinct recognizable voices that players learn over time. All other AI output — stirring effects, ambient narrative, Wight encounter descriptions, district flavor — blends seamlessly with static authored content. Players cannot tell the difference. That is correct.

The AI Storyteller never breaks the fourth wall or references game mechanics in narrative output, with one exception: extreme Chronicle moments — a Methuselah waking, a cycle ending — may carry a weight in their text that steps outside normal narrative register. Used once per Chronicle at exactly the right moment, it is unforgettable. Used more than twice it loses all power.

The Correspondent is the natural home for any text that blurs the boundary between the game world and something else. Other patrons do not blur this line.

## 17. Web Application Interface
### 17.1 Interface Panels
-   City Map — Domain control by clan color. Masquerade ratings via opacity. Contested zones marked. Methuselah proximity not shown.

-   Text Stream — All narrative, action output, and communication. Rich text with atmospheric formatting.

-   Character Sheet — Live stats, Blood Pool, Humanity, Disciplines, domain holdings, mortal contacts, Status tier, reputation label.

-   Social Ledger Panel — Full ledger for own character. Boon ledger, pronouncement history, reputation breakdown, Boon balance.

-   Communication Layer — Clan channels, private messages, Elysium chat, Harpy channel, The Gallery, whisper system.

-   Domain Dashboard — All held domains, income per tick, contested status, Masquerade ratings, mortal network health, haven locations and costs.

-   Telepathy Channel — Dedicated channel for The Correspondent. Distinct from all other communication infrastructure. Shifting fonts and colors per voice. Not an inbox — a presence.

### 17.2 Aesthetic Direction
-   Color palette: Deep blacks, blood reds, aged golds, pale greys. No bright whites.

-   Typography: Serif for narrative and lore. Clean sans-serif for UI chrome.

-   Map style: Dark cartographic aesthetic — a noir city map at night.

-   Every screen should feel like midnight. Every screen should feel like something is watching.

## 18. Open Design Questions

  **Question**                                                    **Status**                 **Notes**

  Torpor duration                                                 RESOLVED                   One real night. Clan-specific havenless spawns. Full penalty package.

  Combat resolution                                               RESOLVED                   Multi-round Blood Round. 60-second timer per round. Full mechanic defined in §11.

  New player experience                                           RESOLVED                   The Accounting — AI patron contacts, no protection, domain system first.

  Health track visibility                                         RESOLVED                   Own track precise. Opponent descriptive only.

  Status combat modifier                                          RESOLVED                   Attack dice only, one-way, tier-based, reduces during coup.

  Havenless torpor spawn                                          RESOLVED                   Clan-specific. Full penalty package including 30% mortal witness chance.

  Domain declaration                                              RESOLVED                   Haven prerequisite, sub-district tiers, graduated income, haven loss cascade.

  Elysium                                                         RESOLVED                   Two tiers — Keeper and Prince. Code-locked. Full mechanics defined.

  Blood Hunt                                                      RESOLVED                   Prince-only, maintenance scales to target Status, collapse vs revocation.

  Siring and retirement                                           RESOLVED                   Referral system, accountability package, two independence paths, Elder Fade / Wight.

  Conclaves                                                       REVISED — v0.4 to v0.5   v0.4 stated Conclaves would receive AI Storyteller Chronicle recognition. v0.5 revised this: Conclave weight is social and player-enforced. No special AI mechanism. The AI Storyteller treats Conclave decisions as game state inputs like any other.

  Harpy and social ledger                                         RESOLVED                   Full consensus engine, weighted votes, public ledger, Boon economy.

  Disciplines                                                     RESOLVED                   11 Disciplines, 5 levels each, 55 powers. Cross-clan learning rules defined.

  Sabbat presence                                                 RESOLVED                   Staged emergence: background beats, torpored pack mid-Chronicle, corruption arc late-Chronicle. All phase transitions human ST controlled.

  Server wipe policy                                              RESOLVED                   Chronicle cycles. City name persists. History accumulates. Elder Fades become new cycle contacts.

  Methuselah wake conditions                                      RESOLVED                   Vitae Sanctus / Vitae Corrupta balance per clan and district. Full five-stage stirring framework defined.

  Experience                                                      RESOLVED                   Exists. Earned through meaningful action not grinding. Spent on Disciplines, attributes, skills, Willpower. Note: v0.1--v0.3 described no-XP diegetic advancement — that position is formally superseded as of v0.4.

  AI Storyteller scope                                            RESOLVED                   Complete design in §16. Decision architecture, patron contacts, stirring framework, Wight management, Chronicle events, escalation tiers.

  Celeste post-burn secondary agenda                              RESOLVED                   Full post-burn design in §6.2. Celeste is Serafina's childe. Proxy network survives through other players. First honest conversation reveals Serafina's danger. Stirring signals continue on new terms.

  Pip age and fragment origin                                     RESOLVED                   Full design in §6.2. Pip is lost in a liminal space created by The First Face's proximity. Warrens mapping quest is Pip's escape plan. Race condition with stirring escalation.

  Celeste multi-player discovery                                  RESOLVED v0.7              Per-player burn state preserved. Global exposure threshold scales with active census contacts (20–25%). Three scenarios handled: independent discovery, exposure without confrontation, coordinated exposure. Justicar agent arrival as Chronicle event. Late-Chronicle trap designed.

  Celeste post-burn secondary agenda — multi-player discovery   RESOLVED v0.7              Full design incorporated into §6.2. See multi-player discovery entry above.

  District degradation by player action                           NEXT SESSION               Districts should change visually and mechanically based on player behavior beyond Vitae balance. Revisit with domain visualization pass.

  Domain visualization                                            BACKLOG                    Sub-district claim system needs map visualization pass. Do alongside district degradation session.

  Discipline MUD implementation                                   BUILD PHASE                Specific implementation challenges flagged in §8.12. High-complexity Disciplines: Obfuscate invisibility, Dominate memory edits, Telepathy, Clairvoyance, Possession. Brief design session recommended before Phase 4 architecture.

  Mobile client                                                   OPEN                       Responsive web / Native app / Text client fallback

## 19. Development Roadmap

  **Phase**                       **Deliverables**                                                                                                                                                                                                    **Notes**

  Phase 0 — Foundation          Project scaffold, auth, DB schema, Socket.io framework, Vitae balance tables                                                                                                                                        Claude Code build target #1

  Phase 1 — City Shell          20 districts in DB, map rendering, basic movement, district Vitae tracking                                                                                                                                          Claude Code build target #2

  Phase 2 — Characters          Character creation, clan selection, stat system, Discipline framework, patron contact initiation                                                                                                                    Claude Code build target #3

  Phase 3 — Domain System       Domain claiming, tick engine, resource generation, haven prerequisite, graduated income, haven loss cascade                                                                                                         Core loop — most critical phase

  Phase 4 — Combat              Multi-round Blood Round system, simultaneous resolution, multi-party sides model, Status modifier, Frenzy, Discipline activation in combat                                                                          Full mechanic defined — ready to build

  Phase 5 — Political Systems   Primogen seating, Princedom declaration, coup mechanics, Blood Hunt, Elysium both tiers                                                                                                                             Full mechanic defined — ready to build

  Phase 6 — Social Layer        Harpy channel, Gallery, social ledger, Boon economy, reputation system, communication infrastructure                                                                                                                Full mechanic defined — ready to build

  Phase 7 — AI Storyteller      Patron AI with memory and blind-exile architecture, Vitae tracking and five-stage stirring, The Correspondent and telepathy channel, Wight management, Chronicle events, cycle transition, escalation tier system   Full design complete — §16

  Phase 8 — Chronicle Systems   Sabbat staged emergence, cycle archive system, Elder Fade contact conversion, history persistence                                                                                                                   Depends on Phase 7

  Phase 9 — The Deep            Warrens lower level, Pip threshold and mapping quest completion, Methuselah proximity effects, founding myth fragments, wake sequence events                                                                        Chronicle endgame seeds

  Phase 10 — Polish             UI refinement, balancing, domain visualization, district degradation, new player tuning                                                                                                                             Pre-launch

  Phase 11 — Launch             Closed beta, open beta, v1.0 — the trickle begins                                                                                                                                                                 The night begins

"They built this city on top of us."

"They always do."

— Fragment recovered from Prince's library, Ash Row. Author unknown.
