import { describe, expect, it } from "vitest";
import {
  isKqAnswerType,
  isKqChapterName,
  isKqObtainedStars,
  isKqSetCategory,
  isKqSport,
  isObjectId,
  KQ_ICON_OPTIONS,
  KQ_SPORT_CODE,
  KQ_SPORT_ICONS,
  KQ_SPORT_LABELS,
  KQ_SPORTS,
  starsForXp,
  validateKqQuestion,
  validateKqQuestionUpdate,
  validateKqSet,
  validateKqSetUpdate,
  validateKqSport,
  validateKqSportUpdate,
  type CreateKqQuestionPayload,
  type CreateKqSetPayload,
} from "@/app/interface/knowledge-quiz.interface";

const ID = "64b7f0c2a1b2c3d4e5f60718";
const ID2 = "64b7f0c2a1b2c3d4e5f60719";

describe("type guards", () => {
  it.each([
    [isKqSport, "tennis", "golf"],
    [isKqAnswerType, "multiple", "both"],
    [isKqSetCategory, "global", "expert"],
    [isKqChapterName, "legend", "Legend"],
  ] as const)("%o accepts %s and rejects %s", (guard, good, bad) => {
    expect(guard(good)).toBe(true);
    expect(guard(bad)).toBe(false);
    expect(guard(undefined)).toBe(false);
    expect(guard(1)).toBe(false);
  });

  it.each([
    [ID, true],
    ["64B7F0C2A1B2C3D4E5F60718", true],
    ["64b7f0c2a1b2c3d4e5f6071", false],
    ["64b7f0c2a1b2c3d4e5f6071z", false],
    ["", false],
    [123, false],
  ])("isObjectId(%j) → %s", (value, valid) => {
    expect(isObjectId(value)).toBe(valid);
  });

  it.each([
    [0, true],
    [3, true],
    [4, false],
    [1.5, false],
    ["1", false],
  ])("isKqObtainedStars(%j) → %s", (value, valid) => {
    expect(isKqObtainedStars(value)).toBe(valid);
  });
});

describe("sport tables", () => {
  it("cover every sport, with distinct id codes", () => {
    for (const sport of KQ_SPORTS) {
      expect(KQ_SPORT_CODE[sport]).toMatch(/^[A-Z]$/);
      expect(KQ_SPORT_LABELS[sport]).toBeTruthy();
      expect(KQ_SPORT_ICONS[sport]).toBeTruthy();
    }
    expect(new Set(Object.values(KQ_SPORT_CODE)).size).toBe(KQ_SPORTS.length);
    expect(KQ_ICON_OPTIONS).toHaveLength(KQ_SPORTS.length);
  });
});

describe("starsForXp", () => {
  const set = { threeStarScore: 10, twoStarScore: 7, oneStarScore: 1 };
  it.each([
    [12, 3],
    [10, 3],
    [9, 2],
    [7, 2],
    [6, 1],
    [1, 1],
    [0, 0],
  ])("%d xp → %d stars", (xp, stars) => {
    expect(starsForXp(xp, set)).toBe(stars);
  });
});

