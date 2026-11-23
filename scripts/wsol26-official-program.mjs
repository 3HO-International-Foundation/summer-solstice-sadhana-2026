#!/usr/bin/env node
/**
 * wsol26-official-program.mjs — writes the official Winter Solstice 2026
 * program into scripts/fixtures/wsol26.json (program, venues, teachers), as
 * read from the programming team's master sheet:
 *
 *   https://docs.google.com/spreadsheets/d/11tzO-DOgjlLDLNno3ZAHHGvIB63RpCN8OQc6AU7pCEU
 *   ("Programming WSOL26 Team Master Doc", tab "General Program", read 2026-11-19;
 *   class descriptions from its "Teacher Needs" tab. First read 2026-10-29 from the
 *   earlier copy 1i62hOJiy1rlJFBStv884FB2p6Kp_OYpN97QNPKMcvCU.)
 *
 * The sheet is a grid (hours × day/venue columns) with merged cells and free
 * text, so it is transcribed here by hand rather than parsed. Every reading
 * decision and every open question is listed in docs/WSOL26-PROGRAM.md — keep
 * the two in step when the sheet changes, then:
 *
 *   node scripts/wsol26-official-program.mjs      → rewrites the fixture (bumps version)
 *   npm run fixtures:csv -- wsol26                → CSVs for Event App → Import
 *
 * Joins are by NAME (docs/CONTENT-MODEL.md): every `location` below must be a
 * venue name in the fixture and every `facilitator` must appear in a teacher's
 * facilitatorNames; the script asserts both before writing.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE = join(ROOT, "scripts", "fixtures", "wsol26.json");
const SUMMER_TEACHERS = join(ROOT, "src", "data", "teachers.json");

/* ---------------------------------------------------------------- venues */
const TANTRIC = "TANTRIC SHELTER";
const GURDWARA = "GURDWARA";
const CHURUATA = "CHURUATA";
const TREE = "TREE PAVILION";
const INCO = "INCO PARK";
const KIDS = "CHILDREN'S CAMP";
const YOGI_TEA = "BAZAAR / YOGI TEA CAFÉ"; // was "BAZAAR / YOGI TEA" (owner, 2026-11-23)
const OFFICE = "OFFICE";
// Where Guru Ka Langar and every meal is served (owner, 2026-11-23). Not labelled on the
// map artwork, so it is listed without a pin until someone points at it.
const LANGAR_HALL = "LANGAR HALL";

/* ------------------------------------------------------------- teachers */
// Names exactly as production (winter-solstice-2026) carries them, so the
// CSV joins on import without edits.
const HARIDASS = "Dr Haridass Kaur";
const CHRIS = "Chris Maanas";
const SAT_BIR = "Sat Bir Singh";
const SIRI_SIMRAN = "Siri Simran Kaur";
const DEVI = "Devi Rajpriti Kaur";
const CHIEF = "Chief Open Heart";
const JOT_SIMRIT = "Jot Simrit";
const DYAL = "Dyal Gobinde";
const KHUSHBIR = "Khushbir Singh";
const KARINA = "Karina Skye";
const SATWANT = "Satwant Singh";
const SAT_NAM = "Sat Nam Kaur";
const RAI = "Rai Singh";
const SHAKTA = "Shakta Kaur";
const SAT_KIRIN = "Sat Kirin Kaur";
// Named in the sheet but without a profile yet (no bio or photo anywhere): shown
// as plain text in the app until the team sends one.
const KIRET = "Kiret Naam Kaur";
// Rensabai has several musicians; `facilitator` holds one name, so it reads "Multiple
// Artists" and the description names them (owner, 2026-11-23).
const MULTIPLE = "Multiple Artists";
const NO_PROFILE = new Set([KIRET, MULTIPLE]);

/* ----------------------------------------------------------------- copy */
const TBA = ["To be announced"];

