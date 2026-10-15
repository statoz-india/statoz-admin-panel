/**
 * Sport-agnostic half of the "answer a quiz from a match page" engines
 * (cricket from Cricbuzz or Sofascore, football from FotMob or Sofascore,
 * basketball from Sofascore). Pure code: the Sofascore lookups run it in the
 * browser.
 *
 * Only the question banks' questions are answered: the quiz bank's and the
 * event bank's (`app/api/utils/eventreolve.js`).
 * A sport engine builds its match facts and lists its banks as
 * `BankQuestion`s; `answerFromBank` then, for each question:
 *  1. finds the bank question whose template it is, reading the teams its
 *     `{teamA}` / `{teamB}` name;
 *  2. runs that bank question's resolver to pull one `Fact` off the match;
 *  3. maps the fact onto exactly one option, or explains why it couldn't.
 * Any other question is left for the admin to answer by hand.
 */

import type { QuizQuestion } from "@/app/api/quiz/route";
import type { MatchAnswerProposal } from "@/app/interface/match-answers.interface";

export type TeamId = number;

/* ---------- Text ---------- */

export function normWords(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function hasPhrase(haystack: string, needle: string): boolean {
  return needle.length > 0 && ` ${haystack} `.includes(` ${needle} `);
}

const N = "(\\d+(?:\\.\\d+)?)";

/* ---------- Matching quiz teams to a provider's teams ---------- */

export interface QuizTeamLike {
  name?: string;
  displayName?: string;
  abbreviation?: string;
}

/** A team as the provider names it. */
export interface ProviderTeam {
  name: string;
  shortName: string;
  otherNames?: string[];
}

/** Tokens that don't identify a club ("FC", "AC", "Club", …). */
const TEAM_NOISE = new Set(["fc", "cf", "afc", "sc", "ac", "cd", "ss", "as", "club", "calcio", "de", "the"]);
const TEAM_EXPANSIONS: Record<string, string> = { man: "manchester", utd: "united" };
/** Tokens many teams share — overlap on these alone means nothing. */
const GENERIC_TEAM_TOKENS = new Set([
  "united", "city", "real", "sporting", "athletic", "atletico", "town", "county", "rovers",
  "wanderers", "hotspur", "albion", "women", "olympique", "borussia", "dynamo", "deportivo",
  "racing", "kings", "super", "royals", "indians", "capitals", "titans", "giants", "riders",
  "knight", "strikers", "stars", "warriors", "tigers", "lions", "under", "national",
  "royal", "north", "south", "east", "west", "saint", "young", "boys",
]);

function canonicalTeam(name: string): string {
  return normWords(name)
    .split(" ")
    .map((t) => TEAM_EXPANSIONS[t] ?? t)
    .filter((t) => t && !TEAM_NOISE.has(t))
    .join(" ");
}

const distinctiveTokens = (name: string) =>
  name.split(" ").filter((t) => t.length >= 4 && !GENERIC_TEAM_TOKENS.has(t));

/**
 * 4 = same name, 3 = same abbreviation, 2 = one name contains the other,
 * 1 = they share a distinctive word ("Bayern Munich" / "Bayern München"),
 * 0 = no match.
 */
export function teamMatchScore(quizTeam: QuizTeamLike, provider: ProviderTeam): number {
  const providerNames = [provider.name, ...(provider.otherNames ?? [])].map(canonicalTeam).filter(Boolean);
  const providerShort = normWords(provider.shortName);
  const quizNames = [quizTeam.name, quizTeam.displayName]
    .filter((n): n is string => !!n)
    .map(canonicalTeam)
    .filter(Boolean);
  const abbr = normWords(quizTeam.abbreviation ?? "");
  const allProvider = providerShort.length >= 3 ? [...providerNames, providerShort] : providerNames;

  if (quizNames.some((n) => allProvider.includes(n))) return 4;
  if (abbr && (abbr === providerShort || providerNames.includes(abbr))) return 3;
  if (quizNames.some((n) => n.length >= 3 && allProvider.some((p) => hasPhrase(n, p) || hasPhrase(p, n)))) {
    return 2;
  }
  const providerTokens = new Set(allProvider.flatMap(distinctiveTokens));
  if (quizNames.some((n) => distinctiveTokens(n).some((t) => providerTokens.has(t)))) return 1;
  return 0;
}

/** A pairing needs at least one solid match or two partial ones. */
const MIN_PAIR_SCORE = 4;
/** Both teams matched by full name or abbreviation. */
export const STRONG_PAIR_SCORE = 6;

/**
 * Best way to line the quiz's two teams up with the provider's two teams.
 * `score` is 0 when the teams don't plausibly match.
 */
export function pairQuizTeams(
  quizTeams: { teamA: QuizTeamLike; teamB: QuizTeamLike },
  t1: ProviderTeam,
  t2: ProviderTeam,
): { score: number; t1Quiz?: QuizTeamLike; t2Quiz?: QuizTeamLike } {
  const pair = (x: QuizTeamLike, y: QuizTeamLike) => {
    const s1 = teamMatchScore(x, t1);
    const s2 = teamMatchScore(y, t2);
    return s1 && s2 && s1 + s2 >= MIN_PAIR_SCORE ? s1 + s2 : 0;
  };
  const straight = pair(quizTeams.teamA, quizTeams.teamB);
  const swapped = pair(quizTeams.teamB, quizTeams.teamA);
  if (!straight && !swapped) return { score: 0 };
  return straight >= swapped
    ? { score: straight, t1Quiz: quizTeams.teamA, t2Quiz: quizTeams.teamB }
    : { score: swapped, t1Quiz: quizTeams.teamB, t2Quiz: quizTeams.teamA };
}

/**
 * A warning when the site's teams don't clearly match ours — so an admin
 * notices "Chicago Fire" standing in for "Chicago State".
 */
export function teamPairingWarning(
  target: { teamA: QuizTeamLike; teamB: QuizTeamLike },
  t1: ProviderTeam,
  t2: ProviderTeam,
  siteName: string,
): string | null {
  const { score } = pairQuizTeams(target, t1, t2);
  const ourTeams = `${target.teamA?.name} vs ${target.teamB?.name}`;
  const siteTeams = `${t1.name} vs ${t2.name}`;
  if (!score) {
    return `The ${siteName} match is ${siteTeams}, which doesn't look like ${ourTeams}.`;
  }
  if (score < STRONG_PAIR_SCORE) {
    return `Teams matched on partial names: ${siteName} has ${siteTeams} for ${ourTeams}. Check it's the same match.`;
  }
  return null;
}

const MAX_START_TIME_GAP_MS = 36 * 60 * 60 * 1000;

/**
 * The listed match that best fits the quiz: both teams must match, and when
 * the quiz has a start time the provider's start must be within
 * `maxGapMs` (36h by default) of it; the closest start wins ties. Pass
 * `Infinity` when `items` is already a list for the right date.
 */
export function findBestMatch<T>(
  items: T[],
  quiz: { teamA: QuizTeamLike; teamB: QuizTeamLike; matchStartTime?: string },
  describe: (item: T) => { teams: [ProviderTeam, ProviderTeam]; startMs: number },
  maxGapMs = MAX_START_TIME_GAP_MS,
): T | null {
  const quizStart = quiz.matchStartTime ? Date.parse(quiz.matchStartTime) : NaN;
  let best: { item: T; score: number; gap: number } | null = null;
  for (const item of items) {
    const { teams, startMs } = describe(item);
    const { score } = pairQuizTeams(quiz, teams[0], teams[1]);
    if (!score) continue;
    const gap = Number.isNaN(quizStart) ? 0 : Math.abs(startMs - quizStart);
    if (gap > maxGapMs) continue;
    if (!best || score > best.score || (score === best.score && gap < best.gap)) {
      best = { item, score, gap };
    }
  }
  return best?.item ?? null;
}

/* ---------- Teams and players as the engines see them ---------- */

export interface AnswerTeam {
  id: TeamId;
  shortName: string;
  /** Name for free-text answers: the quiz's team name when mapped. */
  label: string;
  /** Normalised names/abbreviations from the provider and the quiz. */
  aliases: string[];
}

export function buildAnswerTeam(id: TeamId, provider: ProviderTeam, quizTeam?: QuizTeamLike): AnswerTeam {
  const aliases = [
    provider.name,
    provider.shortName,
    ...(provider.otherNames ?? []),
    quizTeam?.name,
    quizTeam?.displayName,
    quizTeam?.abbreviation,
  ]
    .filter((a): a is string => !!a)
    // Full names plus their distinctive words, so "Newcastle" finds "Newcastle United".
    .flatMap((a) => [normWords(a), canonicalTeam(a), ...distinctiveTokens(canonicalTeam(a))])
    .filter((a) => a.length >= 2);
  return {
    id,
    shortName: provider.shortName || provider.name,
    label: quizTeam?.name || provider.name,
    aliases: [...new Set(aliases)],
  };
}

export interface AnswerPlayer {
  name: string;
  /** `normWords(name)` */
  key: string;
  teamId: TeamId;
}

export function teamForOption(option: string, teams: AnswerTeam[]): AnswerTeam | undefined {
  const forms = [...new Set([normWords(option), canonicalTeam(option)])].filter(Boolean);
  if (!forms.length) return undefined;
  const hits = teams.filter((t) =>
    t.aliases.some((a) =>
      forms.some((o) => o === a || hasPhrase(o, a) || (o.length >= 3 && hasPhrase(a, o))),
    ),
  );
  return hits.length === 1 ? hits[0] : undefined;
}

export function optionMatchesPlayer(option: string, p: AnswerPlayer): boolean {
  const o = normWords(option);
  if (!o) return false;
  if (o === p.key) return true;
  const pTokens = p.key.split(" ");
  let longExact = false;
  for (const t of o.split(" ")) {
    if (pTokens.includes(t)) {
      if (t.length >= 3) longExact = true;
    } else if (!(t.length <= 2 && pTokens.some((x) => x.startsWith(t)))) {
      return false;
    }
  }
  return longExact;
}

/** The single roster player an option names, if it names exactly one. */
export function playerForOption<P extends AnswerPlayer>(option: string, roster: P[]): P | undefined {
  const exact = roster.find((p) => p.key === normWords(option));
  if (exact) return exact;
  const hits = roster.filter((p) => optionMatchesPlayer(option, p));
  return hits.length === 1 ? hits[0] : undefined;
}

/* ---------- Options ---------- */

export const TIE_OPTION_RE =
  /\b(tie|tied|draw|drawn|no result|abandoned|equal|both|same|level|neither|none|no goals?|goalless)\b/;
export const NOBODY_OPTION_RE = /\b(none|no one|nobody|no player|neither|no goals?|no goalscorer|no scorer)\b/;

export const isYesOption = (o: string) => /^(yes|true|y)$/i.test(o.trim());
export const isNoOption = (o: string) => /^(no|false|n)$/i.test(o.trim());

/** Predicate for an option like "0-5", "11+", "Under 150", "Over 2.5", "3", "16-30 min". */
export function parseNumericOption(option: string): ((n: number) => boolean) | null {
  const s = option
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/[–—]/g, "-")
    .replace(/^by\s+/, "")
    .trim();
  const re = (pattern: string) => s.match(new RegExp(pattern));
  let m: RegExpMatchArray | null;

  if (/^(none|zero|nil|nobody|no one)\b/.test(s)) return (n) => n === 0;
  if ((m = re(`^(?:between\\s+)?${N}\\s*(?:-|to|and)\\s*${N}`))) {
    const lo = Math.min(+m[1], +m[2]);
    const hi = Math.max(+m[1], +m[2]);
    return (n) => n >= lo && n <= hi;
  }
  if ((m = re(`^${N}\\s*(?:\\+|or more\\b|or above\\b|and above\\b|or over\\b|and over\\b|plus\\b|or higher\\b|& above)`))) {
    const a = +m[1];
    return (n) => n >= a;
  }
  if ((m = re(`^(?:at least|min(?:imum)?(?: of)?|>=)\\s*${N}`))) {
    const a = +m[1];
    return (n) => n >= a;
  }
  if ((m = re(`^(?:more than|greater than|over|above|>)\\s*${N}`))) {
    const a = +m[1];
    return (n) => n > a;
  }
  if ((m = re(`^(?:up ?to|at most|max(?:imum)?(?: of)?|<=)\\s*${N}`))) {
    const a = +m[1];
    return (n) => n <= a;
  }
  if ((m = re(`^(?:less than|fewer than|under|below|<)\\s*${N}`))) {
    const a = +m[1];
    return (n) => n < a;
  }
  if ((m = re(`^${N}\\s*(?:or less|or fewer|or below|and below|or under|and under)\\b`))) {
    const a = +m[1];
    return (n) => n <= a;
  }
  if ((m = re(`^(?:exactly\\s+)?${N}(?:\\s+[a-z]+)*$`))) {
    const a = +m[1];
    return (n) => n === a;
  }
  return null;
}

