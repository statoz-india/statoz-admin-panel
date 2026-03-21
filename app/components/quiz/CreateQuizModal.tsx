"use client";

import { useState, FormEvent, useEffect } from "react";
import { CreateQuizPayload } from "../../api/quiz/route";
import { MatchData } from "../../api/match/route";

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
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [formData, setFormData] = useState<CreateQuizPayload>({
    tournament: "",
    matchId: "",
    entryStartTime: "",
    tag: "",
    questionsArray: [],
  });

  type QuestionType = "MCQ" | "BOOLEAN" | "NUMERIC" | "ALPHABETICAL";

  type DraftQuestion = {
    questionText: string;
    questionType: QuestionType;
    options: string[];
    questionNumber: number;
    xp: number;
  };
  const [newQuestion, setNewQuestion] = useState<DraftQuestion | null>(null);

  // Convert datetime-local value to IST ISO format with explicit IST timezone
  // Input: "2026-02-13T13:43" (datetime-local, interpreted as IST)
  // Output: "2026-02-13T13:43:00.000+05:30" (IST ISO format with timezone)
  // This explicitly marks the time as IST (UTC+5:30)
  // Note: If backend converts this to UTC, that's a backend configuration issue
  const convertToISTISO = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return "";
    // datetime-local format: "YYYY-MM-DDTHH:mm"
    const [datePart, timePart] = dateTimeLocal.split("T");
    if (!datePart || !timePart) return dateTimeLocal;

    // Format as IST ISO with milliseconds and IST timezone offset (+05:30)
    // This explicitly tells the backend this is IST time
    return `${datePart}T${timePart}:00.000+05:30`;
  };

  // Get the number of options based on question type
  const getOptionsForQuestionType = (type: QuestionType): string[] => {
    switch (type) {
      case "MCQ":
        return ["", ""];
      case "BOOLEAN":
        return ["true", "false"];
      case "NUMERIC":
      case "ALPHABETICAL":
        return [];
      default:
        return ["", ""];
    }
  };

  // Handlers for editing existing questions
  const updateQuestionText = (questionIndex: number, questionText: string) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      questionText,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  const updateQuestionPoints = (questionIndex: number, xp: number) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      xp: xp,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  const updateQuestionType = (questionIndex: number, newType: QuestionType) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      questionType: newType,
      options: getOptionsForQuestionType(newType),
      correctAnswer: "", // Clear correct answer when type changes
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  const updateQuestionOption = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const updatedQuestions = [...formData.questionsArray];
    const options = [...(updatedQuestions[questionIndex].options ?? [])];
    options[optionIndex] = value;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  const addQuestionOption = (questionIndex: number) => {
    const updatedQuestions = [...formData.questionsArray];
    const options = [...(updatedQuestions[questionIndex].options ?? []), ""];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  const removeQuestionOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...formData.questionsArray];
    const currentOptions = updatedQuestions[questionIndex].options ?? [];
    const options = currentOptions.filter((_, i) => i !== optionIndex);
    if (options.length < 2) return;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  // Fetch tournaments
  const fetchTournaments = async () => {
    try {
      const res = await fetch("/api/tournament", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch tournaments");
      }

      const response = await res.json();
      const tournamentData = response.success ? response.data.data : [];
      setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load tournaments",
      );
    }
  };

  // Fetch matches for selected tournament
  const fetchMatches = async (tournament: string) => {
    if (!tournament) {
      setMatches([]);
      return;
    }

    try {
      setMatchesLoading(true);
      const res = await fetch(`/api/match/${encodeURIComponent(tournament)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch matches");
      }

      const response = await res.json();
      const list = response.success && response.data ? response.data : [];
      setMatches(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError(err instanceof Error ? err.message : "Failed to load matches");
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  // Handle tournament selection
  const handleTournamentChange = (tournament: string) => {
    setSelectedTournament(tournament);
    setFormData({
      ...formData,
      tournament: tournament,
      matchId: "",
    });
    fetchMatches(tournament);
  };

  // Format match label: matchId: teamA.abbreviation vs teamB.abbreviation
  const getMatchLabel = (match: MatchData) => {
    const a = match.teamA?.abbreviation ?? "?";
    const b = match.teamB?.abbreviation ?? "?";
    return `${match.matchId}: ${a} vs ${b}`;
  };

  // Fetch tournaments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTournaments();
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setFormData((prev) => ({ ...prev, entryStartTime: local }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!formData.tournament) {
      setError("Please select a tournament");
      setLoading(false);
      return;
    }

    if (!formData.matchId) {
      setError("Please select a match");
      setLoading(false);
      return;
    }

    if (!formData.entryStartTime) {
      setError("Please provide both entry start times");
      setLoading(false);
      return;
    }

    // Send datetime-local values directly as IST time
    // The datetime-local input value represents IST time that user wants stored as IST
    // We send it with IST timezone (+05:30) to explicitly mark it as IST
    // If backend converts this to UTC, that's a backend configuration issue that needs to be fixed
    const entryStartTimeIST = convertToISTISO(formData.entryStartTime);

    // Validate that entry start time is before match start time (entry stop time)
    const selectedMatch = matches.find((m) => m._id === formData.matchId);
    const entryStopTime = selectedMatch?.matchStartTime
      ? new Date(selectedMatch.matchStartTime).getTime()
      : null;
    const startTime = new Date(`${formData.entryStartTime}+05:30`).getTime();
    if (entryStopTime != null && startTime >= entryStopTime) {
      setError("Entry start time must be before match start time");
      setLoading(false);
      return;
    }

    // Validate that there are questions
    // if (formData.questionsArray.length === 0) {
    //   setError("Please add at least one question");
    //   setLoading(false);
    //   return;
    // }

    try {
      // Prepare payload with IST formatted times
      // Format: "2026-02-13T13:43:00.000+05:30" (IST with explicit timezone)
      // This explicitly marks the time as IST - backend should store it as IST
      const payload = {
        ...formData,
        entryStartTime: entryStartTimeIST,
      };

      // Log what we're sending for debugging
      console.log("Sending times as IST:", {
        entryStartTime: entryStartTimeIST,
      });

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage =
          typeof errorData.message === "string"
            ? errorData.message
            : typeof errorData.error === "string"
              ? errorData.error
              : "Failed to create quiz";
        throw new Error(errorMessage);
      }

      const response = await res.json();
      if (!response.success) {
        throw new Error(response.message || "Failed to create quiz");
      }

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        tournament: "",
        matchId: "",
        entryStartTime: "",

        questionsArray: [],
        tag: "",
      });
      setSelectedTournament("");
      setMatches([]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create quiz";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setNewQuestion({
      questionText: "",
      questionType: "MCQ",
      options: ["", ""],
      questionNumber: 0,
      xp: 10,
    });
  };

  const saveNewQuestion = () => {
    if (!newQuestion) return;
    if (!newQuestion.questionText.trim()) {
      setError("Please enter question text");
      return;
    }
    if (
      (newQuestion.questionType === "MCQ" ||
        newQuestion.questionType === "BOOLEAN") &&
      (newQuestion.options.length < 2 ||
        newQuestion.options.some((o) => !o.trim()))
    ) {
      setError("Please fill at least 2 options for MCQ/Boolean");
      return;
    }
    setError("");
    setFormData({
      ...formData,
      questionsArray: [
        ...formData.questionsArray,
        {
          ...newQuestion,
          questionNumber: formData.questionsArray.length + 1,
          correctAnswer: "", // Correct answer is not set in the form
        },
      ],
    });
    setNewQuestion(null);
  };

  const removeNewQuestion = () => {
    setNewQuestion(null);
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
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tournament *
              </label>
              <select
                required
                value={selectedTournament}
                onChange={(e) => handleTournamentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              >
                <option value="">-- Select a tournament --</option>
                {tournaments.map((tournament) => (
                  <option key={tournament} value={tournament}>
                    {tournament}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Match *
              </label>
              <select
                required
                value={formData.matchId}
                onChange={(e) =>
                  setFormData({ ...formData, matchId: e.target.value })
                }
                disabled={!selectedTournament || matchesLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {matchesLoading
                    ? "Loading matches..."
                    : !selectedTournament
                      ? "Select tournament first"
                      : matches.length === 0
                        ? "No matches for this tournament"
                        : "-- Select a match --"}
                </option>
                {matches.map((match) => (
                  <option key={match._id} value={match._id}>
                    {getMatchLabel(match)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entry Start Time *{" "}
                <span className="text-xs text-gray-500">(IST)</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.entryStartTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    entryStartTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag
              </label>
              <input
                type="text"
                value={formData.tag || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
                placeholder="Enter a tag for this quiz (optional)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
              />
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
                  className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50"
                >
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Question {question.questionNumber} Text *
                      </label>
                      <input
                        type="text"
                        value={question.questionText ?? ""}
                        onChange={(e) =>
                          updateQuestionText(idx, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        XP *
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={question.xp ?? 0}
                        onChange={(e) =>
                          updateQuestionPoints(
                            idx,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type *
                      </label>
                      <select
                        value={question.questionType ?? "MCQ"}
                        onChange={(e) =>
                          updateQuestionType(
                            idx,
                            e.target.value as QuestionType,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                      >
                        <option value="MCQ">MCQ</option>
                        <option value="BOOLEAN">Boolean (True/False)</option>
                        <option value="NUMERIC">Numeric</option>
                        <option value="ALPHABETICAL">Alphabetical</option>
                      </select>
                    </div>
                  </div>
                  {(question.questionType === "MCQ" ||
                    question.questionType === "BOOLEAN") && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Options *
                          {question.questionType === "BOOLEAN" &&
                            " (True/False)"}
                        </label>
                        {question.questionType === "MCQ" && (
                          <button
                            type="button"
                            onClick={() => addQuestionOption(idx)}
                            className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            + Add Option
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(question.options ?? []).map((option, optIdx) => (
                          <div key={optIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={
                                question.questionType === "BOOLEAN"
                                  ? (option.toUpperCase() ?? "")
                                  : (option ?? "")
                              }
                              onChange={(e) =>
                                updateQuestionOption(
                                  idx,
                                  optIdx,
                                  e.target.value,
                                )
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                              placeholder={`Option ${optIdx + 1}`}
                            />
                            {question.questionType === "MCQ" &&
                              (question.options?.length ?? 0) > 2 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeQuestionOption(idx, optIdx)
                                  }
                                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shrink-0"
                                  title="Remove option"
                                >
                                  ×
                                </button>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* New question draft form */}
              {newQuestion && (
                <div className="mt-4 p-4 border-2 border-dashed border-blue-500/50 rounded-lg bg-blue-50 dark:bg-zinc-800/80">
                  <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-3">
                    New question
                  </h4>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Question Text *
                    </label>
                    <input
                      type="text"
                      value={newQuestion.questionText}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          questionText: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                      placeholder="Enter question"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type *
                      </label>
                      <select
                        value={newQuestion.questionType}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            questionType: e.target.value as QuestionType,
                            options: getOptionsForQuestionType(
                              e.target.value as QuestionType,
                            ),
                          })
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
                        XP *
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={newQuestion.xp}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            xp: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                      />
                    </div>
                  </div>
                  {(newQuestion.questionType === "MCQ" ||
                    newQuestion.questionType === "BOOLEAN") && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Options *
                          {newQuestion.questionType === "BOOLEAN" &&
                            " (True/False)"}
                        </label>
                        {newQuestion.questionType === "MCQ" && (
                          <button
                            type="button"
                            onClick={() =>
                              setNewQuestion({
                                ...newQuestion,
                                options: [...newQuestion.options, ""],
                              })
                            }
                            className="text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            + Add Option
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {newQuestion.options.map((option, optIdx) => (
                          <div key={optIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={
                                newQuestion.questionType === "BOOLEAN"
                                  ? option.toUpperCase()
                                  : option
                              }
                              onChange={(e) => {
                                const opts = [...newQuestion.options];
                                opts[optIdx] = e.target.value;
                                setNewQuestion({
                                  ...newQuestion,
                                  options: opts,
                                });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                              placeholder={`Option ${optIdx + 1}`}
                            />
                            {newQuestion.questionType === "MCQ" &&
                              newQuestion.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const opts = newQuestion.options.filter(
                                      (_, i) => i !== optIdx,
                                    );

                                    setNewQuestion({
                                      ...newQuestion,
                                      options: opts,
                                    });
                                  }}
                                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shrink-0"
                                >
                                  ×
                                </button>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-3 border-t border-gray-300 dark:border-zinc-600">
                    <button
                      type="button"
                      onClick={saveNewQuestion}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={removeNewQuestion}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {!newQuestion && (
                <button
                  type="button"
                  onClick={addQuestion}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  + Add Question
                </button>
              )}
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