const RISE = "Wake up, get cleaned up, get ready for Sadhana!";
const SADHANA = "Japji Sahib, a Kundalini Yoga kriya and the Aquarian Sadhana mantras. Come as you are, bring a blanket.";
const SADHANA_WTY = `${SADHANA} Shorter on White Tantric Yoga® days.`;
const GURD = "Gurdwara is a sacred space of Shabad (sound current), sangat (community), and seva (service). Whether this is your first time or a treasured tradition, you're invited to sit together in remembrance, sing the Naam, and bathe the mind in Gurbani kirtan. All are welcome.";
const GURD_WTY = `${GURD} Shorter on White Tantric Yoga® days.`;
const AKHAND_SIGNUP = "To sign up as a reader or sevadar, contact Maha Atma at mahankaur6@gmail.com.";
const GURD_AKHAND = `${GURD} With a Siri Singh Sahib lecture. The Akhand Paath / Sahej Paath, the reading of the Siri Guru Granth Sahib, begins at 6:30 AM. ${AKHAND_SIGNUP}`;
const GURD_BHOG = `${GURD} Shorter on White Tantric Yoga® days. Bhog of the Akhand Paath / Sahej Paath at 6:15 AM.`;
const GURD_VOWS = `${GURD} Sikh vows and Minister vows are taken this morning at 6:45 AM.`;
const GURD_TUE = "The Gurdwara opens the Solstice: Sukhmani Sahib 2:00–4:00 PM, Rehras Sahib 4:00–4:30 PM, then Anand Sahib, Ardas and Hukam 4:30–5:30 PM. All are welcome. Afterwards, go to the Langar Hall for Guru Ka Langar.";
const MEDITATION_KY = "A short all-camp meditation, then meet your Karma Yoga or Service Exchange team. All attendees have a karma yoga: it keeps the event sustainable and flowing. Unsure of yours? Ask at the event office.";
const LUNCH = "Free time until the afternoon program.";
const REHRAS = "Evening prayer, followed by Sukhasan (Hukam, Kirtan Sohila, Ardas).";
const WTY = "Gates open 7:15 AM, warm-ups 8:00 AM. Wear white clothing and a white head covering. Lunch is served midday. Doors close when a meditation begins and reopen when it ends.";
const MONITORS = "During lunch. Interested in being a Monitor at White Tantric Yoga® (WTY)? A WTY Monitor must have attended at least one day of WTY, wear white clothing and a white head covering, and wear the Monitor ID marker. Monitors receive the same benefits of WTY as if they were doing the meditations with a partner.";
const FIRST_TIMERS = "During dinner. First time at White Tantric Yoga®? Meet the WTY team and learn what to expect over the three days.";
const SNR = "In this experience, explore Sat Nam Rasayan® through meditation, breath, and partnered healing. Develop subtle awareness, presence, and intuition while supporting your own healing and others. Experience deep relaxation, nervous system regulation, and greater clarity, peace, and inner spaciousness. All camp together, with a short break at 3:30 PM.";const ALL_CAMP = "All camp together, no parallel classes.";
const CHECKIN = "Have your ticket QR code and a photo ID ready. If you don't have a service exchange or karma yoga team yet, one will be assigned at check-in.";
const DINNER_LANGAR = "Guru Ka Langar after the Gurdwara, served langar style.";
const DINNER_WTY = "Served after the White Tantric Yoga® program.";
const OPENING = "Come open the space with us! Welcome home, welcome back. Join the teachers to open this Winter Solstice Celebration with music, laughter, meditation and joy.";
const KIDS_DESC = "Program for children and youth while the adults are in class. Parents check children in and out. Daily schedule to be announced.";
const KIDS_FRI = `${KIDS_DESC} Today the Kids Camp visits the Gurdwara at 2:30 PM.`;
const MUSIC_JAM = "Enjoy an evening of devotional chanting mixed with original songs performed by a collection of your favorite Solstice musicians including Livtar Singh, Karina Skye, Japa Kaur and Sat Jot Singh.";
const OPEN_MIC = "Following a featured musical performer of the night, the stage is open to those wanting to share their musical talents. Interested parties can contact Japa Kaur to schedule a slot.";
const GONG = "Gong meditation and deep relaxation at the Churuata. Bring a blanket.";
const GONG_TBA = `${GONG} To be confirmed for this evening.`;
const IKYTA = "International Kundalini Yoga Teachers Association (IKYTA) session.";
const TANTRIC_INTEGRATION = "Integrate the three days of White Tantric Yoga®.";
const SAT_KIRIN_CLASS = "Class title and details to be announced.";
const CLOSING = "All camp together to close the Solstice, leading into Nagar Kirtan.";
const NAGAR = "Kirtan procession through camp from the Closing Circle to the Gurdwara, where Rensabai begins at 8:00 PM.";
const RENSABAI = "Rensabai Kirtan: musicians take turns singing Gurbani through the night, with Karina Skye, Livtar Singh, Japa Kaur and Sat Kiran.";
const DEPART = "Everyone who is not helping with camp tear-down leaves the site in the morning. Travel day: no afternoon or evening program.";

