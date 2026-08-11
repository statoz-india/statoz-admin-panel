/**
 * Types & validation for the superadmin knowledge-quiz API.
 *
 * List / create / get-by-id / update exist on the backend. See `docs/kq.md`.
 */

/**
 * Sports the knowledge-quiz endpoint accepts. Deliberately separate from
 * `GAME_TYPE_OPTIONS`: that list has no `tennis` and is owned by the
 * match/prediction domain, so widening it here would leak into those screens.
 */
export const KQ_SPORTS = [
  "football",
  "cricket",
  "basketball",
  "tennis",
  "racing",
] as const;

export type KqSport = (typeof KQ_SPORTS)[number];

export function isKqSport(value: unknown): value is KqSport {
  return (
    typeof value === "string" &&
    (KQ_SPORTS as readonly string[]).includes(value)
  );
}

export const KQ_ANSWER_TYPES = ["single", "multiple"] as const;

export type KqAnswerType = (typeof KQ_ANSWER_TYPES)[number];

export function isKqAnswerType(value: unknown): value is KqAnswerType {
  return (
    typeof value === "string" &&
    (KQ_ANSWER_TYPES as readonly string[]).includes(value)
  );
}

/**
 * Sport → letter used in the generated `kqQuestionId` (`KQ-F-1`). Display only:
 * the server allocates the id and the sequence runs per sport.
 */
export const KQ_SPORT_CODE: Record<KqSport, string> = {
  football: "F",
  cricket: "C",
  basketball: "B",
  tennis: "T",
  racing: "R",
};

export const KQ_SPORT_LABELS: Record<KqSport, string> = {
  football: "Football",
  cricket: "Cricket",
  basketball: "Basketball",
  tennis: "Tennis",
  racing: "Racing",
};

export const KQ_ANSWER_TYPE_LABELS: Record<KqAnswerType, string> = {
  single: "Single answer",
  multiple: "Multiple answers",
};

/**
 * Canonical Material icon names, mirroring `GAME_SPORTS_ICONS` on the backend.
 * Nothing validates the string server-side, so a typo saves fine and simply
 * renders no icon in the app — always offer these rather than a text input.
 */
export const KQ_SPORT_ICONS: Record<KqSport, string> = {
  football: "sports_soccer",
  cricket: "sports_cricket",
  basketball: "sports_basketball",
  tennis: "sports_tennis",
  racing: "sports_motorsports",
};

export const KQ_ICON_OPTIONS = Object.values(KQ_SPORT_ICONS);

/**
 * One row per sport: just the presentation for that sport's card on the
 * knowledge quiz home screen. Holds no questions and no answers.
 */
export interface KqSportQuiz {
  _id: string;
  sportsType: KqSport;
  sportsIcon: string;
  gameHeading: string;
  gameSubHeading: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKqSportPayload {
  sportsType: KqSport;
  sportsIcon: string;
  gameHeading: string;
  gameSubHeading: string;
}

/** A Mongo `_id`, which both update endpoints take as `:id`. */
export function isObjectId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);
}

/** Editable fields on a sport's quiz. All optional; at least one required. */
export type UpdateKqSportPayload = Partial<CreateKqSportPayload>;

export const KQ_SPORT_UPDATE_FIELDS = [
  "sportsType",
  "sportsIcon",
  "gameHeading",
  "gameSubHeading",
] as const;

/** Mirrors the backend's four create rules, reported together as it does. */
export function validateKqSport(
  payload: Partial<CreateKqSportPayload>,
): string[] {
  const failures: string[] = [];

  if (!isKqSport(payload.sportsType)) {
    failures.push("sportsType is required and must be a valid sport");
  }
  // All strings are trimmed server-side, so "   " counts as empty.
  if (
    typeof payload.sportsIcon !== "string" ||
    payload.sportsIcon.trim().length === 0
  ) {
    failures.push("sportsIcon is required");
  }
  if (
    typeof payload.gameHeading !== "string" ||
    payload.gameHeading.trim().length === 0
  ) {
    failures.push("gameHeading is required");
  }
  if (
    typeof payload.gameSubHeading !== "string" ||
    payload.gameSubHeading.trim().length === 0
  ) {
    failures.push("gameSubHeading is required");
  }

  return failures;
}

/**
 * Only the fields present are changed; anything omitted keeps its stored value.
 * The server validates the *merged* document, so a partial payload that looks
 * fine on its own can still be rejected by a field it didn't touch.
 */
