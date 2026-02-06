"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { Quiz, CreateQuizAPIPayload } from "@/app/api/quiz/route";
import { Team } from "@/app/api/tournament/teams/route";
import { updateQuiz } from "@/app/lib/api";

export default function EditQuizPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const fromSection = searchParams.get("from");
  const { isAuthenticated } = useAuthStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [tournaments, setTournaments] = useState<string[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateQuizAPIPayload>({
    tournament: "",
    teamA: "",
    teamB: "",
    entryStartTime: "",
    entryStopTime: "",
    questionsArray: [],
    tag: "",
  });

  type QuestionType = "MCQ" | "BOOLEAN" | "NUMERIC" | "ALPHABETICAL";
  type DraftQuestion = {
    questionText: string;
    questionType: QuestionType;
    options: string[];
    questionNumber: number;
    points: number;
    correctAnswer: string;
  };
  const [newQuestion, setNewQuestion] = useState<DraftQuestion | null>(null);

  const quizId = params?.id as string;

  const convertUnixToDateTimeLocal = (
    unixTimestamp: number | string | Date | undefined | null,
  ): string => {
    if (unixTimestamp === undefined || unixTimestamp === null) return "";
    let date: Date;
    if (unixTimestamp instanceof Date) {
      date = unixTimestamp;
    } else if (typeof unixTimestamp === "string") {
      const trimmed = unixTimestamp.trim();
      if (!trimmed) return "";
      if (
        trimmed.includes("T") ||
        (trimmed.includes("-") && trimmed.length > 10)
      ) {
        date = new Date(trimmed);
      } else {
        const num = parseInt(trimmed, 10);
        if (Number.isNaN(num)) return "";
        // Values >= 1e12 are likely milliseconds; smaller values are Unix seconds
        date = num >= 1e12 ? new Date(num) : new Date(num * 1000);
      }
    } else {
      // Number: >= 1e12 treat as milliseconds, else as seconds
      const num = Number(unixTimestamp);
      if (Number.isNaN(num)) return "";
      date = num >= 1e12 ? new Date(num) : new Date(num * 1000);
    }
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchTournaments = async () => {
    try {
      const res = await fetch("/api/tournament", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch tournaments");
      const response = await res.json();
      const raw = response.success ? response.data : null;
      const tournamentData = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as { data?: string[] })?.data)
          ? (raw as { data: string[] }).data
          : [];
      setTournaments(tournamentData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tournaments",
      );
    }
  };

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
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch teams");
      const response = await res.json();
      const teamsData = response.success && response.data ? response.data : [];
      setTeams(Array.isArray(teamsData) ? teamsData : []);
    } catch {
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  };

  const handleTournamentChange = (tournament: string) => {
    setSelectedTournament(tournament);
    setFormData({
      ...formData,
      tournament,
      teamA: "",
      teamB: "",
    });
    fetchTeams(tournament);
  };

  const handleTeamAChange = (teamId: string) => {
    setFormData({ ...formData, teamA: teamId });
  };

  const handleTeamBChange = (teamId: string) => {
    setFormData({ ...formData, teamB: teamId });
  };

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

  useEffect(() => {
    if (quiz) {
      const tournament = quiz.tournament ?? "";
      const teamAId =
        typeof quiz.teamA === "string"
          ? quiz.teamA
          : ((quiz.teamA as { _id?: string })?._id ?? "");
      const teamBId =
        typeof quiz.teamB === "string"
          ? quiz.teamB
          : ((quiz.teamB as { _id?: string })?._id ?? "");
      console.log("entryStart", quiz.entryStartTime);
      // Support both direct and nested API shapes for entry times
      const rawQuiz = quiz as unknown as Record<string, unknown>;

      const entryStart =
        rawQuiz.entryStartTime ??
        (rawQuiz.dates as Record<string, unknown>)?.entryStartTime;
      const entryStop =
        rawQuiz.entryStopTime ??
        (rawQuiz.dates as Record<string, unknown>)?.entryStopTime;
      const entryStartStr = convertUnixToDateTimeLocal(
        entryStart as number | string | Date,
      );
      const entryStopStr = convertUnixToDateTimeLocal(
        entryStop as number | string | Date,
      );
      setFormData({
        tournament,
        teamA: teamAId,
        teamB: teamBId,
        entryStartTime: entryStartStr || "",
        entryStopTime: entryStopStr || "",
        tag: quiz.tag ?? "",
        questionsArray:
          quiz.questionsArray?.map((q) => ({
            questionText: q.questionText ?? "",
            questionType: q.questionType ?? "",
            options: q.options ?? [],
            questionNumber: q.questionNumber ?? 0,
            points: q.points ?? 0,
            correctAnswer: q.correctAnswer ?? "",
          })) ?? [],
      });
      setSelectedTournament(tournament);
      fetchTournaments();
      fetchTeams(tournament);
    }
  }, [quiz]);

  const backUrl = fromSection ? `/?section=${fromSection}` : `/quiz/${quizId}`;

  // Ensure current quiz teams appear in dropdown options (so they stay selected while teams load)
  const teamAOptions: Team[] =
    quiz && formData.teamA && !teams.some((t) => t._id === formData.teamA)
      ? [
          ...(typeof quiz.teamA === "object" && quiz.teamA
            ? [
                {
                  _id: (quiz.teamA as Team)._id,
                  name: (quiz.teamA as Team).name,
                  abbreviation: (quiz.teamA as Team).abbreviation,
                  tournament: (quiz.teamA as Team).tournament,
                  createdAt: (quiz.teamA as Team).createdAt,
                  updatedAt: (quiz.teamA as Team).updatedAt,
                  __v: (quiz.teamA as Team).__v,
                },
              ]
            : []),
          ...teams,
        ]
      : teams;
  const teamBOptions: Team[] =
    quiz && formData.teamB && !teams.some((t) => t._id === formData.teamB)
      ? [
          ...(typeof quiz.teamB === "object" && quiz.teamB
            ? [
                {
                  _id: (quiz.teamB as Team)._id,
                  name: (quiz.teamB as Team).name,
                  abbreviation: (quiz.teamB as Team).abbreviation,
                  tournament: (quiz.teamB as Team).tournament,
                  createdAt: (quiz.teamB as Team).createdAt,
                  updatedAt: (quiz.teamB as Team).updatedAt,
                  __v: (quiz.teamB as Team).__v,
                },
              ]
            : []),
          ...teams,
        ]
      : teams;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitLoading(true);

    if (!formData.tournament) {
      setError("Please select a tournament");
      setSubmitLoading(false);
      return;
    }

    if (!formData.teamA || !formData.teamB) {
      setError("Please select both Team A and Team B");
      setSubmitLoading(false);
      return;
    }

    if (formData.teamA === formData.teamB) {
      setError("Team A and Team B must be different");
      setSubmitLoading(false);
      return;
    }

    if (!formData.entryStartTime || !formData.entryStopTime) {
      setError("Please provide both entry start and stop times");
      setSubmitLoading(false);
      return;
    }

    const startTime = new Date(formData.entryStartTime).getTime();
    const stopTime = new Date(formData.entryStopTime).getTime();
    if (startTime >= stopTime) {
      setError("Entry start time must be before entry stop time");
      setSubmitLoading(false);
      return;
    }

    if (formData.questionsArray.length === 0) {
      setError("Please ensure there is at least one question");
      setSubmitLoading(false);
      return;
    }

    try {
      await updateQuiz(quizId, {
        tournament: formData.tournament,
        teamA: formData.teamA,
        teamB: formData.teamB,
        entryStartTime: formData.entryStartTime,
        entryStopTime: formData.entryStopTime,
        questionsArray: formData.questionsArray,
        tag: formData.tag,
      });
      router.push(backUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quiz");
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateQuestionText = (questionIndex: number, questionText: string) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      questionText,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  const updateQuestionPoints = (questionIndex: number, points: number) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      points,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  const getOptionsForQuestionType = (type: QuestionType): string[] => {
    switch (type) {
      case "MCQ":
        return ["", ""];
      case "BOOLEAN":
        return ["True", "False"];
      case "NUMERIC":
      case "ALPHABETICAL":
        return [];
      default:
        return ["", ""];
    }
  };

  const updateQuestionType = (questionIndex: number, newType: QuestionType) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      questionType: newType,
      options: getOptionsForQuestionType(newType),
      correctAnswer: "",
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
    const removedValue = currentOptions[optionIndex];
    const options = currentOptions.filter((_, i) => i !== optionIndex);
    if (options.length < 2) return;
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
      correctAnswer:
        updatedQuestions[questionIndex].correctAnswer === removedValue
          ? ""
          : updatedQuestions[questionIndex].correctAnswer,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
  };

  const addQuestion = () => {
    setNewQuestion({
      questionText: "",
      questionType: "MCQ",
      options: ["", ""],
      questionNumber: 0,
      points: 10,
      correctAnswer: "",
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
        },
      ],
    });
    setNewQuestion(null);
  };

  const removeNewQuestion = () => {
    setNewQuestion(null);
    setError("");
  };

  const removeQuestion = (questionIndex: number) => {
    setFormData({
      ...formData,
      questionsArray: formData.questionsArray.filter(
        (_, i) => i !== questionIndex,
      ),
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-gray-400">Loading quiz...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Quiz not found"}</p>
          <button
            onClick={() => router.push(backUrl)}
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
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push(backUrl)}
            className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">Edit Quiz</h1>
          <div />
        </div>

        <div className="bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tournament *
                </label>
                <select
                  required
                  value={selectedTournament}
                  onChange={(e) => handleTournamentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
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
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Team A *
                </label>
                <select
                  required
                  value={formData.teamA ?? ""}
                  onChange={(e) => handleTeamAChange(e.target.value)}
                  disabled={!selectedTournament || teamsLoading}
                  className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {teamsLoading
                      ? "Loading teams..."
                      : !selectedTournament
                        ? "Select tournament first"
                        : "-- Select Team A --"}
                  </option>
                  {teamAOptions
                    .filter((team) => team._id !== formData.teamB)
                    .map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name} ({team.abbreviation})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Team B *
                </label>
                <select
                  required
                  value={formData.teamB ?? ""}
                  onChange={(e) => handleTeamBChange(e.target.value)}
                  disabled={!selectedTournament || teamsLoading}
                  className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {teamsLoading
                      ? "Loading teams..."
                      : !selectedTournament
                        ? "Select tournament first"
                        : "-- Select Team B --"}
                  </option>
                  {teamBOptions
                    .filter((team) => team._id !== formData.teamA)
                    .map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name} ({team.abbreviation})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Entry Start Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.entryStartTime ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      entryStartTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Entry Stop Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.entryStopTime ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, entryStopTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tag
                </label>
                <input
                  type="text"
                  value={formData.tag ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tag: e.target.value })
                  }
                  placeholder="Enter a tag for this quiz (optional)"
                  className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                />
              </div>
            </div>

            <div className="mb-6 border-t border-zinc-700 pt-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Questions ({formData.questionsArray.length})
              </h3>
              <div className="space-y-4">
                {formData.questionsArray.map((question, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-zinc-700 rounded-lg bg-zinc-800/50"
                  >
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Question {question.questionNumber} Text *
                        </label>
                        <input
                          type="text"
                          value={question.questionText ?? ""}
                          onChange={(e) =>
                            updateQuestionText(idx, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Points *
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={question.points ?? 0}
                          onChange={(e) =>
                            updateQuestionPoints(
                              idx,
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
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
                          className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
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
                          <label className="block text-sm font-medium text-gray-300">
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
                            <div
                              key={optIdx}
                              className="flex gap-2 items-center"
                            >
                              <input
                                type="text"
                                value={option ?? ""}
                                onChange={(e) =>
                                  updateQuestionOption(
                                    idx,
                                    optIdx,
                                    e.target.value,
                                  )
                                }
                                className={`flex-1 px-3 py-2 border rounded-md bg-zinc-800 text-white ${
                                  option === question.correctAnswer
                                    ? "border-green-500"
                                    : "border-zinc-600"
                                }`}
                                placeholder={`Option ${optIdx + 1}`}
                              />
                              {question.questionType === "MCQ" &&
                                (question.options?.length ?? 0) > 2 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeQuestionOption(idx, optIdx)
                                    }
                                    className="px-3 py-2 bg-red-600/80 text-white rounded-md hover:bg-red-600 shrink-0"
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
                  <div className="mt-4 p-4 border-2 border-dashed border-blue-500/50 rounded-lg bg-zinc-800/80">
                    <h4 className="text-sm font-semibold text-blue-300 mb-3">
                      New question
                    </h4>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
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
                        className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                        placeholder="Enter question"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
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
                              correctAnswer: "",
                            })
                          }
                          className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                        >
                          <option value="MCQ">MCQ</option>
                          <option value="BOOLEAN">Boolean (True/False)</option>
                          <option value="NUMERIC">Numeric</option>
                          <option value="ALPHABETICAL">Alphabetical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Points *
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={newQuestion.points}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              points: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                        />
                      </div>
                    </div>
                    {(newQuestion.questionType === "MCQ" ||
                      newQuestion.questionType === "BOOLEAN") && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-300">
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
                            <div
                              key={optIdx}
                              className="flex gap-2 items-center"
                            >
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const opts = [...newQuestion.options];
                                  opts[optIdx] = e.target.value;
                                  setNewQuestion({
                                    ...newQuestion,
                                    options: opts,
                                  });
                                }}
                                className="flex-1 px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
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
                                      const removed =
                                        newQuestion.options[optIdx];
                                      setNewQuestion({
                                        ...newQuestion,
                                        options: opts,
                                        correctAnswer:
                                          newQuestion.correctAnswer === removed
                                            ? ""
                                            : newQuestion.correctAnswer,
                                      });
                                    }}
                                    className="px-3 py-2 bg-red-600/80 text-white rounded-md hover:bg-red-600 shrink-0"
                                  >
                                    ×
                                  </button>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3 pt-3 border-t border-zinc-600">
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
                        className="px-4 py-2 bg-red-600/80 text-white rounded-md hover:bg-red-600"
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

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
              <button
                type="button"
                onClick={() => router.push(backUrl)}
                className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? "Updating..." : "Update Quiz"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
