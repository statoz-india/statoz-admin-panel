/**
 * Types & validation for the superadmin knowledge-quiz API.
 *
 * Create and list exist on the backend today — no get, update or delete.
 * See `docs/kq.md`.
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
