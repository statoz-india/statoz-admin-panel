/**
 * Sport-agnostic half of the "answer a quiz from a match page" engines
 * (cricket from Cricbuzz or Sofascore, football from FotMob or Sofascore,
 * basketball from Sofascore). Pure code: the Sofascore lookups run it in the
 * browser.
 *
 * A sport engine builds its match facts, then for each question:
 *  1. calls `buildAnswerContext` — normalised text, the teams/players the
 *     question names, any threshold ("50+", "more than 2.5"), and the answer
 *     *shape* implied by the options (player names → "which player", team
 *     names → "which team", ranges → "how many", Yes/No);
 *  2. runs its own resolvers to pull one `Fact` off the match data;
 *  3. calls `answerFromFact`, which maps the fact onto exactly one option or
 *     explains why it couldn't.
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

const NUMBER_WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20,
};
const COUNTED_NOUN =
  "(?:wickets?|wkts?|runs?|overs?|balls?|sixes|fours|boundar\\w*|players?|batters?|bats(?:man|men)|bowlers?|extras?|wides?|centur\\w*|fift\\w*|ducks?|maidens?|goals?|corners?|cards?|shots?|saves?|fouls?|offsides?|minutes?|assists?|bookings?)";
const NUMBER_WORD_RE = new RegExp(
  `\\b(${Object.keys(NUMBER_WORDS).join("|")})(?=[\\s-]+(?:or more\\s+)?${COUNTED_NOUN}\\b)`,
  "g",
);

/* ---------- Thresholds in question text ---------- */

export type Comparator = ">" | ">=" | "<" | "<=" | "==";
export interface Threshold {
  op: Comparator;
  value: number;
}

const N = "(\\d+(?:\\.\\d+)?)";
const THRESHOLD_PATTERNS: [RegExp, Comparator][] = [
  [new RegExp(`${N}\\s*\\+`), ">="],
  [new RegExp(`${N}\\s+(?:or more|or above|and above|or over|and over|plus|or higher)\\b`), ">="],
  [new RegExp(`\\b(?:at least|minimum(?: of)?)\\s+${N}`), ">="],
  [new RegExp(`\\b(?:more than|greater than|over|above|exceeds?|exceeding|in excess of|beyond)\\s+${N}`), ">"],
  [new RegExp(`${N}\\s+(?:or less|or fewer|or below|or under|and below|and under)\\b`), "<="],
  [new RegExp(`\\b(?:at most|maximum(?: of)?|up ?to)\\s+${N}`), "<="],
  [new RegExp(`\\b(?:less than|fewer than|under|below)\\s+${N}`), "<"],
  [new RegExp(`\\bexactly\\s+${N}`), "=="],
  [
    new RegExp(
      `\\b(?:cross(?:es)?|reach(?:es)?|scores?|makes?|hits?|takes?|gets?|loses?|concedes?)\\s+(?:a\\s+)?${N}`,
    ),
    ">=",
  ],
];

function parseThreshold(text: string): Threshold | null {
  for (const [re, op] of THRESHOLD_PATTERNS) {
    const m = text.match(re);
    if (m) return { op, value: Number(m[1]) };
  }
  return null;
}

export function compare(value: number, t: Threshold): boolean {
  switch (t.op) {
    case ">": return value > t.value;
    case ">=": return value >= t.value;
    case "<": return value < t.value;
    case "<=": return value <= t.value;
    case "==": return value === t.value;
  }
}

export const OP_TEXT: Record<Comparator, string> = { ">": ">", ">=": "≥", "<": "<", "<=": "≤", "==": "=" };

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

/**
 * Players named in the question: full name or first+last anywhere, or a
 * surname on its own when it's unique in the match and capitalised in the
 * original text (so "chase" the verb doesn't pick up Roston Chase).
 */
