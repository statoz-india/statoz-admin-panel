"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { Quiz, QuizQuestion } from "@/app/api/quiz/route";
import { buildAdminHomeHref } from "@/app/utils/buildAdminHomeHref";

type QuizSettlementProps = {
  embedded?: boolean;
  onQuizUpdated?: () => void;
  onEmbeddedBack?: () => void;
};

export default function QuizSettlement({
  embedded,
  onQuizUpdated,
  onEmbeddedBack,
}: QuizSettlementProps = {}) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const fromSection = searchParams.get("from");
  const { isAuthenticated } = useAuthStore();
  const quizId = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [settleLoading, setSettleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submissionsProcessed, setSubmissionsProcessed] = useState<
    number | null
  >(null);
  const [answersSubmitted, setAnswersSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (!quizId) return;
    let cancelled = false;

    fetch(`/api/quiz/${quizId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (cancelled) return;
        const quizData = response?.data?.data ?? response?.data ?? null;
        setQuiz(quizData);

        // Initialize correct answers from quiz data
        if (quizData?.questionsArray) {
          const initialAnswers: Record<string, string> = {};
          quizData.questionsArray.forEach((q: QuizQuestion) => {
            const key = q._id || q.questionNumber?.toString() || "";
            const correctAnswer = q.correctAnswer as unknown;
            if (
              key &&
              correctAnswer !== undefined &&
              correctAnswer !== null &&
              correctAnswer !== ""
            ) {
              // Convert boolean to string if needed
              const answerValue =
                typeof correctAnswer === "boolean"
                  ? String(correctAnswer)
                  : String(correctAnswer);
              initialAnswers[key] = answerValue;
            }
          });
          setCorrectAnswers(initialAnswers);

          // Check if all answers are filled initially
          const allFilled = quizData.questionsArray.every((q: QuizQuestion) => {
            const correctAnswer = q.correctAnswer as unknown;
            const answer =
              correctAnswer !== undefined &&
              correctAnswer !== null &&
              correctAnswer !== ""
                ? String(correctAnswer)
                : "";
            return answer.trim() !== "";
          });

          if (allFilled) {
            setAnswersSubmitted(true);
          }
        }

        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setQuiz(null);
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const backUrl = fromSection
    ? buildAdminHomeHref(fromSection, searchParams)
    : `/quiz/${quizId}`;

  const navigateBack = () => {
    if (embedded && onEmbeddedBack) onEmbeddedBack();
    else router.push(backUrl);
  };

  const updateCorrectAnswer = (questionId: string, answer: string) => {
    setCorrectAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const getQuestionKey = (question: QuizQuestion, idx: number) => {
    return (
      question._id || question.questionNumber?.toString() || idx.toString()
    );
  };

  const fetchQuizData = async () => {
    if (!quizId) return;

    try {
      const res = await fetch(`/api/quiz/${quizId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await res.json();
      const quizData = response?.data?.data ?? response?.data ?? null;
      setQuiz(quizData);

      // Initialize correct answers from quiz data
      if (quizData?.questionsArray) {
        const initialAnswers: Record<string, string> = {};
        quizData.questionsArray.forEach((q: QuizQuestion) => {
          const key = q._id || q.questionNumber?.toString() || "";
          const correctAnswer = q.correctAnswer as unknown;
          if (
            key &&
            correctAnswer !== undefined &&
            correctAnswer !== null &&
            correctAnswer !== ""
          ) {
            // Convert boolean to string if needed
            const answerValue =
              typeof correctAnswer === "boolean"
                ? String(correctAnswer)
                : String(correctAnswer);
            initialAnswers[key] = answerValue;
          }
        });
        setCorrectAnswers(initialAnswers);

        // Check if all answers are filled
        const allFilled = quizData.questionsArray.every((q: QuizQuestion) => {
          const correctAnswer = q.correctAnswer as unknown;
          const answer =
            correctAnswer !== undefined &&
            correctAnswer !== null &&
            correctAnswer !== ""
              ? String(correctAnswer)
              : "";
          return answer.trim() !== "";
        });

        if (allFilled) {
          setAnswersSubmitted(true);
        }
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
    }
  };

  const areAllAnswersFilled = () => {
    if (!quiz || !quiz.questionsArray || quiz.questionsArray.length === 0) {
      return false;
    }

    // Check if all answers are filled based on quiz data (after refresh)
    return quiz.questionsArray.every((question, idx) => {
      const correctAnswer = question.correctAnswer as unknown;
      const answer =
        correctAnswer !== undefined &&
        correctAnswer !== null &&
        correctAnswer !== ""
          ? String(correctAnswer)
          : "";
      return answer.trim() !== "";
    });
  };

  const handleSubmitCorrectAnswers = async () => {
    if (!quiz || !quiz.questionsArray) {
      setError("No quiz data available");
      return;
    }

    setSubmitLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Transform correctAnswers into the API format
      const answers = quiz.questionsArray.map((question, idx) => {
        const questionKey = getQuestionKey(question, idx);
        const selectedAnswer =
          correctAnswers[questionKey] || question.correctAnswer || "";

        const answerPayload: {
          questionNumber: number;
          selectedAnswer: string;
          selectedAnswerOption?: number;
        } = {
          questionNumber: question.questionNumber || idx + 1,
          selectedAnswer: selectedAnswer,
        };

        // For MCQ/BOOLEAN questions, find the option index
        if (question.options && question.options.length > 0) {
          const optionIndex = question.options.findIndex(
            (opt) => opt === selectedAnswer,
          );
          if (optionIndex !== -1) {
            answerPayload.selectedAnswerOption = optionIndex;
          }
        }

        return answerPayload;
      });

      const res = await fetch(`/api/quiz/${quizId}/submit-correct-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ answers }),
      });

      const response = await res.json();

      if (!res.ok || !response.success) {
        throw new Error(
          response.message ||
            response.error ||
            "Failed to update correct answers",
        );
      }

      setSuccessMessage("Correct answers updated successfully!");
      setAnswersSubmitted(true);

      // Refresh the quiz data to get updated correct answers
      await fetchQuizData();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      onQuizUpdated?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update correct answers",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSettleQuiz = async () => {
    if (!quizId) {
      setError("Quiz ID is required");
      return;
    }

    setSettleLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/quiz/${quizId}/settle-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      });

      const response = await res.json();

      if (!res.ok || !response.success) {
        throw new Error(
          response.message || response.error || "Failed to settle quiz",
        );
      }

      // Capture submissions processed count
      const processedCount = response?.data?.submissionsProcessed ?? null;
      setSubmissionsProcessed(processedCount);

      setSuccessMessage(
        processedCount !== null
          ? `Quiz settled successfully! Processed ${processedCount} submission${processedCount !== 1 ? "s" : ""}.`
          : "Quiz settled successfully!",
      );

      // Refresh the quiz data to get updated status
      await fetchQuizData();

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      onQuizUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to settle quiz");
    } finally {
      setSettleLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div
        className={
          embedded
            ? "flex items-center justify-center py-16 bg-zinc-900 rounded-lg border border-zinc-700"
            : "flex items-center justify-center min-h-screen bg-black"
        }
      >
        <p className="text-gray-400">Loading quiz...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div
        className={
          embedded
            ? "bg-zinc-900 rounded-lg border border-zinc-700 p-8 text-center"
            : "flex items-center justify-center min-h-screen bg-black"
        }
      >
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Quiz not found"}</p>
          <button
            onClick={navigateBack}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className={embedded ? "" : "min-h-screen bg-black p-6"}>
      <div className={embedded ? "w-full" : "max-w-4xl mx-auto"}>
        {!embedded && (
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={navigateBack}
              className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-white">Quiz Settlement</h1>
            <div />
          </div>
        )}

        <div className="bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden p-6">
          {embedded && (
            <h2 className="text-xl font-bold text-white mb-4">Quiz Settlement</h2>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <p className="text-green-200 text-sm">{successMessage}</p>
            </div>
          )}

          {submissionsProcessed !== null &&
            quiz?.quizStatus?.toUpperCase() === "SETTLEMENT_DONE" && (
              <div className="mb-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-blue-200 text-sm font-semibold">
                  Quiz settled for {submissionsProcessed} user
                  {submissionsProcessed !== 1 ? "s" : ""}
                </p>
              </div>
            )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Questions ({quiz.questionsArray?.length || 0})
            </h2>

            {quiz.questionsArray && quiz.questionsArray.length > 0 ? (
              <div className="space-y-4">
                {quiz.questionsArray.map((question, idx) => {
                  const questionKey = getQuestionKey(question, idx);
                  const currentAnswer =
                    correctAnswers[questionKey] || question.correctAnswer || "";

                  return (
                    <div
                      key={question._id || idx}
                      className="p-4 border border-zinc-700 rounded-lg bg-zinc-800/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-400">
                              Question {question.questionNumber || idx + 1}
                            </span>
                            <span className="px-2 py-1 text-xs bg-zinc-700 text-gray-300 rounded">
                              {question.questionType}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-900/50 text-blue-300 rounded">
                              {question.xp} XP
                            </span>
                          </div>
                          <p className="text-white text-lg mb-3">
                            {question.questionText}
                          </p>
                        </div>
                      </div>

                      {question.options && question.options.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-400 mb-2">
                            Select Correct Answer:
                          </p>
                          <div className="space-y-2">
                            {question.options.map((option, optIdx) => {
                              const isSelected = option === currentAnswer;
                              return (
                                <div
                                  key={optIdx}
                                  onClick={() =>
                                    updateCorrectAnswer(questionKey, option)
                                  }
                                  className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                                    isSelected
                                      ? "bg-green-900/30 border-2 border-green-700 text-green-200"
                                      : "bg-zinc-700/50 text-gray-300 hover:bg-zinc-600/50 border-2 border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      checked={isSelected}
                                      onChange={() =>
                                        updateCorrectAnswer(questionKey, option)
                                      }
                                      className="w-4 h-4 text-green-600"
                                    />
                                    <span>{option}</span>
                                    {isSelected && (
                                      <span className="ml-auto text-xs text-green-400">
                                        ✓ Selected
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {(!question.options || question.options.length === 0) && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Enter Correct Answer:
                          </label>
                          <input
                            type="text"
                            value={currentAnswer}
                            onChange={(e) =>
                              updateCorrectAnswer(questionKey, e.target.value)
                            }
                            placeholder="Enter correct answer"
                            className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                          />
                          {currentAnswer && (
                            <p className="mt-2 text-sm text-green-400">
                              Current answer: {currentAnswer}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">No questions found.</p>
            )}
          </div>

          {quiz?.quizStatus?.toUpperCase() === "SETTLEMENT_DONE" ? (
            <div />
          ) : (
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
              <button
                type="button"
                onClick={navigateBack}
                className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitCorrectAnswers}
                disabled={submitLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? "Updating..." : "Update Correct Answers"}
              </button>
            </div>
          )}
        </div>

        {quiz?.quizStatus?.toUpperCase() === "SETTLEMENT_DONE" ? (
          <div className="mt-6 text-center">
            <p className="text-yellow-400 text-lg mb-2">
              Quiz settlement already done
            </p>
            {submissionsProcessed !== null && (
              <p className="text-green-400 text-md">
                Processed {submissionsProcessed} submission
                {submissionsProcessed !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        ) : (
          answersSubmitted &&
          areAllAnswersFilled() && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleSettleQuiz}
                disabled={settleLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {settleLoading ? "Settling..." : "Settle Quiz"}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
