# CareerOS — Plani i Demos Final

**Kohëzgjatja:** 5–7 minuta
**Audienca:** vlerësues + bashkëstudentë
**Formati:** demo live në browser, me një backup video + screenshots gati në rast emergjence

---

## 1. Çka është projekti dhe kujt i shërben

**CareerOS** është një platformë AI që mbulon të gjithë ciklin e kërkimit të punës, jo vetëm një hap të tij.

**Problemi që zgjidh:** sot një kandidat përdor pesë vegla të ndara — një për CV, një për të analizuar shpalljen, një për cover letter, një për mock interview, një për të mbajtur listën e aplikimeve. Asnjëra nuk komunikon me tjetrën. CareerOS i bashkon të gjitha rreth një CV-je të vetme, dhe — pikë kyçe — **mëson nga rezultatet e përdoruesit** për t'i kalibruar parashikimet me kalimin e kohës.

**Përdoruesi target:** kandidatë teknikë aktivë në kërkim pune, sidomos developers / designers / product people, që duan mbështetje AI në të gjithë loop-in: CV → fit me shpalljen → aplikim → intervistë → planifikim karriere.

**Loop-i bazë (do ta përmend në hapje, jo do ta lexoj):**
ngarko CV → ngjit shpalljen → merr fit score + skill gaps + salary context → tailored CV → cover letter → mock interview → track aplikimin → kap rezultatin → kalibro parashikimet e ardhshme.

**Pse është ndryshe:** fit score-i nuk është numër arbitrar nga AI. Përdor një **rubrikë të fiksuar me banda 0–19 / 20–39 / ... / 90–100** dhe — pasi përdoruesi ka ≥3 outcome të kapura — injektojmë historikun e tij si few-shot examples në prompt për ta rikalibruar modelin. Kjo është e dokumentuar te `CLAUDE.md` dhe e implementuar te `buildJobAnalysisPrompt` në `src/lib/ai/prompts.ts`.

---

## 2. Flow-i kryesor që do të demonstroj

E kam zgjedhur flow-n që mbulon **vlerën më të madhe në kohën më të shkurtër** dhe që tregon dallimin nga konkurrenca (kalibrimi + rubrika fikse). Nuk do të demonstroj çdo feature — do të prek 4 nga 7-të, dhe pjesën tjetër do ta tregoj me një screenshot të shpejtë në fund.

### Skript i demos (timing-u real):

**[0:00 – 0:30] Hook + landing demo (pa login)**
- Hap landing page-n.
- "Para se të hyjmë brenda, kjo është gjëja e parë që sheh një vizitor i ri."
- Ngjit një shpallje pune (e kam të kopjuar gati në clipboard) në demo box-in inline.
- Brenda ~10 sekondash kthen role breakdown: skills, seniority, red flags.
- "Kjo është pa login, e limituar në 1 për IP në ditë."

**[0:30 – 1:00] Login + dashboard**
- Login me një llogari demo që e kam përgatitur (CV-ja tashmë e ngarkuar, 4–5 aplikime me outcomes të kapura).
- Tregoj dashboard-in: NextStepWidget, FollowUpWidget. "Çdo widget këtu lidhet me një feature konkret."

**[1:00 – 2:30] Job Analyzer — pjesa qendrore (e kalibruar)**
- Shkoj te Job Analyzer, ngjit një shpallje për një rol Senior Frontend.
- Ndërsa po ngarkohet, them: "Ky është thelbi i CareerOS. Nuk ju jep një numër të rrumbullakosur — ju thotë **mbi çfarë baze** ka dhënë notën."
- Kur kthehet rezultati, theksoj:
  - **Fit score-i** dhe **basis-i** (explicit/inferred/speculative)
  - **Confidence rationale** ("Matched 7/9 skills, seniority inferred...")
  - Matched / missing skills
  - Salary: nëse listing-u nuk ka salary, kthen guidance, jo numra të hallucinuar
  - Company context panel (anash)
- "Vërejtni — kjo llogari ka 4 outcomes të kapura nga më parë. Modeli i ka përdorur si calibration examples. Po të kishte qenë llogari e re, scoreja mund të kishte qenë 8 pikë më e lartë."

**[2:30 – 3:30] Tailored CV + Cover Letter**
- Klikoj "Tailor CV" në faqen e job detail.
- Side-by-side diff: skills të reorderuar, bullets të rishkruar.
- Pastaj klikoj inline-CTA "Generate Cover Letter".
- Tregoj copy-n: 3 paragrafë, të specifikë, pa "I am passionate about" (sistemi i ndalon shprehimisht këto në system prompt — e di përmendës).

