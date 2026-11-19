# Winter Solstice 2026 — the official program

How the programming team's master sheet became the app's program, what was decided while
reading it, what was left out, and what is still open. Companion to
[CONTENT-MODEL.md](CONTENT-MODEL.md) (field contracts, joins, import) and
[WSOL26-PLAN.md](WSOL26-PLAN.md) (WS7 · Content).

## Source

**"Programming WSOL26 Team Master Doc"** (Google Sheets, shared by the owner on 2026-11-19):
<https://docs.google.com/spreadsheets/d/11tzO-DOgjlLDLNno3ZAHHGvIB63RpCN8OQc6AU7pCEU>

It replaces the copy first read on 2026-10-29 ("Copy of Programming Team Master Doc",
`1i62hOJiy1rlJFBStv884FB2p6Kp_OYpN97QNPKMcvCU`), kept only to diff against — see
[What changed on 2026-11-19](#what-changed-on-2026-11-19).

The **General Program** tab carries the schedule. It is a grid: one row per time slot
(columns A–C: time, session type, duration), one column per day, and the two class days
(Wed 16, Sun 20) split into five venue columns — Tantric Shelter, Gurdwara, Churuata, Tree
Pavilion, Inco Park. Tuesday 15 (arrival), Thu–Sat 17–19 (White Tantric Yoga®) and Monday 21
(departure) have one column each. Merged cells say "same thing across these venues / days",
free text in a cell is the session (usually `Title: Teacher`), `-` means nothing in that venue.

The other tabs:

- **Teacher Needs** — the teachers' own form answers: bio, country, class title, class
  description, language of instruction, each row marked "correct and ready to publish". It
  is the source of the class descriptions and of new teachers' bios. It also holds emails,
  phone numbers and lesson plans, which **never leave the sheet**.
- **Gurdwara** (two dated entries and a set-up checklist), **Rensaibai** (four musicians),
  **Sadhana** (who leads which morning, with candidates) — team notes.
- **Youth camp** and **Team Needs** — empty.

## What it became

| Artifact | Content |
|---|---|
| `scripts/wsol26-official-program.mjs` | The transcription: every session as code, with the reading decisions below. Run it to rewrite the fixture (it bumps `version`). |
| `scripts/fixtures/wsol26.json` (v13) | `program` 93 items over Dec 15–21 (9 tagged "To be announced"), `venues` 23 (Inco Park promoted to a program venue, Tree Pavilion added), `teachers` 18. |
| `references/wsol26-teachers-production.json` | Snapshot of the 12 presenters production first carried (ids, names, name variants, bios, photos), so the fixture and the CSV reuse their ids. The other six come from the summer booklet data or the Teacher Needs tab (see the name table below). |
| `scripts/fixtures/csv/wsol26-{program,venues,teachers}.csv` | What goes into **Event App → Import** (`npm run fixtures:csv -- wsol26`). |

Everything the sheet leaves open carries the tag **"To be announced"** and says what is
missing in its description, so it is visible in the app and easy to grep in the CSV.

## Reading decisions

Day structure, in the sheet's own times:

- **Tue 15 (arrival):** "Registration: 2-8 pm"; Gurdwara 2:00–5:30 PM (Sukhmani 2–4, Rehras
  4–4:30, Anand Sahib, Ardas and Hukam 4:30–5:30); Dinner 5:30 "langar style"; Karma Yoga
  Action 6:30–7:00; Opening Circle 7:30–9:00; bazaar closes 9:45; Lights Out 10:00.
- **Wed 16 and Sun 20 (full days):** Wake Up 3:00 · Aquarian Sadhana 3:40–6:00 · Gurdwara
  6:15–7:15 · Breakfast 7:15–8:15 · All-Camp Meditation + Karma Yoga Meetings 8:30–9:30 ·
  workshops 9:45–11:00 and 11:15–12:30 · Lunch + Free Time 12:30–1:45 · All-Camp Class
  1:45–3:30 ("everyone — no parallel classes") · workshops 3:45–5:00 · Rehras 5:00–5:30 ·
  Dinner 5:30–6:30 · Karma Yoga Action 6:30–7:00 · evening music 7:30–9:30 · bazaar 9:45 ·
  Lights Out 10:00.
- **Thu 17 – Sat 19 (WTY):** Sadhana 3:40–5:50 and Gurdwara 5:50–7:00 (cell note: "Shorten
  Kriya and Gurdwara on WTY days"), Breakfast 7:00–8:00, "Gates open 7:15 AM · White Tantric
  warm-ups 8:00 AM", then the WTY block fills the day through the Rehras row (5:30 PM).
- **Mon 21 (departure):** Sadhana, Gurdwara and Breakfast as on a full day, then "Departure —
  final morning practice complete. Travel day, no scheduled afternoon or evening program."

How the cells were turned into items:

- **"Wake Up"** is published as **"Rise up sweet family dear!"**, the traditional call the
  app has used since the summer booklet (it renders as a routine row).
- **Meals** sit at **CHURUATA** (the map's dining hall); the sheet gives no meal venue.
- **"All-Camp Meditation + KYM"** is one 8:30–9:30 item, *All-Camp Meditation & Karma Yoga
  Meetings*, at Tantric Shelter — the sheet gives the hour, not the split.
- **Breaks** (9:30, 11:00, 3:30) are not items.
- **Sat Nam Rasayan** (Wed): the all-camp class 1:45–3:30 and the "SNR" cell at 3:45–5:00
  are one item, 1:45–5:00 with a break, matching the 3-hour session of 2025. The title stays
  as the grid has it; the form calls the class "Mastering Your Meditative Mind: A Sat Nam
  Rasayan Healing Experience".
- **Class descriptions** come from the Teacher Needs tab ("Class description"), as the
  teachers wrote them: only whitespace and a missing final period are touched, and a title
  repeated as the first line is dropped. All-camp classes keep "All camp together, no
  parallel classes." at the end. A class taught in two languages carries `language`.
- **Gurdwara** on full days is 6:15–7:15 AM. Wednesday's cell reads "6:30 Akhand Paath
  Start" and the Sunday Gurdwara column carries "Sikh/minister vows, morning Gurdwara on Dec
  21st 645am": both are one sentence added to that morning's Gurdwara description (Wed and
  Mon), not separate items.
- **Tuesday's Gurdwara** is one item, 2:00–5:30 PM, with its three parts and their times in
  the description.
- **"SDI"** (Wed 11:15, Churuata) is now *Mera Man Loche: The Soul's Longing for the Guru*
  with Sat Nam Kaur; **IKYTA Day** is with Rai Singh.
- **WTY Monitors Meeting** (Wed, lunch row) and **WTY First Timers Meeting** (Wed, dinner
  row) are items over the meal hour: Monitors at Churuata, First Timers at Tantric Shelter
  (owner, 2026-10-29). The Monitors cell is merged Wed→Sun in the sheet; it is published for
  Wednesday only, as in 2025.
- **Rewiring Stress into Strength** (Sun 1:45–3:30, the all-camp class) is at Churuata, not
  the Tantric Shelter (owner, 2026-10-29).
- **White Tantric Yoga® – Day One/Two/Three**: 8:00 AM (warm-ups) to 5:30 PM, description
  carries "gates open 7:15". The sheet does not state the end time.
- **Kids Camp** 9:00–5:00 on Wed–Sun as "To be announced" (the Youth camp tab is empty but
  exists); **Friday's** description adds the Gurdwara visit at 2:30 PM from the Gurdwara tab
  ("Childrens camp 12-18-26 2:30"). The first transcription put it on Thursday by mistake.
- **Evening (Wed–Sat):** the row is "Yogi Tea Café Music / Gong in Churuata at 8:30–9:30".
  Wednesday is the *3HO All-Star Music Jam* 7:30–9:30 (published at BAZAAR / YOGI TEA: the
  row is the Yogi Tea Café's and no venue column exists for it; the cell itself sits in the
  Tantric Shelter column) and the *Evening Gong* 8:30–9:30 at CHURUATA. Thu–Sat are the
  *Yogi Tea Café Open Mic* with the sheet's own text. The gong is written in the grid for
  Wednesday only; the row label still promises it every night, so Thu–Sat keep an *Evening
  Gong* tagged "To be announced".
- **Sunday evening:** *Closing Circle* 6:30–7:30 replaces Karma Yoga Action; *Nagar Kirtan*
  7:30–8:00 (no time in the sheet; its row sits between the closing circle and the Rensabai
  row); *Rensabai Kirtan* from **8:00 PM** ("Rensabhai 8:00", and the Gurdwara tab agrees)
  in the Gurdwara with Karina Skye, **through the night**, no end time (owner decision
  2026-10-29).
- **No Rehras on WTY days** (owner decision 2026-10-29): White Tantric Yoga® runs through the
  5:00 PM slot, so Thu–Sat carry no Rehras item.
- **Tuesday:** *Arrival & Registration* 2:00–8:00 PM at OFFICE (the map's registration
  point). The "program begins 3:00 PM · orientation / first sessions" cell is gone from the
  sheet, and so is the item.
- **Monday:** *Start the Journey Home* from 8:15, no end time.
- **Sadhana leaders:** only Wednesday is set (Dr Haridass Kaur, confirmed by the Sadhana
  tab). The other mornings have no facilitator; the Sadhana tab lists candidates (Manpreet
  Kaur, Satwant Singh, Dyal Gobinde Singh, Satkirin Kaur, Karina Skye, Sat Jot Singh).
- **Categories** are not in the sheet; assigned by title: kriya classes → *Kriya and
  Meditation*, Sat Bir Singh → *Lecture*, Sat Nam Rasayan / Jot Simrit / gong →
  *Meditation*, circles and all-camp gatherings → *Community*, IKYTA, Satwant Singh's
  discussion class and the untitled Sat Kirin Kaur slot → *Workshop*, the Mera Man Loche
  shabad class → *Mantras*, music and Rensabai → *Music*, Nagar Kirtan and Rehras →
  *Gurdwara*.
- **Ids are pinned.** An id is built from date + start time + title, so a session whose
  time or name changes would get a new id and every favorite and reminder saved on it would
  be lost. When the sheet moves or renames a session, the script passes the id it was first
  published with (`id:` in `add()`): the three full-day Gurdwaras (still `…-0600-gurdwara`),
  Rensabai (`…-1930-rensabai-kirtan`), Arrival & Registration (`…-1300-…`), the evening
  music slots (`…-1930-yogi-tea-caf-music`) and the gong (`…-2030-gong-meditation`).

Teacher names are written **exactly as production carries them** (the join is by name):

| Sheet | Published as |
|---|---|
| Chris Manaas | Chris Maanas |
| Sat Bir Singh Khalsa | Sat Bir Singh |
| SiriSimran Kaur | Siri Simran Kaur |
| Haridass Kaur / Dr. Haridass | Dr Haridass Kaur |
| Khushbir | Khushbir Singh |
| Devi Rajpriti Kaur, Jot Simrit, Dyal Gobinde, Satwant Singh | unchanged |
| Chief Open Heart, Karina Skye, Rai Singh, Shakta Kaur | added from the summer data (photo, no bio yet) |
| Sat Kirin Kaur | added from the summer data's "SS Satkirin Kaur Khalsa" (photo, no bio) — assumed to be the same person |
| Sat Nam Kaur | new, from the Teacher Needs tab (bio, Mexico; her headshot is a Drive link, so no photo until it is uploaded to the Media Library) |
| Kiret Naam Kaur | no profile anywhere: published as plain text (`NO_PROFILE` in the script) |

Venue names stay **uppercase as on the map and in production**: TANTRIC SHELTER, GURDWARA,
CHURUATA, INCO PARK, TREE PAVILION, CHILDREN'S CAMP, plus the landmarks OFFICE and
BAZAAR / YOGI TEA used as locations. **Inco Park** was a map-only landmark and is now a
program venue (it keeps its pin); **Tree Pavilion** is new and has no pin until someone
points at it on the artwork (venues without `mapPoint` are listed, not drawn).

Photos taken from the summer data are app paths (`/images/teachers/…`): the app serves
them from its own bundle and the plugin's website shortcodes resolve them against the
app's web deployment, so they show in both places.

## Left out on purpose

- **KRI Trainer Forum** (Tue 10:30–5:00, Tantric Shelter): the sheet says "internal, not
  published".
- **Tuesday's "unofficial setup sadhana"** (Sadhana tab) and "Finish SE setup": for the
  set-up crew.
- **"KY clean"** in the lunch row label: a karma-yoga duty, not a session.
- **Teachers with a form entry but no slot in the grid:** Karuna (*The Preserver*, in the
  grid until 2026-11-19), Sergio Akaal (*A Stronger You*), Jai Gopal Kaur (*Increasing
  Arcline Velocity*), Tej Dharam Singh (*The Art of Shoonya*).
- The Gurdwara set-up checklist and everything personal in Teacher Needs (emails, phones,
  lesson plans, equipment).

## What changed on 2026-11-19

Read cell by cell against the 2026-10-29 copy (fixture v12 → v13, 92 → 93 items, 21 → 9
"To be announced"):

- **Tue:** registration hours given (2–8 PM, was 1–8 tagged); Gurdwara 2:00–5:30 PM added;
  "Orientation & First Sessions" removed; dinner langar style.
- **Every day:** Karma Yoga Action is 30 minutes (6:30–7:00), was an hour.
- **Full days (Wed, Sun, Mon):** Gurdwara starts 6:15, was 6:00. Akhand Paath starts Wed
  6:30 AM. Sikh and Minister vows Mon 6:45 AM.
- **Wed:** *Mera Man Loche* with Sat Nam Kaur replaces "SDI"; IKYTA Day with Rai Singh; the
  evening is the 3HO All-Star Music Jam plus the Evening Gong.
- **Thu–Sat:** evenings are the Yogi Tea Café Open Mic; the Kids Camp Gurdwara visit moves
  to Friday (transcription fix, the sheet always said Dec 18).
- **Sun:** new *Morning Sadhana: Developing a Daily Practice* with Satwant Singh (9:45, Tree
  Pavilion); Women's Circle with Kiret Naam Kaur; Tantric Integration Circle with Shakta
  Kaur; **the Tree Pavilion 3:45 cell reads "Sat Kirin Kaur" where "The Preserver: Karuna"
  was**; Nagar Kirtan 7:30–8:00; Rensabai at 8:00 PM.
- **Class descriptions** for ten classes, now that the Teacher Needs tab is readable.
- Gone from the sheet: the Amrit 2:00 AM note, "Let's have the music, and gong together."

## Open questions for the programming team

1. **The Preserver (Karuna).** Sunday 3:45 PM at Tree Pavilion now reads "Sat Kirin Kaur",
   with no title. Published as *Workshop with Sat Kirin Kaur*, tagged; Karuna's class is no
   longer in the program. Confirm it was dropped on purpose, and send the new class's title
   and description. Confirm too that Sat Kirin Kaur is Satkirin Kaur Khalsa (her summer
   photo is used).
2. **WTY hours.** Confirm start and end (published 8:00 AM–5:30 PM; 2025 ran to 6:00 PM).
3. **Gurdwara on full days** at 6:15: the time label changed but the duration column still
   says 1 hr 15 min (6:00–7:15).
4. **Akhand Paath** begins Wed 6:30 AM. When does it end?
5. **Monday's vows** ("Sikh/minister vows, morning Gurdwara on Dec 21st 645am"): are the
   vows at 6:45 inside a 6:15 Gurdwara, or does that Gurdwara start at 6:45?
6. **3HO All-Star Music Jam** venue: Yogi Tea Café (published) or Tantric Shelter (the
   column the cell sits in)?
7. **Evening Gong** on Thu–Sat (the grid shows it on Wednesday only) and who plays each night.
8. **Nagar Kirtan** time: 7:30–8:00 PM is inferred from the Closing Circle and Rensabai.
9. **Rensabai**: the tab now lists Karina Skye, Livtar Singh, Japa and Sat Kiran; published
   with Karina Skye only. It runs through the night, so Sunday's 10:00 PM Lights Out, which
   the sheet merges across Tue–Sun, may not apply.
10. **Sadhana leaders** for Thu–Mon.
11. **Rewiring Stress into Strength**: the cell is in the Churuata column but its text still
    says "Tantric Shelter". Published at Churuata (owner, 2026-10-29).
12. **Sat Nam Rasayan** (Wed): one session 1:45–5:00 with a break, or two? And which title:
    the grid's or the form's.
13. **IKYTA Day** (Wed 11:15): what the session is.
14. **Kids Camp** daily schedule (Youth camp tab is empty).
15. **Profiles**: Kiret Naam Kaur (nothing yet); Sat Nam Kaur's photo; bios for Rai Singh,
    Shakta Kaur, Sat Kirin Kaur, Chief Open Heart and Karina Skye.
16. **Tree Pavilion**: where it is on the map.
17. A loose note ": Chris Maanas - Meditation" is still not placed anywhere.

## Importing into production

The production event is **`winter-solstice-2026`** (the fixture's `wsol26` is the mock's
slug). One import feeds both the app (sync bundle) and the website: the public page
<https://www.3ho.org/winter-solstice-2026/program-and-teachers/> renders the same rows
through the plugin's `[ssa_program]` / `[ssa_teachers]` shortcodes. Order, in **Event App →
Import** (`wp-admin/admin.php?page=ssa-import`):

1. **Venues** · `wsol26-venues.csv` · *Add or update* — updates Inco Park (now `kind` venue)
   and adds Tree Pavilion; the other rows are unchanged re-imports (pins included).
2. **Teachers** · `wsol26-teachers.csv` · *Add or update* — the 12 existing rows match by id,
   Chief Open Heart and Karina Skye are added.
3. **Program** · `wsol26-program.csv` · **Replace**, *Validate only* first, then for real.
   Replace retires the rows the file does not carry; favorites on the recurring items
   (same ids: Sadhana, Gurdwara, meals, Lights Out…) survive.

Every import bumps `content_version`; installed apps pick it up on their next sync.

**Done 2026-10-29** (fixture v11): venues 23 imported (content version 23), teachers 14
(v24), program 92 imported and **60** template rows retired (v25) — not 87, because 27
recurring ids were shared with the template and updated in place. The public bundle
afterwards: 92 sessions, no duplicate ids, every `location`, `category` and `facilitator`
joined, INCO PARK a venue with its pin, TREE PAVILION listed without one. Each later
change to the sheet repeats step 3 only (plus 1 or 2 when venues or teachers change).
Later that day the owner moved *WTY First Timers Meeting* to Tantric Shelter and *Rewiring
Stress into Strength* to Churuata directly in wp-admin (content version 27); fixture v12 and
the CSV carry the same venues, so the next Replace keeps them.

## Keeping it current

The sheet will change. Edit the transcription in `scripts/wsol26-official-program.mjs`
(the schedule is plain data at the bottom of the file; constants at the top hold venue and
teacher names and the shared copy), then:

```bash
node scripts/wsol26-official-program.mjs && npm run fixtures:csv -- wsol26
```

The script refuses to write when a `location`, `category` or `facilitator` does not match
the fixture by name, so a typo cannot reach the app as a session without a venue or teacher.
Then update this doc's open questions and the CHANGELOG, and re-import with Replace.
