"use client";

import { QuizSubmission } from "@/app/api/quiz/[id]/user-response/route";
import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

function QuizAnsweredUsersList() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const fromSection = searchParams.get("from");
  const quizId = params?.id as string;
  const [userResponses, setUserResponses] = useState<QuizSubmission[]>([]);

  const fetchUserResponses = async () => {
    if (!quizId) return;
    try {
      const res = await fetch(`/api/quiz/${quizId}/user-response`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) return;
      const submissions: QuizSubmission[] = Array.isArray(json.data)
        ? (json.data as QuizSubmission[])
        : [];
      // `mapped` does not match the expected `QuizSubmission` shape,
      // so use the original response if possible
      setUserResponses(submissions);
    } catch {
      setUserResponses([]);
    }
  };

  useEffect(() => {
    if (quizId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchUserResponses();
    }
  }, [quizId]);

  return (
    <div className="bg-zinc-900  p-6">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() =>
            router.push(fromSection ? `/?section=${fromSection}` : "/")
          }
          className="px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800"
        >
          ← Back
        </button>
      </div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Users Who Answered ({userResponses.length})
      </h2>
      {userResponses.length === 0 ? (
        <p className="text-gray-400">No users have answered this quiz yet.</p>
      ) : (
        <div className="space-y-4">
          {userResponses.map((response, idx) => (
            <div
              key={response.userData._id || idx}
              className="p-4 border border-zinc-700 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {response.userData.userName}
                  </p>

                  {response.userData.email && (
                    <p className="text-sm text-gray-400">
                      Email: {response.userData.email}
                    </p>
                  )}
                  {response.submissionTime && (
                    <p className="text-sm text-gray-400">
                      Submitted:{" "}
                      {new Date(response.submissionTime).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              {response.answers && response.answers.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <p className="text-sm font-medium text-white mb-2">
                    Responses:
                  </p>
                  <div className="space-y-1">
                    {response.answers.map((resp, respIdx) => (
                      <p key={respIdx} className="text-sm text-gray-400">
                        Q{resp.questionNumber}: {resp.selectedAnswer}(
                        {resp.selectedAnswerOption})
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
  );
}

export default QuizAnsweredUsersList;