**[3:30 – 4:30] Interview Coach (adaptive mode)**
- Filloj një session të ri intervistë për të njëjtin rol.
- Përgjigjem **qëllimisht në mënyrë të paqartë** për pyetjen e parë (behavioral).
- Modeli kthen një **follow-up**, jo pyetjen tjetër — kjo është pjesa adaptive (T1-2).
- Pastaj jap përgjigje më të plotë, vazhdon me pyetjen tjetër.
- Tregoj feedback strukturë: strengths, improvements, score, STAR coverage si checkbox për behavioral.
- Klikoj `/interview/progress` për ta treguar trendin nëpër sessione.

**[4:30 – 5:30] Outcome capture + post-mortem (loop-i mbyllet)**
- Shkoj te Applications, marr një aplikim ekzistues, e ndryshoj statusin në "rejected".
- OutcomeModal hapet: stage reached, reason.
- Pas ruajtjes, shfaqet kartela e rejection post-mortem.
- AI kthen: likely_gap, çfarë bëjnë profile të ngjashme, sugjerim për Career Ladder.
- "Dhe ky është loop-i i mbyllur — outcome-i futet automatikisht në historikun që kalibron fit score-t e ardhshëm."

**[5:30 – 6:00] Analytics — provë e loop-it**
- Hap Analytics tab.
- Tregoj AI Calibration widget: "scores over-predict by ~12 pts — be more selective".
- Tregoj rejection patterns (top 3 missing skills nga rejections).
- Cohort benchmark (nëse cohort ka ≥20 anëtarë; nëse jo, them që është privacy threshold).

**[6:00 – 6:30] Career Ladder — quick tour**
- Klikoj te /career.
- Tregoj 3 paths (IC, Management, Specialised Pivot).
- Klikoj një roadmap item → status bëhet `in_progress` → progress bar lëviz.
- "Pse kam zgjedhur ta lë në fund: është feature që ka vlerë në kohë të gjatë, jo në një demo single-shot."

**[6:30 – 7:00] Mbyllje**
- Përmbledhje në 2 fjali: "loop i plotë + AI që mëson nga ti".
- Pyetje.

---

## 3. Pjesët teknike që do të shpjegoj shkurt

Do të mbaj shpjegimet teknike në **pikat ku ka vlerë të vërtetë inxhinierike**, jo në çdo file. Audienca e humb fokusin shpejt nëse zhytemi në strukturë folderash — por nëse pyetet, kam përgjigje konkrete për çdo zgjedhje.

### a) Stack-u dhe arsyeja e secilës zgjedhje

| Shtresë | Tech | Pse pikërisht kjo |
|---|---|---|
| Framework | **Next.js 16 (App Router)** + React 19 | Server Components më lejojnë të bëj DB queries direkt në server pa shtresë API për leximet, ndërsa API routes e mbajnë AI-n në server (kurrë në klient — `ANTHROPIC_API_KEY` është server-only). Routing-u file-based mapon 1:1 me 7 features-at e platformës: `(dashboard)/cv`, `(dashboard)/jobs`, etj. Route groups më lejojnë të ndaj `(auth)` nga `(dashboard)` me layout-e të ndara pa ndryshuar URL-të. |
| Runtime | **Node.js (jo Edge)** | `pdf-parse` dhe `pdfjs-dist` kanë nevojë për Node API — ndaj çdo route AI ka `export const maxDuration = 60` dhe `next.config.ts` lista `pdf-parse` + `pdfjs-dist` te `serverExternalPackages`. |
| DB + Auth + Storage | **Supabase** | Një vendor për të treja → më pak surface për të menaxhuar. Postgres me RLS native do të thotë që policies janë në DB layer, jo në kod aplikacioni — më e vështirë me e bypass-uar aksidentalisht. Storage për CV PDF-të me path-scoped RLS (`{user_id}/{filename}`). |
| AI | **Vercel AI SDK + Anthropic Claude Haiku 4.5** | AI SDK ofron një abstraksion të vetëm për `generateText`/`generateObject`/`streamObject` — model-agnostic nëse na duhet të ndërrojmë. Haiku është mjaft i shpejtë për UX të mirë (job analysis ~3–5s) dhe shumë më i lirë se Sonnet/Opus, që ka rëndësi kur çdo user mund të bëjë 10 calls/orë. |
| Validim | **Zod** | Ka rol të dyfishtë (shih (c) më poshtë). |
| Data fetching | **TanStack React Query** | Cache + invalidation deklarativ (p.sh., kur bëhet `outcome capture`, invalidoj `["analytics"]` dhe widget-et i marrin data-t e reja vetë). Më mirë sesa state manual + useEffect. |
| Styling | **Tailwind v4** (`@tailwindcss/postcss`) | v4 punon me CSS variables nativisht, ndaj theme switching (dark/light) bëhet duke override-uar variables në `:root` vs `.light`, jo duke duplikuar klasa. Më poshtë te (e) shpjegoj sistemin e tokens. |
| Theming | **next-themes** me `attribute="class"` | Server-render-safe, pa flash të dark→light në load. |

