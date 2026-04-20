"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { Quiz, QuizQuestion } from "@/app/api/quiz/route";
import { buildAdminHomeHref } from "@/app/utils/buildAdminHomeHref";
import EditQuizPage from "./editQuiz/page";
import QuizSettlement from "./settleQuiz/page";
import QuizAnsweredUsersList from "./userSubmissions/page";
import QuizSubmissionsJsonPanel from "./QuizSubmissionsJsonPanel";
import QuizDetailsJsonPanel from "./QuizDetailsJsonPanel";
import { Atom } from "react-loading-indicators";

type QuizDetailTab =
  | "details"
  | "users"
  | "edit"
  | "settle"
  | "submissionsJson"
  | "detailsJson";

function tabFromSearchParams(sp: URLSearchParams): QuizDetailTab {
  const t = sp.get("tab");
  if (t === "submissions-json") return "submissionsJson";
  if (t === "quiz-details-json") return "detailsJson";
  if (t === "users" || t === "edit" || t === "settle") return t;
  return "details";
}

export default function QuizDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const fromSection = searchParams.get("from");
  const { isAuthenticated } = useAuthStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const quizId = params?.id as string;
  const tab = tabFromSearchParams(searchParams);

  const selectTab = (next: QuizDetailTab) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (next === "details") sp.delete("tab");
    else {
      const tabParam =
        next === "submissionsJson"
          ? "submissions-json"
          : next === "detailsJson"
            ? "quiz-details-json"
            : next;
      sp.set("tab", tabParam);
    }
    const q = sp.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const goToDetailsTab = () => selectTab("details");

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
      <div className="flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen">
        <Atom color="#5CDFFF" size="medium" text="" textColor="" />
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
              router.push(buildAdminHomeHref(fromSection, searchParams))
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
              router.push(buildAdminHomeHref(fromSection, searchParams))
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
            <p className="text-gray-400">Quiz Mongo ID: {quiz._id}</p>
          </div>

          {/* Teams */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-800 rounded-lg">
            <div className="flex-1 text-center">
              {quiz.teamA.primaryColor && (
                <div
                  className="w-20 h-20 rounded-full mb-3 items-center justify-center inline-flex font-bold text-lg"
                  style={{ backgroundColor: quiz.teamA.primaryColor }}
                >
                  {quiz.teamA.abbreviation}
                </div>
              )}
              <p className="font-semibold text-lg text-white">
                {quiz.teamA.name}
              </p>
            </div>
            <span className="text-gray-500 font-bold text-xl">VS</span>
            <div className="flex-1 text-center">
              {quiz.teamB.primaryColor && (
                <div
                  className="w-20 h-20 rounded-full mb-3 items-center justify-center inline-flex font-bold text-lg"
                  style={{ backgroundColor: quiz.teamB.primaryColor }}
                >
                  {quiz.teamB.abbreviation}
                </div>
              )}
              <p className="font-semibold text-lg text-white">
                {quiz.teamB.name}
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
              <p className="text-white">{quiz.totalQuestions || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Total Submissions</p>
              <p className="text-white">{quiz.totalSubmission || 0}</p>
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

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            type="button"
            onClick={() => selectTab("details")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              tab === "details"
                ? "bg-white text-black"
                : "bg-zinc-600 text-white hover:bg-zinc-500"
            }`}
          >
            Quiz details
          </button>
          <button
            type="button"
            onClick={() => selectTab("users")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              tab === "users"
                ? "bg-white text-black"
                : "bg-zinc-600 text-white hover:bg-zinc-500"
            }`}
          >
            Users answered
          </button>
          <button
            type="button"
            onClick={() => selectTab("edit")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              tab === "edit"
                ? "bg-white text-black"
                : "bg-zinc-600 text-white hover:bg-zinc-500"
            }`}
          >
            Edit quiz
          </button>
          <button
            type="button"
            onClick={() => selectTab("settle")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              tab === "settle"
                ? "bg-white text-black"
                : "bg-zinc-600 text-white hover:bg-zinc-500"
            }`}
          >
            Settle quiz
          </button>
          <button
            type="button"
            onClick={() => selectTab("submissionsJson")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              tab === "submissionsJson"
                ? "bg-white text-black"
                : "bg-zinc-600 text-white hover:bg-zinc-500"
            }`}
          >
            Quiz Submissions JSON
          </button>
          <button
            type="button"
            onClick={() => selectTab("detailsJson")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              tab === "detailsJson"
                ? "bg-white text-black"
                : "bg-zinc-600 text-white hover:bg-zinc-500"
            }`}
          >
            Quiz details JSON
          </button>
        </div>

        {tab === "details" &&
          (quiz.questionsArray && quiz.questionsArray.length > 0 ? (
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
                                <span className="text-green-400">
                                  ✓ Correct
                                </span>
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
          ) : (
            <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 mb-6">
              <p className="text-gray-400">No questions on this quiz yet.</p>
            </div>
          ))}

        {tab === "users" && <QuizAnsweredUsersList embedded />}

        {tab === "edit" && (
          <EditQuizPage
            embedded
            onEditSuccess={() => {
              void fetchQuiz();
              goToDetailsTab();
            }}
            onEmbeddedBack={goToDetailsTab}
          />
        )}

        {tab === "settle" && (
          <QuizSettlement
            embedded
            onQuizUpdated={() => void fetchQuiz()}
            onEmbeddedBack={goToDetailsTab}
          />
        )}

        {tab === "submissionsJson" && <QuizSubmissionsJsonPanel embedded />}

        {tab === "detailsJson" && <QuizDetailsJsonPanel embedded />}
      </div>
    </div>
  );
}
