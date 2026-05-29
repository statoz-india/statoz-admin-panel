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
"[project]/app/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
function Sidebar({ activeSection, onSectionChange, onLogout, isLoggingOut = false }) {
    const menuItems = [
        {
            id: "users",
            label: "Users"
        },
        {
            id: "teams",
            label: "Teams"
        },
        {
            id: "matches",
            label: "Matches"
        },
        {
            id: "quizzes",
            label: "Quizzes"
        },
        {
            id: "predictions",
            label: "Predictions"
        },
        {
            id: "leaderboard",
            label: "Leaderboard"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-64 bg-zinc-900 border-r border-zinc-800 h-screen flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 border-b border-gray-200 dark:border-zinc-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-xl font-bold text-white",
                    children: "Admin Panel"
                }, void 0, false, {
                    fileName: "[project]/app/components/Sidebar.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "space-y-2",
                    children: menuItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onSectionChange(item.id),
                                className: `w-full text-left px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? " bg-white text-black" : "text-gray-300  hover:bg-zinc-800"}`,
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/app/components/Sidebar.tsx",
                                lineNumber: 34,
                                columnNumber: 15
                            }, this)
                        }, item.id, false, {
                            fileName: "[project]/app/components/Sidebar.tsx",
                            lineNumber: 33,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/components/Sidebar.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-zinc-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onLogout,
                    disabled: isLoggingOut,
                    className: "w-full text-center px-4 py-3 rounded-lg transition-colors  bg-black text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed",
                    children: isLoggingOut ? "Logging out..." : "Logout"
                }, void 0, false, {
                    fileName: "[project]/app/components/Sidebar.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Sidebar.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/users/UsersSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UsersSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const USERS_SCROLL_POSITION_KEY = "admin_users_scroll_top";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";
/** Up to 2 decimal places; omits “.00” when the value is whole. */ function formatCoinsDisplay(value) {
    const n = Number(value ?? 0);
    if (!Number.isFinite(n)) return "0";
    return String(parseFloat(n.toFixed(2)));
}
function UsersSection() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const hasRestoredScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const saveScrollPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersSection.useCallback[saveScrollPosition]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
            const scrollTop = container ? container.scrollTop : window.scrollY;
            sessionStorage.setItem(USERS_SCROLL_POSITION_KEY, String(scrollTop));
        }
    }["UsersSection.useCallback[saveScrollPosition]"], []);
    const restoreScrollPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersSection.useCallback[restoreScrollPosition]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const raw = sessionStorage.getItem(USERS_SCROLL_POSITION_KEY);
            if (!raw) return;
            const parsedScrollTop = Number(raw);
            if (!Number.isFinite(parsedScrollTop)) return;
            const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
            requestAnimationFrame({
                "UsersSection.useCallback[restoreScrollPosition]": ()=>{
                    if (container) {
                        container.scrollTo({
                            top: parsedScrollTop,
                            behavior: "auto"
                        });
                    } else {
                        window.scrollTo({
                            top: parsedScrollTop,
                            behavior: "auto"
                        });
                    }
                }
            }["UsersSection.useCallback[restoreScrollPosition]"]);
        }
    }["UsersSection.useCallback[restoreScrollPosition]"], []);
    const navigateToUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "UsersSection.useCallback[navigateToUser]": (userId)=>{
            saveScrollPosition();
            router.push(`/users/${userId}`, {
                scroll: false
            });
        }
    }["UsersSection.useCallback[navigateToUser]"], [
        router,
        saveScrollPosition
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UsersSection.useEffect": ()=>{
            const fetchUsers = {
                "UsersSection.useEffect.fetchUsers": async ()=>{
                    try {
                        setLoading(true);
                        setError("");
                        const res = await fetch("/api/users/getAllUsers", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include"
                        });
                        const response = await res.json();
                        if (!res.ok) {
                            const message = typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to load users";
                            setError(message);
                            setUsers([]);
                            return;
                        }
                        if (!response?.success) {
                            setError(typeof response?.message === "string" && response.message || "Failed to load users");
                            setUsers([]);
                            return;
                        }
                        const list = Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : [];
                        setUsers(list);
                    } catch (err) {
                        setError(err instanceof Error ? err.message : "Failed to load users");
                        setUsers([]);
                    } finally{
                        setLoading(false);
                    }
                }
            }["UsersSection.useEffect.fetchUsers"];
            fetchUsers();
        }
    }["UsersSection.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UsersSection.useEffect": ()=>{
            if (loading || hasRestoredScrollRef.current) return;
            restoreScrollPosition();
            hasRestoredScrollRef.current = true;
        }
    }["UsersSection.useEffect"], [
        loading,
        restoreScrollPosition
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/components/users/UsersSection.tsx",
                lineNumber: 119,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/users/UsersSection.tsx",
            lineNumber: 118,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-500 dark:text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/users/UsersSection.tsx",
                lineNumber: 127,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/users/UsersSection.tsx",
            lineNumber: 126,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-6 text-black dark:text-white",
                children: [
                    "Users (Total: ",
                    users.length,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/users/UsersSection.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full divide-y divide-gray-200 dark:divide-zinc-700",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50 dark:bg-zinc-800",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "Sl No."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/users/UsersSection.tsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "Username"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/users/UsersSection.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/users/UsersSection.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "AuthProvider"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/users/UsersSection.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "User Status"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/users/UsersSection.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "Coins"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/users/UsersSection.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "Created At"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/users/UsersSection.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/users/UsersSection.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/users/UsersSection.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700",
                            children: users.map((user, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    onClick: ()=>navigateToUser(user._id),
                                    className: "hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400",
                                            children: index + 1
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/users/UsersSection.tsx",
                                            lineNumber: 171,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white",
                                            children: user.userName
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/users/UsersSection.tsx",
                                            lineNumber: 174,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                            children: user.email
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/users/UsersSection.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                            children: user.authProvider ?? "unknown"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/users/UsersSection.tsx",
                                            lineNumber: 180,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                            children: user.userStatus
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/users/UsersSection.tsx",
                                            lineNumber: 183,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                            children: formatCoinsDisplay(user.coins)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/users/UsersSection.tsx",
                                            lineNumber: 186,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                            children: new Date(user.createdAt).toLocaleString("en-IN", {
                                                timeZone: "Asia/Kolkata",
                                                dateStyle: "short",
                                                timeStyle: "short"
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/users/UsersSection.tsx",
                                            lineNumber: 189,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, user._id, true, {
                                    fileName: "[project]/app/components/users/UsersSection.tsx",
                                    lineNumber: 166,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/users/UsersSection.tsx",
                            lineNumber: 164,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/users/UsersSection.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/users/UsersSection.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/users/UsersSection.tsx",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
_s(UsersSection, "wceRNDNMtXpeOF01BqwpY+NW5bA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = UsersSection;
var _c;
__turbopack_context__.k.register(_c, "UsersSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/quiz/CreateQuizModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateQuizModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function CreateQuizModal({ isOpen, onClose, onSuccess }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tournaments, setTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTournament, setSelectedTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [matches, setMatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [matchesLoading, setMatchesLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tournament: "",
        matchId: "",
        entryStartTime: "",
        tag: "",
        questionsArray: []
    });
    const [newQuestion, setNewQuestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Convert datetime-local value to IST ISO format with explicit IST timezone
    // Input: "2026-02-13T13:43" (datetime-local, interpreted as IST)
    // Output: "2026-02-13T13:43:00.000+05:30" (IST ISO format with timezone)
    // This explicitly marks the time as IST (UTC+5:30)
    // Note: If backend converts this to UTC, that's a backend configuration issue
    const convertToISTISO = (dateTimeLocal)=>{
        if (!dateTimeLocal) return "";
        // datetime-local format: "YYYY-MM-DDTHH:mm"
        const [datePart, timePart] = dateTimeLocal.split("T");
        if (!datePart || !timePart) return dateTimeLocal;
        // Format as IST ISO with milliseconds and IST timezone offset (+05:30)
        // This explicitly tells the backend this is IST time
        return `${datePart}T${timePart}:00.000+05:30`;
    };
    // Get the number of options based on question type
    const getOptionsForQuestionType = (type)=>{
        switch(type){
            case "MCQ":
                return [
                    "",
                    ""
                ];
            case "BOOLEAN":
                return [
                    "true",
                    "false"
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
    // Handlers for editing existing questions
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
    const updateQuestionPoints = (questionIndex, xp)=>{
        const updatedQuestions = [
            ...formData.questionsArray
        ];
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            xp: xp
        };
        setFormData({
            ...formData,
            questionsArray: updatedQuestions
        });
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
        const options = currentOptions.filter((_, i)=>i !== optionIndex);
        if (options.length < 2) return;
        updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            options
        };
        setFormData({
            ...formData,
            questionsArray: updatedQuestions
        });
    };
    // Fetch tournaments
    const fetchTournaments = async ()=>{
        try {
            const res = await fetch("/api/tournament", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch tournaments");
            }
            const response = await res.json();
            const tournamentData = response.success ? response.data.data : [];
            setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
        } catch (err) {
            console.error("Error fetching tournaments:", err);
            setError(err instanceof Error ? err.message : "Failed to load tournaments");
        }
    };
    // Fetch matches for selected tournament
    const fetchMatches = async (tournament)=>{
        if (!tournament) {
            setMatches([]);
            return;
        }
        try {
            setMatchesLoading(true);
            const res = await fetch(`/api/match/${encodeURIComponent(tournament)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch matches");
            }
            const response = await res.json();
            const list = response.success && response.data ? response.data : [];
            setMatches(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error("Error fetching matches:", err);
            setError(err instanceof Error ? err.message : "Failed to load matches");
            setMatches([]);
        } finally{
            setMatchesLoading(false);
        }
    };
    // Handle tournament selection
    const handleTournamentChange = (tournament)=>{
        setSelectedTournament(tournament);
        setFormData({
            ...formData,
            tournament: tournament,
            matchId: ""
        });
        fetchMatches(tournament);
    };
    // Format match label: matchId: teamA.abbreviation vs teamB.abbreviation
    const getMatchLabel = (match)=>{
        const a = match.teamA?.abbreviation ?? "?";
        const b = match.teamB?.abbreviation ?? "?";
        return `${match.matchId}: ${a} vs ${b}`;
    };
    // Fetch tournaments when modal opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateQuizModal.useEffect": ()=>{
            if (isOpen) {
                fetchTournaments();
                const now = new Date();
                const pad = {
                    "CreateQuizModal.useEffect.pad": (n)=>String(n).padStart(2, "0")
                }["CreateQuizModal.useEffect.pad"];
                const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
                setFormData({
                    "CreateQuizModal.useEffect": (prev)=>({
                            ...prev,
                            entryStartTime: local
                        })
                }["CreateQuizModal.useEffect"]);
            }
        }
    }["CreateQuizModal.useEffect"], [
        isOpen
    ]);
    if (!isOpen) return null;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        // Validate required fields
        if (!formData.tournament) {
            setError("Please select a tournament");
            setLoading(false);
            return;
        }
        if (!formData.matchId) {
            setError("Please select a match");
            setLoading(false);
            return;
        }
        if (!formData.entryStartTime) {
            setError("Please provide both entry start times");
            setLoading(false);
            return;
        }
        // Send datetime-local values directly as IST time
        // The datetime-local input value represents IST time that user wants stored as IST
        // We send it with IST timezone (+05:30) to explicitly mark it as IST
        // If backend converts this to UTC, that's a backend configuration issue that needs to be fixed
        const entryStartTimeIST = convertToISTISO(formData.entryStartTime);
        // Validate that entry start time is before match start time (entry stop time)
        const selectedMatch = matches.find((m)=>m._id === formData.matchId);
        const entryStopTime = selectedMatch?.matchStartTime ? new Date(selectedMatch.matchStartTime).getTime() : null;
        const startTime = new Date(`${formData.entryStartTime}+05:30`).getTime();
        if (entryStopTime != null && startTime >= entryStopTime) {
            setError("Entry start time must be before match start time");
            setLoading(false);
            return;
        }
        // Validate that there are questions
        // if (formData.questionsArray.length === 0) {
        //   setError("Please add at least one question");
        //   setLoading(false);
        //   return;
        // }
        try {
            // Prepare payload with IST formatted times
            // Format: "2026-02-13T13:43:00.000+05:30" (IST with explicit timezone)
            // This explicitly marks the time as IST - backend should store it as IST
            const payload = {
                ...formData,
                entryStartTime: entryStartTimeIST
            };
            // Log what we're sending for debugging
            console.log("Sending times as IST:", {
                entryStartTime: entryStartTimeIST
            });
            const res = await fetch("/api/quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                const errorMessage = typeof errorData.message === "string" ? errorData.message : typeof errorData.error === "string" ? errorData.error : "Failed to create quiz";
                throw new Error(errorMessage);
            }
            const response = await res.json();
            if (!response.success) {
                throw new Error(response.message || "Failed to create quiz");
            }
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                tournament: "",
                matchId: "",
                entryStartTime: "",
                questionsArray: [],
                tag: ""
            });
            setSelectedTournament("");
            setMatches([]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create quiz";
            setError(errorMessage);
        } finally{
            setLoading(false);
        }
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
            xp: 10
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
                    questionNumber: formData.questionsArray.length + 1,
                    correctAnswer: ""
                }
            ]
        });
        setNewQuestion(null);
    };
    const removeNewQuestion = ()=>{
        setNewQuestion(null);
        setError("");
    };
    const removeQuestion = (index)=>{
        setFormData({
            ...formData,
            questionsArray: formData.questionsArray.filter((_, i)=>i !== index)
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white dark:bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-gray-200 dark:border-zinc-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-black dark:text-white",
                        children: "Create New Quiz"
                    }, void 0, false, {
                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                        lineNumber: 399,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                    lineNumber: 398,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-6",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-800 dark:text-red-200 text-sm",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                lineNumber: 407,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                            lineNumber: 406,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Tournament *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 413,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            required: true,
                                            value: selectedTournament,
                                            onChange: (e)=>handleTournamentChange(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "-- Select a tournament --"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 17
                                                }, this),
                                                tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: tournament,
                                                        children: tournament
                                                    }, tournament, false, {
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 424,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 416,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 412,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Match *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 431,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            required: true,
                                            value: formData.matchId,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    matchId: e.target.value
                                                }),
                                            disabled: !selectedTournament || matchesLoading,
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: matchesLoading ? "Loading matches..." : !selectedTournament ? "Select tournament first" : matches.length === 0 ? "No matches for this tournament" : "-- Select a match --"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 443,
                                                    columnNumber: 17
                                                }, this),
                                                matches.map((match)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: match._id,
                                                        children: getMatchLabel(match)
                                                    }, match._id, false, {
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 453,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 434,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 430,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: [
                                                "Entry Start Time *",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-500",
                                                    children: "(IST)"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 460,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "datetime-local",
                                            required: true,
                                            value: formData.entryStartTime,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    entryStartTime: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 464,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 459,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Tag"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 479,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.tag || "",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    tag: e.target.value
                                                }),
                                            placeholder: "Enter a tag for this quiz (optional)",
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 482,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 478,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                            lineNumber: 411,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 border-t border-gray-200 dark:border-zinc-800 pt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-black dark:text-white mb-4",
                                    children: [
                                        "Questions (",
                                        formData.questionsArray.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 496,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        formData.questionsArray.map((question, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-start gap-2 mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                        children: [
                                                                            "Question ",
                                                                            question.questionNumber,
                                                                            " Text *"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 507,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: question.questionText ?? "",
                                                                        onChange: (e)=>updateQuestionText(idx, e.target.value),
                                                                        className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 510,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 506,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>removeQuestion(idx),
                                                                className: "px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm shrink-0",
                                                                children: "Remove"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 519,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-2 gap-3 mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                        children: "XP *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 529,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "number",
                                                                        min: 1,
                                                                        value: question.xp ?? 0,
                                                                        onChange: (e)=>updateQuestionPoints(idx, parseInt(e.target.value) || 0),
                                                                        className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 532,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 528,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                        children: "Type *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 546,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: question.questionType ?? "MCQ",
                                                                        onChange: (e)=>updateQuestionType(idx, e.target.value),
                                                                        className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "MCQ",
                                                                                children: "MCQ"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                                lineNumber: 559,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "BOOLEAN",
                                                                                children: "Boolean (True/False)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                                lineNumber: 560,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "NUMERIC",
                                                                                children: "Numeric"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                                lineNumber: 561,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "ALPHABETICAL",
                                                                                children: "Alphabetical"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                                lineNumber: 562,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 549,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 545,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 527,
                                                        columnNumber: 19
                                                    }, this),
                                                    (question.questionType === "MCQ" || question.questionType === "BOOLEAN") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                                        children: [
                                                                            "Options *",
                                                                            question.questionType === "BOOLEAN" && " (True/False)"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 570,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    question.questionType === "MCQ" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>addQuestionOption(idx),
                                                                        className: "text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700",
                                                                        children: "+ Add Option"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 576,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 569,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: (question.options ?? []).map((option, optIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-2 items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: question.questionType === "BOOLEAN" ? option.toUpperCase() ?? "" : option ?? "",
                                                                                onChange: (e)=>updateQuestionOption(idx, optIdx, e.target.value),
                                                                                className: "flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white",
                                                                                placeholder: `Option ${optIdx + 1}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                                lineNumber: 588,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            question.questionType === "MCQ" && (question.options?.length ?? 0) > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>removeQuestionOption(idx, optIdx),
                                                                                className: "px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shrink-0",
                                                                                title: "Remove option",
                                                                                children: "×"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                                lineNumber: 607,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, optIdx, true, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 587,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 585,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 568,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                lineNumber: 501,
                                                columnNumber: 17
                                            }, this)),
                                        newQuestion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 p-4 border-2 border-dashed border-blue-500/50 rounded-lg bg-blue-50 dark:bg-zinc-800/80",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "text-sm font-semibold text-blue-600 dark:text-blue-300 mb-3",
                                                    children: "New question"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 629,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                            children: "Question Text *"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 633,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: newQuestion.questionText,
                                                            onChange: (e)=>setNewQuestion({
                                                                    ...newQuestion,
                                                                    questionText: e.target.value
                                                                }),
                                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white",
                                                            placeholder: "Enter question"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 636,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 632,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-3 mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                    children: "Type *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 651,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: newQuestion.questionType,
                                                                    onChange: (e)=>setNewQuestion({
                                                                            ...newQuestion,
                                                                            questionType: e.target.value,
                                                                            options: getOptionsForQuestionType(e.target.value)
                                                                        }),
                                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "MCQ",
                                                                            children: "MCQ"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                            lineNumber: 667,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "BOOLEAN",
                                                                            children: "Boolean (True/False)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                            lineNumber: 668,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "NUMERIC",
                                                                            children: "Numeric"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                            lineNumber: 669,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "ALPHABETICAL",
                                                                            children: "Alphabetical"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                            lineNumber: 670,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 654,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 650,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                    children: "XP *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 674,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 1,
                                                                    value: newQuestion.xp,
                                                                    onChange: (e)=>setNewQuestion({
                                                                            ...newQuestion,
                                                                            xp: parseInt(e.target.value) || 0
                                                                        }),
                                                                    className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 677,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 673,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 649,
                                                    columnNumber: 19
                                                }, this),
                                                (newQuestion.questionType === "MCQ" || newQuestion.questionType === "BOOLEAN") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300",
                                                                    children: [
                                                                        "Options *",
                                                                        newQuestion.questionType === "BOOLEAN" && " (True/False)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 695,
                                                                    columnNumber: 25
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
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 701,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 694,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: newQuestion.options.map((option, optIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-2 items-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            value: newQuestion.questionType === "BOOLEAN" ? option.toUpperCase() : option,
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
                                                                            className: "flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white",
                                                                            placeholder: `Option ${optIdx + 1}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                            lineNumber: 718,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        newQuestion.questionType === "MCQ" && newQuestion.options.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>{
                                                                                const opts = newQuestion.options.filter((_, i)=>i !== optIdx);
                                                                                setNewQuestion({
                                                                                    ...newQuestion,
                                                                                    options: opts
                                                                                });
                                                                            },
                                                                            className: "px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shrink-0",
                                                                            children: "×"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                            lineNumber: 738,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, optIdx, true, {
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 717,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 715,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 693,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-3 pt-3 border-t border-gray-300 dark:border-zinc-600",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: saveNewQuestion,
                                                            className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700",
                                                            children: "Save"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 762,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: removeNewQuestion,
                                                            className: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                                                            children: "Remove"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 769,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 761,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 628,
                                            columnNumber: 17
                                        }, this),
                                        !newQuestion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: addQuestion,
                                            className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                                            children: "+ Add Question"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 781,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 499,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                            lineNumber: 495,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 793,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Creating..." : "Create Quiz"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 800,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                            lineNumber: 792,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                    lineNumber: 404,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
            lineNumber: 397,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
        lineNumber: 396,
        columnNumber: 5
    }, this);
}
_s(CreateQuizModal, "ODrObl7OZwdEKbMRRY1M960Nm3A=");
_c = CreateQuizModal;
var _c;
__turbopack_context__.k.register(_c, "CreateQuizModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/constants/quiz-status.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QUIZ_STATUS_VALUES",
    ()=>QUIZ_STATUS_VALUES
]);
const QUIZ_STATUS_VALUES = [
    "UPCOMING",
    "LIVE",
    "FINISHED",
    "SETTLEMENT_DONE"
];
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
"[project]/app/components/quiz/QuizzesSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuizzesSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$quiz$2f$CreateQuizModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/quiz/CreateQuizModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$constants$2f$quiz$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/constants/quiz-status.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/buildAdminHomeHref.ts [app-client] (ecmascript)");
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
const QUIZZES_SCROLL_POSITION_KEY = "admin_quizzes_scroll_top";
const QUIZZES_SHOULD_RESTORE_SCROLL_KEY = "admin_quizzes_should_restore_scroll";
const QUERY_QUIZ_TOURNAMENT = "quizTournament";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";
function resolveTournamentQueryParam(raw, tournamentList) {
    if (raw === "LIVE") return "LIVE";
    if (raw && tournamentList.includes(raw)) return raw;
    return "LIVE";
}
const getQuizStatusBadgeClass = (status)=>{
    switch(status.toUpperCase()){
        case "UPCOMING":
            return "bg-violet-900 text-violet-200";
        case "LIVE":
            return "bg-emerald-900 text-emerald-200";
        case "FINISHED":
            return "bg-zinc-700 text-zinc-200";
        case "ENTRYNOTSTARTED":
            return "bg-slate-700 text-slate-200";
        case "ENTRYCLOSED":
            return "bg-amber-900 text-amber-200";
        case "SETTLEMENT_DONE":
            return "bg-purple-900 text-purple-200";
        case "NOT_VISIBLE":
            return "bg-rose-900 text-rose-200";
        case "ADMIN_VISIBLE":
            return "bg-cyan-900 text-cyan-200";
        // Backward-compatible handling if backend still sends this legacy value
        case "ENTRYSTARTED":
            return "bg-blue-900 text-blue-200";
        default:
            return "bg-zinc-800 text-zinc-200";
    }
};
function QuizzesSection() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const tournamentParam = searchParams.get(QUERY_QUIZ_TOURNAMENT) ?? searchParams.get("tournament");
    const hasRestoredScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [quizzes, setQuizzes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const saveScrollPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuizzesSection.useCallback[saveScrollPosition]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
            const scrollTop = container ? container.scrollTop : window.scrollY;
            sessionStorage.setItem(QUIZZES_SCROLL_POSITION_KEY, String(scrollTop));
        }
    }["QuizzesSection.useCallback[saveScrollPosition]"], []);
    const restoreScrollPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuizzesSection.useCallback[restoreScrollPosition]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const raw = sessionStorage.getItem(QUIZZES_SCROLL_POSITION_KEY);
            if (!raw) return;
            const parsedScrollTop = Number(raw);
            if (!Number.isFinite(parsedScrollTop)) return;
            const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
            requestAnimationFrame({
                "QuizzesSection.useCallback[restoreScrollPosition]": ()=>{
                    if (container) {
                        container.scrollTo({
                            top: parsedScrollTop,
                            behavior: "auto"
                        });
                    } else {
                        window.scrollTo({
                            top: parsedScrollTop,
                            behavior: "auto"
                        });
                    }
                }
            }["QuizzesSection.useCallback[restoreScrollPosition]"]);
        }
    }["QuizzesSection.useCallback[restoreScrollPosition]"], []);
    const [tournaments, setTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tournamentListReady, setTournamentListReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTournament, setSelectedTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("LIVE");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [openStatusDropdownQuizId, setOpenStatusDropdownQuizId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [statusUpdateLoadingQuizId, setStatusUpdateLoadingQuizId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchTournamentsList = async ()=>{
        try {
            const res = await fetch("/api/tournament", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                return [];
            }
            const response = await res.json();
            const tournamentData = response.success ? response.data.data : [];
            return Array.isArray(tournamentData) ? tournamentData : [];
        } catch  {
            return [];
        }
    };
    const fetchQuizzes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuizzesSection.useCallback[fetchQuizzes]": async (tournament)=>{
            try {
                setLoading(true);
                setError("");
                const endpoint = tournament === "LIVE" ? "/api/quiz/live-quizzes" : `/api/quiz/tournament/${encodeURIComponent(tournament)}`;
                const res = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const response = await res.json();
                if (!res.ok) {
                    const message = typeof response?.message === "string" && response.message || typeof response?.error === "string" && response.error || "Failed to load quizzes";
                    setError(message);
                    setQuizzes([]);
                    return;
                }
                if (!response?.success) {
                    setError(typeof response?.message === "string" && response.message || "Failed to load quizzes");
                    setQuizzes([]);
                    return;
                }
                const list = Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : [];
                setQuizzes(list);
            } catch (err) {
                setQuizzes([]);
                setError(err instanceof Error ? err.message : "Failed to load quizzes");
            } finally{
                setLoading(false);
            }
        }
    }["QuizzesSection.useCallback[fetchQuizzes]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuizzesSection.useEffect": ()=>{
            let cancelled = false;
            ({
                "QuizzesSection.useEffect": async ()=>{
                    const list = await fetchTournamentsList();
                    if (cancelled) return;
                    setTournaments(list);
                    setTournamentListReady(true);
                }
            })["QuizzesSection.useEffect"]();
            return ({
                "QuizzesSection.useEffect": ()=>{
                    cancelled = true;
                }
            })["QuizzesSection.useEffect"];
        }
    }["QuizzesSection.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuizzesSection.useEffect": ()=>{
            if (!tournamentListReady) return;
            let cancelled = false;
            ({
                "QuizzesSection.useEffect": async ()=>{
                    const resolved = resolveTournamentQueryParam(tournamentParam, tournaments);
                    const sp = new URLSearchParams(searchParams.toString());
                    sp.set("section", "quizzes");
                    const needsNormalize = searchParams.get("section") !== "quizzes" || searchParams.get(QUERY_QUIZ_TOURNAMENT) !== resolved || searchParams.get("tournament") != null || searchParams.get("from") != null || searchParams.get("predTournament") != null;
                    if (needsNormalize) {
                        sp.set(QUERY_QUIZ_TOURNAMENT, resolved);
                        sp.delete("tournament");
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripAdminHomeQueryNoise"])("quizzes", sp);
                        router.replace(`/?${sp.toString()}`, {
                            scroll: false
                        });
                    }
                    if (cancelled) return;
                    setSelectedTournament(resolved);
                    await fetchQuizzes(resolved);
                }
            })["QuizzesSection.useEffect"]();
            return ({
                "QuizzesSection.useEffect": ()=>{
                    cancelled = true;
                }
            })["QuizzesSection.useEffect"];
        }
    }["QuizzesSection.useEffect"], [
        tournamentListReady,
        tournamentParam,
        tournaments,
        fetchQuizzes,
        router,
        searchParams
    ]);
    const replaceQuizzesTournamentInUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuizzesSection.useCallback[replaceQuizzesTournamentInUrl]": (tournament)=>{
            const sp = new URLSearchParams(searchParams.toString());
            sp.set("section", "quizzes");
            sp.set(QUERY_QUIZ_TOURNAMENT, tournament);
            sp.delete("tournament");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripAdminHomeQueryNoise"])("quizzes", sp);
            router.replace(`/?${sp.toString()}`, {
                scroll: false
            });
        }
    }["QuizzesSection.useCallback[replaceQuizzesTournamentInUrl]"], [
        router,
        searchParams
    ]);
    const quizHrefWithListContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "QuizzesSection.useCallback[quizHrefWithListContext]": (path)=>{
            const sep = path.includes("?") ? "&" : "?";
            return `${path}${sep}from=quizzes&${QUERY_QUIZ_TOURNAMENT}=${encodeURIComponent(selectedTournament)}`;
        }
    }["QuizzesSection.useCallback[quizHrefWithListContext]"], [
        selectedTournament
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuizzesSection.useEffect": ()=>{
            if (loading || hasRestoredScrollRef.current) return;
            const shouldRestore = ("TURBOPACK compile-time value", "object") !== "undefined" && sessionStorage.getItem(QUIZZES_SHOULD_RESTORE_SCROLL_KEY) === "1";
            if (shouldRestore) {
                sessionStorage.removeItem(QUIZZES_SHOULD_RESTORE_SCROLL_KEY);
                restoreScrollPosition();
            }
            hasRestoredScrollRef.current = true;
        }
    }["QuizzesSection.useEffect"], [
        loading,
        restoreScrollPosition
    ]);
    const updateQuizStatus = async (quizId, quizStatus)=>{
        try {
            setStatusUpdateLoadingQuizId(quizId);
            const res = await fetch(`/api/quiz/${quizId}/update-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    quizStatus
                })
            });
            const response = await res.json();
            if (!res.ok || !response?.success) {
                throw new Error(response?.message || "Failed to update quiz status");
            }
            setQuizzes((prev)=>prev.map((quiz)=>quiz._id === quizId ? {
                        ...quiz,
                        quizStatus: quizStatus
                    } : quiz));
            setOpenStatusDropdownQuizId(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update quiz status");
        } finally{
            setStatusUpdateLoadingQuizId(null);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 297,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
            lineNumber: 296,
            columnNumber: 7
        }, this);
    }
    const navigateFromQuizzes = (href)=>{
        saveScrollPosition();
        if ("TURBOPACK compile-time truthy", 1) {
            sessionStorage.setItem(QUIZZES_SHOULD_RESTORE_SCROLL_KEY, "1");
        }
        router.push(href, {
            scroll: false
        });
    };
    const handleQuizClick = (quiz)=>{
        navigateFromQuizzes(quizHrefWithListContext(`/quiz/${quiz._id}`));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white",
                        children: "Quizzes"
                    }, void 0, false, {
                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsModalOpen(true),
                        className: "px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200",
                        children: "Create New Quiz"
                    }, void 0, false, {
                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-gray-300 mb-3",
                        children: "Select Tournament"
                    }, void 0, false, {
                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>replaceQuizzesTournamentInUrl("LIVE"),
                                className: `px-4 py-2 rounded-md font-medium transition-colors ${selectedTournament === "LIVE" ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"}`,
                                children: "Show Live Quizzes"
                            }, void 0, false, {
                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                lineNumber: 330,
                                columnNumber: 11
                            }, this),
                            tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>replaceQuizzesTournamentInUrl(tournament),
                                    className: `px-4 py-2 rounded-md font-medium transition-colors ${selectedTournament === tournament ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"}`,
                                    children: tournament
                                }, tournament, false, {
                                    fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                        lineNumber: 329,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$quiz$2f$CreateQuizModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isModalOpen,
                onClose: ()=>setIsModalOpen(false),
                onSuccess: ()=>fetchQuizzes(selectedTournament)
            }, void 0, false, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, this),
            error && quizzes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-400",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                    lineNumber: 362,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 361,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6",
                children: quizzes.map((quiz)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>handleQuizClick(quiz),
                        className: "borderborder-zinc-700 rounded-lg p-6 bg-zinc-800 hover:bg-indigo-500/10 cursor-pointer transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-bold text-white mb-1",
                                                children: quiz.quizId
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 374,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400",
                                                children: [
                                                    "Tournament: ",
                                                    quiz.tournament
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 377,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400",
                                                children: [
                                                    "Quiz Mongo ID: ",
                                                    quiz._id
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 378,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 373,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: statusUpdateLoadingQuizId === quiz._id,
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    if (quiz.quizStatus.toUpperCase() === "SETTLEMENT_DONE") {
                                                        return;
                                                    }
                                                    setOpenStatusDropdownQuizId((prev)=>prev === quiz._id ? null : quiz._id);
                                                },
                                                className: `px-3 py-1 rounded-full text-sm font-medium ${getQuizStatusBadgeClass(quiz.quizStatus)} ${quiz.quizStatus.toUpperCase() === "SETTLEMENT_DONE" ? "cursor-not-allowed opacity-80" : "cursor-pointer"} ${statusUpdateLoadingQuizId === quiz._id ? "opacity-60 cursor-wait" : ""}`,
                                                children: quiz.quizStatus
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 381,
                                                columnNumber: 19
                                            }, this),
                                            openStatusDropdownQuizId === quiz._id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute right-0 mt-2 min-w-[220px] bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-20 p-1",
                                                onClick: (e)=>e.stopPropagation(),
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$constants$2f$quiz$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUIZ_STATUS_VALUES"].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>updateQuizStatus(quiz._id, status),
                                                        className: `w-full text-left px-3 py-2 rounded text-sm ${quiz.quizStatus.toUpperCase() === status ? "bg-white text-black" : "text-zinc-200 hover:bg-zinc-800"}`,
                                                        children: status
                                                    }, status, false, {
                                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                        lineNumber: 414,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 409,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 380,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                lineNumber: 372,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 mb-4 p-4 bg-zinc-800 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg",
                                                style: {
                                                    backgroundColor: quiz.teamA.primaryColor,
                                                    color: quiz.teamA.textColor
                                                },
                                                children: quiz.teamA.abbreviation
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 435,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white",
                                                children: quiz.teamA.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 444,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 434,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 font-bold",
                                        children: "VS"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 446,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg",
                                                style: {
                                                    backgroundColor: quiz.teamB.primaryColor,
                                                    color: quiz.teamB.textColor
                                                },
                                                children: quiz.teamB.abbreviation
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 448,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white",
                                                children: quiz.teamB.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 457,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 447,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                lineNumber: 433,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 mb-1",
                                                children: "Entry Start"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 464,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white",
                                                children: new Date(quiz.entryStartTime).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 465,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 463,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 mb-1",
                                                children: "Match Start Time"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 470,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white",
                                                children: new Date(quiz.matchStartTime).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 471,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 469,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 mb-1",
                                                children: "Questions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 476,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white",
                                                children: quiz.totalQuestions || 0
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 477,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 475,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 mb-1",
                                                children: "Submissions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 480,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white",
                                                children: quiz.totalSubmission || 0
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 481,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 479,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                lineNumber: 462,
                                columnNumber: 15
                            }, this)
                        ]
                    }, quiz._id, true, {
                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                        lineNumber: 367,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 365,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
        lineNumber: 315,
        columnNumber: 5
    }, this);
}
_s(QuizzesSection, "ICY5gUFtwHj5eC8ze5L3XamWVIw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = QuizzesSection;
var _c;
__turbopack_context__.k.register(_c, "QuizzesSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/predictions/CreatePredictionModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreatePredictionModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function CreatePredictionModal({ isOpen, onClose, onSuccess }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tournaments, setTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTournament, setSelectedTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [matches, setMatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [matchesLoading, setMatchesLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tournament: "",
        matchId: ""
    });
    // Fetch tournaments
    const fetchTournaments = async ()=>{
        try {
            const res = await fetch("/api/tournament", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch tournaments");
            }
            const response = await res.json();
            const tournamentData = response.success ? response.data.data : [];
            setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
        } catch (err) {
            console.error("Error fetching tournaments:", err);
            setError(err instanceof Error ? err.message : "Failed to load tournaments");
        }
    };
    // Fetch matches for selected tournament
    const fetchMatches = async (tournament)=>{
        if (!tournament) {
            setMatches([]);
            return;
        }
        try {
            setMatchesLoading(true);
            const res = await fetch(`/api/match/${encodeURIComponent(tournament)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch matches");
            }
            const response = await res.json();
            const list = response.success && response.data ? response.data : [];
            setMatches(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error("Error fetching matches:", err);
            setError(err instanceof Error ? err.message : "Failed to load matches");
            setMatches([]);
        } finally{
            setMatchesLoading(false);
        }
    };
    // Handle tournament selection
    const handleTournamentChange = (tournament)=>{
        setSelectedTournament(tournament);
        setFormData({
            ...formData,
            tournament: tournament,
            matchId: ""
        });
        fetchMatches(tournament);
    };
    // Format match label: matchId: teamA.abbreviation vs teamB.abbreviation
    const getMatchLabel = (match)=>{
        const a = match.teamA?.abbreviation ?? "?";
        const b = match.teamB?.abbreviation ?? "?";
        return `${match.matchId}: ${a} vs ${b}`;
    };
    const handleEntryStopTimeChange = (value)=>{
        setFormData({
            ...formData
        });
    };
    // Fetch tournaments when modal opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreatePredictionModal.useEffect": ()=>{
            if (isOpen) {
                fetchTournaments();
            }
        }
    }["CreatePredictionModal.useEffect"], [
        isOpen
    ]);
    if (!isOpen) return null;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        // Validate required fields
        if (!formData.tournament) {
            setError("Please select a tournament");
            setLoading(false);
            return;
        }
        if (!formData.matchId) {
            setError("Please select a match");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch("/api/predictions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                const errorMessage = typeof errorData.message === "string" ? errorData.message : typeof errorData.error === "string" ? errorData.error : "Failed to create prediction";
                throw new Error(errorMessage);
            }
            const response = await res.json();
            if (!response.success) {
                throw new Error(response.message || "Failed to create prediction");
            }
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                tournament: "",
                matchId: ""
            });
            setSelectedTournament("");
            setMatches([]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create prediction";
            setError(errorMessage);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-gray-200 dark:border-zinc-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-black dark:text-white",
                        children: "Create New Prediction"
                    }, void 0, false, {
                        fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-6",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-800 dark:text-red-200 text-sm",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                lineNumber: 198,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                            lineNumber: 197,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Tournament *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 204,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            required: true,
                                            value: selectedTournament,
                                            onChange: (e)=>handleTournamentChange(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "-- Select a tournament --"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 17
                                                }, this),
                                                tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: tournament,
                                                        children: tournament
                                                    }, tournament, false, {
                                                        fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 207,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Match *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 222,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            required: true,
                                            value: formData.matchId,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    matchId: e.target.value
                                                }),
                                            disabled: !selectedTournament || matchesLoading,
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: matchesLoading ? "Loading matches..." : !selectedTournament ? "Select tournament first" : matches.length === 0 ? "No matches for this tournament" : "-- Select a match --"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 17
                                                }, this),
                                                matches.map((match)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: match._id,
                                                        children: getMatchLabel(match)
                                                    }, match._id, false, {
                                                        fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 225,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                            lineNumber: 202,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Creating..." : "Create Prediction"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                    lineNumber: 195,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
            lineNumber: 188,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
_s(CreatePredictionModal, "qXXrnioYgt+8RXuLmgW/cctgfDY=");
_c = CreatePredictionModal;
var _c;
__turbopack_context__.k.register(_c, "CreatePredictionModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/constants/prediction-status.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PREDICTION_STATUS_VALUES",
    ()=>PREDICTION_STATUS_VALUES
]);
const PREDICTION_STATUS_VALUES = [
    "ACTIVE",
    "LIVE",
    "FINISHED",
    "SETTLEMENT_DONE"
];
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/predictions/PredictionsSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PredictionsSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$predictions$2f$CreatePredictionModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/predictions/CreatePredictionModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$constants$2f$prediction$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/constants/prediction-status.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/buildAdminHomeHref.ts [app-client] (ecmascript)");
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
const PREDICTIONS_SCROLL_POSITION_KEY = "admin_predictions_scroll_top";
const PREDICTIONS_SHOULD_RESTORE_SCROLL_KEY = "admin_predictions_should_restore_scroll";
const QUERY_PRED_TOURNAMENT = "predTournament";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";
function resolveTournamentQueryParam(raw, tournamentList) {
    if (raw === "LIVE") return "LIVE";
    if (raw && tournamentList.includes(raw)) return raw;
    return "LIVE";
}
const getPredictionStatusBadgeClass = (status)=>{
    switch(status.toUpperCase()){
        case "ACTIVE":
            return "bg-green-900 text-green-200";
        case "LIVE":
            return "bg-blue-900 text-blue-200";
        case "UPCOMING":
            return "bg-violet-900 text-violet-200";
        case "CANCELLED":
            return "bg-red-900 text-red-200";
        case "SETTLEMENT_DONE":
            return "bg-indigo-800 text-indigo-200";
        case "NOT_VISIBLE":
            return "bg-gray-700 text-gray-200";
        case "ADMIN_VISIBLE":
            return "bg-cyan-900 text-cyan-200";
        default:
            return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
};
function PredictionsSection() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const tournamentParam = searchParams.get(QUERY_PRED_TOURNAMENT) ?? searchParams.get("tournament");
    const hasRestoredScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [predictions, setPredictions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const saveScrollPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PredictionsSection.useCallback[saveScrollPosition]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
            const scrollTop = container ? container.scrollTop : window.scrollY;
            sessionStorage.setItem(PREDICTIONS_SCROLL_POSITION_KEY, String(scrollTop));
        }
    }["PredictionsSection.useCallback[saveScrollPosition]"], []);
    const restoreScrollPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PredictionsSection.useCallback[restoreScrollPosition]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const raw = sessionStorage.getItem(PREDICTIONS_SCROLL_POSITION_KEY);
            if (!raw) return;
            const parsedScrollTop = Number(raw);
            if (!Number.isFinite(parsedScrollTop)) return;
            const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
            requestAnimationFrame({
                "PredictionsSection.useCallback[restoreScrollPosition]": ()=>{
                    if (container) {
                        container.scrollTo({
                            top: parsedScrollTop,
                            behavior: "auto"
                        });
                    } else {
                        window.scrollTo({
                            top: parsedScrollTop,
                            behavior: "auto"
                        });
                    }
                }
            }["PredictionsSection.useCallback[restoreScrollPosition]"]);
        }
    }["PredictionsSection.useCallback[restoreScrollPosition]"], []);
    const [tournaments, setTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tournamentListReady, setTournamentListReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTournament, setSelectedTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("LIVE");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [openStatusDropdownPredictionId, setOpenStatusDropdownPredictionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [statusUpdateLoadingPredictionId, setStatusUpdateLoadingPredictionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const formatDateTime = (isoString)=>{
        if (!isoString) return "—";
        try {
            return new Date(isoString).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "short",
                timeStyle: "short"
            });
        } catch  {
            return "—";
        }
    };
    const fetchTournamentsList = async ()=>{
        try {
            const res = await fetch("/api/tournament", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                return [];
            }
            const response = await res.json();
            const tournamentData = response.success ? response.data.data : [];
            return Array.isArray(tournamentData) ? tournamentData : [];
        } catch  {
            return [];
        }
    };
    const fetchPredictions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PredictionsSection.useCallback[fetchPredictions]": async (tournament)=>{
            try {
                setLoading(true);
                setError("");
                const endpoint = tournament === "LIVE" ? `/api/predictions/live-predictions` : `/api/predictions/tournament/${encodeURIComponent(tournament)}`;
                const res = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                const response = await res.json();
                if (!res.ok) {
                    const message = typeof response?.metadata?.message === "string" && response?.metadata?.message || typeof response?.error === "string" && response.error || "Failed to load predictions 1";
                    setError(message);
                    setPredictions([]);
                    return;
                }
                if (!response?.success) {
                    setError(typeof response?.message === "string" && response.message || "Failed to load predictions");
                    setPredictions([]);
                    return;
                }
                const list = Array.isArray(response.data) ? response.data : Array.isArray(response.data?.data) ? response.data.data : [];
                setPredictions(list);
            } catch (err) {
                setPredictions([]);
                setError(err instanceof Error ? err.message : "Failed to load predictions");
            } finally{
                setLoading(false);
            }
        }
    }["PredictionsSection.useCallback[fetchPredictions]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PredictionsSection.useEffect": ()=>{
            let cancelled = false;
            ({
                "PredictionsSection.useEffect": async ()=>{
                    const list = await fetchTournamentsList();
                    if (cancelled) return;
                    setTournaments(list);
                    setTournamentListReady(true);
                }
            })["PredictionsSection.useEffect"]();
            return ({
                "PredictionsSection.useEffect": ()=>{
                    cancelled = true;
                }
            })["PredictionsSection.useEffect"];
        }
    }["PredictionsSection.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PredictionsSection.useEffect": ()=>{
            if (!tournamentListReady) return;
            let cancelled = false;
            ({
                "PredictionsSection.useEffect": async ()=>{
                    const resolved = resolveTournamentQueryParam(tournamentParam, tournaments);
                    const sp = new URLSearchParams(searchParams.toString());
                    sp.set("section", "predictions");
                    const needsNormalize = searchParams.get("section") !== "predictions" || searchParams.get(QUERY_PRED_TOURNAMENT) !== resolved || searchParams.get("tournament") != null || searchParams.get("from") != null || searchParams.get("quizTournament") != null;
                    if (needsNormalize) {
                        sp.set(QUERY_PRED_TOURNAMENT, resolved);
                        sp.delete("tournament");
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripAdminHomeQueryNoise"])("predictions", sp);
                        router.replace(`/?${sp.toString()}`, {
                            scroll: false
                        });
                    }
                    if (cancelled) return;
                    setSelectedTournament(resolved);
                    await fetchPredictions(resolved);
                }
            })["PredictionsSection.useEffect"]();
            return ({
                "PredictionsSection.useEffect": ()=>{
                    cancelled = true;
                }
            })["PredictionsSection.useEffect"];
        }
    }["PredictionsSection.useEffect"], [
        tournamentListReady,
        tournamentParam,
        tournaments,
        fetchPredictions,
        router,
        searchParams
    ]);
    const replacePredictionsTournamentInUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PredictionsSection.useCallback[replacePredictionsTournamentInUrl]": (tournament)=>{
            const sp = new URLSearchParams(searchParams.toString());
            sp.set("section", "predictions");
            sp.set(QUERY_PRED_TOURNAMENT, tournament);
            sp.delete("tournament");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripAdminHomeQueryNoise"])("predictions", sp);
            router.replace(`/?${sp.toString()}`, {
                scroll: false
            });
        }
    }["PredictionsSection.useCallback[replacePredictionsTournamentInUrl]"], [
        router,
        searchParams
    ]);
    const predictionHrefWithListContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PredictionsSection.useCallback[predictionHrefWithListContext]": (path)=>{
            const sep = path.includes("?") ? "&" : "?";
            return `${path}${sep}from=predictions&${QUERY_PRED_TOURNAMENT}=${encodeURIComponent(selectedTournament)}`;
        }
    }["PredictionsSection.useCallback[predictionHrefWithListContext]"], [
        selectedTournament
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PredictionsSection.useEffect": ()=>{
            if (loading || hasRestoredScrollRef.current) return;
            const shouldRestore = ("TURBOPACK compile-time value", "object") !== "undefined" && sessionStorage.getItem(PREDICTIONS_SHOULD_RESTORE_SCROLL_KEY) === "1";
            if (shouldRestore) {
                sessionStorage.removeItem(PREDICTIONS_SHOULD_RESTORE_SCROLL_KEY);
                restoreScrollPosition();
            }
            hasRestoredScrollRef.current = true;
        }
    }["PredictionsSection.useEffect"], [
        loading,
        restoreScrollPosition
    ]);
    const handlePredictionClick = (predictionId)=>{
        saveScrollPosition();
        if ("TURBOPACK compile-time truthy", 1) {
            sessionStorage.setItem(PREDICTIONS_SHOULD_RESTORE_SCROLL_KEY, "1");
        }
        router.push(predictionHrefWithListContext(`/prediction/${predictionId}`), {
            scroll: false
        });
    };
    const updatePredictionStatus = async (predictionId, predictionStatus)=>{
        try {
            setStatusUpdateLoadingPredictionId(predictionId);
            const res = await fetch(`/api/predictions/${predictionId}/update-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    predictionStatus
                })
            });
            const response = await res.json();
            if (!res.ok || !response?.success) {
                throw new Error(response?.message || "Failed to update prediction status");
            }
            setPredictions((prev)=>prev.map((prediction)=>prediction._id === predictionId ? {
                        ...prediction,
                        predictionStatus
                    } : prediction));
            setOpenStatusDropdownPredictionId(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update prediction status");
        } finally{
            setStatusUpdateLoadingPredictionId(null);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 328,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
            lineNumber: 327,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white",
                        children: "Predictions"
                    }, void 0, false, {
                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                        lineNumber: 336,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsModalOpen(true),
                        className: "px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200",
                        children: "Create New Prediction"
                    }, void 0, false, {
                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 335,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-gray-300 mb-3",
                        children: "Select Tournament"
                    }, void 0, false, {
                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>replacePredictionsTournamentInUrl("LIVE"),
                                className: `px-4 py-2 rounded-md font-medium transition-colors ${selectedTournament === "LIVE" ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"}`,
                                children: "Show Live Predictions"
                            }, void 0, false, {
                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                lineNumber: 350,
                                columnNumber: 11
                            }, this),
                            tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>replacePredictionsTournamentInUrl(tournament),
                                    className: `px-4 py-2 rounded-md font-medium transition-colors ${selectedTournament === tournament ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"}`,
                                    children: tournament
                                }, tournament, false, {
                                    fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                    lineNumber: 361,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 345,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$predictions$2f$CreatePredictionModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isModalOpen,
                onClose: ()=>setIsModalOpen(false),
                onSuccess: ()=>fetchPredictions(selectedTournament)
            }, void 0, false, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 376,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-500 dark:text-red-400",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                    lineNumber: 383,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 382,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6",
                children: predictions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 dark:text-gray-400",
                    children: "No predictions found."
                }, void 0, false, {
                    fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                    lineNumber: 388,
                    columnNumber: 13
                }, this) : predictions.map((prediction)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-gray-200 dark:border-zinc-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>handlePredictionClick(prediction._id),
                                        className: "flex-1 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-bold text-black dark:text-white mb-1",
                                                children: prediction.predictionId
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 402,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-600 dark:text-gray-400",
                                                children: [
                                                    "Tournament: ",
                                                    prediction.tournament
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 405,
                                                columnNumber: 21
                                            }, this),
                                            prediction.matchStartTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 dark:text-gray-500 mt-0.5",
                                                children: [
                                                    "Match start: ",
                                                    formatDateTime(prediction.matchStartTime)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 409,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 398,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: statusUpdateLoadingPredictionId === prediction._id,
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    if (prediction.predictionStatus.toUpperCase() === "SETTLEMENT_DONE") {
                                                        return;
                                                    }
                                                    setOpenStatusDropdownPredictionId((prev)=>prev === prediction._id ? null : prediction._id);
                                                },
                                                className: `px-3 py-1 rounded-full text-sm font-medium ${getPredictionStatusBadgeClass(prediction.predictionStatus)} ${prediction.predictionStatus.toUpperCase() === "SETTLEMENT_DONE" ? "cursor-not-allowed opacity-80" : "cursor-pointer"} ${statusUpdateLoadingPredictionId === prediction._id ? "opacity-60 cursor-wait" : ""}`,
                                                children: prediction.predictionStatus
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 415,
                                                columnNumber: 21
                                            }, this),
                                            openStatusDropdownPredictionId === prediction._id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute right-0 mt-2 min-w-[220px] bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-20 p-1",
                                                onClick: (e)=>e.stopPropagation(),
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$constants$2f$prediction$2d$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PREDICTION_STATUS_VALUES"].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>updatePredictionStatus(prediction._id, status),
                                                        className: `w-full text-left px-3 py-2 rounded text-sm ${prediction.predictionStatus.toUpperCase() === status ? "bg-white text-black" : "text-zinc-200 hover:bg-zinc-800"}`,
                                                        children: status
                                                    }, status, false, {
                                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                        lineNumber: 454,
                                                        columnNumber: 27
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 449,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 414,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                lineNumber: 397,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 mb-4 p-4 bg-zinc-800 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg",
                                                style: {
                                                    backgroundColor: prediction.teamA.primaryColor,
                                                    color: prediction.teamA.textColor
                                                },
                                                children: prediction.teamA.abbreviation
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 478,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white",
                                                children: prediction.teamA.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 487,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 477,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 font-bold",
                                        children: "VS"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 491,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg",
                                                style: {
                                                    backgroundColor: prediction.teamB.primaryColor,
                                                    color: prediction.teamB.textColor
                                                },
                                                children: prediction.teamB.abbreviation
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 493,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white",
                                                children: prediction.teamB.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 502,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 492,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                lineNumber: 476,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>handlePredictionClick(prediction._id),
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                                children: "Total Coins"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 514,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-bold text-black dark:text-white",
                                                children: (prediction.totalCoins - (prediction.initialCoinsOnTeamA ?? 0) - (prediction.initialCoinsOnTeamB ?? 0) - (prediction.initialCoinsOnDraw ?? 0)).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 517,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 513,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                                children: "Team A Coins"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 527,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-bold text-blue-600 dark:text-blue-400",
                                                children: (prediction.coinsOnTeamA - (prediction.initialCoinsOnTeamA ?? 0)).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 530,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 526,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                                children: "Team B Coins"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 538,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-bold text-purple-600 dark:text-purple-400",
                                                children: (prediction.coinsOnTeamB - (prediction.initialCoinsOnTeamB ?? 0)).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 541,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 537,
                                        columnNumber: 19
                                    }, this),
                                    prediction.oddsDraw !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                                children: "Draw Coins"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 550,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-bold text-amber-600 dark:text-amber-400",
                                                children: (prediction.coinsOnDraw - (prediction.initialCoinsOnDraw ?? 0)).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 553,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 549,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                lineNumber: 509,
                                columnNumber: 17
                            }, this)
                        ]
                    }, prediction._id, true, {
                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                        lineNumber: 393,
                        columnNumber: 15
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 386,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
        lineNumber: 334,
        columnNumber: 5
    }, this);
}
_s(PredictionsSection, "4VG5H5H9pP4G/hTJTO5W20n1Kcc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = PredictionsSection;
var _c;
__turbopack_context__.k.register(_c, "PredictionsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/leaderboard/LeaderboardSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeaderboardSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function LeaderboardSection() {
    _s();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [leaderboardLoading, setLeaderboardLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [leaderboardError, setLeaderboardError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tournaments, setTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTournament, setSelectedTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const fetchTournaments = async ()=>{
        try {
            setLoading(true);
            const res = await fetch("/api/tournament", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch tournaments");
            }
            const response = await res.json();
            // Handle the response structure from successResponse helper
            const tournamentData = response.success ? response.data.data : [];
            setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tournaments");
        } finally{
            setLoading(false);
        }
    };
    const fetchLeaderboard = async (tournament)=>{
        if (!tournament) {
            setUsers([]);
            return;
        }
        try {
            setLeaderboardLoading(true);
            setLeaderboardError("");
            const res = await fetch(`/api/leaderboard/${encodeURIComponent(tournament)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch leaderboard");
            }
            const response = await res.json();
            const data = response?.data?.data?.leaderboard ?? response?.data ?? [];
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setLeaderboardError(err instanceof Error ? err.message : "Failed to load leaderboard");
            setUsers([]);
        } finally{
            setLeaderboardLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeaderboardSection.useEffect": ()=>{
            fetchTournaments();
        }
    }["LeaderboardSection.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeaderboardSection.useEffect": ()=>{
            if (selectedTournament) {
                fetchLeaderboard(selectedTournament);
            } else {
                setUsers([]);
                setLeaderboardError("");
            }
        }
    }["LeaderboardSection.useEffect"], [
        selectedTournament
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
            lineNumber: 100,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-500 dark:text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-6 text-black dark:text-white",
                children: "Leaderboard"
            }, void 0, false, {
                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-gray-300 mb-3",
                        children: "Select Tournament"
                    }, void 0, false, {
                        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedTournament(tournament),
                                className: `px-4 py-2 rounded-md font-medium transition-colors ${selectedTournament === tournament ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"}`,
                                children: tournament
                            }, tournament, false, {
                                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            selectedTournament && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-semibold mb-4 text-white",
                        children: [
                            "Leaderboard for ",
                            selectedTournament
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this),
                    leaderboardLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                            color: "#5CDFFF",
                            size: "medium",
                            text: "",
                            textColor: ""
                        }, void 0, false, {
                            fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                            lineNumber: 149,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                        lineNumber: 148,
                        columnNumber: 13
                    }, this) : leaderboardError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-red-900/20 border border-red-800 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-400",
                            children: leaderboardError
                        }, void 0, false, {
                            fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                            lineNumber: 153,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                        lineNumber: 152,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "min-w-full divide-y divide-gray-200 dark:divide-zinc-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-gray-50 dark:bg-zinc-800",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Sl. no."
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                lineNumber: 160,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Rank"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                lineNumber: 163,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Username"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                lineNumber: 166,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Email"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                lineNumber: 169,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Tournament XP"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                lineNumber: 172,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Total XP"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                lineNumber: 175,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                        lineNumber: 159,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                    lineNumber: 158,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700",
                                    children: Array.isArray(users) && users.length > 0 ? users.map((user, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: `hover:bg-gray-50 dark:hover:bg-zinc-800 ${index === 0 ? "bg-yellow-50 dark:bg-yellow-900/20" : index === 1 ? "bg-gray-50 dark:bg-gray-800/50" : index === 2 ? "bg-orange-50 dark:bg-orange-900/20" : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white",
                                                    children: index + 1
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                    lineNumber: 195,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? "bg-yellow-400 text-yellow-900" : index === 1 ? "bg-gray-300 text-gray-700" : index === 2 ? "bg-orange-400 text-orange-900" : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"}`,
                                                        children: user.rank
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                        lineNumber: 199,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white",
                                                    children: user.userName
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                                    children: user.email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white",
                                                    children: user.tournamentXP?.toLocaleString() || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white",
                                                    children: user.totalXP?.toLocaleString() || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                                    lineNumber: 222,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, user._id, true, {
                                            fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                            lineNumber: 183,
                                            columnNumber: 23
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 5,
                                            className: "px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400",
                                            children: "No leaderboard data available"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                            lineNumber: 229,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                        lineNumber: 228,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                                    lineNumber: 180,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                            lineNumber: 157,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                        lineNumber: 156,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/leaderboard/LeaderboardSection.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_s(LeaderboardSection, "Y6kTObybWF8mG9ftjkLsFXEFpVY=");
_c = LeaderboardSection;
var _c;
__turbopack_context__.k.register(_c, "LeaderboardSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/teams/CreateTeamModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateTeamModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function CreateTeamModal({ isOpen, onClose, onSuccess, tournaments }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        abbreviation: "",
        tournamentType: "",
        description: "",
        primaryColor: "",
        secondaryColor: "",
        textColor: "",
        displayName: ""
    });
    if (!isOpen) return null;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        // Validate required fields
        if (!formData.name || !formData.abbreviation || !formData.tournamentType || !formData.primaryColor || !formData.secondaryColor || !formData.textColor || !formData.displayName) {
            setError("Please fill in all required fields");
            setLoading(false);
            return;
        }
        try {
            // Prepare payload - include optional fields if they have values
            const payload = {
                name: formData.name,
                abbreviation: formData.abbreviation,
                tournamentType: formData.tournamentType,
                primaryColor: formData.primaryColor,
                secondaryColor: formData.secondaryColor,
                textColor: formData.textColor,
                displayName: formData.displayName
            };
            // Add optional fields only if they have values
            if (formData.description?.trim()) {
                payload.description = formData.description.trim();
            }
            const res = await fetch("/api/tournament/teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to create team");
            }
            const response = await res.json();
            if (!response.success) {
                throw new Error(response.message || "Failed to create team");
            }
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                name: "",
                abbreviation: "",
                tournamentType: "",
                description: "",
                primaryColor: "",
                secondaryColor: "",
                textColor: "",
                displayName: ""
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create team");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-zinc-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white",
                        children: "Create New Team"
                    }, void 0, false, {
                        fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                        lineNumber: 115,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-6",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-400 text-sm",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                lineNumber: 121,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 120,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Team Name *"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    required: true,
                                    value: formData.name,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            name: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    placeholder: "e.g., Barcelona"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Team Display Name *"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    required: true,
                                    value: formData.displayName,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            displayName: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    placeholder: "e.g., Barca"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Abbreviation *"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    required: true,
                                    value: formData.abbreviation,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            abbreviation: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    placeholder: "e.g., barca",
                                    maxLength: 10
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Tournament *"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 178,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    required: true,
                                    value: formData.tournamentType,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            tournamentType: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "-- Select a tournament --"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 189,
                                            columnNumber: 15
                                        }, this),
                                        tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: tournament,
                                                children: tournament
                                            }, tournament, false, {
                                                fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Primary Color *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 200,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "color",
                                            value: formData.primaryColor || "#000000",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    primaryColor: e.target.value
                                                }),
                                            className: "w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 203,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Secondary Color *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "color",
                                            value: formData.secondaryColor || "#000000",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    secondaryColor: e.target.value
                                                }),
                                            className: "w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 219,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 215,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Text Color *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 232,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "color",
                                            value: formData.textColor || "#000000",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    textColor: e.target.value
                                                }),
                                            className: "w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 235,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 198,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 border-t border-zinc-800 pt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-white mb-4",
                                    children: "Optional Team Details"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 251,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Description"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 256,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: formData.description || "",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    description: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                            placeholder: "Team description...",
                                            rows: 3
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 259,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 255,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 250,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 pt-4 border-t border-zinc-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Creating..." : "Create Team"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 279,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                    lineNumber: 118,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
            lineNumber: 113,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
