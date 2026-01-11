"use client";

import { useState, FormEvent, useEffect } from "react";
import {
  updateQuiz,
  Quiz,
  QuizQuestion,
  CreateQuizPayload,
} from "@/app/lib/api";

interface EditQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  quiz: Quiz | null;
}

export default function EditQuizModal({
  isOpen,
  onClose,
  onSuccess,
  quiz,
}: EditQuizModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateQuizPayload>({
    tournament: "",
    teamA: "",
    teamB: "",
    entryStartTime: "",
    entryStopTime: "",
    questionsArray: [],
  });

  // Convert Unix timestamp to datetime-local string
  const convertUnixToDateTimeLocal = (
    unixTimestamp: number | string | Date
  ): string => {
    if (!unixTimestamp) return "";
    let date: Date;
    if (unixTimestamp instanceof Date) {
      date = unixTimestamp;
    } else if (typeof unixTimestamp === "string") {
      // Check if it's already an ISO string or needs conversion
      if (unixTimestamp.includes("T") || unixTimestamp.includes("-")) {
        date = new Date(unixTimestamp);
      } else {
        date = new Date(parseInt(unixTimestamp) * 1000);
      }
    } else {
      date = new Date(unixTimestamp * 1000);
    }
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Initialize form data when quiz is loaded
  useEffect(() => {
    if (quiz) {
      setFormData({
        tournament: quiz.tournament || "",
        teamA: typeof quiz.teamA === "string" ? quiz.teamA : quiz.teamA._id,
        teamB: typeof quiz.teamB === "string" ? quiz.teamB : quiz.teamB._id,
        entryStartTime: convertUnixToDateTimeLocal(quiz.entryStartTime),
        entryStopTime: convertUnixToDateTimeLocal(quiz.entryStopTime),
        questionsArray:
          quiz.questionsArray?.map((q) => ({
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options || [],
            questionNumber: q.questionNumber,
            points: q.points,
            correctAnswer: q.correctAnswer,
          })) || [],
      });
    }
  }, [quiz]);

  if (!isOpen || !quiz) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!formData.entryStartTime || !formData.entryStopTime) {
      setError("Please provide both entry start and stop times");
      setLoading(false);
      return;
    }

    // Validate that entry start time is before stop time
    const startTime = new Date(formData.entryStartTime).getTime();
    const stopTime = new Date(formData.entryStopTime).getTime();
    if (startTime >= stopTime) {
      setError("Entry start time must be before entry stop time");
      setLoading(false);
      return;
    }

    // Validate that there are questions
    if (formData.questionsArray.length === 0) {
      setError("Please ensure there is at least one question");
      setLoading(false);
      return;
    }

    try {
      await updateQuiz(quiz._id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quiz");
    } finally {
      setLoading(false);
    }
  };

  // Update a question's correct answer
  const updateQuestionCorrectAnswer = (
    questionIndex: number,
    correctAnswer: string
  ) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctAnswer,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  // Update a question's text
  const updateQuestionText = (questionIndex: number, questionText: string) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      questionText,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  // Update a question's points
  const updateQuestionPoints = (questionIndex: number, points: number) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      points,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Edit Quiz
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team A *
              </label>
              <input
                type="text"
                required
                value={formData.teamA}
                onChange={(e) =>
                  setFormData({ ...formData, teamA: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team B *
              </label>
              <input
                type="text"
                required
                value={formData.teamB}
                onChange={(e) =>
                  setFormData({ ...formData, teamB: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entry Start Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.entryStartTime}
                onChange={(e) =>
                  setFormData({ ...formData, entryStartTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entry Stop Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.entryStopTime}
                onChange={(e) =>
                  setFormData({ ...formData, entryStopTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
          </div>

          {/* Optional Team Details */}
          <div className="mb-6 border-t border-gray-200 dark:border-zinc-800 pt-4">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Optional Team Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team A Logo URL
                </label>
                <input
                  type="url"
                  value={formData.teamAlogo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, teamAlogo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team B Logo URL
                </label>
                <input
                  type="url"
                  value={formData.teamBlogo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, teamBlogo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team A Primary Color
                </label>
                <input
                  type="color"
                  value={formData.teamAcolorPrimary || "#000000"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamAcolorPrimary: e.target.value,
                    })
                  }
                  className="w-full h-10 border border-gray-300 dark:border-zinc-600 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team B Primary Color
                </label>
                <input
                  type="color"
                  value={formData.teamBcolorPrimary || "#000000"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      teamBcolorPrimary: e.target.value,
                    })
                  }
                  className="w-full h-10 border border-gray-300 dark:border-zinc-600 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-6 border-t border-gray-200 dark:border-zinc-800 pt-4">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Questions ({formData.questionsArray.length})
            </h3>

            <div className="space-y-4">
              {formData.questionsArray.map((question, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
                >
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Question {question.questionNumber} Text *
                    </label>
                    <input
                      type="text"
                      value={question.questionText}
                      onChange={(e) => updateQuestionText(idx, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Points *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={question.points}
                        onChange={(e) =>
                          updateQuestionPoints(
                            idx,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        value={question.questionType}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-700 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Options Display */}
                  {(question.questionType === "MCQ" ||
                    question.questionType === "BOOLEAN") &&
                    question.options &&
                    question.options.length > 0 && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Options
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-lg border-2 ${
                                option === question.correctAnswer
                                  ? "bg-green-100 dark:bg-green-900 border-green-500"
                                  : "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-black dark:text-white">
                                  {option}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuestionCorrectAnswer(idx, option)
                                  }
                                  className={`px-3 py-1 rounded text-sm ${
                                    option === question.correctAnswer
                                      ? "bg-green-600 text-white"
                                      : "bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white"
                                  }`}
                                >
                                  {option === question.correctAnswer
                                    ? "✓ Correct"
                                    : "Set as Correct"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Correct Answer Input for NUMERIC and ALPHABETICAL */}
                  {(question.questionType === "NUMERIC" ||
                    question.questionType === "ALPHABETICAL") && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Correct Answer *
                      </label>
                      <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) =>
                          updateQuestionCorrectAnswer(idx, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                        placeholder="Enter the correct answer"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
