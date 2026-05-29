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
"[project]/app/utils/buildAdminHomeHref.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Remove detail-page and “other tab” params so the home URL stays minimal. */ __turbopack_context__.s([
    "buildAdminHomeHref",
    ()=>buildAdminHomeHref,
    "stripAdminHomeQueryNoise",
    ()=>stripAdminHomeQueryNoise
]);
function stripAdminHomeQueryNoise(activeSection, sp) {
    sp.delete("from");
    sp.delete("id");
    sp.delete("tab");
    if (activeSection !== "leaderboard") {
        sp.delete("leaderboardTab");
    }
    if (activeSection === "predictions") {
        sp.delete("quizTournament");
        sp.delete("matchTournament");
    } else if (activeSection === "quizzes") {
        sp.delete("predTournament");
        sp.delete("matchTournament");
    } else if (activeSection === "matches") {
        sp.delete("predTournament");
        sp.delete("quizTournament");
        sp.delete("tournament");
    } else {
        sp.delete("predTournament");
        sp.delete("quizTournament");
        sp.delete("matchTournament");
        sp.delete("tournament");
    }
}
function buildAdminHomeHref(section, currentSearchParams) {
    if (!section) return "/";
    const sp = new URLSearchParams(currentSearchParams?.toString() ?? "");
    sp.set("section", section);
    stripAdminHomeQueryNoise(section, sp);
    return `/?${sp.toString()}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/utils/enums/event.enum.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventPayoutStatus",
    ()=>EventPayoutStatus,
    "EventStatus",
    ()=>EventStatus
]);
var EventStatus = /*#__PURE__*/ function(EventStatus) {
    EventStatus["UPCOMING"] = "UPCOMING";
    EventStatus["ACTIVE"] = "ACTIVE";
    EventStatus["FINISHED"] = "FINISHED";
    EventStatus["CANCELLED"] = "CANCELLED";
    EventStatus["DELETED"] = "DELETED";
    EventStatus["SETTLEMENT_DONE"] = "SETTLEMENT_DONE";
    EventStatus["WINNING_OPTION_UPDATED"] = "WINNING_OPTION_UPDATED";
    return EventStatus;
}(EventStatus || {});
var EventPayoutStatus = /*#__PURE__*/ function(EventPayoutStatus) {
    EventPayoutStatus["ONGOING"] = "ONGOING";
    EventPayoutStatus["PENDING"] = "PENDING";
    EventPayoutStatus["PROCESSING"] = "PROCESSING";
    EventPayoutStatus["COMPLETED"] = "COMPLETED";
    EventPayoutStatus["PAID"] = "PAID";
    EventPayoutStatus["FAILED"] = "FAILED";
    EventPayoutStatus["LOST"] = "LOST";
    return EventPayoutStatus;
}(EventPayoutStatus || {});
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/events/event-appearance.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "eventStatusBadgeClass",
    ()=>eventStatusBadgeClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/enums/event.enum.ts [app-client] (ecmascript)");
;
function eventStatusBadgeClass(status) {
    switch(status.toUpperCase()){
        case __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].UPCOMING:
            return "bg-violet-900 text-violet-200";
        case __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].ACTIVE:
            return "bg-emerald-900 text-emerald-200";
        case __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].FINISHED:
            return "bg-zinc-700 text-zinc-200";
        case __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].CANCELLED:
            return "bg-rose-900 text-rose-200";
        case __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].DELETED:
            return "bg-zinc-800 text-zinc-300";
        case __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].SETTLEMENT_DONE:
            return "bg-purple-900 text-purple-200";
        case __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].WINNING_OPTION_UPDATED:
            return "bg-cyan-900 text-cyan-200";
        default:
            return "bg-zinc-800 text-zinc-200";
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/constants/future-status.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FUTURE_STATUS_VALUES",
    ()=>FUTURE_STATUS_VALUES
]);
const FUTURE_STATUS_VALUES = [
    "UPCOMING",
    "ACTIVE",
    "FINISHED",
    "CANCELLED",
    "DELETED",
    "SETTLEMENT_DONE",
    "WINNING_OPTION_UPDATED"
];
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/utils/enums/future.enum.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FuturePayoutStatus",
    ()=>FuturePayoutStatus,
    "FutureStatus",
    ()=>FutureStatus
]);
var FutureStatus = /*#__PURE__*/ function(FutureStatus) {
    FutureStatus["UPCOMING"] = "UPCOMING";
    FutureStatus["ACTIVE"] = "ACTIVE";
    FutureStatus["FINISHED"] = "FINISHED";
    FutureStatus["CANCELLED"] = "CANCELLED";
    FutureStatus["DELETED"] = "DELETED";
    FutureStatus["SETTLEMENT_DONE"] = "SETTLEMENT_DONE";
    FutureStatus["WINNING_OPTION_UPDATED"] = "WINNING_OPTION_UPDATED";
    return FutureStatus;
}(FutureStatus || {});
var FuturePayoutStatus = /*#__PURE__*/ function(FuturePayoutStatus) {
    FuturePayoutStatus["ONGOING"] = "ONGOING";
    FuturePayoutStatus["PENDING"] = "PENDING";
    FuturePayoutStatus["PROCESSING"] = "PROCESSING";
    FuturePayoutStatus["COMPLETED"] = "COMPLETED";
    FuturePayoutStatus["PAID"] = "PAID";
    FuturePayoutStatus["FAILED"] = "FAILED";
    FuturePayoutStatus["LOST"] = "LOST";
    return FuturePayoutStatus;
}(FuturePayoutStatus || {});
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/futures/FutureBets.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FutureBets
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function formatInIST(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short"
    });
}
function formatOddsChoice(value) {
    if (value == null) return "null";
    if (!Number.isFinite(value)) return "null";
    return `${value.toFixed(2)}%`;
}
function formatCoins(value) {
    if (value == null || !Number.isFinite(value)) return "—";
    return value.toLocaleString();
}
function formatChoiceOddsAtBetTime(odds) {
    if (!odds || typeof odds !== "object") return "—";
    const parts = Object.entries(odds).filter(([, v])=>v != null && Number.isFinite(v)).map(([key, v])=>`${key} ${v.toFixed(2)}%`);
    return parts.length > 0 ? parts.join(" · ") : "—";
}
function FutureBets({ futureId }) {
    _s();
    const [bets, setBets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FutureBets.useCallback[load]": async ()=>{
            if (!futureId) return;
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`/api/futures/${encodeURIComponent(futureId)}/future-bets`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const response = await res.json();
                if (!res.ok) {
                    setError(typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to load future bets");
                    setBets([]);
                    return;
                }
                if (!response?.success) {
                    setError(typeof response?.message === "string" && response.message || "Failed to load future bets");
                    setBets([]);
                    return;
                }
                setBets(Array.isArray(response.data) ? response.data : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load future bets");
                setBets([]);
            } finally{
                setLoading(false);
            }
        }
    }["FutureBets.useCallback[load]"], [
        futureId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FutureBets.useEffect": ()=>{
            void load();
        }
    }["FutureBets.useEffect"], [
        load
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex flex-wrap items-center justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold text-black dark:text-white",
                        children: "Future bets"
                    }, void 0, false, {
                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>void load(),
                        disabled: loading,
                        className: "rounded-md border border-gray-300 px-3 py-1.5 text-sm text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800",
                        children: "Refresh"
                    }, void 0, false, {
                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/futures/FutureBets.tsx",
                lineNumber: 95,
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
                    fileName: "[project]/app/components/futures/FutureBets.tsx",
                    lineNumber: 111,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/futures/FutureBets.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this),
            !loading && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-red-500 dark:text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/futures/FutureBets.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, this),
            !loading && !error && bets.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500 dark:text-gray-400",
                children: "No bets on this future yet."
            }, void 0, false, {
                fileName: "[project]/app/components/futures/FutureBets.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this),
            !loading && !error && bets.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "-mx-2 overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full text-left text-sm text-gray-700 dark:text-gray-300",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 dark:border-zinc-700 dark:text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Submitted"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                                        lineNumber: 130,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "User"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Choice"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                                        lineNumber: 132,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Bet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                                        lineNumber: 133,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Odds"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                                        lineNumber: 134,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Won"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                                        lineNumber: 135,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Received"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                                        lineNumber: 136,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-0 font-medium",
                                        children: "Payout"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/futures/FutureBets.tsx",
                                        lineNumber: 138,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/futures/FutureBets.tsx",
                                lineNumber: 129,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: bets.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-b border-gray-100 align-top dark:border-zinc-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "whitespace-nowrap py-3 pr-4",
                                            children: formatInIST(row.submissionTime)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                                            lineNumber: 147,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-black dark:text-white",
                                                    children: row.userId?.userName ?? "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/futures/FutureBets.tsx",
                                                    lineNumber: 151,
                                                    columnNumber: 21
                                                }, this),
                                                row.userId?.email ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-0.5 text-xs text-gray-500 dark:text-gray-500",
                                                    children: row.userId.email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/futures/FutureBets.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 23
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                                            lineNumber: 150,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: row.futureChoiceId?.choiceName ?? "—"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                                            lineNumber: 160,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: formatCoins(row.coinsBet)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                                            lineNumber: 163,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: formatOddsChoice(row.oddsChoice)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: formatCoins(row.coinsWon)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                                            lineNumber: 167,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: formatCoins(row.totalCoinsReceived)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                                            lineNumber: 168,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-0 capitalize",
                                            children: row.payoutStatus || "—"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                                            lineNumber: 172,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, row._id, true, {
                                    fileName: "[project]/app/components/futures/FutureBets.tsx",
                                    lineNumber: 143,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureBets.tsx",
                            lineNumber: 141,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/futures/FutureBets.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/futures/FutureBets.tsx",
                lineNumber: 126,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/futures/FutureBets.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_s(FutureBets, "aPaZ1VId34gFZ2gWdhGQGOyyo/E=");
_c = FutureBets;
var _c;
__turbopack_context__.k.register(_c, "FutureBets");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/utils/future-choices.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildEditChoicesPayload",
    ()=>buildEditChoicesPayload,
    "canEditFutureChoices",
    ()=>canEditFutureChoices,
    "choiceToFormRow",
    ()=>choiceToFormRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/enums/future.enum.ts [app-client] (ecmascript)");
;
const NON_EDITABLE_STATUSES = new Set([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FutureStatus"].SETTLEMENT_DONE,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FutureStatus"].DELETED,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FutureStatus"].CANCELLED
]);
function canEditFutureChoices(futureStatus) {
    return !NON_EDITABLE_STATUSES.has(futureStatus.trim().toUpperCase());
}
function choiceToFormRow(choice) {
    return {
        _id: choice._id,
        choiceName: choice.choiceName ?? "",
        choiceDescription: choice.choiceDescription ?? "",
        choiceImage: choice.choiceImage ?? "",
        initialCoinsOnChoice: choice.initialCoinsOnChoice ?? 0,
        teamId: choice.teamDetails?._id ?? "",
        isVisible: choice.isVisible ?? true,
        placeholderColor: choice.placeholderColor ?? "",
        textColor: choice.textColor ?? ""
    };
}
function buildEditChoicesPayload(rows) {
    return rows.map((c)=>{
        const payload = {
            _id: c._id,
            choiceName: c.choiceName.trim(),
            isVisible: c.isVisible
        };
        if (c.choiceDescription.trim()) {
            payload.choiceDescription = c.choiceDescription.trim();
        } else {
            payload.choiceDescription = "";
        }
        if (c.choiceImage.trim()) {
            payload.choiceImage = c.choiceImage.trim();
        } else {
            payload.choiceImage = "";
        }
        payload.teamDetails = c.teamId.trim() ? c.teamId.trim() : null;
        if (c.placeholderColor.trim()) {
            payload.placeholderColor = c.placeholderColor.trim();
        }
        if (c.textColor.trim()) {
            payload.textColor = c.textColor.trim();
        }
        if (Number.isFinite(c.initialCoinsOnChoice)) {
            payload.initialCoinsOnChoice = c.initialCoinsOnChoice;
        }
        return payload;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/futures/FutureDetailView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FutureDetailView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/buildAdminHomeHref.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$event$2d$appearance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/events/event-appearance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$constants$2f$future$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/constants/future-status.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/enums/future.enum.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$futures$2f$FutureBets$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/futures/FutureBets.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$future$2d$choices$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/future-choices.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function tabFromSearchParams(sp) {
    const tab = sp.get("tab");
    if (tab === "future-json") return "json";
    return "bets";
}
function correctChoiceId(future) {
    const cc = future.correctChoice;
    if (!cc) return null;
    if (typeof cc === "string") return cc;
    return cc._id ?? null;
}
function ChoiceTeamLogo({ choice }) {
    if (!choice.teamDetails) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex size-[50px] shrink-0 items-center justify-center rounded-md text-sm font-bold",
        style: {
            backgroundColor: choice.teamDetails.primaryColor,
            color: choice.teamDetails.textColor
        },
        title: choice.teamDetails.name,
        children: choice.teamDetails.abbreviation
    }, void 0, false, {
        fileName: "[project]/app/components/futures/FutureDetailView.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c = ChoiceTeamLogo;
function FutureDetailView({ futureId }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const fromSection = searchParams.get("from");
    const panelTab = tabFromSearchParams(searchParams);
    const [future, setFuture] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [setCorrectChoiceOpen, setSetCorrectChoiceOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedChoiceId, setSelectedChoiceId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [submittingCorrectChoice, setSubmittingCorrectChoice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [setCorrectError, setSetCorrectError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [distributePayoutOpen, setDistributePayoutOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [distributingPayout, setDistributingPayout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [distributePayoutError, setDistributePayoutError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [statusDropdownOpen, setStatusDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const statusDropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [editChoicesOpen, setEditChoicesOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [choicesSaveMessage, setChoicesSaveMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const selectPanelTab = (next)=>{
        const sp = new URLSearchParams(searchParams.toString());
        sp.set("id", futureId);
        if (fromSection) sp.set("from", fromSection);
        if (next === "json") sp.set("tab", "future-json");
        else sp.delete("tab");
        const q = sp.toString();
        router.replace(q ? `${pathname}?${q}` : pathname, {
            scroll: false
        });
    };
    const fetchFuture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FutureDetailView.useCallback[fetchFuture]": async (options)=>{
            if (!futureId) return;
            try {
                if (!options?.silent) {
                    setLoading(true);
                }
                setError("");
                const res = await fetch(`/api/futures/${encodeURIComponent(futureId)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const response = await res.json();
                const entity = response?.data && typeof response.data === "object" ? response.data : null;
                if (!res.ok || !response?.success || !entity) {
                    const message = typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to load future";
                    setError(message);
                    setFuture(null);
                    return;
                }
                setFuture(entity);
            } catch (err) {
                setFuture(null);
                setError(err instanceof Error ? err.message : "Failed to load future");
            } finally{
                if (!options?.silent) {
                    setLoading(false);
                }
            }
        }
    }["FutureDetailView.useCallback[fetchFuture]"], [
        futureId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FutureDetailView.useEffect": ()=>{
            fetchFuture();
        }
    }["FutureDetailView.useEffect"], [
        fetchFuture
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FutureDetailView.useEffect": ()=>{
            if (!statusDropdownOpen) return;
            const onPointerDown = {
                "FutureDetailView.useEffect.onPointerDown": (e)=>{
                    if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
                        setStatusDropdownOpen(false);
                    }
                }
            }["FutureDetailView.useEffect.onPointerDown"];
            document.addEventListener("mousedown", onPointerDown);
            return ({
                "FutureDetailView.useEffect": ()=>document.removeEventListener("mousedown", onPointerDown)
            })["FutureDetailView.useEffect"];
        }
    }["FutureDetailView.useEffect"], [
        statusDropdownOpen
    ]);
    const updateFutureStatus = async (futureStatus)=>{
        if (!futureId) return;
        try {
            setStatusUpdateLoading(true);
            const res = await fetch(`/api/futures/${encodeURIComponent(futureId)}/update-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    futureStatus
                })
            });
            const response = await res.json();
            if (!res.ok || !response?.success) {
                throw new Error(response?.message || "Failed to update future status");
            }
            setStatusDropdownOpen(false);
            await fetchFuture({
                silent: true
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update future status");
        } finally{
            setStatusUpdateLoading(false);
        }
    };
    const handleSubmitCorrectChoice = async ()=>{
        if (!futureId || !selectedChoiceId) return;
        setSubmittingCorrectChoice(true);
        setSetCorrectError("");
        try {
            const res = await fetch(`/api/futures/${encodeURIComponent(futureId)}/correct-choice`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    correctChoiceId: selectedChoiceId
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setSetCorrectError(data?.message || "Failed to update correct answer");
                return;
            }
            setSetCorrectChoiceOpen(false);
            setSelectedChoiceId(null);
            await fetchFuture({
                silent: true
            });
        } catch (err) {
            setSetCorrectError(err instanceof Error ? err.message : "Failed to update correct answer");
        } finally{
            setSubmittingCorrectChoice(false);
        }
    };
    const handleDistributePayout = async ()=>{
        if (!futureId) return;
        setDistributingPayout(true);
        setDistributePayoutError("");
        try {
            const res = await fetch(`/api/futures/${encodeURIComponent(futureId)}/distribute-payout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (!res.ok) {
                setDistributePayoutError(data?.message || "Failed to distribute payouts");
                return;
            }
            setDistributePayoutOpen(false);
            await fetchFuture({
                silent: true
            });
        } catch (err) {
            setDistributePayoutError(err instanceof Error ? err.message : "Failed to distribute payouts");
        } finally{
            setDistributingPayout(false);
        }
    };
    const backHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildAdminHomeHref"])(fromSection, searchParams);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[calc(90dvh-4rem)] items-center justify-center bg-black md:min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                lineNumber: 240,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
            lineNumber: 239,
            columnNumber: 7
        }, this);
    }
    if (error || !future) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4 text-red-400",
                        children: error || "Future not found"
                    }, void 0, false, {
                        fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>router.push(backHref),
                        className: "rounded-md bg-white px-4 py-2 text-black hover:bg-zinc-200",
                        children: "Back to Home"
                    }, void 0, false, {
                        fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                lineNumber: 248,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
            lineNumber: 247,
            columnNumber: 7
        }, this);
    }
    const isSettlementDone = future.futureStatus.toUpperCase() === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FutureStatus"].SETTLEMENT_DONE;
    const choicesEditable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$future$2d$choices$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canEditFutureChoices"])(future.futureStatus);
    const canDistributePayout = future.futureStatus.toUpperCase() === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FutureStatus"].WINNING_OPTION_UPDATED && correctChoiceId(future) != null;
    const choices = Array.isArray(future.choices) ? future.choices : [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-50 p-6 dark:bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-6xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 flex flex-wrap items-center justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>router.push(backHref),
                            className: "rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800",
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 274,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-3",
                            children: [
                                !isSettlementDone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                setSetCorrectError("");
                                                setSelectedChoiceId(correctChoiceId(future));
                                                setSetCorrectChoiceOpen(true);
                                            },
                                            className: "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
                                            children: "Update correct answer"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 284,
                                            columnNumber: 17
                                        }, this),
                                        canDistributePayout && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                setDistributePayoutError("");
                                                setDistributePayoutOpen(true);
                                            },
                                            className: "rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600",
                                            children: "Distribute payouts"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 296,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    ref: statusDropdownRef,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            disabled: statusUpdateLoading || isSettlementDone,
                                            onClick: ()=>{
                                                if (isSettlementDone) return;
                                                setStatusDropdownOpen((open)=>!open);
                                            },
                                            className: `rounded-md px-4 py-2 text-sm font-medium ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$event$2d$appearance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventStatusBadgeClass"])(future.futureStatus)} ${isSettlementDone ? "cursor-not-allowed opacity-80" : "cursor-pointer"} ${statusUpdateLoading ? "cursor-wait opacity-60" : ""}`,
                                            children: future.futureStatus
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 310,
                                            columnNumber: 15
                                        }, this),
                                        statusDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-0 z-20 mt-2 min-w-[240px] rounded-md border border-zinc-700 bg-zinc-900 p-1 shadow-lg",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$constants$2f$future$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FUTURE_STATUS_VALUES"].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>updateFutureStatus(status),
                                                    className: `w-full rounded px-3 py-2 text-left text-sm ${future.futureStatus.toUpperCase() === status ? "bg-white text-black" : "text-zinc-200 hover:bg-zinc-800"}`,
                                                    children: status
                                                }, status, false, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 326,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 309,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                    lineNumber: 273,
                    columnNumber: 9
                }, this),
                setCorrectChoiceOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center p-4",
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "correct-choice-dialog-title",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 bg-black/50 dark:bg-black/70",
                            "aria-hidden": true,
                            onClick: ()=>!submittingCorrectChoice && setSetCorrectChoiceOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 354,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    id: "correct-choice-dialog-title",
                                    className: "mb-2 text-lg font-semibold text-black dark:text-white",
                                    children: "Update correct answer"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-4 text-sm text-gray-500 dark:text-gray-400",
                                    children: "Select the winning choice for this future."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 368,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6 space-y-3",
                                    children: choices.map((choice)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setSelectedChoiceId(choice._id),
                                            disabled: submittingCorrectChoice,
                                            className: `flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors ${selectedChoiceId === choice._id ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30" : "border-gray-200 hover:border-gray-300 dark:border-zinc-600 dark:hover:border-zinc-500"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChoiceTeamLogo, {
                                                    choice: choice
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "block font-medium text-black dark:text-white",
                                                            children: choice.choiceName
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 23
                                                        }, this),
                                                        choice.teamDetails ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-gray-600 dark:text-gray-400",
                                                            children: choice.teamDetails.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 390,
                                                            columnNumber: 25
                                                        }, this) : null
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, choice._id ?? choice.choiceId, true, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 373,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 371,
                                    columnNumber: 15
                                }, this),
                                setCorrectError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-4 text-sm text-red-500 dark:text-red-400",
                                    children: setCorrectError
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 399,
                                    columnNumber: 17
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setSetCorrectChoiceOpen(false),
                                            disabled: submittingCorrectChoice,
                                            className: "rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 404,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleSubmitCorrectChoice,
                                            disabled: !selectedChoiceId || submittingCorrectChoice,
                                            className: "rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600",
                                            children: submittingCorrectChoice ? "Updating…" : "Submit"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 412,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 403,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 361,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                    lineNumber: 348,
                    columnNumber: 11
                }, this),
                distributePayoutOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center p-4",
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "distribute-payout-dialog-title",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 bg-black/50 dark:bg-black/70",
                            "aria-hidden": true,
                            onClick: ()=>!distributingPayout && setDistributePayoutOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 432,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    id: "distribute-payout-dialog-title",
                                    className: "mb-4 text-lg font-semibold text-black dark:text-white",
                                    children: "Distribute payouts"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 440,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-6 text-sm text-gray-600 dark:text-gray-400",
                                    children: "Are you sure you want to distribute payout?"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 446,
                                    columnNumber: 15
                                }, this),
                                distributePayoutError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-4 text-sm text-red-500 dark:text-red-400",
                                    children: distributePayoutError
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 450,
                                    columnNumber: 17
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setDistributePayoutOpen(false),
                                            disabled: distributingPayout,
                                            className: "rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 455,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleDistributePayout,
                                            disabled: distributingPayout,
                                            className: "rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600",
                                            children: distributingPayout ? "Distributing…" : "Yes, distribute"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 463,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 454,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 439,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                    lineNumber: 426,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
                    children: [
                        future.eventImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative aspect-video w-full border-b border-gray-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: future.eventImage,
                                alt: future.eventName,
                                className: "h-full w-full object-cover"
                            }, void 0, false, {
                                fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                lineNumber: 480,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 478,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "mb-2 text-3xl font-bold text-black dark:text-white",
                                    children: future.eventName
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 489,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 dark:text-gray-400",
                                    children: [
                                        "Future ID: ",
                                        future.futureId
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 492,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 dark:text-gray-400",
                                    children: [
                                        "Document ID: ",
                                        future._id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 495,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 dark:text-gray-400",
                                    children: [
                                        "Tournament: ",
                                        future.tournament
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 498,
                                    columnNumber: 13
                                }, this),
                                future.eventDescription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-4 text-gray-700 dark:text-gray-300",
                                    children: future.eventDescription
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 502,
                                    columnNumber: 15
                                }, this) : null,
                                future.eventDescriptionImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-2 text-sm font-medium text-gray-500 dark:text-gray-400",
                                            children: "Description image"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 509,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: future.eventDescriptionImage,
                                            alt: `${future.eventName} description`,
                                            className: "max-h-80 w-full rounded-lg border border-gray-200 object-contain dark:border-zinc-700"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 513,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 508,
                                    columnNumber: 15
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 grid gap-4 sm:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border border-gray-200 p-4 dark:border-zinc-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-1 text-sm text-gray-500 dark:text-gray-400",
                                                    children: "Entry starts"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium text-black dark:text-white",
                                                    children: future.entryStartTime ? new Date(future.entryStartTime).toLocaleString() : "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 526,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 522,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border border-gray-200 p-4 dark:border-zinc-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-1 text-sm text-gray-500 dark:text-gray-400",
                                                    children: "Entry closes"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 533,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium text-black dark:text-white",
                                                    children: future.entryCloseTime ? new Date(future.entryCloseTime).toLocaleString() : "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 536,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 532,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 521,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 488,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                    lineNumber: 476,
                    columnNumber: 9
                }, this),
                choicesSaveMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
                    children: choicesSaveMessage
                }, void 0, false, {
                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                    lineNumber: 547,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 flex flex-wrap items-center justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-black dark:text-white",
                                    children: [
                                        "Choices (",
                                        Array.isArray(future.choices) ? future.choices.length : 0,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 554,
                                    columnNumber: 13
                                }, this),
                                choicesEditable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>{
                                        setChoicesSaveMessage("");
                                        setEditChoicesOpen(true);
                                    },
                                    className: "rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800",
                                    children: "Edit choices"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 559,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 553,
                            columnNumber: 11
                        }, this),
                        Array.isArray(future.choices) && future.choices.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-4",
                            children: future.choices.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "rounded-lg border border-gray-200 p-4 dark:border-zinc-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChoiceTeamLogo, {
                                                    choice: c
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-medium text-black dark:text-white",
                                                            children: c.choiceName
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 581,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex shrink-0 flex-wrap items-center gap-2",
                                                            children: [
                                                                correctChoiceId(future) === c._id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "rounded-md bg-emerald-600/20 px-2 py-0.5 text-xs font-medium text-emerald-400",
                                                                    children: "Winner"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                                    lineNumber: 586,
                                                                    columnNumber: 27
                                                                }, this) : null,
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-zinc-500",
                                                                    children: c.isVisible ? "Visible" : "Hidden"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                                    lineNumber: 590,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 584,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 578,
                                            columnNumber: 19
                                        }, this),
                                        c.choiceDescription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-sm text-gray-600 dark:text-gray-400",
                                            children: c.choiceDescription
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 597,
                                            columnNumber: 21
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                            className: "mt-3 grid gap-2 text-sm sm:grid-cols-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                            className: "text-zinc-500",
                                                            children: "Choice ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 603,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                            className: "font-mono text-xs text-zinc-300",
                                                            children: c.choiceId
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 604,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                            className: "text-zinc-500",
                                                            children: "Odds"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 609,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                            className: "text-zinc-200",
                                                            children: c.odds
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 610,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                            className: "text-zinc-500",
                                                            children: "Coins"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 613,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                            className: "text-zinc-200",
                                                            children: c.choiceCoins
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 614,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 612,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                            className: "text-zinc-500",
                                                            children: "Initial on choice"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 617,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                            className: "text-zinc-200",
                                                            children: c.initialCoinsOnChoice
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                            lineNumber: 618,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                                    lineNumber: 616,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                            lineNumber: 601,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, c._id ?? c.choiceId, true, {
                                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                                    lineNumber: 574,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 dark:text-gray-400",
                            children: "No choices."
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 627,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                    lineNumber: 552,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 mt-6 flex flex-wrap gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>selectPanelTab("bets"),
                            className: `rounded-md px-3 py-1.5 text-sm font-medium ${panelTab === "bets" ? "bg-black text-white dark:bg-white dark:text-black" : "border border-gray-300 text-black hover:bg-gray-100 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"}`,
                            children: "User Bets"
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 632,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>selectPanelTab("json"),
                            className: `rounded-md px-3 py-1.5 text-sm font-medium ${panelTab === "json" ? "bg-black text-white dark:bg-white dark:text-black" : "border border-gray-300 text-black hover:bg-gray-100 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800"}`,
                            children: "Future JSON"
                        }, void 0, false, {
                            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                            lineNumber: 643,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                    lineNumber: 631,
                    columnNumber: 9
                }, this),
                panelTab === "bets" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$futures$2f$FutureBets$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    futureId: futureId
                }, void 0, false, {
                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                    lineNumber: 656,
                    columnNumber: 33
                }, this),
                panelTab === "json" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto rounded-lg border border-gray-200 bg-zinc-950 p-4 dark:border-zinc-700",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "whitespace-pre-wrap break-all text-xs text-zinc-300",
                        children: JSON.stringify(future, null, 2)
                    }, void 0, false, {
                        fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                        lineNumber: 660,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/futures/FutureDetailView.tsx",
                    lineNumber: 659,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/futures/FutureDetailView.tsx",
            lineNumber: 272,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/futures/FutureDetailView.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, this);
}
_s(FutureDetailView, "6wmae+DZzVcK9Vwld/O3StLME+w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c1 = FutureDetailView;
var _c, _c1;
__turbopack_context__.k.register(_c, "ChoiceTeamLogo");
__turbopack_context__.k.register(_c1, "FutureDetailView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/futures/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FuturesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$futures$2f$FutureDetailView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/futures/FutureDetailView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function FuturesPageInner() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const id = searchParams.get("id")?.trim() ?? "";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FuturesPageInner.useEffect": ()=>{
            if (!isAuthenticated) {
                router.push("/login");
            }
        }
    }["FuturesPageInner.useEffect"], [
        isAuthenticated,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FuturesPageInner.useEffect": ()=>{
            if (isAuthenticated && !id) {
                router.replace("/?section=futures");
            }
        }
    }["FuturesPageInner.useEffect"], [
        isAuthenticated,
        id,
        router
    ]);
    if (!isAuthenticated) {
        return null;
    }
    if (!id) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/futures/page.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/futures/page.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$futures$2f$FutureDetailView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        futureId: id
    }, void 0, false, {
        fileName: "[project]/app/futures/page.tsx",
        lineNumber: 39,
        columnNumber: 10
    }, this);
}
_s(FuturesPageInner, "VGFEBCkhMmTvawLcJxnbs9A0TSs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = FuturesPageInner;
function FuturesPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/futures/page.tsx",
                lineNumber: 47,
                columnNumber: 11
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/app/futures/page.tsx",
            lineNumber: 46,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FuturesPageInner, {}, void 0, false, {
            fileName: "[project]/app/futures/page.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/futures/page.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c1 = FuturesPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "FuturesPageInner");
__turbopack_context__.k.register(_c1, "FuturesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_a2e6c28b._.js.map