_s(CreateTeamModal, "yfqt5aXGpL0cSm8sdjb/IVgtRgo=");
_c = CreateTeamModal;
var _c;
__turbopack_context__.k.register(_c, "CreateTeamModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/teams/CreateTournamentModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateTournamentModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const initialFormData = {
    tournament: "",
    tournamentName: "",
    tournamentYear: ""
};
function CreateTournamentModal({ isOpen, onClose, onSuccess }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFormData);
    if (!isOpen) return null;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        if (!formData.tournament?.trim() || !formData.tournamentName?.trim() || !formData.tournamentYear?.trim()) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch("/api/tournament", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    tournament: formData.tournament.trim(),
                    tournamentName: formData.tournamentName.trim(),
                    tournamentYear: formData.tournamentYear.trim()
                })
            });
            const response = await res.json();
            if (!res.ok || !response.success) {
                throw new Error(response.message || "Failed to create tournament");
            }
            onSuccess();
            onClose();
            setFormData(initialFormData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create tournament");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-zinc-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white",
                        children: "Create New Tournament"
                    }, void 0, false, {
                        fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                        lineNumber: 79,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-6",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-400 text-sm",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                                lineNumber: 87,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                            lineNumber: 86,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Tournament Abbreviation *"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    required: true,
                                    value: formData.tournament,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            tournament: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    placeholder: "e.g., IPL-2026"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Tournament Name *"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    required: true,
                                    value: formData.tournamentName,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            tournamentName: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    placeholder: "e.g., Indian Premier League"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Tournament Year *"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    required: true,
                                    value: formData.tournamentYear,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            tournamentYear: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    placeholder: "e.g., 2026"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                            lineNumber: 123,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 pt-4 border-t border-zinc-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Creating..." : "Create Tournament"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/teams/CreateTournamentModal.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(CreateTournamentModal, "hA0a+oOBXClxa/HUJuFxIwOy+OE=");
_c = CreateTournamentModal;
var _c;
__turbopack_context__.k.register(_c, "CreateTournamentModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/teams/EditTeamModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditTeamModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function EditTeamModal({ isOpen, onClose, onSuccess, team }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        abbreviation: "",
        description: "",
        primaryColor: "",
        secondaryColor: "",
        textColor: "",
        displayName: ""
    });
    // Initialize form data when team changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditTeamModal.useEffect": ()=>{
            if (team) {
                setFormData({
                    name: team.name || "",
                    abbreviation: team.abbreviation || "",
                    description: team.description || "",
                    primaryColor: team.primaryColor || "",
                    secondaryColor: team.secondaryColor || "",
                    textColor: team.textColor || "",
                    displayName: team.displayName || ""
                });
            }
        }
    }["EditTeamModal.useEffect"], [
        team
    ]);
    if (!isOpen || !team) return null;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        // Prepare payload with only changed fields
        const payload = {};
        if (formData.name && formData.name !== team.name) {
            payload.name = formData.name;
        }
        if (formData.abbreviation && formData.abbreviation !== team.abbreviation) {
            payload.abbreviation = formData.abbreviation;
        }
        if (formData.description?.trim()) {
            payload.description = formData.description.trim();
        }
        if (formData.primaryColor?.trim()) {
            payload.primaryColor = formData.primaryColor.trim();
        }
        if (formData.secondaryColor?.trim()) {
            payload.secondaryColor = formData.secondaryColor.trim();
        }
        if (formData.textColor?.trim()) {
            payload.textColor = formData.textColor.trim();
        }
        if (formData.displayName) {
            payload.displayName = formData.displayName;
        }
        // Check if there are any changes
        if (Object.keys(payload).length === 0) {
            setError("No changes made");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/tournament/teams/${team._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to update team");
            }
            const response = await res.json();
            if (!response.success) {
                throw new Error(response.message || "Failed to update team");
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update team");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-zinc-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white",
                            children: "Edit Team"
                        }, void 0, false, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-400 mt-1",
                            children: [
                                team.name,
                                " - ",
                                team.tournament
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-400 mt-1",
                            children: [
                                "Mongo ID: ",
                                team._id
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-6",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-400 text-sm",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                lineNumber: 139,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 138,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Team Name"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: formData.name,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            name: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    placeholder: "e.g., Barcelona"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Team Display Name"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: formData.displayName,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            displayName: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    placeholder: "e.g., Barcelona"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium text-gray-300 mb-2",
                                    children: "Abbreviation"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 174,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: formData.abbreviation,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            abbreviation: e.target.value
                                        }),
                                    className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                    placeholder: "e.g., barca",
                                    maxLength: 10
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Primary Color"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                            lineNumber: 194,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "color",
                                            value: formData.primaryColor || "#000000",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    primaryColor: e.target.value
                                                }),
                                            className: "w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                            lineNumber: 197,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Secondary Color"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                            lineNumber: 210,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "color",
                                            value: formData.secondaryColor || "#000000",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    secondaryColor: e.target.value
                                                }),
                                            className: "w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                            lineNumber: 213,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 209,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Text Color"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                            lineNumber: 226,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "color",
                                            value: formData.textColor || "#000000",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    textColor: e.target.value
                                                }),
                                            className: "w-full h-10 border border-zinc-600 rounded-md cursor-pointer"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                            lineNumber: 229,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 border-t border-zinc-800 pt-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-white mb-4",
                                    children: "Optional Team Details"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Description"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                            lineNumber: 250,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: formData.description || "",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    description: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white",
                                            placeholder: "Team description...",
                                            rows: 3
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                            lineNumber: 253,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 pt-4 border-t border-zinc-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 border border-zinc-600 rounded-md text-white hover:bg-zinc-800",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Updating..." : "Update Team"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                                    lineNumber: 273,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/teams/EditTeamModal.tsx",
                    lineNumber: 136,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/teams/EditTeamModal.tsx",
            lineNumber: 127,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/teams/EditTeamModal.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_s(EditTeamModal, "pwfPhKPAEYBP7TEK/8+17LXZBd0=");
