"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getQuizById, Quiz, QuizQuestion } from "@/app/lib/api";
import { useAuthStore } from "@/app/store/authStore";
import EditQuizModal from "@/app/components/EditQuizModal";

interface QuizResponse {
  userId: string;
  userName?: string;
  email?: string;
  responses?: {
    questionNumber: number;
    answer: string;
    isCorrect?: boolean;
  }[];
  submittedAt?: string;
  [key: string]: unknown;
}

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userResponses, setUserResponses] = useState<QuizResponse[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const quizId = params?.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchQuiz = async () => {
      if (!quizId) return;

      try {
        setLoading(true);
        const response = await getQuizById(quizId);
        setQuiz(response.data);

        // Fetch user responses if available
        // Note: You may need to create an API endpoint to fetch user responses
        // For now, we'll show the user IDs from responseSubmittedByUsers
        setUserResponses(
          response.data.responseSubmittedByUsers.map((userId: unknown) => ({
            userId: userId as string,
          }))
        );
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">
          Loading quiz details...
        </p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">
            {error || "Quiz not found"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Quiz
            </button>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                quiz.quizStatus === "ENTRYNOTSTARTED"
                  ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  : quiz.quizStatus === "ENTRYSTARTED"
                  ? "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : quiz.quizStatus === "LIVE"
                  ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {quiz.quizStatus}
            </span>
          </div>
        </div>

        {/* Quiz Info Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-6 mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              {quiz.quizId}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tournament: {quiz.tournament}
            </p>
          </div>

          {/* Teams */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
            <div className="flex-1 text-center">
              {quiz.teamAcolorPrimary && (
                <div
                  className="inline-block w-20 h-20 rounded-full mb-3"
                  style={{ backgroundColor: quiz.teamAcolorPrimary }}
                />
              )}
              <p className="font-semibold text-lg text-black dark:text-white">
                {quiz.teamA}
              </p>
            </div>
            <span className="text-gray-400 dark:text-gray-500 font-bold text-xl">
              VS
            </span>
            <div className="flex-1 text-center">
              {quiz.teamBcolorPrimary && (
                <div
                  className="inline-block w-20 h-20 rounded-full mb-3"
                  style={{ backgroundColor: quiz.teamBcolorPrimary }}
                />
              )}
              <p className="font-semibold text-lg text-black dark:text-white">
                {quiz.teamB}
              </p>
            </div>
          </div>

          {/* Quiz Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Entry Start
              </p>
              <p className="text-black dark:text-white">
                {new Date(quiz.entryStartTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Entry Stop
              </p>
              <p className="text-black dark:text-white">
                {new Date(quiz.entryStopTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Total Questions
              </p>
              <p className="text-black dark:text-white">
                {quiz.questionsArray?.length || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Total Submissions
              </p>
              <p className="text-black dark:text-white">
                {quiz.responseSubmittedByUsers?.length || 0}
              </p>
            </div>
          </div>

          {/* Created By */}
          <div className="pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Created by: {quiz.createdByUserData?.email} (
              {quiz.createdByUserData?.userType})
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Visibility: {quiz.isVisible ? "Visible" : "Hidden"}
            </p>
          </div>
        </div>

        {/* Questions Section */}
        {quiz.questionsArray && quiz.questionsArray.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-6 mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
              Questions ({quiz.questionsArray.length})
            </h2>
            <div className="space-y-6">
              {quiz.questionsArray.map(
                (question: QuizQuestion, idx: number) => (
                  <div
                    key={question._id || idx}
                    className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black dark:text-white">
                          Question {question.questionNumber}:{" "}
                          {question.questionText}
                        </h3>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded">
                        {question.points} pts
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.options?.map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-lg ${
                            option === question.correctAnswer
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 font-medium border-2 border-green-500"
                              : "bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {option === question.correctAnswer && (
                              <span className="text-green-600 dark:text-green-400">
                                ✓ Correct
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Type: {question.questionType}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* User Responses Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
            Users Who Answered ({userResponses.length})
          </h2>
          {userResponses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No users have answered this quiz yet.
            </p>
          ) : (
            <div className="space-y-4">
              {userResponses.map((response, idx) => (
                <div
                  key={response.userId || idx}
                  className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-black dark:text-white">
                        User ID: {response.userId}
                      </p>
                      {response.userName && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Name: {response.userName}
                        </p>
                      )}
                      {response.email && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Email: {response.email}
                        </p>
                      )}
                      {response.submittedAt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Submitted:{" "}
                          {new Date(response.submittedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {response.responses && response.responses.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-700">
                      <p className="text-sm font-medium text-black dark:text-white mb-2">
                        Responses:
                      </p>
                      <div className="space-y-1">
                        {response.responses.map((resp, respIdx) => (
                          <p
                            key={respIdx}
                            className={`text-sm ${
                              resp.isCorrect
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            Q{resp.questionNumber}: {resp.answer}{" "}
                            {resp.isCorrect !== undefined &&
                              (resp.isCorrect ? "✓" : "✗")}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Quiz Modal */}
      <EditQuizModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          // Refetch quiz data
          const fetchQuiz = async () => {
            if (!quizId) return;
            try {
              setLoading(true);
              const response = await getQuizById(quizId);
              setQuiz(response.data);
              setUserResponses(
                response.data.responseSubmittedByUsers.map((userId: unknown) => ({
                  userId: userId as string,
                }))
              );
              setError("");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Failed to load quiz");
            } finally {
              setLoading(false);
            }
          };
          fetchQuiz();
        }}
        quiz={quiz}
      />
    </div>
  );
}