function mentionedPlayers<P extends AnswerPlayer>(raw: string, q: string, roster: P[]): P[] {
  const surnameCount = new Map<string, number>();
  for (const p of roster) {
    const last = p.key.split(" ").pop() ?? "";
    surnameCount.set(last, (surnameCount.get(last) ?? 0) + 1);
  }
  const rawPlain = raw.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return roster.filter((p) => {
    const tokens = p.key.split(" ");
    const last = tokens[tokens.length - 1];
    if (hasPhrase(q, p.key)) return true;
    if (tokens.length > 2 && hasPhrase(q, `${tokens[0]} ${last}`)) return true;
    // Two-word surnames: "Van Dijk", "Calvert-Lewin".
    if (tokens.length > 2 && hasPhrase(q, tokens.slice(-2).join(" "))) return true;
    if (last.length < 3 || surnameCount.get(last) !== 1) return false;
    const capitalised = last[0].toUpperCase() + last.slice(1);
    return new RegExp(`\\b${capitalised}\\b`).test(rawPlain);
  });
}

function mentionedTeams(q: string, teams: AnswerTeam[], winnerId: TeamId | null | undefined): AnswerTeam[] {
  // Also check the canonical form so "Man Utd" finds "Manchester United".
  const canonicalQ = canonicalTeam(q);
  const found = teams.filter((t) => t.aliases.some((a) => hasPhrase(q, a) || hasPhrase(canonicalQ, a)));
  if (winnerId !== undefined && winnerId !== null) {
    if (/\bwinning (team|side)\b/.test(q) && !/\btoss\b/.test(q)) {
      const t = teams.find((x) => x.id === winnerId);
      if (t && !found.includes(t)) found.push(t);
    }
    if (/\blosing (team|side)\b/.test(q)) {
      const t = teams.find((x) => x.id !== winnerId);
      if (t && !found.includes(t)) found.push(t);
    }
  }
  return found;
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

/* ---------- Question context ---------- */

/**
 * `choice` is a sport-specific closed answer — a toss decision ("Bat"),
 * a scoreline ("2-1"), a half ("Second half").
 */
export type Shape = "yesno" | "teams" | "players" | "number" | "choice" | "unknown";

export interface AnswerContext<P extends AnswerPlayer = AnswerPlayer> {
  raw: string;
  /** Lower-cased, number words before counted nouns turned into digits. */
  text: string;
  /** `text` reduced to plain words for phrase matching. */
  q: string;
  options: string[];
  shape: Shape;
  teams: AnswerTeam[];
  roster: P[];
  mentionedTeams: AnswerTeam[];
  mentionedPlayers: P[];
  /** A team the question names by role: "the chasing team", "the home side". */
  roleTeamId: TeamId | null;
  threshold: Threshold | null;
}

function classifyShape(
  question: QuizQuestion,
  options: string[],
  q: string,
  teams: AnswerTeam[],
  roster: AnswerPlayer[],
  choiceOption?: (option: string) => boolean,
): Shape {
  const type = question.questionType?.toUpperCase();
  if (
    type === "BOOLEAN" ||
    (options.length === 2 && options.some(isYesOption) && options.some(isNoOption))
  ) {
    return "yesno";
  }

  if (options.length) {
    // Earlier entries win ties, so a sport's own choice shape beats ranges.
    const counts: [Shape, number][] = [
      ["choice", choiceOption ? options.filter(choiceOption).length : 0],
      ["number", options.filter((o) => parseNumericOption(o)).length],
      ["teams", options.filter((o) => teamForOption(o, teams)).length],
      ["players", options.filter((o) => playerForOption(o, roster)).length],
    ];
    const [shape, count] = counts.reduce((best, c) => (c[1] > best[1] ? c : best));
    if (count > 0) return shape;
  }

  if (/\bwho\b|\bwhich (player|batter|batsman|bowler|goalkeeper|keeper)\b|\bname the\b/.test(q)) return "players";
  if (/\bwhich (team|side|country|club)\b/.test(q)) return "teams";
  if (type === "NUMERIC" || /\bhow many\b|\bhow much\b|\bnumber of\b|\btotal\b/.test(q)) return "number";
  return "unknown";
}

export function buildAnswerContext<P extends AnswerPlayer>(
  question: QuizQuestion,
  match: {
    teams: AnswerTeam[];
    roster: P[];
    winnerId?: TeamId | null;
    /** Recognises the sport's own closed options, if this question has any. */
    choiceOption?: (option: string) => boolean;
    roleTeamId?: (q: string) => TeamId | null;
  },
): AnswerContext<P> {
  const raw = question.questionText ?? "";
  const text = raw.toLowerCase().replace(NUMBER_WORD_RE, (w) => String(NUMBER_WORDS[w]));
  const q = normWords(text);
  const options = (question.options ?? []).filter((o) => typeof o === "string" && o.trim() !== "");
  return {
    raw,
    text,
    q,
    options,
    shape: classifyShape(question, options, q, match.teams, match.roster, match.choiceOption),
    teams: match.teams,
    roster: match.roster,
    mentionedTeams: mentionedTeams(q, match.teams, match.winnerId),
    mentionedPlayers: mentionedPlayers(raw, q, match.roster),
    roleTeamId: match.roleTeamId?.(q) ?? null,
    threshold: parseThreshold(text),
  };
}

/* ---------- Facts and mapping them onto options ---------- */

export type Fact =
  | { kind: "team"; teamId: TeamId | null; evidence: string }
  | { kind: "players"; names: string[]; evidence: string }
  | {
      kind: "number";
      value: number;
      evidence: string;
      /** Yes/No without a threshold in the question means "at least one". */
      isCount?: boolean;
      /** Used when the question has no explicit threshold ("century partnership"). */
      implicitThreshold?: Threshold;
      /** Unit of the value; options about another unit are skipped. */
      unit?: "runs" | "wickets";
    }
  | { kind: "boolean"; value: boolean; evidence: string }
  | {
      kind: "choice";
      /** Free-text answer when the question has no options. */
      value: string;
      evidence: string;
      matchesOption: (option: string) => boolean;
      /** Option to fall back on when none matches, e.g. "Any other score". */
      otherwise?: (option: string) => boolean;
      /** Yes/No reading, e.g. "Will the toss winner bat first?". */
      toBoolean?: (ctx: AnswerContext) => boolean | null;
    }
  | { kind: "none"; evidence: string };

export const none = (evidence: string): Fact => ({ kind: "none", evidence });

export type Picked = Pick<MatchAnswerProposal, "answer" | "optionIndex" | "evidence">;

function toBoolean(fact: Fact, ctx: AnswerContext): boolean | null {
  switch (fact.kind) {
    case "boolean":
      return fact.value;
    case "team":
      if (ctx.mentionedTeams.length === 1) return fact.teamId === ctx.mentionedTeams[0].id;
      if (ctx.roleTeamId !== null) return fact.teamId === ctx.roleTeamId;
      return null;
    case "players": {
      const names = fact.names.map(normWords);
      if (ctx.mentionedPlayers.length) return ctx.mentionedPlayers.some((p) => names.includes(p.key));
      if (ctx.mentionedTeams.length === 1) {
        const teamId = ctx.mentionedTeams[0].id;
        return fact.names.some((n) => ctx.roster.some((p) => p.teamId === teamId && optionMatchesPlayer(n, p)));
      }
      return null;
    }
    case "number": {
      const t = ctx.threshold ?? fact.implicitThreshold;
      if (t) return compare(fact.value, t);
      return fact.isCount ? fact.value > 0 : null;
    }
    case "choice":
      return fact.toBoolean?.(ctx) ?? null;
    case "none":
      return null;
  }
}

function pickIndex(options: string[], indices: number[], evidence: string, what: string): Picked {
  if (indices.length === 1) {
    return { answer: options[indices[0]], optionIndex: indices[0], evidence };
  }
  if (indices.length > 1) {
    return {
      answer: null,
      optionIndex: null,
      evidence: `${evidence} Fits more than one option (${indices.map((i) => options[i]).join(", ")}).`,
    };
  }
  return { answer: null, optionIndex: null, evidence: `${evidence} No option matches ${what}.` };
}

export function answerFromFact(fact: Fact, ctx: AnswerContext): Picked {
  if (fact.kind === "none") return { answer: null, optionIndex: null, evidence: fact.evidence };
  const { options, teams, roster } = ctx;
  const indicesWhere = (pred: (o: string) => boolean) =>
    options.map((o, i) => (pred(o) ? i : -1)).filter((i) => i !== -1);
  const teamName = (id: TeamId | null) => teams.find((t) => t.id === id)?.shortName ?? "—";

  if (ctx.shape === "yesno") {
    const value = toBoolean(fact, ctx);
    if (value === null) {
      return { answer: null, optionIndex: null, evidence: `${fact.evidence} Couldn't reduce this to Yes/No.` };
    }
    if (!options.length) return { answer: value ? "Yes" : "No", optionIndex: null, evidence: fact.evidence };
    return pickIndex(options, indicesWhere(value ? isYesOption : isNoOption), fact.evidence, value ? "Yes" : "No");
  }

  // NUMERIC / ALPHABETICAL: free-text answer.
  if (!options.length) {
    const free = (answer: string | null, why = "") =>
      answer === null
        ? { answer: null, optionIndex: null, evidence: `${fact.evidence} ${why}` }
        : { answer, optionIndex: null, evidence: fact.evidence };
    switch (fact.kind) {
      case "number":
        return free(String(fact.value));
      case "team":
        return free(teams.find((t) => t.id === fact.teamId)?.label ?? null, "No single team to name.");
      case "players":
        return free(fact.names.length === 1 ? fact.names[0] : null, "Needs exactly one player.");
      case "choice":
        return free(fact.value);
      case "boolean":
        return free(fact.value ? "Yes" : "No");
    }
  }

  switch (fact.kind) {
    case "number": {
      let candidates = options.map((_, i) => i);
      if (fact.unit) {
        const unitRe = fact.unit === "runs" ? /\bruns?\b/i : /\b(wickets?|wkts?)\b/i;
        candidates = candidates.filter(
          (i) => unitRe.test(options[i]) || !/\b(runs?|wickets?|wkts?)\b/i.test(options[i]),
        );
      }
      const hits = candidates.filter((i) => parseNumericOption(options[i])?.(fact.value));
      return pickIndex(options, hits, fact.evidence, String(fact.value));
    }
    case "team": {
      if (fact.teamId === null) {
        return pickIndex(
          options,
          indicesWhere((o) => TIE_OPTION_RE.test(normWords(o))),
          fact.evidence,
          "a draw / tie / no result",
        );
      }
      const hits = indicesWhere((o) => teamForOption(o, teams)?.id === fact.teamId);
      return pickIndex(options, hits, fact.evidence, teamName(fact.teamId));
    }
    case "players": {
      if (!fact.names.length) {
        return pickIndex(options, indicesWhere((o) => NOBODY_OPTION_RE.test(normWords(o))), fact.evidence, "“no player”");
      }
      const names = fact.names.map(normWords);
      const hits = indicesWhere((o) => {
        const p = playerForOption(o, roster);
        if (p) return names.includes(p.key);
        // e.g. a player of the match missing from the lineup data.
        return names.includes(normWords(o));
      });
      return pickIndex(options, hits, fact.evidence, fact.names.join(" / "));
    }
    case "choice": {
      const hits = indicesWhere(fact.matchesOption);
      const fallback = !hits.length && fact.otherwise ? indicesWhere(fact.otherwise) : [];
      return pickIndex(options, hits.length ? hits : fallback, fact.evidence, fact.value);
    }
    case "boolean":
      return pickIndex(options, indicesWhere(fact.value ? isYesOption : isNoOption), fact.evidence, fact.value ? "Yes" : "No");
  }
}

/** Run a sport's resolver over every question, never letting one bad question sink the rest. */
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
