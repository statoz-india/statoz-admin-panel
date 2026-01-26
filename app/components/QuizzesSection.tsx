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

      if (!res.ok || !response.success) {
        setError(response.metadata.message);
        return;
      }

      setQuizzes(response.data.data);
      setError("");
    } catch (err) {
      setQuizzes([]);
      console.log("err", err);
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
        <p className="text-gray-400">Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Quizzes</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200"
        >
          Create New Quiz
        </button>
      </div>
      <CreateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchQuizzes}
      />
      {error && quizzes.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-400">{error}</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              onClick={() => router.push(`/quiz/${quiz._id}`)}
              className="borderborder-zinc-700 rounded-lg p-6 bg-zinc-800 hover:bg-blue-900 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {quiz.quizId}
                  </h3>
                  <p className="text-gray-400">Tournament: {quiz.tournament}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    quiz.quizStatus === "ENTRYNOTSTARTED"
                      ? "bg-gray-700 text-gray-200"
                      : quiz.quizStatus === "ENTRYSTARTED"
                        ? "bg-blue-900 text-blue-200"
                        : "bg-green-900 text-green-200"
                  }`}
                >
                  {quiz.quizStatus}
                </span>
              </div>

              {/* Teams */}
              <div className="flex items-center gap-4 mb-4 p-4 bg-zinc-800 rounded-lg">
                <div className="flex-1 text-center">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg"
                    style={{
                      backgroundColor: quiz.teamA.primaryColor,
                      color: quiz.teamA.textColor,
                    }}
                  >
                    {quiz.teamA.abbreviation}
                  </div>
                  <p className="font-semibold text-white">{quiz.teamA.name}</p>
                </div>
                <span className="text-gray-500 font-bold">VS</span>
                <div className="flex-1 text-center">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg"
                    style={{
                      backgroundColor: quiz.teamB.primaryColor,
                      color: quiz.teamB.textColor,
                    }}
                  >
                    {quiz.teamB.abbreviation}
                  </div>
                  <p className="font-semibold text-white">{quiz.teamB.name}</p>
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
                  <p className="text-gray-400 mb-1">Entry Stop</p>
                  <p className="text-white">
                    {new Date(quiz.entryStopTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Questions</p>
                  <p className="text-white">
                    {quiz.questionsArray?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Submissions</p>
                  <p className="text-white">
                    {quiz.responseSubmittedByUsers?.length || 0}
                  </p>
                </div>
              </div>

              {/* Created By */}
              <div className="mt-4 pt-4 border-t border-zinc-700 text-sm">
                <p className="text-gray-400">
                  Created by: {quiz.createdByUserData?.email} (
                  {quiz.createdByUserData?.userType})
                </p>
                <p className="text-gray-400">
                  Visibility: {quiz.isVisible ? "Visible" : "Hidden"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