_c = EditTeamModal;
var _c;
__turbopack_context__.k.register(_c, "EditTeamModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/teams/TeamsSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$CreateTeamModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/teams/CreateTeamModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$CreateTournamentModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/teams/CreateTournamentModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$EditTeamModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/teams/EditTeamModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const DEFAULT_TEAM_PRIMARY_COLOR = "#1f2937";
const DEFAULT_TEAM_SECONDARY_COLOR = "#64748b";
const DEFAULT_TEAM_TEXT_COLOR = "#f8fafc";
function TeamsSection() {
    _s();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tournaments, setTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTournament, setSelectedTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [teams, setTeams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [teamsLoading, setTeamsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [teamsError, setTeamsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isCreateModalOpen, setIsCreateModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEditModalOpen, setIsEditModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTeam, setSelectedTeam] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchTournaments = async ()=>{
        try {
            setLoading(true);
            const res = await fetch("/api/tournament", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch tournaments");
            }
            const response = await res.json();
            // Handle the response structure from successResponse helper
            const tournamentData = response.success ? response.data.data : [];
            setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tournaments");
        } finally{
            setLoading(false);
        }
    };
    const fetchTeams = async (tournament)=>{
        if (!tournament) {
            setTeams([]);
            return;
        }
        try {
            setTeamsLoading(true);
            setTeamsError("");
            const res = await fetch(`/api/tournament/teams?tournament=${encodeURIComponent(tournament)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch teams");
            }
            const response = await res.json();
            const teamsData = response.success && response.data ? response.data : [];
            setTeams(Array.isArray(teamsData) ? teamsData : []);
            setTeamsError("");
        } catch (err) {
            setTeamsError(err instanceof Error ? err.message : "Failed to load teams");
            setTeams([]);
        } finally{
            setTeamsLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TeamsSection.useEffect": ()=>{
            fetchTournaments();
        }
    }["TeamsSection.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TeamsSection.useEffect": ()=>{
            if (selectedTournament) {
                fetchTeams(selectedTournament);
            } else {
                setTeams([]);
                setTeamsError("");
            }
        }
    }["TeamsSection.useEffect"], [
        selectedTournament
    ]);
    const handleTeamCreated = ()=>{
        // Refresh teams list if a tournament is selected
        if (selectedTournament) {
            fetchTeams(selectedTournament);
        }
    };
    const handleTeamUpdated = ()=>{
        // Refresh teams list if a tournament is selected
        if (selectedTournament) {
            fetchTeams(selectedTournament);
        }
    };
    const handleTeamClick = (team)=>{
        setSelectedTeam(team);
        setIsEditModalOpen(true);
    };
    const getTeamAbbreviation = (team)=>(team.abbreviation || team.name || "").slice(0, 4).toUpperCase();
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-[calc(100dvh-4rem)] items-center justify-center md:min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                lineNumber: 137,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/teams/TeamsSection.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/teams/TeamsSection.tsx",
            lineNumber: 144,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white",
                        children: "Teams"
                    }, void 0, false, {
                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsCreateTournamentModalOpen(true),
                                className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 font-medium",
                                children: "Create New Tournament"
                            }, void 0, false, {
                                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsCreateModalOpen(true),
                                className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 font-medium",
                                children: "Create New Team"
                            }, void 0, false, {
                                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-gray-300 mb-3",
                        children: "Select Tournament"
                    }, void 0, false, {
                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedTournament(tournament),
                                className: `px-4 py-2 rounded-md font-medium transition-colors ${selectedTournament === tournament ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"}`,
                                children: tournament
                            }, tournament, false, {
                                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            selectedTournament && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-semibold mb-4 text-white",
                        children: [
                            "Teams for ",
                            selectedTournament
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this),
                    teamsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-h-[calc(90dvh-4rem)] items-center justify-center md:min-h-screen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                            color: "#5CDFFF",
                            size: "medium",
                            text: "",
                            textColor: ""
                        }, void 0, false, {
                            fileName: "[project]/app/components/teams/TeamsSection.tsx",
                            lineNumber: 199,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                        lineNumber: 198,
                        columnNumber: 13
                    }, this) : teamsError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-red-900/20 border border-red-800 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-400",
                            children: teamsError
                        }, void 0, false, {
                            fileName: "[project]/app/components/teams/TeamsSection.tsx",
                            lineNumber: 203,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                        lineNumber: 202,
                        columnNumber: 13
                    }, this) : teams.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-zinc-800 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "No teams found for this tournament"
                        }, void 0, false, {
                            fileName: "[project]/app/components/teams/TeamsSection.tsx",
                            lineNumber: 207,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                        lineNumber: 206,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full border-collapse border border-zinc-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "bg-zinc-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Logo"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                                lineNumber: 216,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Name"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                                lineNumber: 219,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Abbreviation"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                                lineNumber: 222,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Display Name"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                                lineNumber: 225,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                        lineNumber: 215,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                    lineNumber: 214,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: teams.map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            onClick: ()=>handleTeamClick(team),
                                            className: "hover:bg-zinc-800/50 transition-colors cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 flex items-center justify-center rounded-sm border-b-4 font-semibold text-sm",
                                                        style: {
                                                            backgroundColor: team.primaryColor || DEFAULT_TEAM_PRIMARY_COLOR,
                                                            borderBottomColor: team.secondaryColor || DEFAULT_TEAM_SECONDARY_COLOR,
                                                            color: team.textColor || DEFAULT_TEAM_TEXT_COLOR
                                                        },
                                                        children: getTeamAbbreviation(team)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 text-gray-300",
                                                    children: team.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 text-gray-300 uppercase",
                                                    children: team.abbreviation
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 text-gray-300",
                                                    children: team.displayName
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                                    lineNumber: 258,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, team._id, true, {
                                            fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                            lineNumber: 232,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/TeamsSection.tsx",
                                    lineNumber: 230,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/TeamsSection.tsx",
                            lineNumber: 213,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/teams/TeamsSection.tsx",
                        lineNumber: 212,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                lineNumber: 192,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$CreateTeamModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isCreateModalOpen,
                onClose: ()=>setIsCreateModalOpen(false),
                onSuccess: handleTeamCreated,
                tournaments: tournaments
            }, void 0, false, {
                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$CreateTournamentModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isCreateTournamentModalOpen,
                onClose: ()=>setIsCreateTournamentModalOpen(false),
                onSuccess: fetchTournaments
            }, void 0, false, {
                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$EditTeamModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isEditModalOpen,
                onClose: ()=>{
                    setIsEditModalOpen(false);
                    setSelectedTeam(null);
                },
                onSuccess: handleTeamUpdated,
                team: selectedTeam
            }, void 0, false, {
                fileName: "[project]/app/components/teams/TeamsSection.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/teams/TeamsSection.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_s(TeamsSection, "H7WS78GW0vfUuQ19+QWhD7x7tws=");
_c = TeamsSection;
const __TURBOPACK__default__export__ = TeamsSection;
var _c;
__turbopack_context__.k.register(_c, "TeamsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/matches/CreateMatchesModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateMatchesModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const GAME_TYPE_OPTIONS = [
    "cricket",
    "football"
];
function CreateMatchesModal({ isOpen, onClose, onSuccess }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tournaments, setTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedTournament, setSelectedTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [teams, setTeams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [teamsLoading, setTeamsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tournament: "",
        teamA: "",
        teamB: "",
        tag: "",
        matchStartTime: "",
        gameType: ""
    });
    const fetchTournaments = async ()=>{
        try {
            const res = await fetch("/api/tournament", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch tournaments");
            }
            const response = await res.json();
            const tournamentData = response.success ? response.data.data : [];
            setTournaments(Array.isArray(tournamentData) ? tournamentData : []);
        } catch (err) {
            console.error("Error fetching tournaments:", err);
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
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch teams");
            }
            const response = await res.json();
            const teamsData = response.success && response.data ? response.data : [];
            setTeams(Array.isArray(teamsData) ? teamsData : []);
        } catch (err) {
            console.error("Error fetching teams:", err);
            setError(err instanceof Error ? err.message : "Failed to load teams");
            setTeams([]);
        } finally{
            setTeamsLoading(false);
        }
    };
    const handleTournamentChange = (tournament)=>{
        setSelectedTournament(tournament);
        setFormData({
            ...formData,
            tournament: tournament,
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
        "CreateMatchesModal.useEffect": ()=>{
            if (isOpen) {
                fetchTournaments();
            }
        }
    }["CreateMatchesModal.useEffect"], [
        isOpen
    ]);
    if (!isOpen) return null;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        if (!formData.tournament) {
            setError("Please select a tournament");
            setLoading(false);
            return;
        }
        if (!formData.teamA || !formData.teamB) {
            setError("Please select both Team A and Team B");
            setLoading(false);
            return;
        }
        if (formData.teamA === formData.teamB) {
            setError("Team A and Team B must be different");
            setLoading(false);
            return;
        }
        if (!formData.gameType) {
            setError("Please select game type");
            setLoading(false);
            return;
        }
        try {
            const payload = {
                tournament: formData.tournament,
                teamA: formData.teamA,
                teamB: formData.teamB,
                tag: formData.tag ?? "",
                gameType: formData.gameType
            };
            if (formData.matchStartTime) {
                payload.matchStartTime = new Date(formData.matchStartTime).toISOString();
            }
            const res = await fetch("/api/match", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                const errorMessage = typeof errorData.message === "string" ? errorData.message : typeof errorData.error === "string" ? errorData.error : "Failed to create match";
                throw new Error(errorMessage);
            }
            const response = await res.json();
            if (!response.success) {
                throw new Error(response.message || "Failed to create match");
            }
            onSuccess();
            onClose();
            setFormData({
                tournament: "",
                teamA: "",
                teamB: "",
                tag: "",
                matchStartTime: "",
                gameType: ""
            });
            setSelectedTournament("");
            setTeams([]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create match");
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-gray-200 dark:border-zinc-800",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-black dark:text-white",
                        children: "Create New Match"
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                    lineNumber: 222,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "p-6",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-800 dark:text-red-200 text-sm",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                lineNumber: 231,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Tournament *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 237,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            required: true,
                                            value: selectedTournament,
                                            onChange: (e)=>handleTournamentChange(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "-- Select a tournament --"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 17
                                                }, this),
                                                tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: tournament,
                                                        children: tournament
                                                    }, tournament, false, {
                                                        fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                                        lineNumber: 248,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 240,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                    lineNumber: 236,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Team A *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 255,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            required: true,
                                            value: formData.teamA,
                                            onChange: (e)=>handleTeamAChange(e.target.value),
                                            disabled: !selectedTournament || teamsLoading,
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: teamsLoading ? "Loading teams..." : !selectedTournament ? "Select tournament first" : "-- Select Team A --"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 17
                                                }, this),
                                                teams.filter((team)=>team._id !== formData.teamB).map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: team._id,
                                                        children: [
                                                            team.name,
                                                            " (",
                                                            team.abbreviation,
                                                            ")"
                                                        ]
                                                    }, team._id, true, {
                                                        fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Team B *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 282,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            required: true,
                                            value: formData.teamB,
                                            onChange: (e)=>handleTeamBChange(e.target.value),
                                            disabled: !selectedTournament || teamsLoading,
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: teamsLoading ? "Loading teams..." : !selectedTournament ? "Select tournament first" : "-- Select Team B --"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                                    lineNumber: 292,
                                                    columnNumber: 17
                                                }, this),
                                                teams.filter((team)=>team._id !== formData.teamA).map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: team._id,
                                                        children: [
                                                            team.name,
                                                            " (",
                                                            team.abbreviation,
                                                            ")"
                                                        ]
                                                    }, team._id, true, {
                                                        fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                                        lineNumber: 302,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 285,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                    lineNumber: 281,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Match start time *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 309,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "datetime-local",
                                            value: formData.matchStartTime ?? "",
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    matchStartTime: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 312,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                    lineNumber: 308,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Game Type *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 322,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            required: true,
                                            value: formData.gameType,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    gameType: e.target.value
                                                }),
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "-- Select game type --"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                                    lineNumber: 336,
                                                    columnNumber: 17
                                                }, this),
                                                GAME_TYPE_OPTIONS.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: type,
                                                        children: type.charAt(0).toUpperCase() + type.slice(1)
                                                    }, type, false, {
                                                        fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                                        lineNumber: 338,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 325,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                    lineNumber: 321,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: [
                                                "Tag",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-500 font-normal",
                                                    children: "(optional)"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 345,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.tag,
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    tag: e.target.value
                                                }),
                                            placeholder: "e.g. M1, Match 1",
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                            lineNumber: 349,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                    lineNumber: 344,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                            lineNumber: 235,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: onClose,
                                    className: "px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-md text-black dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Creating..." : "Create Match"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
                    lineNumber: 228,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
            lineNumber: 221,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/matches/CreateMatchesModal.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, this);
}
_s(CreateMatchesModal, "1SoNJ5POLRPCV/7q+XIGhJIAmSE=");
_c = CreateMatchesModal;
var _c;
__turbopack_context__.k.register(_c, "CreateMatchesModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/matches/MatchesSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$matches$2f$CreateMatchesModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/matches/CreateMatchesModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-loading-indicators/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/buildAdminHomeHref.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const MATCHES_SCROLL_POSITION_KEY = "admin_matches_scroll_top";
const MATCHES_SHOULD_RESTORE_SCROLL_KEY = "admin_matches_should_restore_scroll";
const QUERY_MATCH_TOURNAMENT = "matchTournament";
const MAIN_SCROLL_CONTAINER_ID = "app-main-scroll-container";
function resolveTournamentQueryParam(raw, tournamentList) {
    if (raw === "LIVE") return "LIVE";
    if (raw && tournamentList.includes(raw)) return raw;
    return "LIVE";
}
function MatchIdWithCopy({ id, onQuizClick }) {
    _s();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleCopy = async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(id);
            setCopied(true);
            window.setTimeout(()=>setCopied(false), 1500);
        } catch  {
            setCopied(false);
        }
    };
    const idEl = onQuizClick ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: (e)=>{
            e.stopPropagation();
            onQuizClick();
        },
        className: "cursor-pointer text-left font-mono text-xs break-all text-sky-300 hover:text-sky-200 hover:underline",
        title: "Open quiz details",
        children: id
    }, void 0, false, {
        fileName: "[project]/app/components/matches/MatchesSection.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "font-mono text-xs text-gray-300 break-all",
        children: id
    }, void 0, false, {
        fileName: "[project]/app/components/matches/MatchesSection.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-0.5",
        children: [
            idEl,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: handleCopy,
                    className: "rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white",
                    "aria-label": `Copy id ${id}`,
                    title: "Copy to clipboard",
                    children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-3.5 w-3.5 text-emerald-400",
                        strokeWidth: 2
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 74,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                        className: "h-3.5 w-3.5",
                        strokeWidth: 2
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 76,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/matches/MatchesSection.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(MatchIdWithCopy, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c = MatchIdWithCopy;
function MatchBannerUrlWithCopy({ url }) {
    _s1();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const trimmed = url?.trim() ?? "";
    if (!trimmed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-zinc-500",
            children: "—"
        }, void 0, false, {
            fileName: "[project]/app/components/matches/MatchesSection.tsx",
            lineNumber: 89,
            columnNumber: 12
        }, this);
    }
    const handleCopy = async (e)=>{
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(trimmed);
            setCopied(true);
            window.setTimeout(()=>setCopied(false), 1500);
        } catch  {
            setCopied(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-0.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "break-all text-xs text-gray-300",
                children: trimmed
            }, void 0, false, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: handleCopy,
                    className: "rounded p-0.5 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white",
                    "aria-label": "Copy banner URL",
                    title: "Copy URL to clipboard",
                    children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-3.5 w-3.5 text-emerald-400",
                        strokeWidth: 2
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 116,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                        className: "h-3.5 w-3.5",
                        strokeWidth: 2
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 118,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/matches/MatchesSection.tsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
}
_s1(MatchBannerUrlWithCopy, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c1 = MatchBannerUrlWithCopy;
function MatchesSection() {
    _s2();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const matchTournamentParam = searchParams.get(QUERY_MATCH_TOURNAMENT) ?? searchParams.get("tournament");
    const hasRestoredScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tournaments, setTournaments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tournamentListReady, setTournamentListReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedTournament, setSelectedTournament] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("LIVE");
    const [matches, setMatches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [matchesError, setMatchesError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [matchToUpdate, setMatchToUpdate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bannerUrlInput, setBannerUrlInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [bannerUpdateLoading, setBannerUpdateLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bannerUpdateError, setBannerUpdateError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const saveScrollPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MatchesSection.useCallback[saveScrollPosition]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
            const scrollTop = container ? container.scrollTop : window.scrollY;
            sessionStorage.setItem(MATCHES_SCROLL_POSITION_KEY, String(scrollTop));
        }
    }["MatchesSection.useCallback[saveScrollPosition]"], []);
    const restoreScrollPosition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MatchesSection.useCallback[restoreScrollPosition]": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const raw = sessionStorage.getItem(MATCHES_SCROLL_POSITION_KEY);
            if (!raw) return;
            const parsedScrollTop = Number(raw);
            if (!Number.isFinite(parsedScrollTop)) return;
            const container = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
            requestAnimationFrame({
                "MatchesSection.useCallback[restoreScrollPosition]": ()=>{
                    if (container) {
                        container.scrollTo({
                            top: parsedScrollTop,
                            behavior: "auto"
                        });
                    } else {
                        window.scrollTo({
                            top: parsedScrollTop,
                            behavior: "auto"
                        });
                    }
                }
            }["MatchesSection.useCallback[restoreScrollPosition]"]);
        }
    }["MatchesSection.useCallback[restoreScrollPosition]"], []);
    const formatDateIST = (isoString)=>{
        if (!isoString) return "—";
        try {
            return new Date(isoString).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "short",
                timeStyle: "short"
            });
        } catch  {
            return "—";
        }
    };
    const fetchTournamentsList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MatchesSection.useCallback[fetchTournamentsList]": async ()=>{
            const res = await fetch("/api/tournament", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch({
                    "MatchesSection.useCallback[fetchTournamentsList]": ()=>({})
                }["MatchesSection.useCallback[fetchTournamentsList]"]);
                throw new Error(errorData.message || "Failed to fetch tournaments");
            }
            const response = await res.json();
            const tournamentData = response.success ? response.data.data : [];
            return Array.isArray(tournamentData) ? tournamentData : [];
        }
    }["MatchesSection.useCallback[fetchTournamentsList]"], []);
    const fetchMatches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MatchesSection.useCallback[fetchMatches]": async (tournament, options)=>{
            if (!tournament) {
                setMatches([]);
                setMatchesError("");
                return;
            }
            const quiet = options?.quiet === true;
            try {
                if (!quiet) setLoading(true);
                setMatchesError("");
                const endpoint = tournament === "LIVE" ? "/api/match/live-matches" : `/api/match/${encodeURIComponent(tournament)}`;
                const res = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });
                if (!res.ok) {
                    const errorData = await res.json().catch({
                        "MatchesSection.useCallback[fetchMatches]": ()=>({})
                    }["MatchesSection.useCallback[fetchMatches]"]);
                    throw new Error(errorData.message || "Failed to fetch matches");
                }
                const response = await res.json();
                const list = response.success && response.data ? response.data : [];
                setMatches(Array.isArray(list) ? list : []);
            } catch (err) {
                setMatchesError(err instanceof Error ? err.message : "Failed to load matches");
                setMatches([]);
            } finally{
                if (!quiet) setLoading(false);
            }
        }
    }["MatchesSection.useCallback[fetchMatches]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MatchesSection.useEffect": ()=>{
            let cancelled = false;
            ({
                "MatchesSection.useEffect": async ()=>{
                    try {
                        const list = await fetchTournamentsList();
                        if (cancelled) return;
                        setTournaments(list);
                        setError("");
                    } catch (err) {
                        if (cancelled) return;
                        setError(err instanceof Error ? err.message : "Failed to load tournaments");
                    } finally{
                        if (!cancelled) setTournamentListReady(true);
                    }
                }
            })["MatchesSection.useEffect"]();
            return ({
                "MatchesSection.useEffect": ()=>{
                    cancelled = true;
                }
            })["MatchesSection.useEffect"];
        }
    }["MatchesSection.useEffect"], [
        fetchTournamentsList
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MatchesSection.useEffect": ()=>{
            if (!tournamentListReady) return;
            let cancelled = false;
            ({
                "MatchesSection.useEffect": async ()=>{
                    const resolved = resolveTournamentQueryParam(matchTournamentParam, tournaments);
                    const sp = new URLSearchParams(searchParams.toString());
                    sp.set("section", "matches");
                    const needsNormalize = searchParams.get("section") !== "matches" || searchParams.get(QUERY_MATCH_TOURNAMENT) !== resolved || searchParams.get("tournament") != null || searchParams.get("from") != null || searchParams.get("quizTournament") != null || searchParams.get("predTournament") != null;
                    if (needsNormalize) {
                        sp.set(QUERY_MATCH_TOURNAMENT, resolved);
                        sp.delete("tournament");
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripAdminHomeQueryNoise"])("matches", sp);
                        router.replace(`/?${sp.toString()}`, {
                            scroll: false
                        });
                    }
                    if (cancelled) return;
                    setSelectedTournament(resolved);
                    await fetchMatches(resolved);
                }
            })["MatchesSection.useEffect"]();
            return ({
                "MatchesSection.useEffect": ()=>{
                    cancelled = true;
                }
            })["MatchesSection.useEffect"];
        }
    }["MatchesSection.useEffect"], [
        tournamentListReady,
        matchTournamentParam,
        tournaments,
        fetchMatches,
        router,
        searchParams
    ]);
    const replaceMatchesTournamentInUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MatchesSection.useCallback[replaceMatchesTournamentInUrl]": (tournament)=>{
            const sp = new URLSearchParams(searchParams.toString());
            sp.set("section", "matches");
            sp.set(QUERY_MATCH_TOURNAMENT, tournament);
            sp.delete("tournament");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripAdminHomeQueryNoise"])("matches", sp);
            router.replace(`/?${sp.toString()}`, {
                scroll: false
            });
        }
    }["MatchesSection.useCallback[replaceMatchesTournamentInUrl]"], [
        router,
        searchParams
    ]);
    const matchHrefWithListContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MatchesSection.useCallback[matchHrefWithListContext]": (path)=>{
            const sep = path.includes("?") ? "&" : "?";
            return `${path}${sep}from=matches&${QUERY_MATCH_TOURNAMENT}=${encodeURIComponent(selectedTournament)}`;
        }
    }["MatchesSection.useCallback[matchHrefWithListContext]"], [
        selectedTournament
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MatchesSection.useEffect": ()=>{
            if (loading || hasRestoredScrollRef.current) return;
            const shouldRestore = ("TURBOPACK compile-time value", "object") !== "undefined" && sessionStorage.getItem(MATCHES_SHOULD_RESTORE_SCROLL_KEY) === "1";
            if (shouldRestore) {
                sessionStorage.removeItem(MATCHES_SHOULD_RESTORE_SCROLL_KEY);
                restoreScrollPosition();
            }
            hasRestoredScrollRef.current = true;
        }
    }["MatchesSection.useEffect"], [
        loading,
        restoreScrollPosition
    ]);
    const navigateFromMatchesToQuiz = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MatchesSection.useCallback[navigateFromMatchesToQuiz]": (quizId)=>{
            saveScrollPosition();
            if ("TURBOPACK compile-time truthy", 1) {
                sessionStorage.setItem(MATCHES_SHOULD_RESTORE_SCROLL_KEY, "1");
            }
            router.push(matchHrefWithListContext(`/quiz/${encodeURIComponent(quizId)}`), {
                scroll: false
            });
        }
    }["MatchesSection.useCallback[navigateFromMatchesToQuiz]"], [
        matchHrefWithListContext,
        router,
        saveScrollPosition
    ]);
    const openUpdateMatchDialog = (match)=>{
        setBannerUpdateError("");
        setMatchToUpdate(match);
        setBannerUrlInput(match.matchBanner ?? "");
    };
    const closeUpdateMatchDialog = ()=>{
        setMatchToUpdate(null);
        setBannerUrlInput("");
        setBannerUpdateError("");
        setBannerUpdateLoading(false);
    };
    const handleUpdateMatchBanner = async ()=>{
        if (!matchToUpdate) return;
        const trimmed = bannerUrlInput.trim();
        if (!trimmed) {
            setBannerUpdateError("Enter a banner image URL");
            return;
        }
        setBannerUpdateError("");
        setBannerUpdateLoading(true);
        try {
            const res = await fetch(`/api/match/${encodeURIComponent(matchToUpdate._id)}/matchBanner`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    matchBanner: trimmed
                })
            });
            const payload = await res.json().catch(()=>({}));
            if (!res.ok) {
                const msg = typeof payload.message === "string" ? payload.message : `Request failed (${res.status})`;
                throw new Error(msg);
            }
            if (!payload.success) {
                throw new Error(typeof payload.message === "string" ? payload.message : "Failed to update banner");
            }
            closeUpdateMatchDialog();
            if (selectedTournament) {
                await fetchMatches(selectedTournament, {
                    quiet: true
                });
            }
        } catch (err) {
            setBannerUpdateError(err instanceof Error ? err.message : "Failed to update banner");
        } finally{
            setBannerUpdateLoading(false);
        }
    };
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 419,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/matches/MatchesSection.tsx",
            lineNumber: 418,
            columnNumber: 7
        }, this);
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
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 427,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/matches/MatchesSection.tsx",
            lineNumber: 426,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white",
                        children: "Matches"
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 435,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsCreateModalOpen(true),
                        className: "rounded-md bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200",
                        children: "Create New Match"
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 436,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 434,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "mb-3 block text-sm font-medium text-gray-300",
                        children: "Select Tournament"
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 445,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>replaceMatchesTournamentInUrl("LIVE"),
                                className: `rounded-md px-4 py-2 font-medium transition-colors ${selectedTournament === "LIVE" ? "bg-white text-black hover:bg-zinc-200" : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"}`,
                                children: "Show Live Matches"
                            }, void 0, false, {
                                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                lineNumber: 449,
                                columnNumber: 11
                            }, this),
                            tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>replaceMatchesTournamentInUrl(tournament),
                                    className: `rounded-md px-4 py-2 font-medium transition-colors ${selectedTournament === tournament ? "bg-white text-black hover:bg-zinc-200" : "border border-zinc-600 bg-zinc-800 text-white hover:bg-zinc-700"}`,
                                    children: tournament
                                }, tournament, false, {
                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                    lineNumber: 461,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 448,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 444,
                columnNumber: 7
            }, this),
            selectedTournament && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mb-4 text-xl font-semibold text-white",
                        children: selectedTournament === "LIVE" ? "Live matches" : `Matches for ${selectedTournament}`
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 479,
                        columnNumber: 11
                    }, this),
                    matchesError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border border-red-800 bg-red-900/20 p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-400",
                            children: matchesError
                        }, void 0, false, {
                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                            lineNumber: 487,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 486,
                        columnNumber: 13
                    }, this) : matches.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg bg-zinc-800 p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "No matches for this tournament yet. Create a match using the button above."
                        }, void 0, false, {
                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                            lineNumber: 491,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 490,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full border-collapse border border-zinc-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "bg-zinc-800",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Match ID"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                lineNumber: 501,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Team A"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                lineNumber: 504,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Team B"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                lineNumber: 507,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Match start time"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                lineNumber: 510,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Mongo ID"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                lineNumber: 513,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Quizzes"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                lineNumber: 516,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Banners"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                lineNumber: 519,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                        lineNumber: 500,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                    lineNumber: 499,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: matches.map((match)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            role: "button",
                                            tabIndex: 0,
                                            onClick: ()=>openUpdateMatchDialog(match),
                                            onKeyDown: (e)=>{
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    openUpdateMatchDialog(match);
                                                }
                                            },
                                            className: "cursor-pointer transition-colors hover:bg-zinc-800/50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 font-mono text-sm text-gray-300",
                                                    children: match.matchId
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                    lineNumber: 539,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 text-gray-300",
                                                    children: [
                                                        match.teamA?.name,
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-zinc-500",
                                                            children: [
                                                                "(",
                                                                match.teamA?.abbreviation,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                            lineNumber: 544,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                    lineNumber: 542,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 text-gray-300",
                                                    children: [
                                                        match.teamB?.name,
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-zinc-500",
                                                            children: [
                                                                "(",
                                                                match.teamB?.abbreviation,
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                            lineNumber: 550,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                    lineNumber: 548,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 text-gray-400",
                                                    children: formatDateIST(match.matchStartTime)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                    lineNumber: 554,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "break-all border border-zinc-700 px-4 py-3 text-gray-400",
                                                    children: match._id
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 align-top text-gray-400",
                                                    children: match.quizIds && match.quizIds.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col gap-2",
                                                        children: match.quizIds.map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MatchIdWithCopy, {
                                                                id: id,
                                                                onQuizClick: ()=>navigateFromMatchesToQuiz(id)
                                                            }, id, false, {
                                                                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                                lineNumber: 564,
                                                                columnNumber: 31
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                        lineNumber: 562,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-zinc-500",
                                                        children: "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                        lineNumber: 574,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                    lineNumber: 560,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "break-all border border-zinc-700 px-4 py-3 align-top text-gray-400",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MatchBannerUrlWithCopy, {
                                                        url: match.matchBanner
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                        lineNumber: 578,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                                    lineNumber: 577,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, match._id, true, {
                                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                            lineNumber: 526,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                    lineNumber: 524,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                            lineNumber: 498,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                        lineNumber: 497,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 478,
                columnNumber: 9
            }, this),
            !selectedTournament && tournaments.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 rounded-lg bg-zinc-800 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400",
                    children: "Select a tournament to view its matches."
                }, void 0, false, {
                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                    lineNumber: 591,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 590,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$matches$2f$CreateMatchesModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isCreateModalOpen,
                onClose: ()=>setIsCreateModalOpen(false),
                onSuccess: ()=>{
                    void (async ()=>{
                        try {
                            const list = await fetchTournamentsList();
                            setTournaments(list);
                        } catch  {
                        /* keep existing list */ }
                        if (selectedTournament) {
                            await fetchMatches(selectedTournament, {
                                quiet: true
                            });
                        }
                    })();
                }
            }, void 0, false, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 597,
                columnNumber: 7
            }, this),
            matchToUpdate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
                role: "presentation",
                onClick: closeUpdateMatchDialog,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": "update-match-dialog-title",
                    className: "max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-b border-zinc-800 p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    id: "update-match-dialog-title",
                                    className: "text-xl font-bold text-white",
                                    children: "Update match data"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                    lineNumber: 629,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 font-mono text-xs text-zinc-500",
                                    children: [
                                        matchToUpdate.matchId,
                                        " · ",
                                        matchToUpdate._id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                    lineNumber: 635,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                            lineNumber: 628,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                bannerUpdateError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-4 rounded-lg bg-red-950/40 p-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-red-300",
                                        children: bannerUpdateError
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                        lineNumber: 643,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                    lineNumber: 642,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "match-banner-url",
                                    className: "mb-2 block text-sm font-medium text-gray-300",
                                    children: "Update match banner"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                    lineNumber: 647,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "match-banner-url",
                                    type: "url",
                                    value: bannerUrlInput,
                                    onChange: (e)=>setBannerUrlInput(e.target.value),
                                    placeholder: "https://…",
                                    className: "mb-6 w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500",
                                    disabled: bannerUpdateLoading,
                                    autoComplete: "off"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                    lineNumber: 653,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap justify-end gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: closeUpdateMatchDialog,
                                            disabled: bannerUpdateLoading,
                                            className: "rounded-md border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 disabled:opacity-50",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                            lineNumber: 665,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>void handleUpdateMatchBanner(),
                                            disabled: bannerUpdateLoading,
                                            className: "rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50",
                                            children: bannerUpdateLoading ? "Updating…" : "Update"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                            lineNumber: 673,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                                    lineNumber: 664,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/matches/MatchesSection.tsx",
                            lineNumber: 640,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/matches/MatchesSection.tsx",
                    lineNumber: 621,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/matches/MatchesSection.tsx",
                lineNumber: 616,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/matches/MatchesSection.tsx",
        lineNumber: 433,
        columnNumber: 5
    }, this);
}
_s2(MatchesSection, "PGw7ntBGdQIG2RYkORRS/HPwidI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c2 = MatchesSection;
const __TURBOPACK__default__export__ = MatchesSection;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "MatchIdWithCopy");
__turbopack_context__.k.register(_c1, "MatchBannerUrlWithCopy");
__turbopack_context__.k.register(_c2, "MatchesSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$users$2f$UsersSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/users/UsersSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$quiz$2f$QuizzesSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/quiz/QuizzesSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$predictions$2f$PredictionsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/predictions/PredictionsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$leaderboard$2f$LeaderboardSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/leaderboard/LeaderboardSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$TeamsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/teams/TeamsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$matches$2f$MatchesSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/matches/MatchesSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/buildAdminHomeHref.ts [app-client] (ecmascript)");
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
;
;
;
;
;
;
const VALID_SECTIONS = [
    "users",
    "matches",
    "quizzes",
    "predictions",
    "leaderboard",
    "teams"
];
function HomeContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { isAuthenticated, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const sectionFromUrl = searchParams.get("section");
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const activeSection = sectionFromUrl && VALID_SECTIONS.includes(sectionFromUrl) ? sectionFromUrl : "users";
    const handleLogout = async ()=>{
        if (isLoggingOut) return;
        try {
            setIsLoggingOut(true);
            await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally{
            localStorage.clear();
            sessionStorage.clear();
            logout();
            router.push("/login");
            setIsLoggingOut(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeContent.useEffect": ()=>{
            if (!isAuthenticated) {
                router.push("/login");
            }
        }
    }["HomeContent.useEffect"], [
        isAuthenticated,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomeContent.useEffect": ()=>{
            const s = searchParams.get("section");
            if (!s || !VALID_SECTIONS.includes(s)) {
                const sp = new URLSearchParams(searchParams.toString());
                sp.set("section", "users");
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripAdminHomeQueryNoise"])("users", sp);
                router.replace(`/?${sp.toString()}`, {
                    scroll: false
                });
            }
        }
    }["HomeContent.useEffect"], [
        searchParams,
        router
    ]);
    const handleSectionChange = (section)=>{
        if (!VALID_SECTIONS.includes(section)) return;
        if (section === activeSection) {
            setIsMobileMenuOpen(false);
            return;
        }
        const sp = new URLSearchParams(searchParams.toString());
        sp.set("section", section);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$buildAdminHomeHref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stripAdminHomeQueryNoise"])(section, sp);
        router.push(`/?${sp.toString()}`, {
            scroll: false
        });
        setIsMobileMenuOpen(false);
    };
    // Don't render content if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }
    const renderContent = ()=>{
        switch(activeSection){
            case "users":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$users$2f$UsersSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 97,
                    columnNumber: 16
                }, this);
            case "teams":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$TeamsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 99,
                    columnNumber: 16
                }, this);
            case "matches":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$matches$2f$MatchesSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 101,
                    columnNumber: 16
                }, this);
            case "quizzes":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$quiz$2f$QuizzesSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 103,
                    columnNumber: 16
                }, this);
            case "predictions":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$predictions$2f$PredictionsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 105,
                    columnNumber: 16
                }, this);
            case "leaderboard":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$leaderboard$2f$LeaderboardSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 107,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$users$2f$UsersSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 109,
                    columnNumber: 16
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen font-sans bg-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden md:block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    activeSection: activeSection,
                    onSectionChange: handleSectionChange,
                    onLogout: handleLogout,
                    isLoggingOut: isLoggingOut
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "app-main-scroll-container",
                className: "relative flex-1 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `fixed top-4 z-60 md:hidden rounded-md border border-zinc-700 bg-zinc-900 p-2 text-white ${isMobileMenuOpen ? "ml-50" : "left-4"}`,
                        onClick: ()=>setIsMobileMenuOpen((prev)=>!prev),
                        "aria-label": isMobileMenuOpen ? "Close menu" : "Open menu",
                        children: isMobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            className: "h-6 w-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "M6 18L18 6M6 6l12 12"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 145,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 137,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            className: "h-6 w-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "M4 6h16M4 12h16M4 18h16"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 160,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 152,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    isMobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fixed inset-y-0 left-0 z-50 md:hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    activeSection: activeSection,
                                    onSectionChange: handleSectionChange,
                                    onLogout: handleLogout,
                                    isLoggingOut: isLoggingOut
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "fixed inset-0 z-40 bg-black/60 md:hidden right-0",
                                onClick: ()=>setIsMobileMenuOpen(false),
                                "aria-label": "Close mobile menu overlay"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-16 md:pt-0",
                        children: renderContent()
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
_s(HomeContent, "G8pTsBHPJo94+10K0XXwXJsHxo4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = HomeContent;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center font-sans bg-black text-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loading$2d$indicators$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Atom"], {
                color: "#5CDFFF",
                size: "medium",
                text: "",
                textColor: ""
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 199,
                columnNumber: 11
            }, void 0)
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 198,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HomeContent, {}, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 203,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, this);
}
_c1 = Home;
var _c, _c1;
__turbopack_context__.k.register(_c, "HomeContent");
__turbopack_context__.k.register(_c1, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_41858acc._.js.map