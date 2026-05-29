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
"[project]/app/constants/event-status.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EVENT_STATUS_VALUES",
    ()=>EVENT_STATUS_VALUES
]);
const EVENT_STATUS_VALUES = [
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
"[project]/app/components/events/EventsBets.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventsBets
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
function chosenLabel(value, optionLabels) {
    return optionLabels?.[value] ?? value;
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
function formatOddsAtBetTime(odds) {
    if (!odds) return "—";
    const parts = [];
    if (odds.Y != null && Number.isFinite(odds.Y)) parts.push(`Y ${odds.Y.toFixed(2)}%`);
    if (odds.N != null && Number.isFinite(odds.N)) parts.push(`N ${odds.N.toFixed(2)}%`);
    if (odds.M != null && Number.isFinite(odds.M)) parts.push(`M ${odds.M.toFixed(2)}%`);
    return parts.length > 0 ? parts.join(" · ") : "—";
}
function EventsBets({ eventId, optionLabels }) {
    _s();
    const [bets, setBets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EventsBets.useCallback[load]": async ()=>{
            if (!eventId) return;
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/events-bets`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const response = await res.json();
                if (!res.ok) {
                    setError(typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to load event bets");
                    setBets([]);
                    return;
                }
                if (!response?.success) {
                    setError(typeof response?.message === "string" && response.message || "Failed to load event bets");
                    setBets([]);
                    return;
                }
                setBets(Array.isArray(response.data) ? response.data : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load event bets");
                setBets([]);
            } finally{
                setLoading(false);
            }
        }
    }["EventsBets.useCallback[load]"], [
        eventId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EventsBets.useEffect": ()=>{
            void load();
        }
    }["EventsBets.useEffect"], [
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
                        children: "Event bets"
                    }, void 0, false, {
                        fileName: "[project]/app/components/events/EventsBets.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>void load(),
                        disabled: loading,
                        className: "rounded-md border border-gray-300 px-3 py-1.5 text-sm text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800",
                        children: "Refresh"
                    }, void 0, false, {
                        fileName: "[project]/app/components/events/EventsBets.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/events/EventsBets.tsx",
                lineNumber: 107,
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
                    fileName: "[project]/app/components/events/EventsBets.tsx",
                    lineNumber: 123,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/events/EventsBets.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, this),
            !loading && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-red-500 dark:text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/events/EventsBets.tsx",
                lineNumber: 128,
                columnNumber: 9
            }, this),
            !loading && !error && bets.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500 dark:text-gray-400",
                children: "No bets on this event yet."
            }, void 0, false, {
                fileName: "[project]/app/components/events/EventsBets.tsx",
                lineNumber: 132,
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
                                        fileName: "[project]/app/components/events/EventsBets.tsx",
                                        lineNumber: 142,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "User"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EventsBets.tsx",
                                        lineNumber: 143,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Choice"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EventsBets.tsx",
                                        lineNumber: 144,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Bet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EventsBets.tsx",
                                        lineNumber: 145,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Odds"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EventsBets.tsx",
                                        lineNumber: 146,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Won"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EventsBets.tsx",
                                        lineNumber: 147,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Received"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EventsBets.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-4 font-medium",
                                        children: "Odds at bet"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EventsBets.tsx",
                                        lineNumber: 149,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "py-2 pr-0 font-medium",
                                        children: "Payout"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EventsBets.tsx",
                                        lineNumber: 150,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/events/EventsBets.tsx",
                                lineNumber: 141,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/events/EventsBets.tsx",
                            lineNumber: 140,
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
                                            fileName: "[project]/app/components/events/EventsBets.tsx",
                                            lineNumber: 159,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-black dark:text-white",
                                                    children: row.userId?.userName ?? "—"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/events/EventsBets.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 21
                                                }, this),
                                                row.userId?.email ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-0.5 text-xs text-gray-500 dark:text-gray-500",
                                                    children: row.userId.email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/events/EventsBets.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 23
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/events/EventsBets.tsx",
                                            lineNumber: 162,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: chosenLabel(row.chosenOption, optionLabels)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventsBets.tsx",
                                            lineNumber: 172,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: formatCoins(row.coinsBet)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventsBets.tsx",
                                            lineNumber: 175,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: formatOddsChoice(row.oddsChoice)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventsBets.tsx",
                                            lineNumber: 176,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: formatCoins(row.coinsWon)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventsBets.tsx",
                                            lineNumber: 179,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4",
                                            children: formatCoins(row.totalCoinsReceived)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventsBets.tsx",
                                            lineNumber: 180,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-4 text-xs",
                                            children: formatOddsAtBetTime(row.optionOddsAtBetTime)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventsBets.tsx",
                                            lineNumber: 183,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "py-3 pr-0 capitalize",
                                            children: row.payoutStatus || "—"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventsBets.tsx",
                                            lineNumber: 186,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, row._id, true, {
                                    fileName: "[project]/app/components/events/EventsBets.tsx",
                                    lineNumber: 155,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/events/EventsBets.tsx",
                            lineNumber: 153,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/events/EventsBets.tsx",
                    lineNumber: 139,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/events/EventsBets.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/events/EventsBets.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, this);
}
_s(EventsBets, "aPaZ1VId34gFZ2gWdhGQGOyyo/E=");
_c = EventsBets;
var _c;
__turbopack_context__.k.register(_c, "EventsBets");
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
"[project]/app/utils/future-edit.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildEditFuturePayload",
    ()=>buildEditFuturePayload,
    "canEditFuture",
    ()=>canEditFuture,
    "convertToISTISO",
    ()=>convertToISTISO,
    "isoToDatetimeLocal",
    ()=>isoToDatetimeLocal,
    "validateEntryWindow",
    ()=>validateEntryWindow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/enums/future.enum.ts [app-client] (ecmascript)");
;
const NON_EDITABLE_STATUSES = new Set([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FutureStatus"].SETTLEMENT_DONE,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FutureStatus"].DELETED,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$future$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FutureStatus"].CANCELLED
]);
function canEditFuture(futureStatus) {
    return !NON_EDITABLE_STATUSES.has(futureStatus.trim().toUpperCase());
}
function convertToISTISO(dateTimeLocal) {
    if (!dateTimeLocal) return "";
    const [datePart, timePart] = dateTimeLocal.split("T");
    if (!datePart || !timePart) return dateTimeLocal;
    return `${datePart}T${timePart}:00.000+05:30`;
}
function isoToDatetimeLocal(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).formatToParts(d);
    const get = (type)=>parts.find((p)=>p.type === type)?.value ?? "";
    return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
function buildEditFuturePayload(form) {
    return {
        eventName: form.eventName.trim(),
        eventDescription: form.eventDescription,
        eventImage: form.eventImage,
        eventDescriptionImage: form.eventDescriptionImage,
        entryStartTime: convertToISTISO(form.entryStartTime),
        entryCloseTime: convertToISTISO(form.entryCloseTime)
    };
}
function validateEntryWindow(entryStartTime, entryCloseTime) {
    if (!entryStartTime.trim() || !entryCloseTime.trim()) {
        return "Entry start and close times are required.";
    }
    const start = new Date(convertToISTISO(entryStartTime));
    const close = new Date(convertToISTISO(entryCloseTime));
    if (Number.isNaN(start.getTime()) || Number.isNaN(close.getTime())) {
        return "Invalid entry start or close time.";
    }
    if (close.getTime() <= start.getTime()) {
        return "Entry close time must be after entry start time.";
    }
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/utils/event-edit.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildEditEventPayload",
    ()=>buildEditEventPayload,
    "canEditEvent",
    ()=>canEditEvent,
    "eventToForm",
    ()=>eventToForm,
    "validateEditEventForm",
    ()=>validateEditEventForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/enums/event.enum.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$future$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/future-edit.ts [app-client] (ecmascript)");
;
;
const NON_EDITABLE_STATUSES = new Set([
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].SETTLEMENT_DONE,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].DELETED,
    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].CANCELLED
]);
function canEditEvent(eventStatus) {
    return !NON_EDITABLE_STATUSES.has(eventStatus.trim().toUpperCase());
}
function eventToForm(event) {
    return {
        eventName: event.eventName ?? "",
        eventDescription: event.eventDescription ?? "",
        eventImage: event.eventImage ?? "",
        eventDescriptionImage: event.eventDescriptionImage ?? "",
        entryStartTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$future$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isoToDatetimeLocal"])(event.entryStartTime),
        entryCloseTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$future$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isoToDatetimeLocal"])(event.entryCloseTime),
        yesPlaceholder: event.yesPlaceholder ?? "Yes",
        noPlaceholder: event.noPlaceholder ?? "No",
        maybePlaceholder: event.maybePlaceholder ?? "Maybe",
        yesPlaceholderColor: event.yesPlaceholderColor ?? "",
        noPlaceholderColor: event.noPlaceholderColor ?? "",
        maybePlaceholderColor: event.maybePlaceholderColor ?? "",
        yesTextColor: event.yesTextColor ?? "",
        noTextColor: event.noTextColor ?? "",
        maybeTextColor: event.maybeTextColor ?? ""
    };
}
function buildEditEventPayload(form, haveThreeOptions) {
    const payload = {
        eventName: form.eventName.trim(),
        eventDescription: form.eventDescription,
        eventImage: form.eventImage,
        eventDescriptionImage: form.eventDescriptionImage,
        entryStartTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$future$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertToISTISO"])(form.entryStartTime),
        entryCloseTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$future$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertToISTISO"])(form.entryCloseTime),
        yesPlaceholder: form.yesPlaceholder.trim(),
        noPlaceholder: form.noPlaceholder.trim(),
        yesPlaceholderColor: form.yesPlaceholderColor.trim() || undefined,
        noPlaceholderColor: form.noPlaceholderColor.trim() || undefined,
        yesTextColor: form.yesTextColor.trim() || undefined,
        noTextColor: form.noTextColor.trim() || undefined
    };
    if (haveThreeOptions) {
        payload.maybePlaceholder = form.maybePlaceholder.trim();
        payload.maybePlaceholderColor = form.maybePlaceholderColor.trim() || undefined;
        payload.maybeTextColor = form.maybeTextColor.trim() || undefined;
    }
    return payload;
}
function validateEditEventForm(form, haveThreeOptions) {
    if (!form.eventName.trim()) {
        return "Event name is required.";
    }
    if (!form.yesPlaceholder.trim()) {
        return "Yes label is required.";
    }
    if (!form.noPlaceholder.trim()) {
        return "No label is required.";
    }
    if (haveThreeOptions && !form.maybePlaceholder.trim()) {
        return "Maybe label is required for three-option events.";
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$future$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateEntryWindow"])(form.entryStartTime, form.entryCloseTime);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/events/EditEventDetailsModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditEventDetailsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$event$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/event-edit.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ColorField({ label, value, fallback, onChange, ariaLabel }) {
    const display = value || fallback;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "color",
                        value: display,
                        onChange: (e)=>onChange(e.target.value),
                        className: "h-10 w-14 shrink-0 cursor-pointer rounded-md border border-gray-300 dark:border-zinc-600",
                        "aria-label": ariaLabel
                    }, void 0, false, {
                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-xs text-zinc-500",
                        children: display
                    }, void 0, false, {
                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c = ColorField;
function EditEventDetailsModal({ isOpen, event, onClose, onSuccess }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "EditEventDetailsModal.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$event$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventToForm"])(event)
    }["EditEventDetailsModal.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditEventDetailsModal.useEffect": ()=>{
            if (!isOpen) return;
            setError("");
            setForm((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$event$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventToForm"])(event));
        }
    }["EditEventDetailsModal.useEffect"], [
        isOpen,
        event
    ]);
    const updateForm = (patch)=>{
        setForm((prev)=>({
                ...prev,
                ...patch
            }));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        const validationError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$event$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateEditEventForm"])(form, event.haveThreeOptions);
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`/api/events/${encodeURIComponent(event._id)}/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$event$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildEditEventPayload"])(form, event.haveThreeOptions))
            });
            const response = await res.json();
            if (!res.ok || !response?.success) {
                setError(typeof response?.message === "string" && response.message || "Failed to update event");
                return;
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update event");
        } finally{
            setLoading(false);
        }
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "edit-event-details-dialog-title",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/50 dark:bg-black/70",
                "aria-hidden": true,
                onClick: ()=>!loading && onClose()
            }, void 0, false, {
                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        id: "edit-event-details-dialog-title",
                        className: "mb-1 text-lg font-semibold text-black dark:text-white",
                        children: "Edit event details"
                    }, void 0, false, {
                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4 text-sm text-gray-500 dark:text-gray-400",
                        children: [
                            event.eventId,
                            " · Status: ",
                            event.eventStatus,
                            event.haveThreeOptions ? " · 3 options" : " · Yes / No"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                        className: "text-sm font-semibold text-gray-800 dark:text-gray-200",
                                        children: "Basic info"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                children: "Event name *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 147,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                required: true,
                                                value: form.eventName,
                                                onChange: (e)=>updateForm({
                                                        eventName: e.target.value
                                                    }),
                                                className: "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 150,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                children: [
                                                    "Description",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-normal text-zinc-500",
                                                        children: "(optional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 161,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 159,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                rows: 3,
                                                value: form.eventDescription,
                                                onChange: (e)=>updateForm({
                                                        eventDescription: e.target.value
                                                    }),
                                                className: "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 163,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                children: [
                                                    "Event image URL",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-normal text-zinc-500",
                                                        children: "(optional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 173,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                inputMode: "url",
                                                placeholder: "https://…",
                                                value: form.eventImage,
                                                onChange: (e)=>updateForm({
                                                        eventImage: e.target.value
                                                    }),
                                                className: "w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 177,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 172,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                children: [
                                                    "Description image URL",
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-normal text-zinc-500",
                                                        children: "(optional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 187,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                inputMode: "url",
                                                placeholder: "https://…",
                                                value: form.eventDescriptionImage,
                                                onChange: (e)=>updateForm({
                                                        eventDescriptionImage: e.target.value
                                                    }),
                                                className: "w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 191,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 186,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                        className: "text-sm font-semibold text-gray-800 dark:text-gray-200",
                                        children: "Schedule"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                children: "Entry start time *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 209,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "datetime-local",
                                                required: true,
                                                value: form.entryStartTime,
                                                onChange: (e)=>updateForm({
                                                        entryStartTime: e.target.value
                                                    }),
                                                className: "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 212,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                children: "Entry close time *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 223,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "datetime-local",
                                                required: true,
                                                value: form.entryCloseTime,
                                                onChange: (e)=>updateForm({
                                                        entryCloseTime: e.target.value
                                                    }),
                                                className: "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 226,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                        className: "text-sm font-semibold text-gray-800 dark:text-gray-200",
                                        children: "Options copy & colors"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 239,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-4 sm:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                        children: "Yes label *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        required: true,
                                                        value: form.yesPlaceholder,
                                                        onChange: (e)=>updateForm({
                                                                yesPlaceholder: e.target.value
                                                            }),
                                                        className: "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 247,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 243,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                        children: "No label *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        required: true,
                                                        value: form.noPlaceholder,
                                                        onChange: (e)=>updateForm({
                                                                noPlaceholder: e.target.value
                                                            }),
                                                        className: "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 257,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 242,
                                        columnNumber: 13
                                    }, this),
                                    event.haveThreeOptions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                children: "Maybe label *"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                required: true,
                                                value: form.maybePlaceholder,
                                                onChange: (e)=>updateForm({
                                                        maybePlaceholder: e.target.value
                                                    }),
                                                className: "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 278,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 274,
                                        columnNumber: 15
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-lg border border-zinc-200 p-3 dark:border-zinc-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-3 text-xs font-medium text-emerald-600 dark:text-emerald-400",
                                                children: "Yes"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 291,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid gap-3 sm:grid-cols-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorField, {
                                                        label: "Placeholder color",
                                                        value: form.yesPlaceholderColor,
                                                        fallback: "#2CA85E",
                                                        onChange: (hex)=>updateForm({
                                                                yesPlaceholderColor: hex
                                                            }),
                                                        ariaLabel: "Yes placeholder color"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorField, {
                                                        label: "Text color",
                                                        value: form.yesTextColor,
                                                        fallback: "#FFFFFF",
                                                        onChange: (hex)=>updateForm({
                                                                yesTextColor: hex
                                                            }),
                                                        ariaLabel: "Yes text color"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 304,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 294,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 290,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-lg border border-zinc-200 p-3 dark:border-zinc-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-3 text-xs font-medium text-rose-600 dark:text-rose-400",
                                                children: "No"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 315,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid gap-3 sm:grid-cols-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorField, {
                                                        label: "Placeholder color",
                                                        value: form.noPlaceholderColor,
                                                        fallback: "#FF3B30",
                                                        onChange: (hex)=>updateForm({
                                                                noPlaceholderColor: hex
                                                            }),
                                                        ariaLabel: "No placeholder color"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 319,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorField, {
                                                        label: "Text color",
                                                        value: form.noTextColor,
                                                        fallback: "#FFFFFF",
                                                        onChange: (hex)=>updateForm({
                                                                noTextColor: hex
                                                            }),
                                                        ariaLabel: "No text color"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 326,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 318,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 314,
                                        columnNumber: 13
                                    }, this),
                                    event.haveThreeOptions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-lg border border-zinc-200 p-3 dark:border-zinc-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-3 text-xs font-medium text-amber-600 dark:text-amber-400",
                                                children: "Maybe"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 338,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid gap-3 sm:grid-cols-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorField, {
                                                        label: "Placeholder color",
                                                        value: form.maybePlaceholderColor,
                                                        fallback: "#FF9500",
                                                        onChange: (hex)=>updateForm({
                                                                maybePlaceholderColor: hex
                                                            }),
                                                        ariaLabel: "Maybe placeholder color"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 342,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ColorField, {
                                                        label: "Text color",
                                                        value: form.maybeTextColor,
                                                        fallback: "#FFFFFF",
                                                        onChange: (hex)=>updateForm({
                                                                maybeTextColor: hex
                                                            }),
                                                        ariaLabel: "Maybe text color"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                        lineNumber: 351,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                                lineNumber: 341,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 337,
                                        columnNumber: 15
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                lineNumber: 238,
                                columnNumber: 11
                            }, this),
                            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-red-500 dark:text-red-400",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                lineNumber: 364,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end gap-3 pt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: onClose,
                                        disabled: loading,
                                        className: "rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 368,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: loading,
                                        className: "rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600",
                                        children: loading ? "Saving…" : "Save details"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                        lineNumber: 376,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                                lineNumber: 367,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/events/EditEventDetailsModal.tsx",
        lineNumber: 118,
        columnNumber: 5
    }, this);
}
_s(EditEventDetailsModal, "7cBArAEFWHand85BD5ANHufpG+w=");
_c1 = EditEventDetailsModal;
var _c, _c1;
__turbopack_context__.k.register(_c, "ColorField");
__turbopack_context__.k.register(_c1, "EditEventDetailsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/events/EventDetailView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventDetailView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/buildAdminHomeHref.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$event$2d$appearance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/events/event-appearance.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$constants$2f$event$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/constants/event-status.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/enums/event.enum.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$EventsBets$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/events/EventsBets.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$EditEventDetailsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/events/EditEventDetailsModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$event$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/event-edit.ts [app-client] (ecmascript)");
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
;
function tabFromSearchParams(sp) {
    const tab = sp.get("tab");
    if (tab === "event-json") return "json";
    return "bets";
}
function formatInIST(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short"
    });
}
function netSideCoins(gross, initial) {
    return (gross ?? 0) - (initial ?? 0);
}
function outcomeOptions(ev) {
    const options = [
        {
            value: "Y",
            label: ev.yesPlaceholder,
            descriptionClass: "text-emerald-600 dark:text-emerald-400"
        },
        {
            value: "N",
            label: ev.noPlaceholder,
            descriptionClass: "text-rose-600 dark:text-rose-400"
        }
    ];
    if (ev.haveThreeOptions) {
        options.push({
            value: "M",
            label: ev.maybePlaceholder ?? "Maybe",
            descriptionClass: "text-amber-600 dark:text-amber-400"
        });
    }
    return options;
}
function winningOptionLabel(ev) {
    if (!ev.winningOption) return null;
    return outcomeOptions(ev).find((o)=>o.value === ev.winningOption)?.label ?? null;
}
/** User-attributed total: gross totals minus seeded initial coins (matches prediction detail). */ function netTotalCoins(ev) {
    const initMaybe = ev.haveThreeOptions ? ev.initialCoinsOnMaybe ?? 0 : 0;
    if (ev.totalCoins != null && Number.isFinite(ev.totalCoins)) {
        return ev.totalCoins - (ev.initialCoinsOnYes ?? 0) - (ev.initialCoinsOnNo ?? 0) - initMaybe;
    }
    return netSideCoins(ev.coinsOnYes, ev.initialCoinsOnYes) + netSideCoins(ev.coinsOnNo, ev.initialCoinsOnNo) + (ev.haveThreeOptions ? netSideCoins(ev.coinsOnMaybe, ev.initialCoinsOnMaybe) : 0);
}
function EventDetailView({ eventId }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const fromSection = searchParams.get("from");
    const panelTab = tabFromSearchParams(searchParams);
    const [event, setEvent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [setWinningOptionOpen, setSetWinningOptionOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedWinningOption, setSelectedWinningOption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [submittingWinningOption, setSubmittingWinningOption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [setWinningOptionError, setSetWinningOptionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [distributePayoutOpen, setDistributePayoutOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [distributingPayout, setDistributingPayout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [distributePayoutError, setDistributePayoutError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [statusDropdownOpen, setStatusDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const statusDropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [editDetailsOpen, setEditDetailsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [detailsSaveMessage, setDetailsSaveMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const selectPanelTab = (next)=>{
        const sp = new URLSearchParams(searchParams.toString());
        sp.set("id", eventId);
        if (fromSection) sp.set("from", fromSection);
        if (next === "json") sp.set("tab", "event-json");
        else sp.delete("tab");
        const q = sp.toString();
        router.replace(q ? `${pathname}?${q}` : pathname, {
            scroll: false
        });
    };
    const fetchEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "EventDetailView.useCallback[fetchEvent]": async (options)=>{
            if (!eventId) return;
            try {
                if (!options?.silent) {
                    setLoading(true);
                }
                setError("");
                const res = await fetch(`/api/events/${encodeURIComponent(eventId)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const response = await res.json();
                if (!res.ok || !response?.success) {
                    const message = typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to load event";
                    setError(message);
                    setEvent(null);
                    return;
                }
                setEvent(response.data ?? null);
            } catch (err) {
                setEvent(null);
                setError(err instanceof Error ? err.message : "Failed to load event");
            } finally{
                if (!options?.silent) {
                    setLoading(false);
                }
            }
        }
    }["EventDetailView.useCallback[fetchEvent]"], [
        eventId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EventDetailView.useEffect": ()=>{
            fetchEvent();
        }
    }["EventDetailView.useEffect"], [
        fetchEvent
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EventDetailView.useEffect": ()=>{
            if (!statusDropdownOpen) return;
            const onPointerDown = {
                "EventDetailView.useEffect.onPointerDown": (e)=>{
                    if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
                        setStatusDropdownOpen(false);
                    }
                }
            }["EventDetailView.useEffect.onPointerDown"];
            document.addEventListener("mousedown", onPointerDown);
            return ({
                "EventDetailView.useEffect": ()=>document.removeEventListener("mousedown", onPointerDown)
            })["EventDetailView.useEffect"];
        }
    }["EventDetailView.useEffect"], [
        statusDropdownOpen
    ]);
    const updateEventStatus = async (eventStatus)=>{
        if (!eventId) return;
        try {
            setStatusUpdateLoading(true);
            const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/update-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    eventStatus
                })
            });
            const response = await res.json();
            if (!res.ok || !response?.success) {
                throw new Error(response?.message || "Failed to update event status");
            }
            setStatusDropdownOpen(false);
            await fetchEvent({
                silent: true
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update event status");
        } finally{
            setStatusUpdateLoading(false);
        }
    };
    const handleSubmitWinningOption = async ()=>{
        if (!eventId || !selectedWinningOption) return;
        setSubmittingWinningOption(true);
        setSetWinningOptionError("");
        try {
            const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/update-result`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    winningOption: selectedWinningOption
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setSetWinningOptionError(data?.message || "Failed to update winning option");
                return;
            }
            setSetWinningOptionOpen(false);
            setSelectedWinningOption(null);
            await fetchEvent({
                silent: true
            });
        } catch (err) {
            setSetWinningOptionError(err instanceof Error ? err.message : "Failed to update winning option");
        } finally{
            setSubmittingWinningOption(false);
        }
    };
    const handleDistributePayout = async ()=>{
        if (!eventId) return;
        setDistributingPayout(true);
        setDistributePayoutError("");
        try {
            const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/distribute-payout`, {
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
            await fetchEvent({
                silent: true
            });
        } catch (err) {
            setDistributePayoutError(err instanceof Error ? err.message : "Failed to distribute payouts");
        } finally{
            setDistributingPayout(false);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/components/events/EventDetailView.tsx",
                lineNumber: 282,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/events/EventDetailView.tsx",
            lineNumber: 281,
            columnNumber: 7
        }, this);
    }
    if (error || !event) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-400 mb-4",
                        children: error || "Event not found"
                    }, void 0, false, {
                        fileName: "[project]/app/components/events/EventDetailView.tsx",
                        lineNumber: 291,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>router.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildAdminHomeHref"])(fromSection, searchParams)),
                        className: "px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200",
                        children: "Back to Home"
                    }, void 0, false, {
                        fileName: "[project]/app/components/events/EventDetailView.tsx",
                        lineNumber: 292,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/events/EventDetailView.tsx",
                lineNumber: 290,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/events/EventDetailView.tsx",
            lineNumber: 289,
            columnNumber: 7
        }, this);
    }
    const netYes = netSideCoins(event.coinsOnYes, event.initialCoinsOnYes);
    const netNo = netSideCoins(event.coinsOnNo, event.initialCoinsOnNo);
    const netMaybe = event.haveThreeOptions ? netSideCoins(event.coinsOnMaybe, event.initialCoinsOnMaybe) : 0;
    const netTotal = netTotalCoins(event);
    const isSettlementDone = event.eventStatus.toUpperCase() === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].SETTLEMENT_DONE;
    const eventEditable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$event$2d$edit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canEditEvent"])(event.eventStatus);
    const canDistributePayout = event.eventStatus.toUpperCase() === __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$enums$2f$event$2e$enum$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventStatus"].WINNING_OPTION_UPDATED && event.winningOption != null;
    const options = outcomeOptions(event);
    const currentWinnerLabel = winningOptionLabel(event);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-50 dark:bg-black p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 flex flex-wrap items-center justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>router.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildAdminHomeHref"])(fromSection, searchParams)),
                            className: "px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800",
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 325,
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
                                                setSetWinningOptionError("");
                                                setSelectedWinningOption(event.winningOption ?? null);
                                                setSetWinningOptionOpen(true);
                                            },
                                            className: "rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
                                            children: "Update winning option"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 337,
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
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 349,
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
                                            className: `rounded-md px-4 py-2 text-sm font-medium ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$event$2d$appearance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["eventStatusBadgeClass"])(event.eventStatus)} ${isSettlementDone ? "cursor-not-allowed opacity-80" : "cursor-pointer"} ${statusUpdateLoading ? "cursor-wait opacity-60" : ""}`,
                                            children: event.eventStatus
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 363,
                                            columnNumber: 15
                                        }, this),
                                        statusDropdownOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute right-0 z-20 mt-2 min-w-[240px] rounded-md border border-zinc-700 bg-zinc-900 p-1 shadow-lg",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$constants$2f$event$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EVENT_STATUS_VALUES"].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>updateEventStatus(status),
                                                    className: `w-full rounded px-3 py-2 text-left text-sm ${event.eventStatus.toUpperCase() === status ? "bg-white text-black" : "text-zinc-200 hover:bg-zinc-800"}`,
                                                    children: status
                                                }, status, false, {
                                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 379,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 334,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                    lineNumber: 324,
                    columnNumber: 9
                }, this),
                setWinningOptionOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center p-4",
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "winning-option-dialog-title",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 bg-black/50 dark:bg-black/70",
                            "aria-hidden": true,
                            onClick: ()=>!submittingWinningOption && setSetWinningOptionOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 407,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-600 dark:bg-zinc-900",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    id: "winning-option-dialog-title",
                                    className: "mb-2 text-lg font-semibold text-black dark:text-white",
                                    children: "Update winning option"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 415,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-4 text-sm text-gray-500 dark:text-gray-400",
                                    children: "Select the winning outcome for this event."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 421,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6 space-y-3",
                                    children: options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setSelectedWinningOption(option.value),
                                            disabled: submittingWinningOption,
                                            className: `flex w-full items-center justify-between rounded-lg border-2 p-3 text-left transition-colors ${selectedWinningOption === option.value ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30" : "border-gray-200 hover:border-gray-300 dark:border-zinc-600 dark:hover:border-zinc-500"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `font-medium ${option.descriptionClass}`,
                                                    children: option.label
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-mono text-xs text-zinc-500",
                                                    children: option.value
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, option.value, true, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 426,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 424,
                                    columnNumber: 15
                                }, this),
                                setWinningOptionError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-4 text-sm text-red-500 dark:text-red-400",
                                    children: setWinningOptionError
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 447,
                                    columnNumber: 17
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setSetWinningOptionOpen(false),
                                            disabled: submittingWinningOption,
                                            className: "rounded-md border border-gray-300 px-4 py-2 text-black hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 452,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleSubmitWinningOption,
                                            disabled: !selectedWinningOption || submittingWinningOption,
                                            className: "rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600",
                                            children: submittingWinningOption ? "Updating…" : "Submit"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 460,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 451,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 414,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                    lineNumber: 401,
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
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 480,
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
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 488,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-6 text-sm text-gray-600 dark:text-gray-400",
                                    children: [
                                        "Are you sure you want to distribute payout",
                                        currentWinnerLabel ? ` to "${currentWinnerLabel}"` : "",
                                        "?"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 494,
                                    columnNumber: 15
                                }, this),
                                distributePayoutError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-4 text-sm text-red-500 dark:text-red-400",
                                    children: distributePayoutError
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 499,
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
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 504,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleDistributePayout,
                                            disabled: distributingPayout,
                                            className: "rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600",
                                            children: distributingPayout ? "Distributing…" : "Yes, distribute"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 512,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 503,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 487,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                    lineNumber: 474,
                    columnNumber: 11
                }, this),
                detailsSaveMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
                    children: detailsSaveMessage
                }, void 0, false, {
                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                    lineNumber: 526,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 p-6 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 flex flex-wrap items-start justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold text-black dark:text-white",
                                    children: event.eventName
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 533,
                                    columnNumber: 13
                                }, this),
                                eventEditable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>{
                                        setDetailsSaveMessage("");
                                        setEditDetailsOpen(true);
                                    },
                                    className: "shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-50 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-800",
                                    children: "Edit details"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 537,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 532,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 dark:text-gray-400",
                            children: [
                                "Event ID: ",
                                event.eventId
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 549,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 dark:text-gray-400",
                            children: [
                                "Document ID: ",
                                event._id
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 552,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 dark:text-gray-400",
                            children: [
                                "Tournament: ",
                                event.tournament
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 555,
                            columnNumber: 11
                        }, this),
                        event.eventDescription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 text-gray-700 dark:text-gray-300",
                            children: event.eventDescription
                        }, void 0, false, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 559,
                            columnNumber: 13
                        }, this) : null,
                        event.eventImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 dark:text-gray-400 mb-2",
                                    children: "Event image"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 566,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: event.eventImage,
                                    alt: "",
                                    className: "max-h-48 max-w-full rounded-lg border border-gray-200 dark:border-zinc-700 object-contain"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 570,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 565,
                            columnNumber: 13
                        }, this) : null,
                        event.eventDescriptionImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 dark:text-gray-400 mb-2",
                                    children: "Description image"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 580,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: event.eventDescriptionImage,
                                    alt: "",
                                    className: "max-h-48 max-w-full rounded-lg border border-gray-200 dark:border-zinc-700 object-contain"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 584,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 579,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 grid gap-4 sm:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border border-gray-200 dark:border-zinc-700 p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                            children: "Entry starts"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 594,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-black dark:text-white",
                                            children: formatInIST(event.entryStartTime)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 597,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 593,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border border-gray-200 dark:border-zinc-700 p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                            children: "Entry closes"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 602,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-black dark:text-white",
                                            children: formatInIST(event.entryCloseTime)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 605,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 601,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border border-gray-200 dark:border-zinc-700 p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                            children: "Options"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 610,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium text-black dark:text-white",
                                            children: event.haveThreeOptions ? "Yes / No / Maybe" : "Yes / No"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 613,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 flex flex-wrap gap-2",
                                            children: options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-sm dark:border-zinc-600 ${option.descriptionClass}`,
                                                    children: [
                                                        option.label,
                                                        event.winningOption === option.value ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "rounded bg-emerald-600/20 px-1.5 py-0.5 text-xs font-medium text-emerald-400",
                                                            children: "Winner"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                                            lineNumber: 624,
                                                            columnNumber: 23
                                                        }, this) : null
                                                    ]
                                                }, option.value, true, {
                                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                                    lineNumber: 618,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                                            lineNumber: 616,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 609,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 592,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 grid grid-cols-2 md:grid-cols-4 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                    label: "Total coins",
                                    value: netTotal
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 635,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                    label: `${event.yesPlaceholder} coins`,
                                    value: netYes
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 636,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                    label: `${event.noPlaceholder} coins`,
                                    value: netNo
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 637,
                                    columnNumber: 13
                                }, this),
                                event.haveThreeOptions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                    label: `${event.maybePlaceholder ?? "Maybe"} coins`,
                                    value: netMaybe
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 639,
                                    columnNumber: 15
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 634,
                            columnNumber: 11
                        }, this),
                        (event.oddsYes != null || event.oddsNo != null) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 grid grid-cols-2 md:grid-cols-3 gap-4",
                            children: [
                                event.oddsYes != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                    label: `${event.yesPlaceholder} odds`,
                                    value: `${event.oddsYes.toFixed(2)}%`
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 649,
                                    columnNumber: 17
                                }, this),
                                event.oddsNo != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                    label: `${event.noPlaceholder} odds`,
                                    value: `${event.oddsNo.toFixed(2)}%`
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 655,
                                    columnNumber: 17
                                }, this),
                                event.oddsMaybe != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stat, {
                                    label: "Maybe odds",
                                    value: `${event.oddsMaybe.toFixed(2)}%`
                                }, void 0, false, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 661,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 647,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm text-gray-600 dark:text-gray-400 space-y-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "Created: ",
                                        formatInIST(event.createdAt)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 670,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "Updated: ",
                                        formatInIST(event.updatedAt)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 671,
                                    columnNumber: 13
                                }, this),
                                event.createdByUserData && (event.createdByUserData.email || event.createdByUserData.userName) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "Created by:",
                                        " ",
                                        event.createdByUserData.email || event.createdByUserData.userName,
                                        event.createdByUserData.userType ? ` (${event.createdByUserData.userType})` : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                                    lineNumber: 675,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 669,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                    lineNumber: 531,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-2 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>selectPanelTab("bets"),
                            className: `px-3 py-1.5 rounded-md text-sm font-medium ${panelTab === "bets" ? "bg-black text-white dark:bg-white dark:text-black" : "border border-gray-300 dark:border-zinc-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"}`,
                            children: "User Bets"
                        }, void 0, false, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 688,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>selectPanelTab("json"),
                            className: `px-3 py-1.5 rounded-md text-sm font-medium ${panelTab === "json" ? "bg-black text-white dark:bg-white dark:text-black" : "border border-gray-300 dark:border-zinc-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"}`,
                            children: "Event JSON"
                        }, void 0, false, {
                            fileName: "[project]/app/components/events/EventDetailView.tsx",
                            lineNumber: 699,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                    lineNumber: 687,
                    columnNumber: 9
                }, this),
                panelTab === "bets" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$EventsBets$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    eventId: eventId,
                    optionLabels: {
                        Y: event.yesPlaceholder,
                        N: event.noPlaceholder,
                        ...event.haveThreeOptions ? {
                            M: event.maybePlaceholder ?? "Maybe"
                        } : {}
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                    lineNumber: 713,
                    columnNumber: 11
                }, this),
                panelTab === "json" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border border-gray-200 dark:border-zinc-700 bg-zinc-950 p-4 overflow-x-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "text-xs text-zinc-300 whitespace-pre-wrap break-all",
                        children: JSON.stringify(event, null, 2)
                    }, void 0, false, {
                        fileName: "[project]/app/components/events/EventDetailView.tsx",
                        lineNumber: 727,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                    lineNumber: 726,
                    columnNumber: 11
                }, this),
                editDetailsOpen && eventEditable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$EditEventDetailsModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    isOpen: editDetailsOpen,
                    event: event,
                    onClose: ()=>setEditDetailsOpen(false),
                    onSuccess: async ()=>{
                        setDetailsSaveMessage("Event details updated successfully.");
                        await fetchEvent({
                            silent: true
                        });
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/events/EventDetailView.tsx",
                    lineNumber: 734,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/events/EventDetailView.tsx",
            lineNumber: 323,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/events/EventDetailView.tsx",
        lineNumber: 322,
        columnNumber: 5
    }, this);
}
_s(EventDetailView, "/c+sUavPS5yxGiYIN3LbJHnR4NM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = EventDetailView;
function Stat({ label, value, sub }) {
    const display = typeof value === "number" ? value.toLocaleString() : value != null && value !== "" ? String(value) : "—";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 bg-gray-50 dark:bg-zinc-800/80 rounded-lg border border-gray-200 dark:border-zinc-700",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/components/events/EventDetailView.tsx",
                lineNumber: 766,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-lg font-semibold text-black dark:text-white",
                children: display
            }, void 0, false, {
                fileName: "[project]/app/components/events/EventDetailView.tsx",
                lineNumber: 767,
                columnNumber: 7
            }, this),
            sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500 dark:text-gray-400 mt-1",
                children: sub
            }, void 0, false, {
                fileName: "[project]/app/components/events/EventDetailView.tsx",
                lineNumber: 771,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/events/EventDetailView.tsx",
        lineNumber: 765,
        columnNumber: 5
    }, this);
}
_c1 = Stat;
var _c, _c1;
__turbopack_context__.k.register(_c, "EventDetailView");
__turbopack_context__.k.register(_c1, "Stat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/events/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$EventDetailView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/events/EventDetailView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function EventsPageInner() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const id = searchParams.get("id")?.trim() ?? "";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EventsPageInner.useEffect": ()=>{
            if (!isAuthenticated) {
                router.push("/login");
            }
        }
    }["EventsPageInner.useEffect"], [
        isAuthenticated,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EventsPageInner.useEffect": ()=>{
            if (isAuthenticated && !id) {
                router.replace("/?section=events");
            }
        }
    }["EventsPageInner.useEffect"], [
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
                fileName: "[project]/app/events/page.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/events/page.tsx",
            lineNumber: 33,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$events$2f$EventDetailView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        eventId: id
    }, void 0, false, {
        fileName: "[project]/app/events/page.tsx",
        lineNumber: 39,
        columnNumber: 10
    }, this);
}
_s(EventsPageInner, "VGFEBCkhMmTvawLcJxnbs9A0TSs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = EventsPageInner;
function EventsPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/events/page.tsx",
                lineNumber: 47,
                columnNumber: 11
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/app/events/page.tsx",
            lineNumber: 46,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EventsPageInner, {}, void 0, false, {
            fileName: "[project]/app/events/page.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/events/page.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c1 = EventsPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "EventsPageInner");
__turbopack_context__.k.register(_c1, "EventsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_edde6e68._.js.map