/* ---------- Facts and mapping them onto options ---------- */

export type Fact =
  | { kind: "boolean"; value: boolean; evidence: string }
  /** `teamId` null: a draw / tie — mapped onto a "Draw" / "Tied" / "Same" option. */
  | { kind: "team"; teamId: TeamId | null; evidence: string }
  /** Mapped onto range options: "150 - 179", "Under 5", "3 or more", "2". */
  | { kind: "number"; value: number; evidence: string }
  /** A closed answer such as a toss decision; `value` is the free-text answer. */
  | { kind: "choice"; value: string; evidence: string; matchesOption: (option: string) => boolean }
  | { kind: "none"; evidence: string };

export const none = (evidence: string): Fact => ({ kind: "none", evidence });
export const yesNo = (value: boolean, evidence: string): Fact => ({ kind: "boolean", value, evidence });

export type Picked = Pick<MatchAnswerProposal, "answer" | "optionIndex" | "evidence">;

const unanswered = (evidence: string): Picked => ({ answer: null, optionIndex: null, evidence });

function pickIndex(options: string[], indices: number[], evidence: string, what: string): Picked {
  if (indices.length === 1) {
    return { answer: options[indices[0]], optionIndex: indices[0], evidence };
  }
  if (indices.length > 1) {
    return unanswered(`${evidence} Fits more than one option (${indices.map((i) => options[i]).join(", ")}).`);
  }
  return unanswered(`${evidence} No option matches ${what}.`);
}

