"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  isQuizOpen,
  teamName,
  type PlayQuiz,
  type PlayQuizAnswer,
  type PlayQuizQuestion,
} from "@/app/interface/app-user.interface";
import { appUserRequest } from "@/app/utils/appUsers";
import { formatIST, HiddenBadge, isPast, messageOf, PlayCard, PlayList, usePlayList } from "./playUi";

type Props = { userId: string };

const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * The answer the backend grades (`selectedAnswer`) and the label the app shows
 * (`selectedAnswerOption`): an MCQ's option letter, otherwise the value itself.
 */
function toAnswer(question: PlayQuizQuestion, value: string): PlayQuizAnswer {
  const option =
    question.questionType === "MCQ"
      ? (OPTION_LETTERS[question.options?.indexOf(value) ?? -1] ?? value)
      : value;
  return { questionNumber: question.questionNumber, selectedAnswerOption: option, selectedAnswer: value };
}

const pick = <T,>(items: readonly T[]): T | undefined => items[Math.floor(Math.random() * items.length)];

/** A random answer in the shape `QuestionInput` stores; "" when there's nothing to pick from. */
function randomAnswer(question: PlayQuizQuestion): string {
  switch (question.questionType) {
    case "MCQ":
      return pick(question.options ?? []) ?? "";
    case "BOOLEAN":
      return pick(["true", "false"]) ?? "";
    case "NUMERIC":
      return String(Math.floor(Math.random() * 11));
    case "ALPHABETICAL":
      return pick(OPTION_LETTERS.split("")) ?? "";
    default:
      return "";
  }
}

export default function PlayQuizzes({ userId }: Props) {
  const list = usePlayList<PlayQuiz>("/api/quiz/upcoming", isQuizOpen);

  return (
    <PlayList list={list} noun="quizzes">
      {list.items.map((quiz) => (
        <PlayCard
          key={quiz._id}
          title={`${teamName(quiz.teamA, "Team A")} vs ${teamName(quiz.teamB, "Team B")}`}
          subtitle={[quiz.quizId, quiz.tournament].filter(Boolean).join(" · ")}
          status={quiz.quizStatus}
          badge={<HiddenBadge hidden={quiz.isVisible === false} />}
          meta={[{ label: "Match start", value: formatIST(quiz.matchStartTime) }]}
          warning={isPast(quiz.matchStartTime) ? "Match time passed but still UPCOMING" : undefined}
          // The list's `isAttempted` is the admin's; the form loads the user's answers.
          actionLabel="Answer"
        >
          {() => <QuizForm userId={userId} quizId={quiz._id} onSaved={list.reload} />}
        </PlayCard>
      ))}
    </PlayList>
  );
}

function QuizForm({ userId, quizId, onSaved }: { userId: string; quizId: string; onSaved: () => void }) {
  const [quiz, setQuiz] = useState<PlayQuiz | null>(null);
  const [loadError, setLoadError] = useState("");
  /** Answer per question number; blank means unanswered. */
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    appUserRequest<PlayQuiz>(userId, "GET", `quiz/${quizId}`)
      .then((data) => {
        if (cancelled) return;
        const previous = data?.userAnswers?.answers ?? [];
        setQuiz(data);
        setSubmitted(previous.length > 0);
        setAnswers(Object.fromEntries(previous.map((a) => [a.questionNumber, String(a.selectedAnswer)])));
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(messageOf(err, "Couldn't load the quiz"));
      });
    return () => {
      cancelled = true;
    };
  }, [userId, quizId]);

  if (loadError) return <p className="text-sm text-red-300">{loadError}</p>;
  if (!quiz) return <p className="text-sm text-zinc-500">Loading questions…</p>;

  const questions = quiz.questionsArray ?? [];
  if (questions.length === 0) return <p className="text-sm text-zinc-500">This quiz has no questions.</p>;

  const setAnswer = (questionNumber: number, value: string) =>
    setAnswers((prev) => ({ ...prev, [questionNumber]: value }));

  const fillRandom = () =>
    setAnswers((prev) => {
      const next = { ...prev };
      for (const question of questions) {
        if (next[question.questionNumber]?.trim()) continue;
        const value = randomAnswer(question);
        if (value) next[question.questionNumber] = value;
      }
      return next;
    });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = questions
      .filter((q) => answers[q.questionNumber]?.trim())
      .map((q) => toAnswer(q, answers[q.questionNumber].trim()));
    if (payload.length === 0) {
      setError("Answer at least one question.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      if (submitted) {
        await appUserRequest(userId, "PUT", `quiz/updateSubmission/${quizId}`, { answers: payload });
        setSuccess("Answers updated.");
      } else {
        await appUserRequest(userId, "POST", `quiz/submitQuiz/${quizId}`, { answers: payload });
        setSubmitted(true);
        setSuccess("Answers submitted.");
      }
      onSaved();
    } catch (err) {
      setError(messageOf(err, "The answers weren't saved"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {questions.map((question) => (
        <fieldset key={question.questionNumber}>
          <legend className="mb-2 text-sm text-white">
            <span className="text-zinc-500">Q{question.questionNumber}.</span> {question.questionText}
            {question.xp ? <span className="ml-2 text-xs text-amber-300">{question.xp} XP</span> : null}
          </legend>
          <QuestionInput
            question={question}
            value={answers[question.questionNumber] ?? ""}
            onChange={(value) => setAnswer(question.questionNumber, value)}
          />
        </fieldset>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-50"
        >
          {busy ? "Saving…" : submitted ? "Update answers" : "Submit answers"}
        </button>
        <button
          type="button"
          onClick={fillRandom}
          disabled={busy}
          className="rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          Select random
        </button>
        <span className="text-xs text-zinc-500">Unanswered questions just earn nothing.</span>
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-300">{success}</p> : null}
    </form>
  );
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: PlayQuizQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  const choices =
    question.questionType === "MCQ"
      ? (question.options ?? []).map((o) => ({ value: o, label: o }))
      : question.questionType === "BOOLEAN"
        ? [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]
        : null;

  if (choices) {
    return (
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {choices.map((choice) => (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={value === choice.value}
            onClick={() => onChange(value === choice.value ? "" : choice.value)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              value === choice.value
                ? "border-cyan-500 bg-cyan-950/50 text-cyan-100"
                : "border-zinc-600 text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            {choice.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <input
      type={question.questionType === "NUMERIC" ? "number" : "text"}
      step="any"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.questionType === "NUMERIC" ? "A number" : "Your answer"}
      className="w-full max-w-sm rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
    />
  );
}
