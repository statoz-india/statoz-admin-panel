"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateQuizModal from "./CreateQuizModal";
import { Quiz } from "../api/quiz/route";

export default function QuizzesSection() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/quiz", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const response = await res.json();
      setQuizzes(response.data.data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Quizzes
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Create New Quiz
        </button>
      </div>

      <CreateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchQuizzes}
      />
      <div className="grid gap-6">
        {quizzes.length === 0 ? (
          <p className="text-gray-400">No quizzes found.</p>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz._id}
              onClick={() => router.push(`/quiz/${quiz._id}`)}
              className="borderborder-zinc-700 rounded-lg p-6 hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {quiz.quizId}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tournament: {quiz.tournament}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    quiz.quizStatus === "ENTRYNOTSTARTED"
                      ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      : quiz.quizStatus === "ENTRYSTARTED"
                      ? "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {quiz.quizStatus}
                </span>
              </div>

              {/* Teams */}
              <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <div className="flex-1 text-center">
                  <div
                    className="inline-block w-16 h-16 rounded-full mb-2"
                    style={{ backgroundColor: quiz.teamAcolorPrimary }}
                  />
                  <p className="font-semibold text-black dark:text-white">
                    {quiz.teamA}
                  </p>
                </div>
                <span className="text-gray-400 dark:text-gray-500 font-bold">
                  VS
                </span>
                <div className="flex-1 text-center">
                  <div
                    className="inline-block w-16 h-16 rounded-full mb-2"
                    style={{ backgroundColor: quiz.teamBcolorPrimary }}
                  />
                  <p className="font-semibold text-black dark:text-white">
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
                    Questions
                  </p>
                  <p className="text-black dark:text-white">
                    {quiz.questionsArray?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                    Submissions
                  </p>
                  <p className="text-black dark:text-white">
                    {quiz.responseSubmittedByUsers?.length || 0}
                  </p>
                </div>
              </div>

              {/* Created By */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm">
                <p className="text-gray-500 dark:text-gray-400">
                  Created by: {quiz.createdByUserData?.email} (
                  {quiz.createdByUserData?.userType})
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Visibility: {quiz.isVisible ? "Visible" : "Hidden"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