describe("validateKqQuestion", () => {
  const valid = (overrides: Partial<CreateKqQuestionPayload> = {}): Partial<CreateKqQuestionPayload> => ({
    sportsType: "cricket",
    questionText: "Which country won the 2011 World Cup?",
    answerOptions: ["India", "Sri Lanka", "Australia"],
    correctAnswer: ["India"],
    correctAnswerIndex: [0],
    xp: 10,
    answerType: "single",
    ...overrides,
  });

  it("accepts a valid single-answer question", () => {
    expect(validateKqQuestion(valid())).toEqual([]);
  });

  it("accepts a valid multiple-answer question in any index order", () => {
    expect(
      validateKqQuestion(valid({ answerType: "multiple", correctAnswer: ["India", "Australia"], correctAnswerIndex: [2, 0] })),
    ).toEqual([]);
  });

  it("defaults to a single answer", () => {
    expect(validateKqQuestion(valid({ answerType: undefined }))).toEqual([]);
  });

  it("reports every problem with an empty payload at once", () => {
    expect(validateKqQuestion({})).toEqual([
      "sportsType must be one of: football, cricket, basketball, tennis, racing",
      "questionText is required",
      "xp must be a number greater than or equal to 0",
      "answerOptions is required and must have at least 2 options",
      "correctAnswer is required",
      "correctAnswerIndex is required and must be an array of option positions",
      "A single answer question must have exactly 1 correctAnswer",
    ]);
  });

  it.each<[string, Partial<CreateKqQuestionPayload>, string]>([
    ["blank question", { questionText: "   " }, "questionText is required"],
    ["negative xp", { xp: -1 }, "xp must be a number greater than or equal to 0"],
    ["non-finite xp", { xp: Number.NaN }, "xp must be a number greater than or equal to 0"],
    ["unknown answer type", { answerType: "both" as never }, "answerType must be one of: single, multiple"],
    ["an empty option", { answerOptions: ["India", " ", "Australia"] }, "answerOptions must not contain empty options"],
    ["duplicate options after trimming", { answerOptions: ["India", " India", "Australia"] }, "answerOptions must not contain duplicates"],
    ["an answer that isn't an option", { correctAnswer: ["Pakistan"] }, "correctAnswer contains values not in answerOptions: Pakistan"],
    ["an index past the options", { correctAnswerIndex: [5] }, "correctAnswerIndex has positions outside answerOptions: 5"],
    ["a negative or fractional index", { correctAnswerIndex: [-1, 1.5] }, "correctAnswerIndex has positions outside answerOptions: -1, 1.5"],
    ["an index that disagrees with the answer", { correctAnswerIndex: [1] }, "correctAnswerIndex and correctAnswer must refer to the same options"],
    [
      "duplicate indexes",
      { answerType: "multiple", correctAnswer: ["India", "Australia"], correctAnswerIndex: [0, 0] },
      "correctAnswerIndex must not contain duplicates",
    ],
    ["duplicate answers", { answerType: "multiple", correctAnswer: ["India", "India "], correctAnswerIndex: [0, 2] }, "correctAnswer must not contain duplicates"],
    ["two answers to a single-answer question", { correctAnswer: ["India", "Australia"], correctAnswerIndex: [0, 2] }, "A single answer question must have exactly 1 correctAnswer"],
    ["one answer to a multiple-answer question", { answerType: "multiple" }, "A multiple answer question must have at least 2 correctAnswer"],
  ])("rejects %s", (_, overrides, failure) => {
    expect(validateKqQuestion(valid(overrides))).toContain(failure);
  });
});

describe("validateKqQuestionUpdate", () => {
  it("needs at least one field", () => {
    expect(validateKqQuestionUpdate({})).toEqual(["Provide at least one field to update"]);
  });

  it.each([{ xp: 0 }, { questionText: "New wording" }, { answerOptions: ["A", "B"], correctAnswerIndex: [1], answerType: "single" as const }])(
    "accepts %j",
    (payload) => {
      expect(validateKqQuestionUpdate(payload)).toEqual([]);
    },
  );

  it.each([
    [{ questionText: " " }, "questionText is required"],
    [{ xp: -5 }, "xp is required and must be a number >= 0"],
    [{ answerType: "both" }, "answerType must be one of: single, multiple"],
    [{ answerOptions: ["A"] }, "answerOptions is required and must have at least 2 options"],
    [{ answerOptions: ["A", ""] }, "answerOptions must not contain empty options"],
    [{ answerOptions: ["A", " A"] }, "answerOptions must not contain duplicates"],
    [{ correctAnswerIndex: [] }, "correctAnswerIndex is required and must be an array of option positions"],
    [{ correctAnswerIndex: [1.5] }, "correctAnswerIndex must contain non-negative integers"],
    [{ correctAnswerIndex: [0, 0] }, "correctAnswerIndex must not contain duplicates"],
    [{ answerOptions: ["A", "B"], correctAnswerIndex: [0, 2, 3] }, "correctAnswerIndex out of range for 2 options: 2, 3"],
    [{ correctAnswerIndex: [0, 1], answerType: "single" }, "A single answer question must have exactly 1 correctAnswerIndex"],
    [{ correctAnswerIndex: [0], answerType: "multiple" }, "A multiple answer question must have at least 2 correctAnswerIndex entries"],
  ])("rejects %j", (payload, failure) => {
    expect(validateKqQuestionUpdate(payload as never)).toContain(failure);
  });
});

