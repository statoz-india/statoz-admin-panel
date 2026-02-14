"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { Quiz, QuizQuestion } from "@/app/api/quiz/route";

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const fromSection = searchParams.get("from");
  const { isAuthenticated } = useAuthStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const quizId = params?.id as string;

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/quiz/${quizId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const response = await res.json();
      setQuiz(response.data.data);
      setError("");
    } catch (err) {
      setQuiz(null);
      setError(err instanceof Error ? err.message : "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading quiz details...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Quiz not found"}</p>
          <button
            onClick={() =>
              router.push(fromSection ? `/?section=${fromSection}` : "/")
            }
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() =>
              router.push(fromSection ? `/?section=${fromSection}` : "/")
            }
            className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800"
          >
            ← Back
          </button>
          {/* <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Quiz
            </button>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                quiz.quizStatus === "ENTRYNOTSTARTED"
                  ? "bg-gray-700 text-gray-200"
                  : quiz.quizStatus === "ENTRYSTARTED"
                    ? "bg-blue-900 text-blue-200"
                    : quiz.quizStatus === "LIVE"
                      ? "bg-green-900 text-green-200"
                      : "bg-gray-700 text-gray-200"
              }`}
            >
              {quiz.quizStatus}
            </span>
          </div> */}
        </div>

        {/* Quiz Info Card */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">
              {quiz.quizId}
            </h1>
            <p className="text-gray-400">Tournament: {quiz.tournament}</p>
          </div>

          {/* Teams */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-800 rounded-lg">
            <div className="flex-1 text-center">
              {quiz.matchData.teamA.primaryColor && (
                <div
                  className="w-20 h-20 rounded-full mb-3 items-center justify-center inline-flex font-bold text-lg"
                  style={{ backgroundColor: quiz.matchData.teamA.primaryColor }}
                >
                  {quiz.matchData.teamA.abbreviation}
                </div>
              )}
              <p className="font-semibold text-lg text-white">
                {quiz.matchData.teamA.name}
              </p>
            </div>
            <span className="text-gray-500 font-bold text-xl">VS</span>
            <div className="flex-1 text-center">
              {quiz.matchData.teamB.primaryColor && (
                <div
                  className="w-20 h-20 rounded-full mb-3 items-center justify-center inline-flex font-bold text-lg"
                  style={{ backgroundColor: quiz.matchData.teamB.primaryColor }}
                >
                  {quiz.matchData.teamB.abbreviation}
                </div>
              )}
              <p className="font-semibold text-lg text-white">
                {quiz.matchData.teamB.name}
              </p>
            </div>
          </div>

          {/* Quiz Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Entry Start</p>
              <p className="text-white">
                {new Date(quiz.entryStartTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Match Start</p>
              <p className="text-white">
                {new Date(quiz.matchStartTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Total Questions</p>
              <p className="text-white">{quiz.questionsArray?.length || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Total Submissions</p>
              <p className="text-white">
                {quiz.responseSubmittedByUsers?.length || 0}
              </p>
            </div>
          </div>

          {/* Created By */}
          <div className="pt-4 border-t border-zinc-700 text-sm">
            <p className="text-gray-400">
              Created by: {quiz.createdByUserData?.email} (
              {quiz.createdByUserData?.userType})
            </p>
            <p className="text-gray-400">
              Visibility: {quiz.isVisible ? "Visible" : "Hidden"}
            </p>
          </div>
        </div>

        {/* Questions Section */}
        {quiz.questionsArray && quiz.questionsArray.length > 0 && (
          <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Questions ({quiz.questionsArray.length})
            </h2>
            <div className="space-y-6">
              {quiz.questionsArray.map(
                (question: QuizQuestion, idx: number) => (
                  <div
                    key={question._id || idx}
                    className="p-4 border border-zinc-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          Question {question.questionNumber}:{" "}
                          {question.questionText}
                        </h3>
                      </div>
                      <span className="text-sm text-gray-400 bg-zinc-800 px-3 py-1 rounded">
                        {question.xp} xp
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.options?.map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg ${
                            option === question.correctAnswer
                              ? "bg-green-900 text-green-200 font-medium border-2 border-green-500"
                              : "bg-zinc-800 text-gray-300 border border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {option === question.correctAnswer && (
                              <span className="text-green-400">✓ Correct</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Type: {question.questionType}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