/** The fact as exactly one of `options`, or as free text when the question has none. */
function answerFromFact(fact: Fact, options: string[], teams: AnswerTeam[]): Picked {
  if (fact.kind === "none") return unanswered(fact.evidence);
  const { evidence } = fact;
  const free = (answer: string): Picked => ({ answer, optionIndex: null, evidence });
  const indicesWhere = (pred: (o: string) => boolean) =>
    options.map((o, i) => (pred(o) ? i : -1)).filter((i) => i !== -1);

  switch (fact.kind) {
    case "boolean": {
      const label = fact.value ? "Yes" : "No";
      if (!options.length) return free(label);
      return pickIndex(options, indicesWhere(fact.value ? isYesOption : isNoOption), evidence, label);
    }
    case "number":
      if (!options.length) return free(String(fact.value));
      return pickIndex(
        options,
        indicesWhere((o) => parseNumericOption(o)?.(fact.value) ?? false),
        evidence,
        String(fact.value),
      );
    case "team": {
      const team = teams.find((t) => t.id === fact.teamId);
      if (!options.length) return team ? free(team.label) : unanswered(`${evidence} No single team to name.`);
      if (!team) {
        return pickIndex(options, indicesWhere((o) => TIE_OPTION_RE.test(normWords(o))), evidence, "a draw / tie");
      }
      return pickIndex(options, indicesWhere((o) => teamForOption(o, teams)?.id === team.id), evidence, team.shortName);
    }
    case "choice":
      if (!options.length) return free(fact.value);
      return pickIndex(options, indicesWhere(fact.matchesOption), evidence, fact.value);
  }
}

