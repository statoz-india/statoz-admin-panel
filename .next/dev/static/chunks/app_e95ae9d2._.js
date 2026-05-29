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
"[project]/app/components/futures/FutureDetailView.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/app/components/futures/FutureDetailView.tsx'\n\nExpected '</', got 'jsx text (\n\n        )'");
e.code = 'MODULE_UNPARSABLE';
throw e;
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

//# sourceMappingURL=app_e95ae9d2._.js.map