/* --------------------------------------------------- class descriptions */
// From the sheet's "Teacher Needs" tab (the teachers' own form answers, each marked
// "correct and ready to publish"). Only whitespace and a missing final period are touched.
const D_CHRIS = "In these times, everyday is harder and harder to live following the heart in every situation, stress & busy lifestyle make our heart depleted & we are pushed to have our mind in control. We'll use the power of our inner sun activating and uplifting our heart, remembering the love we are.";
const D_SAT_BIR = "In easy-to-understand language, this workshop will review modern biomedical research on yoga with a special focus on Kundalini Yoga. It will include the scientific evidence for how yoga works, clinical trials research, and the value and implications of yoga research in society and healthcare.";
const D_SAT_NAM = "We will explore the sacred Shabad of Guru Arjan Dev Ji, expressing the soul's deep longing for union with the Guru. Through reflection and chanting, we will connect with the essence of devotion, surrender, and the transformative power of Gurbani.";
const D_DEVI = "A heart-centered Kundalini Yoga journey into Divine Mother love: the primal power that nourishes, protects, creates and holds life. The class is moderately active, moving from kriya into deep meditation, mantra and stillness to experience love as strength, presence and grace.";
const D_SATWANT = "This is an inspirational class where we discuss the various types of Sadhana (40, 90, 120, 1000 days, Amrit Vela Sadhana). The benefits and challenges of it, what it takes to develop a lifelong practice. The goal is to leave students inspired to commit to a daily practice.";
const D_JOT = "Step into a transformative Kundalini practice designed to deepen your inner dialogue. Through rhythmic breathwork, targeted kriyas, and silent meditation, tune out external noise, awaken vital energy, and connect to the subtle guidance of your authentic self. Silence becomes your highest wisdom.";
const D_DYAL = "Kundalini Yoga. Be on time and ready to work! Full class of Kundalini Yoga Kriyas to prime the endocrine glandular system in perfect alignment with the winter solstice to release and rebirth at the sacred junction of the year. Ending with an extended kriya to purify sushumna and experience shuniya.";
const D_HARIDASS = `Directing Energy with Clarity. Stress is not the enemy; it is energy looking for direction. In this class, we transform the scattered patterns of overwhelm into a focused current of strength, clarity, and inner stability. Do this with somatic intelligence, movement, mantra, breath, and intention. ${ALL_CAMP}`;
const D_KHUSHBIR = "Yoga practice to stretch and exercise the body, regenerate nerves, adjust your rhythms and fine tune your frequency. A complete practice of a fun, challenging kriya, taught at full times, relaxation, and breath meditation with mantra. Love more fully, expand the universality of your personality!";