### b) Arkitektura e auth-it: 3 lloje Supabase clients

Kjo është e zakonshme me e ngatërruar. Kemi **tre** kliente, secili me një rol të qartë:

1. **Browser client** (`createBrowserClient`) — për Client Components. Përdor anon key, RLS aktive.
2. **Server client** (`createServerClient` me cookie forwarding) — për Server Components dhe API routes. Lexon cookies të requestit, mban session-in e përdoruesit, RLS aktive.
3. **Admin client** (service role key) — bypass-on RLS. Përdoret **vetëm** për: storage operations (upload/download CV), CV parsing pipeline, dhe demo route i palogazhuar. Ky kurrë në klient.

`src/middleware.ts` ekzekutohet në çdo request dhe refresh-on session-in (Supabase tokens kanë short TTL). Dashboard layout bën dy-fish check me `getUser()` për t'u siguruar — nëse middleware-i rri, layout-i ende mbron.

### c) Çfarë është Zod dhe pse përdoret në dy vende të ndryshme

Zod është një runtime schema validator për TypeScript. Pse runtime? — sepse compile-time types nuk e ndalin një user me ngjit JSON të shkatërruar te API. Përdoret në dy role krejt të ndarë:

**Roli 1 — validim i request bodies (`src/lib/validation/schemas.ts`):**
```ts
const result = JobAnalyzeSchema.safeParse(body);
if (!result.success) return errorResponse(result.error.errors[0].message, 400);
```
Çdo API route validon bodyin para se të bëjë çfarëdo. Mbron nga: missing fields, type mismatches, string lengths jashtë rangut, URLs invalide. Mesazhi i parë i errorit kthehet te user-i.

**Roli 2 — schema për AI structured output (`generateObject` / `streamObject`):**
```ts
const { object } = await generateObject({
  model: anthropic("claude-haiku-4-5"),
  schema: JobAnalysisSchema,  // i njëjti format Zod
  prompt: buildJobAnalysisPrompt(...)
});
```
AI SDK e konverton schema-n në JSON Schema, e dërgon te Claude si tool call constraint, dhe Claude **garantohet** të kthejë output që match-on schema-n. Nëse nuk match-on, SDK retry-on automatikisht. Kjo eliminon "AI kthen markdown ose JSON të dëmtuar" si klasë e tërë problemi.

Versioni fillestar i interview feedback-ut i parsuar markdown-in me `[SCORE: 85]` regex — i brishtë. Sot është një `streamObject` me `InterviewFeedbackSchema`, dhe UI render-on objektin pjesë-pjesë ndërsa streamohet (strengths si listë, STAR si checkboxe).

### d) Si funksionon kalibrimi (core differentiator-i im)

- Kur përdoruesi ka ≥3 outcome të kapura, marr 10 nga aplikimet e fundit (5 pozitive, 5 rejections).
- I injektoj në prompt si few-shot examples përpara rubrikës.
- Modeli sheh: "ky kandidat mori 70 dhe nuk u përgjigj askush" → e di që duhet të jetë më i rreptë.
- Rubrika ka **banda fikse të dokumentuara** (90–100, 75–89, 60–74, 40–59, 20–39, 0–19) — modeli nuk mund të dalë jashtë tyre pa arsye të qartë, dhe i lejohet vetëm ±5 për nuancë brenda bandit.
- Kjo është në `buildJobAnalysisPrompt` te `src/lib/ai/prompts.ts`.

**Skill ground truth (SG-6):** Matched/missing skills nuk i prodhon Claude. Janë llogaritje **deterministe** mbi skill taxonomy-n: `matched = listing_skills ∩ cv_skills`, `missing = listing_skills − cv_skills`. Claude prodhon vetëm fushat cilësore (rationale, suggestions, salary). Kjo do të thotë që dy users me të njëjtin CV dhe të njëjtën listing marrin të njëjtin matched/missing list — pa AI variance.