export function validateKqSportUpdate(payload: UpdateKqSportPayload): string[] {
  const present = KQ_SPORT_UPDATE_FIELDS.filter(
    (field) => payload[field] !== undefined,
  );
  if (present.length === 0) {
    return ["Provide at least one field to update"];
  }

  const failures: string[] = [];

  if (payload.sportsType !== undefined && !isKqSport(payload.sportsType)) {
    failures.push("sportsType is required and must be a valid sport");
  }
  for (const field of ["sportsIcon", "gameHeading", "gameSubHeading"] as const) {
    const value = payload[field];
    if (value !== undefined && (typeof value !== "string" || !value.trim())) {
      failures.push(`${field} is required`);
    }
  }

  return failures;
}

/**
 * Wire payload. Has no `kqQuestionId` on purpose — the server assigns it and
 * ignores anything the client sends.
 */
export interface CreateKqQuestionPayload {
  sportsType: KqSport;
  questionText: string;
  answerOptions: string[];
  correctAnswer: string[];
  correctAnswerIndex: number[];
  xp: number;
  answerType: KqAnswerType;
}

/** A question, as returned by the create 201 and by the list endpoint. */
export interface KqQuestion extends CreateKqQuestionPayload {
  _id: string;
  kqQuestionId: string;
  /** Always empty today — attaching to a quiz set has no endpoint yet. */
  knowledgeQuizzes: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Editable fields on a question. `sportsType` is absent because `kqQuestionId`
 * encodes the sport, and `correctAnswer` because the server re-derives it from
 * `correctAnswerIndex` on every write.
 */
export interface UpdateKqQuestionPayload {
  questionText?: string;
  answerOptions?: string[];
  correctAnswerIndex?: number[];
  answerType?: KqAnswerType;
  xp?: number;
}

export const KQ_QUESTION_UPDATE_FIELDS = [
  "questionText",
  "answerOptions",
  "correctAnswerIndex",
  "answerType",
  "xp",
] as const;

/**
 * Validates a partial question update. Each field is checked on its own; the
 * cross-field rules can only run when both sides are in the payload, because
 * the server checks them against the merged document, which the panel does not
 * have. Sending `answerOptions`, `correctAnswerIndex` and `answerType` together
 * on any answer edit makes every rule checkable here.
 */
export function validateKqQuestionUpdate(
  payload: UpdateKqQuestionPayload,
): string[] {
  const present = KQ_QUESTION_UPDATE_FIELDS.filter(
    (field) => payload[field] !== undefined,
  );
  if (present.length === 0) {
    return ["Provide at least one field to update"];
  }

  const failures: string[] = [];

  if (
    payload.questionText !== undefined &&
    (typeof payload.questionText !== "string" || !payload.questionText.trim())
  ) {
    failures.push("questionText is required");
  }

  if (
    payload.xp !== undefined &&
    (typeof payload.xp !== "number" ||
      !Number.isFinite(payload.xp) ||
      payload.xp < 0)
  ) {
    failures.push("xp is required and must be a number >= 0");
  }

  if (payload.answerType !== undefined && !isKqAnswerType(payload.answerType)) {
    failures.push(`answerType must be one of: ${KQ_ANSWER_TYPES.join(", ")}`);
  }

  let trimmedOptions: string[] | null = null;
  if (payload.answerOptions !== undefined) {
    const options = payload.answerOptions;
    if (!Array.isArray(options) || options.length < 2) {
      failures.push(
        "answerOptions is required and must have at least 2 options",
      );
    } else if (
      options.some((o) => typeof o !== "string" || o.trim().length === 0)
    ) {
      failures.push("answerOptions must not contain empty options");
    } else {
      const trimmed = options.map((o) => o.trim());
      if (new Set(trimmed).size !== trimmed.length) {
        failures.push("answerOptions must not contain duplicates");
      } else {
        trimmedOptions = trimmed;
      }
    }
  }

  let indexes: number[] | null = null;
  if (payload.correctAnswerIndex !== undefined) {
    const raw = payload.correctAnswerIndex;
    if (!Array.isArray(raw) || raw.length < 1) {
      failures.push(
        "correctAnswerIndex is required and must be an array of option positions",
      );
    } else if (raw.some((i) => !Number.isInteger(i) || i < 0)) {
      failures.push("correctAnswerIndex must contain non-negative integers");
    } else if (new Set(raw).size !== raw.length) {
      failures.push("correctAnswerIndex must not contain duplicates");
    } else {
      indexes = raw;
    }
  }

  if (indexes && trimmedOptions) {
    const outOfRange = indexes.filter((i) => i >= trimmedOptions.length);
    if (outOfRange.length > 0) {
      failures.push(
        `correctAnswerIndex out of range for ${trimmedOptions.length} options: ${outOfRange.join(", ")}`,
      );
    }
  }

  if (indexes && payload.answerType !== undefined) {
    if (payload.answerType === "single" && indexes.length !== 1) {
      failures.push(
        "A single answer question must have exactly 1 correctAnswerIndex",
      );
    }
    if (payload.answerType === "multiple" && indexes.length < 2) {
      failures.push(
        "A multiple answer question must have at least 2 correctAnswerIndex entries",
      );
    }
  }

  return failures;
}

/* ------------------------------------------------------------------ *
 * Quiz sets (chapters) — the playable unit between a sport and its
 * questions. Carries the star thresholds, the economy, and its question list.
 * ------------------------------------------------------------------ */

export const KQ_SET_CATEGORIES = ["easy", "medium", "hard", "global"] as const;

export type KqSetCategory = (typeof KQ_SET_CATEGORIES)[number];

export function isKqSetCategory(value: unknown): value is KqSetCategory {
  return (
    typeof value === "string" &&
    (KQ_SET_CATEGORIES as readonly string[]).includes(value)
  );
}

export const KQ_CHAPTER_NAMES = [
  "foundation",
  "prospect",
  "contender",
  "specialist",
  "legend",
] as const;

export type KqChapterName = (typeof KQ_CHAPTER_NAMES)[number];

export function isKqChapterName(value: unknown): value is KqChapterName {
  return (
    typeof value === "string" &&
    (KQ_CHAPTER_NAMES as readonly string[]).includes(value)
  );
}

/** Per-field schema minimums, checked separately from the ordering rule. */
export const KQ_STAR_MINIMUMS = {
  threeStarScore: 10,
  twoStarScore: 7,
  oneStarScore: 1,
} as const;

export interface CreateKqSetPayload {
  knowledgeQuizId: string;
  category: KqSetCategory;
  chapter: number;
  chapterName: KqChapterName;
  threeStarScore: number;
  twoStarScore: number;
  oneStarScore: number;
  reward: number;
  entryCoins?: number;
  knowledgeQuizQuestions?: string[];
}

/** Partial update — send at least one field. */
export interface UpdateKqSetPayload {
  knowledgeQuizId?: string;
  category?: KqSetCategory;
  chapter?: number;
  chapterName?: KqChapterName;
  threeStarScore?: number;
  twoStarScore?: number;
  oneStarScore?: number;
  reward?: number;
  entryCoins?: number;
  /** Full replacement list when sent (empty array clears). */
  knowledgeQuizQuestions?: string[];
}

export const KQ_SET_UPDATE_FIELDS = [
  "knowledgeQuizId",
  "category",
  "chapter",
  "chapterName",
  "threeStarScore",
  "twoStarScore",
  "oneStarScore",
  "reward",
  "entryCoins",
  "knowledgeQuizQuestions",
] as const;

export interface KqSet
  extends Omit<CreateKqSetPayload, "knowledgeQuizQuestions"> {
  _id: string;
  entryCoins: number;
  /** Raw ids, or full documents when the list ran with `includeQuestions`. */
  knowledgeQuizQuestions: string[] | KqQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface KqSetListParams {
  page?: number;
  limit?: number;
  knowledgeQuizId?: string;
  category?: KqSetCategory;
  chapterName?: KqChapterName;
  /** Expands questions to full documents — answers included. List views: off. */
  includeQuestions?: boolean;
}

export interface KqSetList {
  items: KqSet[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/** Mirrors every create rule, with the backend's wording, reported together. */
export function validateKqSet(payload: Partial<CreateKqSetPayload>): string[] {
  const failures: string[] = [];

  if (!isObjectId(payload.knowledgeQuizId)) {
    failures.push("knowledgeQuizId is required and must be a valid id");
  }
  if (!isKqSetCategory(payload.category)) {
    failures.push("category is required and must be a valid category");
  }
  if (!isKqChapterName(payload.chapterName)) {
    failures.push("chapterName is required and must be a valid chapter name");
  }
  if (!Number.isInteger(payload.chapter) || (payload.chapter as number) < 1) {
    failures.push("chapter is required and must be an integer >= 1");
  }

  const stars = ["threeStarScore", "twoStarScore", "oneStarScore"] as const;
  for (const field of stars) {
    const value = payload[field];
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < KQ_STAR_MINIMUMS[field]
    ) {
      failures.push(
        `${field} is required and must be a number >= ${KQ_STAR_MINIMUMS[field]}`,
      );
    }
  }

  // Only meaningful once all three are real numbers; a strict descent stops one
  // score qualifying for two tiers at once.
  const allStarsNumeric = stars.every(
    (field) =>
      typeof payload[field] === "number" && Number.isFinite(payload[field]),
  );
  if (
    allStarsNumeric &&
    !(
      (payload.threeStarScore as number) > (payload.twoStarScore as number) &&
      (payload.twoStarScore as number) > (payload.oneStarScore as number)
    )
  ) {
    failures.push(
      "star thresholds must descend: threeStarScore > twoStarScore > oneStarScore",
    );
  }

  if (
    typeof payload.reward !== "number" ||
    !Number.isFinite(payload.reward) ||
    payload.reward < 0
  ) {
    failures.push("reward is required and must be a number >= 0");
  }

  if (payload.entryCoins !== undefined) {
    if (
      typeof payload.entryCoins !== "number" ||
      !Number.isFinite(payload.entryCoins) ||
      payload.entryCoins < 0
    ) {
      failures.push("entryCoins must be a number >= 0");
    }
  }

  if (payload.knowledgeQuizQuestions !== undefined) {
    const questions = payload.knowledgeQuizQuestions;
    if (!Array.isArray(questions) || !questions.every(isObjectId)) {
      failures.push("knowledgeQuizQuestions must be an array of valid ids");
    } else if (new Set(questions).size !== questions.length) {
      failures.push("knowledgeQuizQuestions must not contain duplicates");
    }
  }

  return failures;
}

/**
 * Validates a partial set update. Cross-field star ordering is checked only when
 * all three scores are in the payload (the server validates against the merged
 * document). Prefer sending the full form state from the edit modal.
 */
export function validateKqSetUpdate(payload: UpdateKqSetPayload): string[] {
  const present = KQ_SET_UPDATE_FIELDS.filter(
    (field) => payload[field] !== undefined,
  );
  if (present.length === 0) {
    return ["Provide at least one field to update"];
  }

  const failures: string[] = [];

  if (
    payload.knowledgeQuizId !== undefined &&
    !isObjectId(payload.knowledgeQuizId)
  ) {
    failures.push("knowledgeQuizId must be a valid id");
  }
  if (payload.category !== undefined && !isKqSetCategory(payload.category)) {
    failures.push("category must be a valid category");
  }
  if (
    payload.chapterName !== undefined &&
    !isKqChapterName(payload.chapterName)
  ) {
    failures.push("chapterName must be a valid chapter name");
  }
  if (
    payload.chapter !== undefined &&
    (!Number.isInteger(payload.chapter) || payload.chapter < 1)
  ) {
    failures.push("chapter must be an integer >= 1");
  }

  const stars = ["threeStarScore", "twoStarScore", "oneStarScore"] as const;
  for (const field of stars) {
    if (payload[field] === undefined) continue;
    const value = payload[field];
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < KQ_STAR_MINIMUMS[field]
    ) {
      failures.push(
        `${field} must be a number >= ${KQ_STAR_MINIMUMS[field]}`,
      );
    }
  }

  const allStarsPresent = stars.every((field) => payload[field] !== undefined);
  if (
    allStarsPresent &&
    !(
      (payload.threeStarScore as number) > (payload.twoStarScore as number) &&
      (payload.twoStarScore as number) > (payload.oneStarScore as number)
    )
  ) {
    failures.push(
      "star thresholds must descend: threeStarScore > twoStarScore > oneStarScore",
    );
  }

  if (payload.reward !== undefined) {
    if (
      typeof payload.reward !== "number" ||
      !Number.isFinite(payload.reward) ||
      payload.reward < 0
    ) {
      failures.push("reward must be a number >= 0");
    }
  }

  if (payload.entryCoins !== undefined) {
    if (
      typeof payload.entryCoins !== "number" ||
      !Number.isFinite(payload.entryCoins) ||
      payload.entryCoins < 0
    ) {
      failures.push("entryCoins must be a number >= 0");
    }
  }

  if (payload.knowledgeQuizQuestions !== undefined) {
    const questions = payload.knowledgeQuizQuestions;
    if (!Array.isArray(questions) || !questions.every(isObjectId)) {
      failures.push("knowledgeQuizQuestions must be an array of valid ids");
    } else if (new Set(questions).size !== questions.length) {
      failures.push("knowledgeQuizQuestions must not contain duplicates");
    }
  }

  return failures;
}

/** Backend defaults and ceiling for `GET /knowledge-quiz/questions`. */
export const KQ_LIST_DEFAULT_LIMIT = 50;
export const KQ_LIST_MAX_LIMIT = 100;

export interface KqQuestionListParams {
  page?: number;
  limit?: number;
  sportsType?: KqSport;
  answerType?: KqAnswerType;
  /** Case-insensitive substring of `questionText` or `kqQuestionId`. */
  search?: string;
}

/** Offset-based page. A question created mid-browse shifts rows between pages. */
export interface KqQuestionList {
  items: KqQuestion[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Every backend rule, checked client-side and again in the proxy so a common
 * mistake never round-trips. Returns *all* failures, like the server does, with
 * matching wording so a locally-caught failure reads the same as a server one.
 */
export function validateKqQuestion(
  payload: Partial<CreateKqQuestionPayload>,
): string[] {
  const failures: string[] = [];

  if (!isKqSport(payload.sportsType)) {
    failures.push(`sportsType must be one of: ${KQ_SPORTS.join(", ")}`);
  }

  if (
    typeof payload.questionText !== "string" ||
    payload.questionText.trim().length === 0
  ) {
    failures.push("questionText is required");
  }

  if (
    typeof payload.xp !== "number" ||
    !Number.isFinite(payload.xp) ||
    payload.xp < 0
  ) {
    failures.push("xp must be a number greater than or equal to 0");
  }

  if (payload.answerType !== undefined && !isKqAnswerType(payload.answerType)) {
    failures.push(`answerType must be one of: ${KQ_ANSWER_TYPES.join(", ")}`);
  }

  const options = Array.isArray(payload.answerOptions)
    ? payload.answerOptions
    : [];

  if (options.length < 2) {
    failures.push("answerOptions is required and must have at least 2 options");
  }
  if (options.some((o) => typeof o !== "string" || o.trim().length === 0)) {
    failures.push("answerOptions must not contain empty options");
  }
  const trimmedOptions = options
    .filter((o): o is string => typeof o === "string")
    .map((o) => o.trim());
  if (new Set(trimmedOptions).size !== trimmedOptions.length) {
    failures.push("answerOptions must not contain duplicates");
  }

  const correct = Array.isArray(payload.correctAnswer)
    ? payload.correctAnswer
    : [];

  if (correct.length < 1) {
    failures.push("correctAnswer is required");
  }
  const trimmedCorrect = correct
    .filter((c): c is string => typeof c === "string")
    .map((c) => c.trim());
  if (new Set(trimmedCorrect).size !== trimmedCorrect.length) {
    failures.push("correctAnswer must not contain duplicates");
  }

  // Cross-field: the server matches by exact string, not index.
  const orphans = trimmedCorrect.filter((c) => !trimmedOptions.includes(c));
  if (orphans.length > 0) {
    failures.push(
      `correctAnswer contains values not in answerOptions: ${orphans.join(", ")}`,
    );
  }

  // The backend wants the correct answers as positions as well as strings.
  const indexes = payload.correctAnswerIndex;
  if (!Array.isArray(indexes) || indexes.length < 1) {
    failures.push(
      "correctAnswerIndex is required and must be an array of option positions",
    );
  } else {
    const invalid = indexes.filter(
      (i) => !Number.isInteger(i) || i < 0 || i >= trimmedOptions.length,
    );
    if (invalid.length > 0) {
      failures.push(
        `correctAnswerIndex has positions outside answerOptions: ${invalid.join(", ")}`,
      );
    } else if (new Set(indexes).size !== indexes.length) {
      failures.push("correctAnswerIndex must not contain duplicates");
    } else {
      // Both fields must describe the same options, or the question would be
      // stored with its answers disagreeing with each other.
      const fromIndexes = indexes.map((i) => trimmedOptions[i]).sort();
      const sortedCorrect = [...trimmedCorrect].sort();
      if (
        fromIndexes.length !== sortedCorrect.length ||
        fromIndexes.some((value, i) => value !== sortedCorrect[i])
      ) {
        failures.push(
          "correctAnswerIndex and correctAnswer must refer to the same options",
        );
      }
    }
  }

  const answerType = payload.answerType ?? "single";
  if (answerType === "single" && correct.length !== 1) {
    failures.push("A single answer question must have exactly 1 correctAnswer");
  }
  if (answerType === "multiple" && correct.length < 2) {
    failures.push(
      "A multiple answer question must have at least 2 correctAnswer",
    );
  }

  return failures;
}
