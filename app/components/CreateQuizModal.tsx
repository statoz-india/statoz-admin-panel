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
    teamA: "",
    teamAlogo: "",
    teamAcolorPrimary: "",
    teamAcolorSecondary: "",
    teamB: "",
    teamBlogo: "",
    teamBcolorPrimary: "",
    teamBcolorSecondary: "",
    entryStartTime: "",
    entryStopTime: "",
    questionsArray: [],
  });

  type QuestionType = "MCQ" | "BOOLEAN" | "NUMERIC" | "ALPHABETICAL";

  const [currentQuestion, setCurrentQuestion] = useState<
    Omit<QuizQuestion, "_id">
  >({
    questionText: "",
    questionType: "MCQ",
    options: ["", ""],
    questionNumber: 1,
    points: 10,
    correctAnswer: "",
  });

  // Get the number of options based on question type
  const getOptionsForQuestionType = (type: QuestionType): string[] => {
    switch (type) {
      case "MCQ":
        return ["", ""]; // Start with 2 options
      case "BOOLEAN":
        return ["True", "False"];
      case "NUMERIC":
      case "ALPHABETICAL":
        return [];
      default:
        return ["", ""];
    }
  };

  // Add a new option
  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, ""],
    });
  };

  // Remove an option (minimum 2 for MCQ)
  const removeOption = (index: number) => {
    if (currentQuestion.options.length <= 2) {
      setError("MCQ questions must have at least 2 options");
      return;
    }
    const newOptions = currentQuestion.options.filter(
      (_, idx) => idx !== index
    );
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
    setError("");
  };

  // Handle question type change
  const handleQuestionTypeChange = (type: QuestionType) => {
    const newOptions = getOptionsForQuestionType(type);
    setCurrentQuestion({
      ...currentQuestion,
      questionType: type,
      options: newOptions,
      // Reset correct answer when type changes
      correctAnswer: "",
    });
  };

  if (!isOpen) return null;

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
      setError("Please add at least one question");
      setLoading(false);
      return;
    }

    try {
      await createQuiz(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        teamA: "",
        teamAlogo: "",
        teamAcolorPrimary: "",
        teamAcolorSecondary: "",
        teamB: "",
        teamBlogo: "",
        teamBcolorPrimary: "",
        teamBcolorSecondary: "",
        entryStartTime: "",
        entryStopTime: "",
        questionsArray: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.questionText) {
      setError("Please fill all question fields");
      return;
    }

    // Validate options based on question type
    const questionType = currentQuestion.questionType as QuestionType;
    if (questionType === "MCQ" || questionType === "BOOLEAN") {
      if (questionType === "MCQ" && currentQuestion.options.length < 2) {
        setError("MCQ questions must have at least 2 options");
        return;
      }
      if (currentQuestion.options.some((opt) => !opt)) {
        setError("Please fill all option fields");
        return;
      }
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
      options: ["", ""],
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
                    Question Type *
                  </label>
                  <select
                    value={currentQuestion.questionType}
                    onChange={(e) =>
                      handleQuestionTypeChange(e.target.value as QuestionType)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="BOOLEAN">Boolean (True/False)</option>
                    <option value="NUMERIC">Numeric</option>
                    <option value="ALPHABETICAL">Alphabetical</option>
                  </select>
                </div>
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
              </div>

              {(currentQuestion.questionType === "MCQ" ||
                currentQuestion.questionType === "BOOLEAN") && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Options *
                      {currentQuestion.questionType === "BOOLEAN" &&
                        " (True/False)"}
                    </label>
                    {currentQuestion.questionType === "MCQ" && (
                      <button
                        type="button"
                        onClick={addOption}
                        className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        + Add Option
                      </button>
                    )}
                  </div>
                  {currentQuestion.options.map((option, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
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
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                        placeholder={`Option ${idx + 1}`}
                      />
                      {currentQuestion.questionType === "MCQ" &&
                        currentQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(idx)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            title="Remove option"
                          >
                            ×
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              )}
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
