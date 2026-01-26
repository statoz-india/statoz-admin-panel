"use client";

import { useState, FormEvent, useEffect } from "react";
import { QuizQuestion } from "@/app/lib/api";
import { Team } from "../api/tournament/teams/route";
import { CreateQuizPayload } from "../api/quiz/route";

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Helper function to convert Unix timestamp to datetime-local string format
const convertUnixToDateTimeLocal = (unixTimestamp: number): string => {
  if (!unixTimestamp || unixTimestamp === 0) return "";
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  // Format as YYYY-MM-DDTHH:mm for datetime-local input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function CreateQuizModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateQuizModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateQuizPayload>({
    tournament: "",
    teamA: "",
    teamB: "",
    entryStartTime: 0,
    entryStopTime: 0,
    tag: "",
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

  // Helper function to convert datetime-local string to Unix timestamp
  const convertToUnixTimestamp = (dateTimeString: string): number => {
    if (!dateTimeString) return 0;
    const date = new Date(dateTimeString);
    return Math.floor(date.getTime() / 1000); // Convert to seconds (Unix timestamp)
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
      (_, idx) => idx !== index,
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

  // Fetch teams for selected tournament
  const fetchTeams = async (tournament: string) => {
    if (!tournament) {
      setTeams([]);
      return;
    }

    try {
      setTeamsLoading(true);
      const res = await fetch(
        `/api/tournament/teams?tournament=${encodeURIComponent(tournament)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch teams");
      }

      const response = await res.json();
      const teamsData = response.success && response.data ? response.data : [];
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError(err instanceof Error ? err.message : "Failed to load teams");
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  };

  // Handle tournament selection
  const handleTournamentChange = (tournament: string) => {
    setSelectedTournament(tournament);
    setFormData({
      ...formData,
      tournament: tournament,
      teamA: "", // Reset team selections
      teamB: "",
    });
    fetchTeams(tournament);
  };

  // Handle team selection
  const handleTeamAChange = (teamId: string) => {
    setFormData({
      ...formData,
      teamA: teamId,
    });
  };

  const handleTeamBChange = (teamId: string) => {
    setFormData({
      ...formData,
      teamB: teamId,
    });
  };

  // Fetch tournaments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTournaments();
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

    if (!formData.teamA || !formData.teamB) {
      setError("Please select both Team A and Team B");
      setLoading(false);
      return;
    }

    if (formData.teamA === formData.teamB) {
      setError("Team A and Team B must be different");
      setLoading(false);
      return;
    }

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
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
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
        teamA: "",
        teamB: "",
        entryStartTime: 0,
        entryStopTime: 0,
        questionsArray: [],
        tag: "",
      });
      setSelectedTournament("");
      setTeams([]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create quiz";
      setError(errorMessage);
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team A *
              </label>
              <select
                required
                value={formData.teamA}
                onChange={(e) => handleTeamAChange(e.target.value)}
                disabled={!selectedTournament || teamsLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {teamsLoading
                    ? "Loading teams..."
                    : !selectedTournament
                      ? "Select tournament first"
                      : "-- Select Team A --"}
                </option>
                {teams
                  .filter((team) => team._id !== formData.teamB)
                  .map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} ({team.abbreviation})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team B *
              </label>
              <select
                required
                value={formData.teamB}
                onChange={(e) => handleTeamBChange(e.target.value)}
                disabled={!selectedTournament || teamsLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {teamsLoading
                    ? "Loading teams..."
                    : !selectedTournament
                      ? "Select tournament first"
                      : "-- Select Team B --"}
                </option>
                {teams
                  .filter((team) => team._id !== formData.teamA)
                  .map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name} ({team.abbreviation})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entry Start Time *
              </label>
              <input
                type="datetime-local"
                required
                value={convertUnixToDateTimeLocal(formData.entryStartTime)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    entryStartTime: convertToUnixTimestamp(e.target.value),
                  })
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
                value={convertUnixToDateTimeLocal(formData.entryStopTime)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    entryStopTime: convertToUnixTimestamp(e.target.value),
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