### e) Skill Taxonomy: pse normalizer deterministik

Versioni fillestar trajtonte skills si `string[]` ad-hoc. Problemi: "React.js", "ReactJS", "react" dhe "React" trajtohen si 4 skills të ndryshme. Që fit score të jetë i krahasueshëm nëpër users, na duhej një burim i vetëm i së vërtetës.

- `data/skills-taxonomy.json` — checked into repo, ships in PRs (treated as code).
- 9 kategori: language, framework, database, cloud, devops, tool, concept, domain, soft.
- 3-tier lookup në `src/lib/skills/normalizer.ts`:
  1. Exact match në `canonical_name` (case-insensitive)
  2. Match në çfarëdo `alias`
  3. Normalized match (strip punctuation, lowercase): `"react.js"` → `"reactjs"`
- O(1) lookup via in-memory Map, 10-min cache TTL.
- Skills të panjohura logohen në `unknown_skills`. Loop javor: `npm run review:unknowns` → edit JSON → `npm run seed:taxonomy`.

### f) Theming: design tokens, jo hex hardcoded

Tema dark/light punon me CSS variables, jo me Tailwind dark variant. `globals.css` ka:
```css
:root { --background: #0f0e0c; --accent: #f59e0b; ... }
.light { --background: #faf9f7; --accent: #d97706; ... }
```
Komponentët përdorin `bg-[var(--card-bg)]`, kurrë `bg-stone-900`. Sidebar-i mban dark edhe në light mode (qëllimisht — kontrasti më i mirë për navigim).

**Një rregull konkret accessibility:** `bg-amber-500` butona duhet të kenë `text-stone-900`, kurrë `text-white` — `#f59e0b` mbi white nuk kalon WCAG AA.

### g) Rate limiting fails CLOSED

- Two-tier: global 10/orë per user, plus per-route caps (`cv/parse` 3/h, `cover-letter/generate` 5/h, `cv/tailor` 2/h, etj.).
- Tracking në `rate_limit_events` table (rolling window, jo bucket fix).
- Check para AI call → AI call → consume pas success-it (ndryshe nga "consume first" që do të penalizonte fail-et e DB-së).
- **Nëse DB jep error gjatë check-ut → mohojmë requestin.** Kjo është e qëllimtë. Çdo AI call kushton para reale; një bug që "fails open" do të hapte derën për abuse.
- Returns HTTP 429 me `Retry-After: 3600`.

### h) Demo i palogazhuar (landing demo)

- Tabela e veçantë `demo_rate_limits` me hash SHA-256 të IP-së (kurrë IP raw — privacy by design).
- Pa RLS — qëllimisht — sepse aksesohet vetëm via admin client. Komenti në `schema.sql` e dokumenton këtë.
- 1 për IP në ditë. Hashi parandalon enumeration nëse dikush sheh DB-në.

### i) PDF parsing pipeline (gotcha që e zgjidha)

- `pdf-parse` për tekst të thjeshtë; `pdfjs-dist` si fallback për layouts kompleks.
- `pdfjs-dist` pret DOM API (DOMMatrix, DOMPoint, DOMRect) që nuk ekzistojnë në Node.
- Fix: stubs në `src/lib/pdf/polyfills.ts`, thirrur via `applyPdfPolyfills()` në fillim të `cv/parse` route-it.
- I brishtë gjatë upgrades të `pdfjs-dist` — kam koment në kod me arsyen.

**Çka NUK do ta hap pa u pyetur:** RLS policies file-by-file, struktura e plotë e folderave, çdo Zod schema. Janë në kod, dhe `CLAUDE.md` është dokumentacioni autoritativ nëse vlerësuesit duan të lexojnë vetë.

---

## 4. Çka kam kontrolluar para demos

Checklist konkret që e kaloj **një orë para prezantimit**:

**Build + deploy:**
- [ ] `npm run build` kalon pa errors
- [ ] `npm run lint` pa warnings të reja
- [ ] `npx vitest` — testet kalojnë (rate limit tests veçanërisht)
- [ ] Deploy në Vercel kalon pa errors
- [ ] Live URL hapet në incognito + në mobile

**Llogaria demo:**
- [ ] Llogari demo e dedikuar (jo personale) — `demo@careeros.app` ose ngjashëm
- [ ] CV e ngarkuar dhe aktive (PDF i pastër, parse_status = 'completed')
- [ ] 4–5 aplikime me outcomes të kapura (që kalibrimi të jetë i dukshëm)
- [ ] 2–3 sessione intervistë të mbyllura me score (që Progress page të ketë trend)
- [ ] Career roadmap e gjeneruar me të paktën 1 item `done`, 1 `in_progress`
- [ ] Rate limit jo afër kufirit (nuk dua të marr 429 mes demos)

