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

  const quizId = params?.id as string;

  const convertUnixToDateTimeLocal = (
    unixTimestamp: number | string | Date,
  ): string => {
    if (!unixTimestamp) return "";
    let date: Date;
    if (unixTimestamp instanceof Date) {
      date = unixTimestamp;
    } else if (typeof unixTimestamp === "string") {
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
      setFormData({
        tournament,
        teamA: teamAId,
        teamB: teamBId,
        entryStartTime: convertUnixToDateTimeLocal(quiz.entryStartTime) || "",
        entryStopTime: convertUnixToDateTimeLocal(quiz.entryStopTime) || "",
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
        entryStartTime: Math.floor(
          new Date(formData.entryStartTime).getTime() / 1000,
        ),
        entryStopTime: Math.floor(
          new Date(formData.entryStopTime).getTime() / 1000,
        ),
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

  const updateQuestionCorrectAnswer = (
    questionIndex: number,
    correctAnswer: string,
  ) => {
    const updatedQuestions = [...formData.questionsArray];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      correctAnswer,
    };
    setFormData({ ...formData, questionsArray: updatedQuestions });
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
                    <div className="mb-3">
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
                          Type
                        </label>
                        <input
                          type="text"
                          value={question.questionType ?? ""}
                          disabled
                          className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-700 text-gray-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    {(question.questionType === "MCQ" ||
                      question.questionType === "BOOLEAN") &&
                      question.options &&
                      question.options.length > 0 && (
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Options
                          </label>
                          <div className="space-y-2">
                            {question.options.map((option, optIdx) => (
                              <div
                                key={optIdx}
                                className={`p-3 rounded-lg border-2 ${
                                  option === question.correctAnswer
                                    ? "bg-green-900/30 border-green-500"
                                    : "bg-zinc-800 border-zinc-700"
                                }`}
                              >
                                <span className="text-white">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    {(question.questionType === "NUMERIC" ||
                      question.questionType === "ALPHABETICAL") && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Correct Answer *
                        </label>
                        <input
                          type="text"
                          value={question.correctAnswer ?? ""}
                          onChange={(e) =>
                            updateQuestionCorrectAnswer(idx, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                          placeholder="Enter the correct answer"
                        />
                      </div>
                    )}
                  </div>
                ))}
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
