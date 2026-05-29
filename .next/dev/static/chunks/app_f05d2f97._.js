(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/store/authStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        isAuthenticated: false,
        token: null,
        user: null,
        login: (token, user)=>{
            set({
                isAuthenticated: true,
                token,
                user
            });
        },
        logout: ()=>{
            set({
                isAuthenticated: false,
                token: null,
                user: null
            });
        }
    }), {
    name: "auth-storage"
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updatePrediction",
    ()=>updatePrediction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.API_BASE_URL;
async function updatePrediction(predictionId, payload) {
    let response;
    try {
        response = await fetch(`${API_BASE_URL}/prediction/updatePrediction/${predictionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        });
    } catch  {
        throw new Error("Network error: Unable to connect to the server. Please check if the backend server is running and CORS is configured correctly.");
    }
    let data;
    try {
        data = await response.json();
    } catch  {
        throw new Error(`Server error: Received invalid response (Status: ${response.status}). Please check CORS configuration.`);
    }
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update prediction");
    }
    return data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/quiz/[id]/editQuiz/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditQuizPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function EditQuizPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const fromSection = searchParams.get("from");
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [quiz, setQuiz] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [submitLoading, setSubmitLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tournaments, setTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTournament, setSelectedTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [teams, setTeams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [teamsLoading, setTeamsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tournament: "",
        teamA: "",
        teamB: "",
        entryStartTime: "",
        entryStopTime: "",
        questionsArray: [],
        tag: ""
    });
    const [newQuestion, setNewQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const quizId = params?.id;
    const convertUnixToDateTimeLocal = (unixTimestamp)=>{
        if (unixTimestamp === undefined || unixTimestamp === null) return "";
        let date;
        if (unixTimestamp instanceof Date) {
            date = unixTimestamp;
        } else if (typeof unixTimestamp === "string") {
            const trimmed = unixTimestamp.trim();
            if (!trimmed) return "";
            if (trimmed.includes("T") || trimmed.includes("-") && trimmed.length > 10) {
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
    const fetchTournaments = async ()=>{
        try {
            const res = await fetch("/api/tournament", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to fetch tournaments");
            const response = await res.json();
            const raw = response.success ? response.data : null;
            const tournamentData = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
            setTournaments(tournamentData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tournaments");
        }
    };
    const fetchTeams = async (tournament)=>{
        if (!tournament) {
            setTeams([]);
            return;
        }
        try {
            setTeamsLoading(true);
            const res = await fetch(`/api/tournament/teams?tournament=${encodeURIComponent(tournament)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to fetch teams");
            const response = await res.json();
            const teamsData = response.success && response.data ? response.data : [];
            setTeams(Array.isArray(teamsData) ? teamsData : []);
        } catch  {
            setTeams([]);
        } finally{
            setTeamsLoading(false);
        }
    };
    const handleTournamentChange = (tournament)=>{
        setSelectedTournament(tournament);
        setFormData({
            ...formData,
            tournament,
            teamA: "",
            teamB: ""
        });
        fetchTeams(tournament);
    };
    const handleTeamAChange = (teamId)=>{
        setFormData({
            ...formData,
            teamA: teamId
        });
    };
    const handleTeamBChange = (teamId)=>{
        setFormData({
            ...formData,
            teamB: teamId
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditQuizPage.useEffect": ()=>{
            if (!quizId) return;
            let cancelled = false;
            fetch(`/api/quiz/${quizId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }).then({
                "EditQuizPage.useEffect": (res)=>res.json()
            }["EditQuizPage.useEffect"]).then({
                "EditQuizPage.useEffect": (response)=>{
                    if (cancelled) return;
                    const quizData = response?.data?.data ?? response?.data ?? null;
                    setQuiz(quizData);
                    setError("");
                }
            }["EditQuizPage.useEffect"]).catch({
                "EditQuizPage.useEffect": (err)=>{
                    if (cancelled) return;
                    setQuiz(null);
                    setError(err instanceof Error ? err.message : "Failed to load quiz");
                }
            }["EditQuizPage.useEffect"]).finally({
                "EditQuizPage.useEffect": ()=>{
                    if (!cancelled) setLoading(false);
                }
            }["EditQuizPage.useEffect"]);
            return ({
                "EditQuizPage.useEffect": ()=>{
                    cancelled = true;
                }
            })["EditQuizPage.useEffect"];
        }
    }["EditQuizPage.useEffect"], [
        quizId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditQuizPage.useEffect": ()=>{
            if (quiz) {
                const tournament = quiz.tournament ?? "";
                const teamAId = typeof quiz.teamA === "string" ? quiz.teamA : quiz.teamA?._id ?? "";
                const teamBId = typeof quiz.teamB === "string" ? quiz.teamB : quiz.teamB?._id ?? "";
                console.log("entryStart", quiz.entryStartTime);
                // Support both direct and nested API shapes for entry times
                const rawQuiz = quiz;
                const entryStart = rawQuiz.entryStartTime ?? rawQuiz.dates?.entryStartTime;
                const entryStop = rawQuiz.entryStopTime ?? rawQuiz.dates?.entryStopTime;
                const entryStartStr = convertUnixToDateTimeLocal(entryStart);
                const entryStopStr = convertUnixToDateTimeLocal(entryStop);
                setFormData({
                    tournament,
                    teamA: teamAId,
                    teamB: teamBId,
                    entryStartTime: entryStartStr || "",
                    entryStopTime: entryStopStr || "",
                    tag: quiz.tag ?? "",
                    questionsArray: quiz.questionsArray?.map({
                        "EditQuizPage.useEffect": (q)=>({
                                questionText: q.questionText ?? "",
                                questionType: q.questionType ?? "",
                                options: q.options ?? [],
                                questionNumber: q.questionNumber ?? 0,
                                points: q.points ?? 0,
                                correctAnswer: q.correctAnswer ?? ""
                            })
                    }["EditQuizPage.useEffect"]) ?? []
                });
                setSelectedTournament(tournament);
                fetchTournaments();
                fetchTeams(tournament);
            }
        }
    }["EditQuizPage.useEffect"], [
        quiz
    ]);
    const backUrl = fromSection ? `/?section=${fromSection}` : `/quiz/${quizId}`;
    // Ensure current quiz teams appear in dropdown options (so they stay selected while teams load)
    const teamAOptions = quiz && formData.teamA && !teams.some((t)=>t._id === formData.teamA) ? [
        ...typeof quiz.teamA === "object" && quiz.teamA ? [
            {
                _id: quiz.teamA._id,
                name: quiz.teamA.name,
                abbreviation: quiz.teamA.abbreviation,
                tournament: quiz.teamA.tournament,
                createdAt: quiz.teamA.createdAt,
                updatedAt: quiz.teamA.updatedAt,
                __v: quiz.teamA.__v
            }
        ] : [],
        ...teams
    ] : teams;
    const teamBOptions = quiz && formData.teamB && !teams.some((t)=>t._id === formData.teamB) ? [
        ...typeof quiz.teamB === "object" && quiz.teamB ? [
            {
                _id: quiz.teamB._id,
                name: quiz.teamB.name,
                abbreviation: quiz.teamB.abbreviation,
                tournament: quiz.teamB.tournament,
                createdAt: quiz.teamB.createdAt,
                updatedAt: quiz.teamB.updatedAt,
                __v: quiz.teamB.__v
            }
        ] : [],
        ...teams
    ] : teams;
    const handleSubmit = async (e)=>{
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateQuiz"])(quizId, {
                tournament: formData.tournament,
                teamA: formData.teamA,
                teamB: formData.teamB,
                entryStartTime: formData.entryStartTime,
                entryStopTime: formData.entryStopTime,
                questionsArray: formData.questionsArray,
                tag: formData.tag
            });
            router.push(backUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update quiz");
        } finally{
            setSubmitLoading(false);
        }
    };
    const updateQuestionText = (questionIndex, questionText)=>{
        const updatedQuestions = [
            ...formData.questionsArray
        ];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            questionText
        };
        setFormData({
            ...formData,
            questionsArray: updatedQuestions
        });
    };
    const updateQuestionPoints = (questionIndex, points)=>{
        const updatedQuestions = [
            ...formData.questionsArray
        ];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            points
        };
        setFormData({
            ...formData,
            questionsArray: updatedQuestions
        });
    };
    const getOptionsForQuestionType = (type)=>{
        switch(type){
            case "MCQ":
                return [
                    "",
                    ""
                ];
            case "BOOLEAN":
                return [
                    "True",
                    "False"
                ];
            case "NUMERIC":
            case "ALPHABETICAL":
                return [];
            default:
                return [
                    "",
                    ""
                ];
        }
    };
    const updateQuestionType = (questionIndex, newType)=>{
        const updatedQuestions = [
            ...formData.questionsArray
        ];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            questionType: newType,
            options: getOptionsForQuestionType(newType),
            correctAnswer: ""
        };
        setFormData({
            ...formData,
            questionsArray: updatedQuestions
        });
    };
    const updateQuestionOption = (questionIndex, optionIndex, value)=>{
        const updatedQuestions = [
            ...formData.questionsArray
        ];
        const options = [
            ...updatedQuestions[questionIndex].options ?? []
        ];
        options[optionIndex] = value;
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options
        };
        setFormData({
            ...formData,
            questionsArray: updatedQuestions
        });
    };
    const addQuestionOption = (questionIndex)=>{
        const updatedQuestions = [
            ...formData.questionsArray
        ];
        const options = [
            ...updatedQuestions[questionIndex].options ?? [],
            ""
        ];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options
        };
        setFormData({
            ...formData,
            questionsArray: updatedQuestions
        });
    };
    const removeQuestionOption = (questionIndex, optionIndex)=>{
        const updatedQuestions = [
            ...formData.questionsArray
        ];
        const currentOptions = updatedQuestions[questionIndex].options ?? [];
        const removedValue = currentOptions[optionIndex];
        const options = currentOptions.filter((_, i)=>i !== optionIndex);
        if (options.length < 2) return;
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options,
            correctAnswer: updatedQuestions[questionIndex].correctAnswer === removedValue ? "" : updatedQuestions[questionIndex].correctAnswer
        };
        setFormData({
            ...formData,
            questionsArray: updatedQuestions
        });
    };
    const addQuestion = ()=>{
        setNewQuestion({
            questionText: "",
            questionType: "MCQ",
            options: [
                "",
                ""
            ],
            questionNumber: 0,
            points: 10,
            correctAnswer: ""
        });
    };
    const saveNewQuestion = ()=>{
        if (!newQuestion) return;
        if (!newQuestion.questionText.trim()) {
            setError("Please enter question text");
            return;
        }
        if ((newQuestion.questionType === "MCQ" || newQuestion.questionType === "BOOLEAN") && (newQuestion.options.length < 2 || newQuestion.options.some((o)=>!o.trim()))) {
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
                    questionNumber: formData.questionsArray.length + 1
                }
            ]
        });
        setNewQuestion(null);
    };
    const removeNewQuestion = ()=>{
        setNewQuestion(null);
        setError("");
    };
    const removeQuestion = (questionIndex)=>{
        setFormData({
            ...formData,
            questionsArray: formData.questionsArray.filter((_, i)=>i !== questionIndex)
        });
    };
    if (!isAuthenticated) {
        return null;
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400",
                children: "Loading quiz..."
            }, void 0, false, {
                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                lineNumber: 478,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
            lineNumber: 477,
            columnNumber: 7
        }, this);
    }
    if (error && !quiz) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-500 mb-4",
                        children: error || "Quiz not found"
                    }, void 0, false, {
                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                        lineNumber: 487,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push(backUrl),
                        className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200",
                        children: "Back"
                    }, void 0, false, {
                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                        lineNumber: 488,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                lineNumber: 486,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
            lineNumber: 485,
            columnNumber: 7
        }, this);
    }
    if (!quiz) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-black p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>router.push(backUrl),
                            className: "px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800",
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                            lineNumber: 507,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white",
                            children: "Edit Quiz"
                        }, void 0, false, {
                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                            lineNumber: 514,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                            lineNumber: 515,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                    lineNumber: 506,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "p-6",
                        children: [
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-red-200 text-sm",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                    lineNumber: 522,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                lineNumber: 521,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "col-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-1",
                                                children: "Tournament *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 528,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                required: true,
                                                value: selectedTournament,
                                                onChange: (e)=>handleTournamentChange(e.target.value),
                                                className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "-- Select a tournament --"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 19
                                                    }, this),
                                                    tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: tournament,
                                                            children: tournament
                                                        }, tournament, false, {
                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                            lineNumber: 539,
                                                            columnNumber: 21
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 531,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 527,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-1",
                                                children: "Team A *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 546,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                required: true,
                                                value: formData.teamA ?? "",
                                                onChange: (e)=>handleTeamAChange(e.target.value),
                                                disabled: !selectedTournament || teamsLoading,
                                                className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: teamsLoading ? "Loading teams..." : !selectedTournament ? "Select tournament first" : "-- Select Team A --"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                        lineNumber: 556,
                                                        columnNumber: 19
                                                    }, this),
                                                    teamAOptions.filter((team)=>team._id !== formData.teamB).map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: team._id,
                                                            children: [
                                                                team.name,
                                                                " (",
                                                                team.abbreviation,
                                                                ")"
                                                            ]
                                                        }, team._id, true, {
                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                            lineNumber: 566,
                                                            columnNumber: 23
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 549,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 545,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-1",
                                                children: "Team B *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 573,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                required: true,
                                                value: formData.teamB ?? "",
                                                onChange: (e)=>handleTeamBChange(e.target.value),
                                                disabled: !selectedTournament || teamsLoading,
                                                className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: teamsLoading ? "Loading teams..." : !selectedTournament ? "Select tournament first" : "-- Select Team B --"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                        lineNumber: 583,
                                                        columnNumber: 19
                                                    }, this),
                                                    teamBOptions.filter((team)=>team._id !== formData.teamA).map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: team._id,
                                                            children: [
                                                                team.name,
                                                                " (",
                                                                team.abbreviation,
                                                                ")"
                                                            ]
                                                        }, team._id, true, {
                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                            lineNumber: 593,
                                                            columnNumber: 23
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 576,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 572,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-1",
                                                children: "Entry Start Time *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 600,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "datetime-local",
                                                required: true,
                                                value: formData.entryStartTime ?? "",
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        entryStartTime: e.target.value
                                                    }),
                                                className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 603,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 599,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-1",
                                                children: "Entry Stop Time *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 617,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "datetime-local",
                                                required: true,
                                                value: formData.entryStopTime ?? "",
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        entryStopTime: e.target.value
                                                    }),
                                                className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 620,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 616,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "col-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-300 mb-1",
                                                children: "Tag"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 631,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formData.tag ?? "",
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        tag: e.target.value
                                                    }),
                                                placeholder: "Enter a tag for this quiz (optional)",
                                                className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 634,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 630,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                lineNumber: 526,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6 border-t border-zinc-700 pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-white mb-4",
                                        children: [
                                            "Questions (",
                                            formData.questionsArray.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 647,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: [
                                            formData.questionsArray.map((question, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4 border border-zinc-700 rounded-lg bg-zinc-800/50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-start gap-2 mb-3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-300 mb-1",
                                                                        children: [
                                                                            "Question ",
                                                                            question.questionNumber,
                                                                            " Text *"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                        lineNumber: 658,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: question.questionText ?? "",
                                                                        onChange: (e)=>updateQuestionText(idx, e.target.value),
                                                                        className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                        lineNumber: 661,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                lineNumber: 657,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                            lineNumber: 656,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid grid-cols-2 gap-3 mb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-medium text-gray-300 mb-1",
                                                                            children: "Points *"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                            lineNumber: 673,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            min: 1,
                                                                            value: question.points ?? 0,
                                                                            onChange: (e)=>updateQuestionPoints(idx, parseInt(e.target.value) || 0),
                                                                            className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                            lineNumber: 676,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                    lineNumber: 672,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-medium text-gray-300 mb-1",
                                                                            children: "Type *"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                            lineNumber: 690,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: question.questionType ?? "MCQ",
                                                                            onChange: (e)=>updateQuestionType(idx, e.target.value),
                                                                            className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "MCQ",
                                                                                    children: "MCQ"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                    lineNumber: 703,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "BOOLEAN",
                                                                                    children: "Boolean (True/False)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                    lineNumber: 704,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "NUMERIC",
                                                                                    children: "Numeric"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                    lineNumber: 705,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "ALPHABETICAL",
                                                                                    children: "Alphabetical"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                    lineNumber: 706,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                            lineNumber: 693,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                    lineNumber: 689,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                            lineNumber: 671,
                                                            columnNumber: 21
                                                        }, this),
                                                        (question.questionType === "MCQ" || question.questionType === "BOOLEAN") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "block text-sm font-medium text-gray-300",
                                                                            children: [
                                                                                "Options *",
                                                                                question.questionType === "BOOLEAN" && " (True/False)"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                            lineNumber: 714,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        question.questionType === "MCQ" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>addQuestionOption(idx),
                                                                            className: "text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700",
                                                                            children: "+ Add Option"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                            lineNumber: 720,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                    lineNumber: 713,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-2",
                                                                    children: (question.options ?? []).map((option, optIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex gap-2 items-center",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    value: option ?? "",
                                                                                    onChange: (e)=>updateQuestionOption(idx, optIdx, e.target.value),
                                                                                    className: `flex-1 px-3 py-2 border rounded-md bg-zinc-800 text-white ${option === question.correctAnswer ? "border-green-500" : "border-zinc-600"}`,
                                                                                    placeholder: `Option ${optIdx + 1}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                    lineNumber: 735,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                question.questionType === "MCQ" && (question.options?.length ?? 0) > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    onClick: ()=>removeQuestionOption(idx, optIdx),
                                                                                    className: "px-3 py-2 bg-red-600/80 text-white rounded-md hover:bg-red-600 shrink-0",
                                                                                    title: "Remove option",
                                                                                    children: "×"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                    lineNumber: 754,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, optIdx, true, {
                                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                            lineNumber: 731,
                                                                            columnNumber: 29
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                    lineNumber: 729,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                            lineNumber: 712,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                    lineNumber: 652,
                                                    columnNumber: 19
                                                }, this)),
                                            newQuestion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 p-4 border-2 border-dashed border-blue-500/50 rounded-lg bg-zinc-800/80",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-sm font-semibold text-blue-300 mb-3",
                                                        children: "New question"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                        lineNumber: 776,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-sm font-medium text-gray-300 mb-1",
                                                                children: "Question Text *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                lineNumber: 780,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: newQuestion.questionText,
                                                                onChange: (e)=>setNewQuestion({
                                                                        ...newQuestion,
                                                                        questionText: e.target.value
                                                                    }),
                                                                className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white",
                                                                placeholder: "Enter question"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                lineNumber: 783,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                        lineNumber: 779,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 gap-3 mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-300 mb-1",
                                                                        children: "Type *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                        lineNumber: 798,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: newQuestion.questionType,
                                                                        onChange: (e)=>setNewQuestion({
                                                                                ...newQuestion,
                                                                                questionType: e.target.value,
                                                                                options: getOptionsForQuestionType(e.target.value),
                                                                                correctAnswer: ""
                                                                            }),
                                                                        className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "MCQ",
                                                                                children: "MCQ"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                lineNumber: 815,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "BOOLEAN",
                                                                                children: "Boolean (True/False)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                lineNumber: 816,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "NUMERIC",
                                                                                children: "Numeric"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                lineNumber: 817,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "ALPHABETICAL",
                                                                                children: "Alphabetical"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                lineNumber: 818,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                        lineNumber: 801,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                lineNumber: 797,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-300 mb-1",
                                                                        children: "Points *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                        lineNumber: 822,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        value: newQuestion.points,
                                                                        onChange: (e)=>setNewQuestion({
                                                                                ...newQuestion,
                                                                                points: parseInt(e.target.value) || 0
                                                                            }),
                                                                        className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                        lineNumber: 825,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                lineNumber: 821,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                        lineNumber: 796,
                                                        columnNumber: 21
                                                    }, this),
                                                    (newQuestion.questionType === "MCQ" || newQuestion.questionType === "BOOLEAN") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-300",
                                                                        children: [
                                                                            "Options *",
                                                                            newQuestion.questionType === "BOOLEAN" && " (True/False)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                        lineNumber: 843,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    newQuestion.questionType === "MCQ" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setNewQuestion({
                                                                                ...newQuestion,
                                                                                options: [
                                                                                    ...newQuestion.options,
                                                                                    ""
                                                                                ]
                                                                            }),
                                                                        className: "text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700",
                                                                        children: "+ Add Option"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                        lineNumber: 849,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                lineNumber: 842,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: newQuestion.options.map((option, optIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-2 items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: option,
                                                                                onChange: (e)=>{
                                                                                    const opts = [
                                                                                        ...newQuestion.options
                                                                                    ];
                                                                                    opts[optIdx] = e.target.value;
                                                                                    setNewQuestion({
                                                                                        ...newQuestion,
                                                                                        options: opts
                                                                                    });
                                                                                },
                                                                                className: "flex-1 px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white",
                                                                                placeholder: `Option ${optIdx + 1}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                lineNumber: 869,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            newQuestion.questionType === "MCQ" && newQuestion.options.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>{
                                                                                    const opts = newQuestion.options.filter((_, i)=>i !== optIdx);
                                                                                    const removed = newQuestion.options[optIdx];
                                                                                    setNewQuestion({
                                                                                        ...newQuestion,
                                                                                        options: opts,
                                                                                        correctAnswer: newQuestion.correctAnswer === removed ? "" : newQuestion.correctAnswer
                                                                                    });
                                                                                },
                                                                                className: "px-3 py-2 bg-red-600/80 text-white rounded-md hover:bg-red-600 shrink-0",
                                                                                children: "×"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                                lineNumber: 885,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, optIdx, true, {
                                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                        lineNumber: 865,
                                                                        columnNumber: 29
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                lineNumber: 863,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                        lineNumber: 841,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-3 pt-3 border-t border-zinc-600",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: saveNewQuestion,
                                                                className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                                                                children: "Save"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                lineNumber: 913,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: removeNewQuestion,
                                                                className: "px-4 py-2 bg-red-600/80 text-white rounded-md hover:bg-red-600",
                                                                children: "Remove"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                                lineNumber: 920,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                        lineNumber: 912,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 775,
                                                columnNumber: 19
                                            }, this),
                                            !newQuestion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: addQuestion,
                                                className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                                                children: "+ Add Question"
                                            }, void 0, false, {
                                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                                lineNumber: 932,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 650,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                lineNumber: 646,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-3 pt-4 border-t border-zinc-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>router.push(backUrl),
                                        className: "px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 944,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: submitLoading,
                                        className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                        children: submitLoading ? "Updating..." : "Update Quiz"
                                    }, void 0, false, {
                                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                        lineNumber: 951,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                                lineNumber: 943,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                        lineNumber: 519,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
                    lineNumber: 518,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
            lineNumber: 505,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/quiz/[id]/editQuiz/page.tsx",
        lineNumber: 504,
        columnNumber: 5
    }, this);
}
_s(EditQuizPage, "Ur/Zk8VF3vKR7nrTo3F10DMS9f4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = EditQuizPage;
var _c;
__turbopack_context__.k.register(_c, "EditQuizPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_f05d2f97._.js.map