**Të dhëna gati:**
- [ ] Shpallje pune në clipboard, **2 versione**: njëra me salary të shfaqur, tjetra pa
- [ ] Përgjigje "e dobët" dhe "e mirë" e parapërgatitur për intervistën adaptive (që follow-up logic-u të aktivizohet besueshëm)
- [ ] Backup video i gjithë demos (screen recording 3–5 min) i ngarkuar dhe i lidhur

**Mjedisi fizik:**
- [ ] Browser në incognito, zoom 110%, vetëm tab-at e nevojshëm
- [ ] Notifications off (Slack, email, OS)
- [ ] Wifi i testuar; hotspot i telefonit gati si fallback
- [ ] Browser cache i pastruar — që login-i të jetë "fresh" sikur përdorues i ri
- [ ] Dark mode (kontrasti më i mirë në projektor)

**Repo:**
- [ ] README i përditësuar (verifikuar — pasqyron features aktualë sipas FEATURE_AUDIT.md)
- [ ] `docs/demo-plan.md` i committuar
- [ ] Git push i fundit përpara prezantimit
- [ ] Repo public (ose access i dhënë vlerësuesve)

**ENV vars në Vercel:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ANTHROPIC_API_KEY`
- [ ] OAuth providers (Google + GitHub) të konfiguruar nëse do ta tregoj atë rrugë

---

## 5. Plani B nëse demoja live dështon

E kam menduar në **3 nivele**, varësisht se sa thellë shkon problemi.

**Niveli 1 — Internet i ngadaltë / API call-i pa kthim:**
- Vazhdoj të flas, them "ndërkohë që po pres, le të shpjegoj çfarë po ndodh prapa skenës."
- Shpjegoj rate limiting / prompt strukturën / Zod validation gjersa kthehet response-i.
- Nëse pas 15 sekondash ende asgjë → kaloj në Niveli 2.

**Niveli 2 — Një feature i caktuar nuk punon (p.sh. AI call jep 500):**
- Kaloj direkt te **screenshots-et e parapërgatitur** për atë feature (i kam në një folder lokal + në Notion).
- Vazhdoj demon live për pjesët e tjera që funksionojnë.
- Jam i sinqertë: "Ky endpoint po ka problem tani — ja screenshots-et nga ekzekutimi i fundit i suksesshëm."

**Niveli 3 — Aplikacioni live nuk hapet fare / Vercel down / DB down:**
- Kaloj 100% në **video backup-in 3–5 minutësh** (i ngarkuar paraprakisht në Drive me share link, edhe lokalisht në laptop).
- Pas videos, hap kodin në VS Code dhe tregoj 2 file kritikë: `src/lib/ai/prompts.ts` (rubrika + kalibrimi) dhe `src/lib/rateLimit.ts`.
- Kjo akoma e tregon vlerën inxhinierike edhe pa app live.

**Niveli 4 — laptop-i im jashtë funksioni:**
- Slide deck-u + video backup-i janë në Drive.
- Mund ta hap nga laptop-i i dikujt tjetër ose nga telefoni (deck minimal i optimizuar).

**Rregulla që ndjek pavarësisht nivelit:**
- Kurrë mos shqetësohem live — nëse panikohem, audienca e ndjen.
- Nuk gjykoj veten me zë ("oh jo, kjo zakonisht punon..."). Vazhdoj rrjedhshëm.
- Mbaj timing-un. Nëse jam vonë, e shkurtoj Career Ladder dhe Analytics — Job Analyzer + Outcome loop janë "must show".

---

## Shtojcë: Mesazhe kyçe që duhet të mbeten te audienca

Nëse pas demos audienca mban mend vetëm 3 gjëra, duhet të jenë:

1. **CareerOS mbyll loop-in e plotë** — nga CV deri te outcome — jo një feature i veçuar.
2. **AI mëson nga përdoruesi** — fit score-t kalibrohen me historikun real të aplikimeve, jo janë numra statikë.
3. **Inxhinierikisht është i ndërtuar serioz** — RLS gjithkund, rate limiting fails closed, validim Zod, prompts të centralizuar, schema idempotent.

Çdo gjë tjetër — features, dizajni, navigimi — janë support për këto tre.