describe("validateKqSport / validateKqSportUpdate", () => {
  const sport = { sportsType: "football" as const, sportsIcon: "sports_soccer", gameHeading: "Football IQ", gameSubHeading: "Test yourself" };

  it("accepts a complete sport", () => {
    expect(validateKqSport(sport)).toEqual([]);
  });

  it("reports every missing field, treating whitespace as empty", () => {
    expect(validateKqSport({ sportsIcon: " ", gameHeading: "" })).toEqual([
      "sportsType is required and must be a valid sport",
      "sportsIcon is required",
      "gameHeading is required",
      "gameSubHeading is required",
    ]);
  });

  it("checks only the fields an update sends", () => {
    expect(validateKqSportUpdate({})).toEqual(["Provide at least one field to update"]);
    expect(validateKqSportUpdate({ gameHeading: "New" })).toEqual([]);
    expect(validateKqSportUpdate({ gameHeading: " ", sportsType: "golf" as never })).toEqual([
      "sportsType is required and must be a valid sport",
      "gameHeading is required",
    ]);
  });
});

describe("validateKqSet", () => {
  const set = (overrides: Partial<CreateKqSetPayload> = {}): Partial<CreateKqSetPayload> => ({
    knowledgeQuizId: ID,
    category: "easy",
    chapter: 1,
    chapterName: "foundation",
    threeStarScore: 10,
    twoStarScore: 7,
    oneStarScore: 1,
    reward: 50,
    ...overrides,
  });

  it("accepts a valid set", () => {
    expect(validateKqSet(set())).toEqual([]);
    expect(validateKqSet(set({ entryCoins: 0, knowledgeQuizQuestions: [ID, ID2] }))).toEqual([]);
  });

  it("reports every problem with an empty payload at once", () => {
    expect(validateKqSet({})).toEqual([
      "knowledgeQuizId is required and must be a valid id",
      "category is required and must be a valid category",
      "chapterName is required and must be a valid chapter name",
      "chapter is required and must be an integer >= 1",
      "threeStarScore is required and must be a number >= 10",
      "twoStarScore is required and must be a number >= 7",
      "oneStarScore is required and must be a number >= 1",
      "reward is required and must be a number >= 0",
    ]);
  });

  it.each<[string, Partial<CreateKqSetPayload>, string]>([
    ["a fractional chapter", { chapter: 1.5 }, "chapter is required and must be an integer >= 1"],
    ["a star score below its minimum", { threeStarScore: 9 }, "threeStarScore is required and must be a number >= 10"],
    ["equal star thresholds", { threeStarScore: 10, twoStarScore: 10 }, "star thresholds must descend: threeStarScore > twoStarScore > oneStarScore"],
    ["negative reward", { reward: -1 }, "reward is required and must be a number >= 0"],
    ["negative entry coins", { entryCoins: -1 }, "entryCoins must be a number >= 0"],
    ["a bad question id", { knowledgeQuizQuestions: ["q1"] }, "knowledgeQuizQuestions must be an array of valid ids"],
    ["a repeated question", { knowledgeQuizQuestions: [ID, ID] }, "knowledgeQuizQuestions must not contain duplicates"],
  ])("rejects %s", (_, overrides, failure) => {
    expect(validateKqSet(set(overrides))).toContain(failure);
  });
});

describe("validateKqSetUpdate", () => {
  it("needs at least one field", () => {
    expect(validateKqSetUpdate({})).toEqual(["Provide at least one field to update"]);
  });

  it("accepts a partial update", () => {
    expect(validateKqSetUpdate({ reward: 0 })).toEqual([]);
    expect(validateKqSetUpdate({ twoStarScore: 12 })).toEqual([]);
  });

  it.each([
    [{ knowledgeQuizId: "x" }, "knowledgeQuizId must be a valid id"],
    [{ category: "expert" }, "category must be a valid category"],
    [{ chapterName: "rookie" }, "chapterName must be a valid chapter name"],
    [{ chapter: 0 }, "chapter must be an integer >= 1"],
    [{ oneStarScore: 0 }, "oneStarScore must be a number >= 1"],
    [{ threeStarScore: 10, twoStarScore: 8, oneStarScore: 8 }, "star thresholds must descend: threeStarScore > twoStarScore > oneStarScore"],
    [{ reward: -5 }, "reward must be a number >= 0"],
    [{ entryCoins: Number.POSITIVE_INFINITY }, "entryCoins must be a number >= 0"],
    [{ knowledgeQuizQuestions: [ID2, ID2] }, "knowledgeQuizQuestions must not contain duplicates"],
  ])("rejects %j", (payload, failure) => {
    expect(validateKqSetUpdate(payload as never)).toContain(failure);
  });
});
