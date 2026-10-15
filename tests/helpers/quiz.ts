import type { QuizQuestion } from "@/app/api/quiz/route";

/** A quiz question as the backend stores it. */
export function question(questionText: string, options: string[], overrides: Partial<QuizQuestion> = {}): QuizQuestion {
  return {
    _id: "q1",
    questionNumber: 1,
    questionText,
    questionType: options.length ? "MCQ" : "NUMERIC",
    options,
    xp: 10,
    correctAnswer: "",
    ...overrides,
  };
}

/** One question per text, keyed q1, q2, … */
export function questions(...list: [string, string[]][]): QuizQuestion[] {
  return list.map(([text, options], i) => question(text, options, { _id: `q${i + 1}`, questionNumber: i + 1 }));
}