/* ---------- The question bank ---------- */

/**
 * A question from the quiz bank or the event bank
 * (`app/api/utils/eventreolve.js`), with how to answer it from a sport's
 * match facts. `{teamA}` / `{teamB}` in the template is a team's name; event
 * templates name both ("… in {teamA} vs {teamB} game"), which also checks
 * the question is about this match.
 */
export interface BankQuestion<F> {
  /** The bank's id for it. */
  id: string;
  template: string;
  /** `team` is the team named by the template's first `{teamA}` / `{teamB}`, if it has one. */
  resolve: (facts: F, team: AnswerTeam | null) => Fact;
}

/** A resolver for a template about one team — the one its first placeholder names. */
export const forTeam =
  <F>(resolve: (facts: F, team: AnswerTeam) => Fact) =>
  (facts: F, team: AnswerTeam | null): Fact =>
    team ? resolve(facts, team) : none("The question doesn't name a team.");

/** `sourceId`'s question from `bank`, worded as `template` — an event's version of a quiz question. */
export function reworded<F>(
  bank: BankQuestion<F>[],
  sourceId: string,
  template: string,
  id = sourceId,
): BankQuestion<F> {
  const source = bank.find((q) => q.id === sourceId);
  if (!source) throw new Error(`No bank question "${sourceId}" to reword.`);
  return { id, template, resolve: source.resolve };
}

