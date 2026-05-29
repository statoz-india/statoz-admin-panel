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
"[project]/app/users/[id]/PlayedPrediction.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlayedPrediction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function PlayedPrediction({ userId }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PlayedPrediction.useCallback[load]": async ()=>{
            if (!userId) return;
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`/api/users/${userId}/playedPredictionsForAdmin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const response = await res.json();
                if (!res.ok) {
                    setError(typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to load played predictions");
                    return;
                }
                if (!response?.success) {
                    setError(typeof response?.message === "string" && response.message || "Failed to load played predictions");
                    return;
                }
                setItems(Array.isArray(response.data) ? response.data : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load played predictions");
            } finally{
                setLoading(false);
            }
        }
    }["PlayedPrediction.useCallback[load]"], [
        userId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlayedPrediction.useEffect": ()=>{
            void load();
        }
    }["PlayedPrediction.useEffect"], [
        load
    ]);
    const formatDate = (value)=>{
        try {
            return new Date(value).toLocaleString();
        } catch  {
            return value;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-900 rounded-lg border border-zinc-700 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-4 mb-4 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-white",
                        children: "Played predictions"
                    }, void 0, false, {
                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>void load(),
                        disabled: loading,
                        className: "px-3 py-1.5 text-sm border border-zinc-600 rounded-md text-white hover:bg-zinc-800 disabled:opacity-50",
                        children: "Refresh"
                    }, void 0, false, {
                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                    color: "#5CDFFF",
                    size: "small",
                    text: "",
                    textColor: ""
                }, void 0, false, {
                    fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                    lineNumber: 86,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this),
            !loading && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-400 text-sm",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                lineNumber: 90,
                columnNumber: 29
            }, this),
            !loading && !error && items.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400 text-sm",
                children: "No prediction bets yet."
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this),
            !loading && !error && items.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto -mx-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full text-left text-sm text-gray-300",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "border-b border-zinc-700 text-xs uppercase tracking-wider text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Submitted"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                        lineNumber: 101,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Match"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                        lineNumber: 102,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Chosen"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Bet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                        lineNumber: 104,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Won"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Net"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                        lineNumber: 106,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                        lineNumber: 107,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-0 font-medium",
                                        children: "Settled"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                lineNumber: 100,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                            lineNumber: 99,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: items.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-b border-zinc-800 align-top",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4 whitespace-nowrap",
                                            children: formatDate(row.submissionTime)
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                            lineNumber: 117,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-white",
                                                    children: [
                                                        row.prediction?.teamA?.displayName ?? row.prediction?.teamA?.name,
                                                        " ",
                                                        "vs",
                                                        " ",
                                                        row.prediction?.teamB?.displayName ?? row.prediction?.teamB?.name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-xs text-gray-500 mt-0.5",
                                                    children: [
                                                        row.prediction?.tournament,
                                                        " · ",
                                                        row.prediction?.gameType
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                            lineNumber: 120,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4 capitalize",
                                            children: row.teamChosen
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                            lineNumber: 132,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: row.coinsBet
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                            lineNumber: 133,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: row.coinsWon
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                            lineNumber: 134,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: row.coinsBet + row.coinsWon
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                            lineNumber: 135,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4 capitalize",
                                            children: row.coinsBet + row.coinsWon
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                            lineNumber: 136,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-0",
                                            children: row.isSettled ? "Yes" : "No"
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                            lineNumber: 139,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, row.submissionId, true, {
                                    fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                                    lineNumber: 113,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                            lineNumber: 111,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                    lineNumber: 98,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/users/[id]/PlayedPrediction.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_s(PlayedPrediction, "EacGNkpf9ZD2/KAekBvTkVbgtew=");
_c = PlayedPrediction;
var _c;
__turbopack_context__.k.register(_c, "PlayedPrediction");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/users/[id]/PlayedQuizzes.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PlayedQuizzes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function formatUserSelection(q) {
    const { option, value } = q.userAnswer;
    const parts = [
        option?.trim(),
        value?.trim()
    ].filter(Boolean);
    if (parts.length === 0) return "—";
    if (parts.length === 1) return parts[0];
    if (parts[0] === parts[1]) return parts[0];
    return `${parts[0]} (${parts[1]})`;
}
function formatCorrectAnswer(q) {
    if (q.correctAnswer === null || q.correctAnswer === undefined) {
        return "—";
    }
    return String(q.correctAnswer);
}
function PlayedQuizzes({ userId }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [expandedSubmissionId, setExpandedSubmissionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PlayedQuizzes.useCallback[load]": async ()=>{
            if (!userId) return;
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`/api/users/${userId}/playedQuizzesForAdmin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const response = await res.json();
                if (!res.ok) {
                    setError(typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to load played quizzes");
                    return;
                }
                if (!response?.success) {
                    setError(typeof response?.message === "string" && response.message || "Failed to load played quizzes");
                    return;
                }
                setItems(Array.isArray(response.data) ? response.data : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load played quizzes");
            } finally{
                setLoading(false);
            }
        }
    }["PlayedQuizzes.useCallback[load]"], [
        userId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlayedQuizzes.useEffect": ()=>{
            void load();
        }
    }["PlayedQuizzes.useEffect"], [
        load
    ]);
    const formatDate = (value)=>{
        try {
            return new Date(value).toLocaleString();
        } catch  {
            return value;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-900 rounded-lg border border-zinc-700 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-4 mb-4 flex-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-white",
                        children: "Played quizzes"
                    }, void 0, false, {
                        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>void load(),
                        disabled: loading,
                        className: "px-3 py-1.5 text-sm border border-zinc-600 rounded-md text-white hover:bg-zinc-800 disabled:opacity-50",
                        children: "Refresh"
                    }, void 0, false, {
                        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                    color: "#5CDFFF",
                    size: "small",
                    text: "",
                    textColor: ""
                }, void 0, false, {
                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                    lineNumber: 105,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                lineNumber: 104,
                columnNumber: 9
            }, this),
            !loading && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-400 text-sm",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                lineNumber: 109,
                columnNumber: 29
            }, this),
            !loading && !error && items.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400 text-sm",
                children: "No quiz submissions yet."
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                lineNumber: 112,
                columnNumber: 9
            }, this),
            !loading && !error && items.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto -mx-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full text-left text-sm text-gray-300",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "border-b border-zinc-700 text-xs uppercase tracking-wider text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Submitted"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                        lineNumber: 120,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Match"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                        lineNumber: 121,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "XP"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                        lineNumber: 123,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Credited"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                        lineNumber: 124,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-0 font-medium",
                                        children: "Questions"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                        lineNumber: 125,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                lineNumber: 119,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: items.map((row)=>{
                                const isOpen = expandedSubmissionId === row.submissionId;
                                const questions = row.questions ?? [];
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            onClick: ()=>setExpandedSubmissionId((id)=>id === row.submissionId ? null : row.submissionId),
                                            onKeyDown: (e)=>{
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    setExpandedSubmissionId((id)=>id === row.submissionId ? null : row.submissionId);
                                                }
                                            },
                                            tabIndex: 0,
                                            role: "button",
                                            "aria-expanded": isOpen,
                                            "aria-label": `${isOpen ? "Collapse" : "Expand"} quiz submission ${row.submissionId}`,
                                            className: `border-b border-zinc-800 align-top cursor-pointer select-none hover:bg-zinc-800/40 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset ${isOpen ? "bg-zinc-800/30" : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3 pr-4 whitespace-nowrap",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-block w-4 text-gray-500 mr-1",
                                                            children: isOpen ? "▼" : "▶"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 25
                                                        }, this),
                                                        formatDate(row.submissionTime)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                    lineNumber: 156,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3 pr-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-white",
                                                            children: [
                                                                row.quiz?.teamA?.displayName ?? row.quiz?.teamA?.name,
                                                                " ",
                                                                "vs",
                                                                " ",
                                                                row.quiz?.teamB?.displayName ?? row.quiz?.teamB?.name
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                            lineNumber: 163,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-xs text-gray-500 mt-0.5",
                                                            children: [
                                                                row.quiz?.tournament,
                                                                row.quiz?.matchStartTime ? ` · ${formatDate(row.quiz.matchStartTime)}` : ""
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                            lineNumber: 170,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                    lineNumber: 162,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3 pr-4 capitalize",
                                                    children: row.quiz?.quizStatus ?? "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3 pr-4",
                                                    children: row.obtainedXP
                                                }, void 0, false, {
                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3 pr-4",
                                                    children: row.xpCredited ? "Yes" : "No"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3 pr-0",
                                                    children: questions.length
                                                }, void 0, false, {
                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                            lineNumber: 134,
                                            columnNumber: 21
                                        }, this),
                                        isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-b border-zinc-800 bg-zinc-950/60",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: 6,
                                                className: "py-4 px-3 sm:px-4",
                                                children: questions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500",
                                                    children: "No question breakdown for this submission."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                    lineNumber: 193,
                                                    columnNumber: 29
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-3",
                                                    children: questions.map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "rounded-lg border border-zinc-700 bg-zinc-900/80 p-3 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap items-start justify-between gap-2 mb-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-white font-medium pr-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-gray-500 font-normal mr-2",
                                                                                children: [
                                                                                    "Q",
                                                                                    q.questionNumber,
                                                                                    "."
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                                lineNumber: 205,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            q.questionText
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                        lineNumber: 204,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                    lineNumber: 203,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-gray-500 mb-1",
                                                                    children: q.questionType
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                    lineNumber: 211,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid gap-1.5 sm:grid-cols-2 text-xs sm:text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-gray-500 block mb-0.5",
                                                                                    children: "User selected"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                                    lineNumber: 216,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-gray-200",
                                                                                    children: formatUserSelection(q)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                                    lineNumber: 219,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                            lineNumber: 215,
                                                                            columnNumber: 37
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-gray-500 block mb-0.5",
                                                                                    children: "Correct answer"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                                    lineNumber: 224,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-gray-200",
                                                                                    children: formatCorrectAnswer(q)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                                    lineNumber: 227,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                            lineNumber: 223,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                    lineNumber: 214,
                                                                    columnNumber: 35
                                                                }, this),
                                                                q.options?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-gray-600 mt-2",
                                                                    children: [
                                                                        "Options: ",
                                                                        q.options.join(" · ")
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                                    lineNumber: 233,
                                                                    columnNumber: 37
                                                                }, this)
                                                            ]
                                                        }, `${row.submissionId}-q-${q.questionNumber}`, true, {
                                                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                            lineNumber: 199,
                                                            columnNumber: 33
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                                lineNumber: 191,
                                                columnNumber: 25
                                            }, this)
                                        }, `${row.submissionId}-detail`, false, {
                                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                            lineNumber: 187,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, row.submissionId, true, {
                                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                                    lineNumber: 133,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                    lineNumber: 117,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/users/[id]/PlayedQuizzes.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(PlayedQuizzes, "mBfpL/9aISlhHc8fP1Du8z8pqAU=");
_c = PlayedQuizzes;
var _c;
__turbopack_context__.k.register(_c, "PlayedQuizzes");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/users/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UserDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$users$2f5b$id$5d2f$PlayedPrediction$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/users/[id]/PlayedPrediction.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$users$2f5b$id$5d2f$PlayedQuizzes$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/users/[id]/PlayedQuizzes.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function homeHrefFromUserEntry(searchParams) {
    const fromSection = searchParams.get("fromSection");
    if (fromSection === "leaderboard") {
        const sp = new URLSearchParams();
        sp.set("section", "leaderboard");
        const tab = searchParams.get("leaderboardTab");
        if (tab === "coins" || tab === "tournament") {
            sp.set("leaderboardTab", tab);
        }
        return {
            href: `/?${sp.toString()}`,
            backLabel: "← Back to Leaderboard"
        };
    }
    return {
        href: "/?section=users",
        backLabel: "← Back to Users"
    };
}
function UserDetailPageInner() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { href: homeBackHref, backLabel: homeBackLabel } = homeHrefFromUserEntry(searchParams);
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [converting, setConverting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNotificationDialogOpen, setIsNotificationDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sendingNotification, setSendingNotification] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notificationError, setNotificationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [notificationSuccess, setNotificationSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [notificationForm, setNotificationForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: "",
        body: "",
        type: "SYSTEM_ANNOUNCEMENT",
        screen: "home",
        entityId: "test-123"
    });
    const [playedActivityTab, setPlayedActivityTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isGiftCoinDialogOpen, setIsGiftCoinDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [giftingCoins, setGiftingCoins] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [giftCoinError, setGiftCoinError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [giftCoinSuccess, setGiftCoinSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [giftCoinAmount, setGiftCoinAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const userId = params?.id;
    const fetchUserData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UserDetailPageInner.useCallback[fetchUserData]": async ()=>{
            if (!userId) return;
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`/api/users/${userId}/userDataForAdmin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const response = await res.json();
                if (!res.ok) {
                    const message = typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to load user data";
                    setError(message);
                    return;
                }
                if (!response?.success) {
                    setError(typeof response?.message === "string" && response.message || "Failed to load user data");
                    return;
                }
                const data = response.data;
                setUserData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load user data");
            } finally{
                setLoading(false);
            }
        }
    }["UserDetailPageInner.useCallback[fetchUserData]"], [
        userId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserDetailPageInner.useEffect": ()=>{
            if (userId) fetchUserData();
        }
    }["UserDetailPageInner.useEffect"], [
        userId,
        fetchUserData
    ]);
    const isWaitlist = userData?.userType?.toLowerCase() === "waitlist";
    const handleConvertToUser = async ()=>{
        if (!userData?.email || converting) return;
        try {
            setConverting(true);
            setError("");
            const res = await fetch("/api/users/updateWaitlistToUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    emailId: userData.email
                })
            });
            const response = await res.json();
            if (!res.ok) {
                const message = typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to convert to user";
                setError(message);
                return;
            }
            if (!response?.success) {
                setError(typeof response?.message === "string" && response.message || "Failed to convert to user");
                return;
            }
            await fetchUserData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to convert to user");
        } finally{
            setConverting(false);
        }
    };
    const openNotificationDialog = ()=>{
        setNotificationError("");
        setNotificationSuccess("");
        setNotificationForm({
            title: "",
            body: "",
            type: "SYSTEM_ANNOUNCEMENT",
            screen: "home",
            entityId: "test-123"
        });
        setIsNotificationDialogOpen(true);
    };
    const closeNotificationDialog = ()=>{
        if (sendingNotification) return;
        setIsNotificationDialogOpen(false);
    };
    const handleSendNotification = async (event)=>{
        event.preventDefault();
        if (!userData?._id || sendingNotification) return;
        const title = notificationForm.title.trim();
        const body = notificationForm.body.trim();
        if (!title || !body) {
            setNotificationError("Title and body are required");
            return;
        }
        try {
            setSendingNotification(true);
            setNotificationError("");
            setNotificationSuccess("");
            const res = await fetch("/api/notifications/send-to-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    userId: userData._id,
                    title,
                    body,
                    type: notificationForm.type,
                    data: {
                        screen: notificationForm.screen,
                        entityId: notificationForm.entityId
                    }
                })
            });
            const response = await res.json();
            if (!res.ok || !response?.success) {
                const message = typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to send notification";
                setNotificationError(message);
                return;
            }
            setNotificationSuccess(typeof response?.message === "string" && response.message || "Notification sent successfully");
            setNotificationForm((prev)=>({
                    ...prev,
                    title: "",
                    body: ""
                }));
        } catch (err) {
            setNotificationError(err instanceof Error ? err.message : "Failed to send notification");
        } finally{
            setSendingNotification(false);
        }
    };
    const openGiftCoinDialog = ()=>{
        setGiftCoinError("");
        setGiftCoinSuccess("");
        setGiftCoinAmount("");
        setIsGiftCoinDialogOpen(true);
    };
    const closeGiftCoinDialog = ()=>{
        if (giftingCoins) return;
        setIsGiftCoinDialogOpen(false);
    };
    const handleGiftCoins = async (event)=>{
        event.preventDefault();
        if (!userData?._id || giftingCoins) return;
        const parsed = Number.parseInt(giftCoinAmount.trim(), 10);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            setGiftCoinError("Enter a positive whole number of coins");
            return;
        }
        try {
            setGiftingCoins(true);
            setGiftCoinError("");
            setGiftCoinSuccess("");
            const res = await fetch(`/api/users/${userData._id}/gift-coins`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    giftedcoins: parsed
                })
            });
            const response = await res.json();
            if (!res.ok || !response?.success) {
                const message = typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to gift coins";
                setGiftCoinError(message);
                return;
            }
            setGiftCoinSuccess(typeof response?.message === "string" && response.message || "Coins gifted successfully");
            setGiftCoinAmount("");
            await fetchUserData();
        } catch (err) {
            setGiftCoinError(err instanceof Error ? err.message : "Failed to gift coins");
        } finally{
            setGiftingCoins(false);
        }
    };
    if (!isAuthenticated) {
        return null;
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/page.tsx",
                lineNumber: 291,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/users/[id]/page.tsx",
            lineNumber: 290,
            columnNumber: 7
        }, this);
    }
    if (error || !userData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-500 mb-4",
                        children: error || "User not found"
                    }, void 0, false, {
                        fileName: "[project]/app/users/[id]/page.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>router.push(homeBackHref, {
                                scroll: false
                            }),
                        className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200",
                        children: homeBackLabel
                    }, void 0, false, {
                        fileName: "[project]/app/users/[id]/page.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/users/[id]/page.tsx",
                lineNumber: 299,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/users/[id]/page.tsx",
            lineNumber: 298,
            columnNumber: 7
        }, this);
    }
    const formatValue = (value)=>{
        if (value === null || value === undefined) return "—";
        if (typeof value === "object") return JSON.stringify(value, null, 2);
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
            try {
                return new Date(value).toLocaleString();
            } catch  {
                return String(value);
            }
        }
        return String(value);
    };
    const xp = userData?.xp && typeof userData.xp === "object" && !Array.isArray(userData.xp) ? userData.xp : null;
    const xpEntries = xp ? Object.entries(xp) : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-black p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-4xl mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 flex items-center justify-between flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>router.push(homeBackHref, {
                                        scroll: false
                                    }),
                                className: "px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800",
                                children: homeBackLabel
                            }, void 0, false, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 338,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: openNotificationDialog,
                                        className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                                        children: "Send Notification"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/page.tsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: openGiftCoinDialog,
                                        className: "px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700",
                                        children: "Gift Coin"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/page.tsx",
                                        lineNumber: 352,
                                        columnNumber: 13
                                    }, this),
                                    isWaitlist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleConvertToUser,
                                        disabled: converting,
                                        className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                        children: converting ? "Converting…" : "Convert to User"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/page.tsx",
                                        lineNumber: 360,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 345,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/users/[id]/page.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-zinc-900 rounded-lg border border-zinc-700 p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-white mb-2",
                                children: userData.userName
                            }, void 0, false, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 text-sm mb-2",
                                children: [
                                    "Email id - ",
                                    userData.email || ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 375,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 text-sm mb-6",
                                children: [
                                    "Mongodb ID - ",
                                    userData._id || ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 378,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-800 rounded-lg p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400 uppercase tracking-wider",
                                                children: "User type"
                                            }, void 0, false, {
                                                fileName: "[project]/app/users/[id]/page.tsx",
                                                lineNumber: 384,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white font-medium capitalize",
                                                children: String(userData.userType ?? "—")
                                            }, void 0, false, {
                                                fileName: "[project]/app/users/[id]/page.tsx",
                                                lineNumber: 387,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/users/[id]/page.tsx",
                                        lineNumber: 383,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-800 rounded-lg p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400 uppercase tracking-wider",
                                                children: "Coins"
                                            }, void 0, false, {
                                                fileName: "[project]/app/users/[id]/page.tsx",
                                                lineNumber: 392,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white font-medium",
                                                children: formatValue(userData.coins)
                                            }, void 0, false, {
                                                fileName: "[project]/app/users/[id]/page.tsx",
                                                lineNumber: 395,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/users/[id]/page.tsx",
                                        lineNumber: 391,
                                        columnNumber: 13
                                    }, this),
                                    xpEntries.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: xpEntries.map(([key, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-zinc-800 rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-400 uppercase tracking-wider",
                                                        children: key === "totalXP" ? "Total XP" : key
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/users/[id]/page.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-white font-medium",
                                                        children: value
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/users/[id]/page.tsx",
                                                        lineNumber: 406,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, key, true, {
                                                fileName: "[project]/app/users/[id]/page.tsx",
                                                lineNumber: 402,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 382,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/users/[id]/page.tsx",
                        lineNumber: 371,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 mb-2",
                                        children: "Activity"
                                    }, void 0, false, {
                                        fileName: "[project]/app/users/[id]/page.tsx",
                                        lineNumber: 416,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setPlayedActivityTab("quizzes"),
                                                className: `px-4 py-2 rounded-md text-sm font-medium border transition-colors ${playedActivityTab === "quizzes" ? "bg-white text-black border-white" : "bg-zinc-900 text-white border-zinc-600 hover:bg-zinc-800"}`,
                                                children: "Played quizzes"
                                            }, void 0, false, {
                                                fileName: "[project]/app/users/[id]/page.tsx",
                                                lineNumber: 418,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setPlayedActivityTab("predictions"),
                                                className: `px-4 py-2 rounded-md text-sm font-medium border transition-colors ${playedActivityTab === "predictions" ? "bg-white text-black border-white" : "bg-zinc-900 text-white border-zinc-600 hover:bg-zinc-800"}`,
                                                children: "Played predictions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/users/[id]/page.tsx",
                                                lineNumber: 429,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/users/[id]/page.tsx",
                                        lineNumber: 417,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 415,
                                columnNumber: 11
                            }, this),
                            playedActivityTab === null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500",
                                children: "Choose quizzes or predictions to load that data."
                            }, void 0, false, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 443,
                                columnNumber: 13
                            }, this),
                            playedActivityTab === "quizzes" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$users$2f5b$id$5d2f$PlayedQuizzes$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                userId: userId
                            }, void 0, false, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 447,
                                columnNumber: 47
                            }, this),
                            playedActivityTab === "predictions" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$users$2f5b$id$5d2f$PlayedPrediction$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                userId: userId
                            }, void 0, false, {
                                fileName: "[project]/app/users/[id]/page.tsx",
                                lineNumber: 449,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/users/[id]/page.tsx",
                        lineNumber: 414,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/users/[id]/page.tsx",
                lineNumber: 336,
                columnNumber: 7
            }, this),
            isGiftCoinDialogOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-900 rounded-lg max-w-md w-full border border-zinc-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-b border-zinc-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-white",
                                    children: "Gift Coin"
                                }, void 0, false, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 457,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-400 mt-1",
                                    children: [
                                        "User ID: ",
                                        userData._id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 458,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/users/[id]/page.tsx",
                            lineNumber: 456,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleGiftCoins,
                            className: "p-6 space-y-4",
                            children: [
                                giftCoinError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 bg-red-900/20 border border-red-700 rounded-md text-red-300 text-sm",
                                    children: giftCoinError
                                }, void 0, false, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 465,
                                    columnNumber: 17
                                }, this),
                                giftCoinSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 bg-green-900/20 border border-green-700 rounded-md text-green-300 text-sm",
                                    children: giftCoinSuccess
                                }, void 0, false, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 470,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-gray-300 mb-1",
                                            children: "Coins to gift"
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 476,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: 1,
                                            step: 1,
                                            inputMode: "numeric",
                                            value: giftCoinAmount,
                                            onChange: (event)=>setGiftCoinAmount(event.target.value),
                                            placeholder: "100",
                                            className: "w-full px-3 py-2 rounded-md border border-zinc-600 bg-zinc-800 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 479,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 475,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: closeGiftCoinDialog,
                                            className: "px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed",
                                            disabled: giftingCoins,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 492,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: giftingCoins,
                                            className: "px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: giftingCoins ? "Gifting…" : "Gift"
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 500,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 491,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/users/[id]/page.tsx",
                            lineNumber: 463,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/users/[id]/page.tsx",
                    lineNumber: 455,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/page.tsx",
                lineNumber: 454,
                columnNumber: 9
            }, this),
            isNotificationDialogOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-900 rounded-lg max-w-xl w-full border border-zinc-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-b border-zinc-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-white",
                                    children: "Send Notification"
                                }, void 0, false, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 516,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-400 mt-1",
                                    children: [
                                        "User ID: ",
                                        userData._id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 519,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/users/[id]/page.tsx",
                            lineNumber: 515,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSendNotification,
                            className: "p-6 space-y-4",
                            children: [
                                notificationError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 bg-red-900/20 border border-red-700 rounded-md text-red-300 text-sm",
                                    children: notificationError
                                }, void 0, false, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 526,
                                    columnNumber: 17
                                }, this),
                                notificationSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 bg-green-900/20 border border-green-700 rounded-md text-green-300 text-sm",
                                    children: notificationSuccess
                                }, void 0, false, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 531,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-gray-300 mb-1",
                                            children: "Title *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 537,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: notificationForm.title,
                                            onChange: (event)=>setNotificationForm((prev)=>({
                                                        ...prev,
                                                        title: event.target.value
                                                    })),
                                            placeholder: "Test Notification",
                                            className: "w-full px-3 py-2 rounded-md border border-zinc-600 bg-zinc-800 text-white",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 540,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 536,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm text-gray-300 mb-1",
                                            children: "Body *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 556,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: notificationForm.body,
                                            onChange: (event)=>setNotificationForm((prev)=>({
                                                        ...prev,
                                                        body: event.target.value
                                                    })),
                                            placeholder: "This is a direct test notification",
                                            className: "w-full px-3 py-2 rounded-md border border-zinc-600 bg-zinc-800 text-white min-h-[100px]",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 559,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 555,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: closeNotificationDialog,
                                            className: "px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed",
                                            disabled: sendingNotification,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 574,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: sendingNotification,
                                            className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: sendingNotification ? "Sending..." : "Send"
                                        }, void 0, false, {
                                            fileName: "[project]/app/users/[id]/page.tsx",
                                            lineNumber: 582,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/users/[id]/page.tsx",
                                    lineNumber: 573,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/users/[id]/page.tsx",
                            lineNumber: 524,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/users/[id]/page.tsx",
                    lineNumber: 514,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/page.tsx",
                lineNumber: 513,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/users/[id]/page.tsx",
        lineNumber: 335,
        columnNumber: 5
    }, this);
}
_s(UserDetailPageInner, "ohYHnruo+JENKJknsLiPc3v4ZRw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = UserDetailPageInner;
function UserDetailPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/users/[id]/page.tsx",
                lineNumber: 603,
                columnNumber: 11
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/app/users/[id]/page.tsx",
            lineNumber: 602,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserDetailPageInner, {}, void 0, false, {
            fileName: "[project]/app/users/[id]/page.tsx",
            lineNumber: 607,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/users/[id]/page.tsx",
        lineNumber: 600,
        columnNumber: 5
    }, this);
}
_c1 = UserDetailPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "UserDetailPageInner");
__turbopack_context__.k.register(_c1, "UserDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_47a627dd._.js.map