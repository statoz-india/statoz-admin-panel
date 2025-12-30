"use client";

import { useState, FormEvent } from "react";
import { createQuiz, CreateQuizPayload, QuizQuestion } from "@/app/lib/api";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateQuizModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateQuizModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateQuizPayload>({
    quizId: "",
    teamA: "",
    teamAlogo: "",
    teamAcolorPrimary: "",
    teamAcolorSecondary: "",
    teamB: "",
    teamBlogo: "",
    teamBcolorPrimary: "",
    teamBcolorSecondary: "",
    quizStatus: "ENTRYNOTSTARTED",
    tournament: "",
    entryStartTime: "",
    entryStopTime: "",
    questionsArray: [],
    isVisible: true,
  });

  const [currentQuestion, setCurrentQuestion] = useState<
    Omit<QuizQuestion, "_id">
  >({
    questionText: "",
    questionType: "MCQ",
    options: ["", "", "", ""],
    questionNumber: 1,
    points: 10,
    correctAnswer: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createQuiz(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        quizId: "",
        teamA: "",
        teamAlogo: "",
        teamAcolorPrimary: "",
        teamAcolorSecondary: "",
        teamB: "",
        teamBlogo: "",
        teamBcolorPrimary: "",
        teamBcolorSecondary: "",
        quizStatus: "ENTRYNOTSTARTED",
        tournament: "",
        entryStartTime: "",
        entryStopTime: "",
        questionsArray: [],
        isVisible: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    if (
      !currentQuestion.questionText ||
      !currentQuestion.correctAnswer ||
      currentQuestion.options.some((opt) => !opt)
    ) {
      setError("Please fill all question fields");
      return;
    }
    setFormData({
      ...formData,
      questionsArray: [
        ...formData.questionsArray,
        {
          ...currentQuestion,
          questionNumber: formData.questionsArray.length + 1,
        },
      ],
    });
    setCurrentQuestion({
      questionText: "",
      questionType: "MCQ",
      options: ["", "", "", ""],
      questionNumber: formData.questionsArray.length + 2,
      points: 10,
      correctAnswer: "",
    });
    setError("");
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questionsArray: formData.questionsArray.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Create New Quiz
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
                Quiz ID *
              </label>
              <input
                type="text"
                required
                value={formData.quizId}
                onChange={(e) =>
                  setFormData({ ...formData, quizId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tournament *
              </label>
              <input
                type="text"
                required
                value={formData.tournament}
                onChange={(e) =>
                  setFormData({ ...formData, tournament: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quiz Status *
              </label>
              <select
                required
                value={formData.quizStatus}
                onChange={(e) =>
                  setFormData({ ...formData, quizStatus: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              >
                <option value="ENTRYNOTSTARTED">Entry Not Started</option>
                <option value="ENTRYSTARTED">Entry Started</option>
                <option value="LIVE">Live</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData({ ...formData, isVisible: e.target.checked })
                }
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Visible
              </label>
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

            {/* Add Question Form */}
            <div className="mb-4 p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Question Text *
                </label>
                <input
                  type="text"
                  value={currentQuestion.questionText}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      questionText: e.target.value,
                    })
                  }
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
                    value={currentQuestion.points}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        points: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Correct Answer *
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.correctAnswer}
                    onChange={(e) =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        correctAnswer: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Options *
                </label>
                {currentQuestion.options.map((option, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[idx] = e.target.value;
                      setCurrentQuestion({
                        ...currentQuestion,
                        options: newOptions,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white mb-2"
                    placeholder={`Option ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Question
              </button>
            </div>

            {/* List of Added Questions */}
            {formData.questionsArray.length > 0 && (
              <div className="space-y-2">
                {formData.questionsArray.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-black dark:text-white">
                        Q{q.questionNumber}: {q.questionText}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {q.points} pts | Correct: {q.correctAnswer}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              disabled={loading || formData.questionsArray.length === 0}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