const TEAM_SLOT = /\{team[AB]\}/;
const TEAM_SLOTS = /\{team[AB]\}/g;

/**
 * The teams a template's placeholders captured, in order, or the first
 * capture that isn't one of this match's teams. The same placeholder must
 * name the same team each time, and `{teamA}` / `{teamB}` different ones —
 * null when they don't.
 */
function slotTeams(
  captures: string[],
  slots: string[],
  teams: AnswerTeam[],
): { teams: AnswerTeam[] } | { unknown: string } | null {
  const bySlot = new Map<string, AnswerTeam>();
  const found: AnswerTeam[] = [];
  for (const [i, capture] of captures.entries()) {
    const team = teamForOption(capture, teams);
    if (!team) return { unknown: capture };
    const earlier = bySlot.get(slots[i]);
    if (earlier ? earlier !== team : [...bySlot.values()].includes(team)) return null;
    bySlot.set(slots[i], team);
    found.push(team);
  }
  return { teams: found };
}

/** Wording for comparing a question with a template: no brackets, possessive 's, case or punctuation. */
const questionWords = (text: string) =>
  normWords(text.replace(/\([^)]*\)/g, " ").replace(/['’]s\b/gi, ""));

/** "{teamA} will lose 5 or more wickets…" → /^(.+) will lose 5 or more wickets…$/ */
function templatePattern(template: string): RegExp {
  // Plain words and spaces only, so nothing needs escaping.
  const source = template
    .split(TEAM_SLOT)
    .map(questionWords)
    .flatMap((words, i) => [i > 0 ? "(.+)" : "", words])
    .filter(Boolean)
    .join(" ");
  return new RegExp(`^${source}$`);
}

/**
 * Answers each question that's in `bank` from `facts`; any other question
 * is left unanswered. `notReady` explains why none can be answered yet
 * (e.g. the match hasn't started).
 */
export function answerFromBank<F extends { teams: AnswerTeam[] }>(
  questions: QuizQuestion[],
  bank: BankQuestion<F>[],
  facts: F,
  notReady: string | null = null,
): MatchAnswerProposal[] {
  // Templates without a team first, so "{teamA} will win the match" can't claim "Which team will win the match?".
  const compiled = bank
    .map((entry) => ({
      entry,
      pattern: templatePattern(entry.template),
      slots: entry.template.match(TEAM_SLOTS) ?? [],
    }))
    .sort((a, b) => Number(a.slots.length > 0) - Number(b.slots.length > 0));

  return answerQuestions(questions, (question) => {
    const text = questionWords(question.questionText ?? "");
    let unknownTeam: string | null = null;
    for (const { entry, pattern, slots } of compiled) {
      const m = text.match(pattern);
      if (!m) continue;
      const named = slotTeams(m.slice(1), slots, facts.teams);
      if (!named) continue;
      if ("unknown" in named) {
        unknownTeam ??= named.unknown;
        continue;
      }
      if (notReady) return unanswered(notReady);
      const options = (question.options ?? []).filter((o) => typeof o === "string" && o.trim() !== "");
      return answerFromFact(entry.resolve(facts, named.teams[0] ?? null), options, facts.teams);
    }
    return unanswered(
      unknownTeam
        ? `Couldn't tell which team “${unknownTeam}” is in this match.`
        : "Not one of the question bank's questions, so it isn't answered automatically.",
    );
  });
}

/** Run a resolver over every question, never letting one bad question sink the rest. */
export function answerQuestions(
  questions: QuizQuestion[],
  answerOne: (question: QuizQuestion) => Picked,
): MatchAnswerProposal[] {
  return questions.map((question, idx) => {
    const questionKey = question._id || question.questionNumber?.toString() || idx.toString();
    const questionNumber = question.questionNumber || idx + 1;
    try {
      return { questionKey, questionNumber, ...answerOne(question) };
    } catch (err) {
      return {
        questionKey,
        questionNumber,
        answer: null,
        optionIndex: null,
        evidence: `Couldn't evaluate this question (${err instanceof Error ? err.message : "unknown error"}).`,
      };
    }
  });
}