/* ------------------------------------------------------------- builders */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const slug = (s) => s.toLowerCase().replace(/®/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const items = [];
// `id` pins the id a session was first published with. Ids are built from date + start +
// title, so a session whose time or name changes would otherwise get a new id and lose
// every favorite and reminder attendees saved on it. Pin instead of letting it change.
function add(date, startTime, endTime, title, { id, category, location, facilitator, language, description, tags } = {}) {
  const item = { id: id ?? `${date}-${startTime.replace(":", "")}-${slug(title)}`, date, day: DAYS[new Date(`${date}T12:00:00Z`).getUTCDay()], startTime };
  if (endTime) item.endTime = endTime;
  item.title = title;
  if (category) item.category = category;
  if (tags) item.tags = [...tags];
  if (location) item.location = location;
  if (facilitator) item.facilitator = facilitator;
  if (language) item.language = language;
  if (description) item.description = description;
  items.push(item);
}

const rise = (d, end) => add(d, "03:00", end, "Rise up sweet family dear!", { description: RISE });
const sadhana = (d, s, e, extra = {}) => add(d, s, e, "Aquarian Sadhana", { category: "Sadhana", location: TANTRIC, description: SADHANA, ...extra });
const gurdwara = (d, s, e, description = GURD, extra = {}) => add(d, s, e, "Gurdwara", { category: "Gurdwara", location: GURDWARA, description, ...extra });
// Full days: Gurdwara moved from 6:00 to 6:15 AM (sheet, 2026-11-19); Wednesday's is back at
// 6:00 (owner, 2026-11-23). The id stays.
const gurdwaraFullDay = (d, description = GURD, start = "06:15") => gurdwara(d, start, "07:15", description, { id: `${d}-0600-gurdwara` });
// Meals are served in the Langar Hall (owner, 2026-11-23; they sat at Churuata before).
const meal = (d, s, e, name, description, extra = {}) => add(d, s, e, `🍴 ${name}`, { category: "Meal", location: LANGAR_HALL, description, ...extra });
// Renamed "… Karma Yoga / Team Meetings" and "Rehras Sahib" (owner, 2026-11-23); ids stay.
const meditationKY = (d) => add(d, "08:30", "09:30", "All-Camp Meditation & Karma Yoga / Team Meetings", { id: `${d}-0830-all-camp-meditation-karma-yoga-meetings`, category: "Community", location: TANTRIC, description: MEDITATION_KY });
const kids = (d, description = KIDS_DESC) => add(d, "09:00", "17:00", "Kids Camp", { category: "Community", location: KIDS, description, tags: TBA });
const rehras = (d) => add(d, "17:00", "17:30", "Rehras Sahib", { id: `${d}-1700-rehras`, category: "Gurdwara", location: GURDWARA, description: REHRAS });
const karmaYoga = (d) => add(d, "18:30", "19:00", "Karma Yoga Action", { category: "Service" });
// Evening slots keep the ids of the placeholders they replace ("Yogi Tea Café Music",
// whose slug dropped the é: "yogi-tea-caf-music", and "Gong Meditation"). The gong is written in the grid for Wednesday only; the row label
// still says "Gong in Churuata at 8:30-9:30" for every night, so Thu–Sat stay tagged.
const eveningMusic = (d, title, description) => add(d, "19:30", "21:30", title, { id: `${d}-1930-yogi-tea-caf-music`, category: "Music", location: YOGI_TEA, description });
const eveningGong = (d, confirmed) => add(d, "20:30", "21:30", "Evening Gong", { id: `${d}-2030-gong-meditation`, category: "Meditation", location: CHURUATA, description: confirmed ? GONG : GONG_TBA, ...(confirmed ? {} : { tags: TBA }) });
const night = (d) => {
  add(d, "21:45", null, "Bazaar closes", { category: "Logistics" });
  add(d, "22:00", null, "🌙 Lights Out", { category: "Logistics" });
};
const cls = (d, s, e, title, category, location, facilitator, extra = {}) => add(d, s, e, title, { category, location, facilitator, ...extra });

/* ------------------------------------------------------------- Tue Dec 15 · arrival */
let d = "2026-12-15";
add(d, "13:00", "20:00", "Arrival & Registration", { id: `${d}-1300-arrival-registration`, category: "Logistics", location: OFFICE, description: CHECKIN }); // from 1:00 PM (owner, 2026-11-23; the sheet says 2-8 pm)
gurdwara(d, "14:00", "17:30", GURD_TUE);
meal(d, "17:30", "18:30", "Langar", DINNER_LANGAR, { id: `${d}-1730-dinner` }); // "Instead of Dinner put Langar" (owner, 2026-11-23)
karmaYoga(d);
add(d, "19:30", "21:00", "Opening Circle", { category: "Community", location: TANTRIC, description: OPENING });
night(d);

/* ------------------------------------------------------------- Wed Dec 16 · full program day */
d = "2026-12-16";
rise(d, "03:40");
sadhana(d, "03:40", "06:00", { facilitator: HARIDASS });
gurdwaraFullDay(d, GURD_AKHAND, "06:00");
meal(d, "07:15", "08:15", "Breakfast");
meditationKY(d);
kids(d);
// Venues swapped (owner, 2026-11-23): the sheet has Sat Bir Singh in the Churuata column.
cls(d, "09:45", "11:00", "Raising the Heart with our Inner Sun Power", "Kriya and Meditation", TREE, CHRIS, { description: D_CHRIS });
cls(d, "09:45", "11:00", "Understanding the Science and Research on Yoga", "Lecture", CHURUATA, SAT_BIR, { description: D_SAT_BIR });
cls(d, "11:15", "12:30", "Mera Man Loche: The Soul's Longing for the Guru", "Mantras", CHURUATA, SAT_NAM, { description: D_SAT_NAM, language: "English / Spanish" }); // the slot the sheet first called "SDI"
cls(d, "11:15", "12:30", "IKYTA Day", "Workshop", TREE, RAI, { description: IKYTA });
meal(d, "12:30", "13:45", "Lunch", LUNCH);
add(d, "12:30", "13:45", "WTY Monitors Meeting", { category: "White Tantric Yoga", location: LANGAR_HALL, description: MONITORS }); // "@ Dining Hall" (sheet; owner, 2026-11-23)
cls(d, "13:45", "17:00", "Sat Nam Rasayan", "Meditation", TANTRIC, SIRI_SIMRAN, { description: SNR });
add(d, "15:45", "17:00", "Ministers Gathering", { category: "Community", location: CHURUATA }); // owner, 2026-11-23 ("3:45-54" read as 3:45–5:00)
rehras(d);
meal(d, "17:30", "18:30", "Dinner");
add(d, "17:30", "18:30", "WTY First Timers Meeting", { category: "White Tantric Yoga", location: LANGAR_HALL, description: FIRST_TIMERS }); // Langar Hall (owner, 2026-11-23)
karmaYoga(d);
eveningMusic(d, "3HO All-Star Music Jam", MUSIC_JAM);
// No Evening Gong on the 16th (owner, 2026-11-23).
night(d);

/* ------------------------------------------------------------- Thu 17 · Fri 18 · Sat 19 · White Tantric Yoga® */
// No Rehras on WTY days (owner decision 2026-10-29): WTY runs through the Rehras slot.
for (const [date, n] of [["2026-12-17", "One"], ["2026-12-18", "Two"], ["2026-12-19", "Three"]]) {
  rise(date, "03:40");
  sadhana(date, "03:40", "05:50", { description: SADHANA_WTY });
  // Thu and Fri end at 6:50 (owner, 2026-11-23); Saturday's carries the Bhog at 6:15.
  if (n === "Three") gurdwara(date, "05:50", "07:00", GURD_BHOG);
  else gurdwara(date, "05:50", "06:50", GURD_WTY);
  meal(date, "07:00", "08:00", "Breakfast");
  add(date, "08:00", "17:30", `White Tantric Yoga® – Day ${n}`, { category: "White Tantric Yoga", location: TANTRIC, description: WTY });
  kids(date, n === "Two" ? KIDS_FRI : KIDS_DESC); // Gurdwara tab: "Childrens camp 12-18-26 2:30" = Friday
  meal(date, "17:30", "18:30", "Dinner", DINNER_WTY);
  karmaYoga(date);
  eveningMusic(date, "Yogi Tea Café Open Mic", OPEN_MIC);
  eveningGong(date, false);
  night(date);
}

/* ------------------------------------------------------------- Sun Dec 20 · full program day + Rensabai */
d = "2026-12-20";
rise(d, "03:40");
sadhana(d, "03:40", "06:00");
gurdwaraFullDay(d);
meal(d, "07:15", "08:15", "Breakfast");
meditationKY(d);
kids(d);
cls(d, "09:45", "11:00", "Divine Mother: The Love That Holds Everything", "Kriya and Meditation", CHURUATA, DEVI, { description: D_DEVI });
cls(d, "09:45", "11:00", "Morning Sadhana: Developing a Daily Practice", "Workshop", TREE, SATWANT, { description: D_SATWANT });
cls(d, "09:45", "11:00", "Men's Circle", "Community", INCO, CHIEF);
cls(d, "11:15", "12:30", "Conscious Communication within Silence", "Meditation", CHURUATA, JOT_SIMRIT, { description: D_JOT });
cls(d, "11:15", "12:30", "Winter Solstice Glandular Summit", "Kriya and Meditation", TREE, DYAL, { description: D_DYAL });
cls(d, "11:15", "12:30", "Women's Circle", "Community", INCO, KIRET);
meal(d, "12:30", "13:45", "Lunch", LUNCH);
cls(d, "13:45", "15:30", "Rewiring Stress into Strength", "Kriya and Meditation", CHURUATA, HARIDASS, { description: D_HARIDASS }); // Churuata (owner, 2026-10-29)
cls(d, "15:45", "17:00", "Rejuvenate: Emotional Balance & Alertness", "Kriya and Meditation", CHURUATA, KHUSHBIR, { description: D_KHUSHBIR });
// The sheet now reads "Sat Kirin Kaur" where "The Preserver: Karuna" was (2026-11-19).
cls(d, "15:45", "17:00", "Workshop with Sat Kirin Kaur", "Workshop", TREE, SAT_KIRIN, { description: SAT_KIRIN_CLASS, tags: TBA });
cls(d, "15:45", "17:00", "Tantric Integration Circle", "Kriya and Meditation", INCO, SHAKTA, { description: TANTRIC_INTEGRATION });
rehras(d);
meal(d, "17:30", "18:30", "Dinner");
add(d, "18:30", "19:30", "Closing Circle", { category: "Community", location: TANTRIC, description: CLOSING });
add(d, "19:30", "20:00", "Nagar Kirtan", { category: "Gurdwara", description: NAGAR }); // no time in the sheet: between the Closing Circle and Rensabai
add(d, "20:00", null, "Rensabai Kirtan", { id: `${d}-1930-rensabai-kirtan`, category: "Music", location: GURDWARA, facilitator: MULTIPLE, description: RENSABAI }); // "Rensabhai 8:00"; the Rensaibai tab's four musicians
night(d);

/* ------------------------------------------------------------- Mon Dec 21 · departure */
d = "2026-12-21";
rise(d, "03:40");
sadhana(d, "03:40", "06:00");
gurdwaraFullDay(d, GURD_VOWS); // "Sikh/minister vows, morning Gurdwara on Dec 21st 645am"
meal(d, "07:15", "08:15", "Breakfast");
add(d, "08:15", null, "Start the Journey Home", { category: "Logistics", description: DEPART });

/* ------------------------------------------------------------- ids: parallel sessions share date+time+title only by accident */
const seen = new Map();
for (const item of items) seen.set(item.id, (seen.get(item.id) ?? 0) + 1);
for (const item of items) {
  if (seen.get(item.id) > 1 && item.location) item.id = `${item.id}-${slug(item.location)}`;
}
if (new Set(items.map((i) => i.id)).size !== items.length) throw new Error("duplicate ids");

/* ------------------------------------------------------------- fixture */
const fixture = JSON.parse(readFileSync(FIXTURE, "utf8"));

// Venues: Inco Park hosts circles now (was a map-only landmark); Tree Pavilion
// is new and not on the map artwork yet (no mapPoint → listed, not drawn).
const inco = fixture.venues.find((v) => v.id === "inco-park");
if (!inco) throw new Error("fixture has no inco-park venue");
inco.kind = "venue";
inco.description = "Open lawn for circles and outdoor classes.";
if (!fixture.venues.some((v) => v.id === "tree-pavilion")) {
  fixture.venues.push({ id: "tree-pavilion", name: TREE, description: "Open-air pavilion under the trees for workshops. Location on the map to be confirmed.", kind: "venue" });
}
// The Yogi Tea Café (owner, 2026-11-23): same id, so the import renames it in place.
const yogiTea = fixture.venues.find((v) => v.id === "bazaar-yogi-tea");
if (!yogiTea) throw new Error("fixture has no bazaar-yogi-tea venue");
yogiTea.name = YOGI_TEA;
yogiTea.description = "Bazaar stalls and the Yogi Tea Café: Yogi Tea and evening music.";
const churuata = fixture.venues.find((v) => v.id === "churuata");
if (!churuata) throw new Error("fixture has no churuata venue");
churuata.description = "Workshops, classes and the evening gong. Meals are in the Langar Hall.";
if (!fixture.venues.some((v) => v.id === "langar-hall")) {
  fixture.venues.push({ id: "langar-hall", name: LANGAR_HALL, description: "Guru Ka Langar and all meals. Location on the map to be confirmed.", kind: "venue" });
}

// Teachers: the 12 presenters production first carried (same ids, so the CSV
// updates rather than duplicates), the ones the sheet names that the summer
// booklet data already knows, and the new ones from the Teacher Needs tab.
// Karuna is off the teacher list (owner, 2026-11-23): her class left the grid on 2026-11-19.
const DROPPED_TEACHERS = new Set(["karuna"]);
const PRODUCTION_TEACHERS = JSON.parse(readFileSync(join(ROOT, "references", "wsol26-teachers-production.json"), "utf8")).filter((t) => !DROPPED_TEACHERS.has(t.id));
const summer = JSON.parse(readFileSync(SUMMER_TEACHERS, "utf8"));
// `as` renames a summer record to the name the winter sheet uses.
const FROM_SUMMER = [
  { name: CHIEF },
  { name: KARINA },
  { name: RAI },
  { name: SHAKTA },
  { name: "SS Satkirin Kaur Khalsa", as: SAT_KIRIN, id: "sat-kirin-kaur", facilitatorNames: [SAT_KIRIN, "Satkirin Kaur", "Satkirin Kaur Khalsa", "SS Satkirin Kaur Khalsa"] },
];
const extra = FROM_SUMMER.map(({ name, as, id, facilitatorNames }) => {
  const t = summer.find((x) => x.name === name);
  if (!t) throw new Error(`summer teachers.json has no ${name}`);
  return { id: id ?? t.id, name: as ?? t.name, facilitatorNames: facilitatorNames ?? t.facilitatorNames, bio: t.bio ?? "", country: t.country === "USA" ? "United States" : t.country, ...(t.photo ? { photo: t.photo } : {}) };
});
// New this winter, from the "Teacher Needs" tab (bio as sent). Her headshot came as a
// Drive link; it is kept in public/images/teachers/ like the summer photos, but with an
// absolute URL: app builds made before 2026-11-19 do not bundle the file, so the relative
// path the summer photos use would 404 there.
extra.push({
  id: "sat-nam-kaur",
  name: SAT_NAM,
  facilitatorNames: [SAT_NAM, "Sat Nam Kaur Khalsa"],
  bio: "Sat Nam Kaur is a second-generation member of the global Sangat and a certified teacher since 1997. Having lived in Mexico, Brazil, and Española, she currently serves as Khalsa Council Coordinator at Sikh Dharma International and as Director of the Kundalini Yoga Center in Guadalajara, Mexico.",
  country: "Mexico",
  photo: "https://summer-solstice-sadhana-2026.vercel.app/images/teachers/Sat-Nam-Kaur.jpg",
});
fixture.teachers = [...PRODUCTION_TEACHERS, ...extra].sort((a, b) => a.name.localeCompare(b.name));

// Joins by name.
const venueNames = new Set(fixture.venues.map((v) => v.name));
const categoryNames = new Set(fixture.categories.map((c) => c.name));
const facilitatorNames = new Set(fixture.teachers.flatMap((t) => t.facilitatorNames ?? [t.name]));
for (const item of items) {
  if (item.location && !venueNames.has(item.location)) throw new Error(`${item.id}: unknown venue ${item.location}`);
  if (item.category && !categoryNames.has(item.category)) throw new Error(`${item.id}: unknown category ${item.category}`);
  if (item.facilitator && !facilitatorNames.has(item.facilitator) && !NO_PROFILE.has(item.facilitator)) throw new Error(`${item.id}: unknown facilitator ${item.facilitator}`);
}

items.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime) || (a.endTime ?? "").localeCompare(b.endTime ?? "") || a.title.localeCompare(b.title));
fixture.program = items;
fixture.version = (fixture.version ?? 0) + 1;
fixture._comment = "Dummy WSOL26 bundle for local testing. Event metadata (name, dates, venue) and the White Tantric Yoga days (Dec 17-19) mirror the real registration system. The PROGRAM, VENUES and TEACHERS are the official Winter Solstice 2026 program as read from the programming team's master sheet, written by scripts/wsol26-official-program.mjs (reading decisions and open questions in docs/WSOL26-PROGRAM.md); items tagged 'To be announced' are the ones the sheet leaves open. Info pages and menus are interim. Venue map pins are measured on the real map artwork (references/winter-solstice-map-revised-v3.jpg, served by the mock as /photos/wsol26-map.jpg). Served by scripts/mock-backend.mjs and convertible to CSV with scripts/fixture-to-csv.mjs. See docs/CONTENT-MODEL.md.";

writeFileSync(FIXTURE, `${JSON.stringify(fixture, null, 2)}\n`);

const perDay = {};
for (const item of items) perDay[item.date] = (perDay[item.date] ?? 0) + 1;
console.log(`fixture v${fixture.version}: ${items.length} program items`, perDay);
console.log(`teachers ${fixture.teachers.length}, venues ${fixture.venues.length}, "To be announced" ${items.filter((i) => i.tags?.includes("To be announced")).length}`);
