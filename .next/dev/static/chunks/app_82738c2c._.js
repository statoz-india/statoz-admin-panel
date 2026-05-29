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
function Sidebar({ activeSection, onSectionChange }) {
    const menuItems = [
        {
            id: "users",
            label: "Users"
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
        },
        {
            id: "teams",
            label: "Teams"
        },
        {
            id: "waitlist",
            label: "Waitlist"
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
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 23,
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
                                lineNumber: 30,
                                columnNumber: 15
                            }, this)
                        }, item.id, false, {
                            fileName: "[project]/app/components/Sidebar.tsx",
                            lineNumber: 29,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/components/Sidebar.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/Sidebar.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Sidebar.tsx",
        lineNumber: 22,
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
"[project]/app/components/UsersSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UsersSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function UsersSection() {
    _s();
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UsersSection.useEffect": ()=>{
            const fetchUsers = {
                "UsersSection.useEffect.fetchUsers": async ()=>{
                    try {
                        setLoading(true);
                        const res = await fetch("/api/users/getAllUsers", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include"
                        });
                        const response = await res.json();
                        setUsers(response.data.data);
                        setError("");
                    } catch (err) {
                        setError(err instanceof Error ? err.message : "Failed to load users");
                    } finally{
                        setLoading(false);
                    }
                }
            }["UsersSection.useEffect.fetchUsers"];
            fetchUsers();
        }
    }["UsersSection.useEffect"], []);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-500 dark:text-gray-400",
                children: "Loading users..."
            }, void 0, false, {
                fileName: "[project]/app/components/UsersSection.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/UsersSection.tsx",
            lineNumber: 37,
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
                fileName: "[project]/app/components/UsersSection.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/UsersSection.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-6 text-black dark:text-white",
                children: "Users"
            }, void 0, false, {
                fileName: "[project]/app/components/UsersSection.tsx",
                lineNumber: 53,
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
                                        children: "Username"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/UsersSection.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/UsersSection.tsx",
                                        lineNumber: 63,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "User Type"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/UsersSection.tsx",
                                        lineNumber: 66,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "Coins"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/UsersSection.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                        children: "Created At"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/UsersSection.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/UsersSection.tsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/UsersSection.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700",
                            children: users.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-gray-50 dark:hover:bg-zinc-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white",
                                            children: user.userName
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/UsersSection.tsx",
                                            lineNumber: 83,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                            children: user.email
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/UsersSection.tsx",
                                            lineNumber: 86,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                            children: user.userType
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/UsersSection.tsx",
                                            lineNumber: 89,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                            children: user.coins
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/UsersSection.tsx",
                                            lineNumber: 92,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                            children: new Date(user.createdAt).toLocaleDateString()
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/UsersSection.tsx",
                                            lineNumber: 95,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, user._id, true, {
                                    fileName: "[project]/app/components/UsersSection.tsx",
                                    lineNumber: 79,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/UsersSection.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/UsersSection.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/UsersSection.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/UsersSection.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(UsersSection, "ti6iAh9YWw9PPSvUKlmYPkl4k8Q=");
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
    const [teams, setTeams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [teamsLoading, setTeamsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tournament: "",
        teamA: "",
        teamB: "",
        entryStartTime: "",
        matchStartTime: "",
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
    // Fetch teams for selected tournament
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
    // Handle tournament selection
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
    // Handle team selection
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
    // Fetch tournaments when modal opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CreateQuizModal.useEffect": ()=>{
            if (isOpen) {
                fetchTournaments();
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
        if (!formData.entryStartTime || !formData.matchStartTime) {
            setError("Please provide both entry and match start times");
            setLoading(false);
            return;
        }
        // Send datetime-local values directly as IST time
        // The datetime-local input value represents IST time that user wants stored as IST
        // We send it with IST timezone (+05:30) to explicitly mark it as IST
        // If backend converts this to UTC, that's a backend configuration issue that needs to be fixed
        const entryStartTimeIST = convertToISTISO(formData.entryStartTime);
        const matchStartTimeIST = convertToISTISO(formData.matchStartTime);
        // Validate that entry start time is before stop time
        // Parse as IST by appending timezone for validation purposes
        const startTime = new Date(`${formData.entryStartTime}+05:30`).getTime();
        const stopTime = new Date(`${formData.matchStartTime}+05:30`).getTime();
        if (startTime >= stopTime) {
            setError("Entry start time must be before match stop time");
            setLoading(false);
            return;
        }
        // Validate that there are questions
        if (formData.questionsArray.length === 0) {
            setError("Please add at least one question");
            setLoading(false);
            return;
        }
        try {
            // Prepare payload with IST formatted times
            // Format: "2026-02-13T13:43:00.000+05:30" (IST with explicit timezone)
            // This explicitly marks the time as IST - backend should store it as IST
            const payload = {
                ...formData,
                entryStartTime: entryStartTimeIST,
                matchStartTime: matchStartTimeIST
            };
            // Log what we're sending for debugging
            console.log("Sending times as IST:", {
                entryStartTime: entryStartTimeIST,
                matchStartTime: matchStartTimeIST
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
                teamA: "",
                teamB: "",
                entryStartTime: "",
                matchStartTime: "",
                questionsArray: [],
                tag: ""
            });
            setSelectedTournament("");
            setTeams([]);
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
                        lineNumber: 417,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                    lineNumber: 416,
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
                                lineNumber: 425,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                            lineNumber: 424,
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
                                            lineNumber: 431,
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
                                                    lineNumber: 440,
                                                    columnNumber: 17
                                                }, this),
                                                tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: tournament,
                                                        children: tournament
                                                    }, tournament, false, {
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 442,
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
                                            children: "Team A *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 449,
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
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 459,
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
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 469,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 452,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 448,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Team B *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 476,
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
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 486,
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
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 496,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 479,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 475,
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
                                                    lineNumber: 505,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 503,
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
                                            lineNumber: 507,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 502,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: [
                                                "Match Start Time *",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-500",
                                                    children: "(IST)"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 521,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "datetime-local",
                                            required: true,
                                            value: formData.matchStartTime,
                                            onChange: (e)=>{
                                                setFormData({
                                                    ...formData,
                                                    matchStartTime: e.target.value.toString()
                                                });
                                            },
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 525,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 520,
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
                                            lineNumber: 539,
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
                                            lineNumber: 542,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 538,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                            lineNumber: 429,
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
                                    lineNumber: 556,
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
                                                                        lineNumber: 567,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: question.questionText ?? "",
                                                                        onChange: (e)=>updateQuestionText(idx, e.target.value),
                                                                        className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 570,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 566,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>removeQuestion(idx),
                                                                className: "px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm shrink-0",
                                                                children: "Remove"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 579,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 565,
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
                                                                        lineNumber: 589,
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
                                                                        lineNumber: 592,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 588,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                        children: "Type *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 606,
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
                                                                                lineNumber: 619,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "BOOLEAN",
                                                                                children: "Boolean (True/False)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                                lineNumber: 620,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "NUMERIC",
                                                                                children: "Numeric"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                                lineNumber: 621,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "ALPHABETICAL",
                                                                                children: "Alphabetical"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                                lineNumber: 622,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 609,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 605,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 587,
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
                                                                        lineNumber: 630,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    question.questionType === "MCQ" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>addQuestionOption(idx),
                                                                        className: "text-sm px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700",
                                                                        children: "+ Add Option"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 636,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 629,
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
                                                                                lineNumber: 648,
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
                                                                                lineNumber: 667,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, optIdx, true, {
                                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                        lineNumber: 647,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                lineNumber: 645,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                        lineNumber: 628,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                lineNumber: 561,
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
                                                    lineNumber: 689,
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
                                                            lineNumber: 693,
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
                                                            lineNumber: 696,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 692,
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
                                                                    lineNumber: 711,
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
                                                                            lineNumber: 727,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "BOOLEAN",
                                                                            children: "Boolean (True/False)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                            lineNumber: 728,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "NUMERIC",
                                                                            children: "Numeric"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                            lineNumber: 729,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "ALPHABETICAL",
                                                                            children: "Alphabetical"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                            lineNumber: 730,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 714,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 710,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                                    children: "XP *"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 734,
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
                                                                    lineNumber: 737,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 733,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 709,
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
                                                                    lineNumber: 755,
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
                                                                    lineNumber: 761,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 754,
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
                                                                            lineNumber: 778,
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
                                                                            lineNumber: 798,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, optIdx, true, {
                                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                                    lineNumber: 777,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 775,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 753,
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
                                                            lineNumber: 822,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: removeNewQuestion,
                                                            className: "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700",
                                                            children: "Remove"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                            lineNumber: 829,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                                    lineNumber: 821,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 688,
                                            columnNumber: 17
                                        }, this),
                                        !newQuestion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: addQuestion,
                                            className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700",
                                            children: "+ Add Question"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                            lineNumber: 841,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 559,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                            lineNumber: 555,
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
                                    lineNumber: 853,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading || formData.questionsArray.length === 0,
                                    className: "px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Creating..." : "Create Quiz"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                                    lineNumber: 860,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                            lineNumber: 852,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
                    lineNumber: 422,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
            lineNumber: 415,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/quiz/CreateQuizModal.tsx",
        lineNumber: 414,
        columnNumber: 5
    }, this);
}
_s(CreateQuizModal, "mqS5G1xDsAVXMEzZuz5F1qlmjDc=");
_c = CreateQuizModal;
var _c;
__turbopack_context__.k.register(_c, "CreateQuizModal");
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
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function QuizzesSection() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [quizzes, setQuizzes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchQuizzes = async ()=>{
        try {
            setLoading(true);
            const res = await fetch("/api/quiz", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
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
            setError(err instanceof Error ? err.message : "Failed to load quizzes");
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuizzesSection.useEffect": ()=>{
            fetchQuizzes();
        }
    }["QuizzesSection.useEffect"], []);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400",
                children: "Loading quizzes..."
            }, void 0, false, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this);
    }
    const handleQuizClick = (quiz)=>{
        router.push(`/quiz/${quiz._id}?from=quizzes`);
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
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsModalOpen(true),
                        className: "px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200",
                        children: "Create New Quiz"
                    }, void 0, false, {
                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$quiz$2f$CreateQuizModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isModalOpen,
                onClose: ()=>setIsModalOpen(false),
                onSuccess: fetchQuizzes
            }, void 0, false, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            error && quizzes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-400",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 75,
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
                                                lineNumber: 88,
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
                                                lineNumber: 91,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 87,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `px-3 py-1 rounded-full text-sm font-medium ${quiz.quizStatus === "ENTRYNOTSTARTED" ? "bg-gray-700 text-gray-200" : quiz.quizStatus === "ENTRYSTARTED" ? "bg-blue-900 text-blue-200" : "bg-green-900 text-green-200"}`,
                                        children: quiz.quizStatus
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 93,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                lineNumber: 86,
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
                                                    backgroundColor: quiz.matchData.teamA.primaryColor,
                                                    color: quiz.matchData.teamA.textColor
                                                },
                                                children: quiz.matchData.teamA.abbreviation
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 109,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white",
                                                children: quiz.matchData.teamA.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 118,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 font-bold",
                                        children: "VS"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg",
                                                style: {
                                                    backgroundColor: quiz.matchData.teamB.primaryColor,
                                                    color: quiz.matchData.teamB.textColor
                                                },
                                                children: quiz.matchData.teamB.abbreviation
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 124,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white",
                                                children: quiz.matchData.teamB.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 133,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 123,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                lineNumber: 107,
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
                                                lineNumber: 142,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white",
                                                children: new Date(quiz.entryStartTime).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 143,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 mb-1",
                                                children: "Match Start Time"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 148,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white",
                                                children: new Date(quiz.matchStartTime).toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 149,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 147,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 mb-1",
                                                children: "Questions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 154,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white",
                                                children: quiz.questionsArray?.length || 0
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 155,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 153,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-400 mb-1",
                                                children: "Submissions"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 160,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white",
                                                children: quiz.responseSubmittedByUsers?.length || 0
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                                lineNumber: 161,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 159,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                lineNumber: 140,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 pt-4 border-t border-zinc-700 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400",
                                        children: [
                                            "Created by: ",
                                            quiz.createdByUserData?.email,
                                            " (",
                                            quiz.createdByUserData?.userType,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 169,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400",
                                        children: [
                                            "Visibility: ",
                                            quiz.isVisible ? "Visible" : "Hidden"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 173,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                lineNumber: 168,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2 mt-4",
                                onClick: (e)=>e.stopPropagation(),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>handleQuizClick(quiz),
                                        className: "px-3 py-1.5 rounded-md bg-zinc-600 text-white text-sm hover:bg-zinc-500",
                                        children: "Quiz details"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 182,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>router.push(`/quiz/${quiz._id}/userSubmissions?from=quizzes`),
                                        className: "px-3 py-1.5 rounded-md bg-zinc-600 text-white text-sm hover:bg-zinc-500",
                                        children: "Users answered"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 189,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>router.push(`/quiz/${quiz._id}/editQuiz?from=quizzes`),
                                        className: "px-3 py-1.5 rounded-md bg-zinc-600 text-white text-sm hover:bg-zinc-500",
                                        children: "Edit quiz"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 200,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>router.push(`/quiz/${quiz._id}/settleQuiz?from=quizzes`),
                                        className: "px-3 py-1.5 rounded-md bg-zinc-600 text-white text-sm hover:bg-zinc-500",
                                        children: "Settle quiz"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                        lineNumber: 209,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                                lineNumber: 178,
                                columnNumber: 15
                            }, this)
                        ]
                    }, quiz._id, true, {
                        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                        lineNumber: 81,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/quiz/QuizzesSection.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(QuizzesSection, "aj0nbXD4Oto/XGOoqfuxQvfD1B8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
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
    const [teams, setTeams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [teamsLoading, setTeamsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        tournament: "",
        teamA: "",
        teamB: "",
        entryStopTime: ""
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
    // Fetch teams for selected tournament
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
    // Handle tournament selection
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
    // Handle team selection
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
    const handleEntryStopTimeChange = (value)=>{
        setFormData({
            ...formData,
            entryStopTime: value || undefined
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
                teamA: "",
                teamB: "",
                entryStopTime: ""
            });
            setSelectedTournament("");
            setTeams([]);
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
                        lineNumber: 213,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                    lineNumber: 212,
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
                                lineNumber: 221,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                            lineNumber: 220,
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
                                            lineNumber: 227,
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
                                                    lineNumber: 236,
                                                    columnNumber: 17
                                                }, this),
                                                tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: tournament,
                                                        children: tournament
                                                    }, tournament, false, {
                                                        fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 230,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Team A *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 245,
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
                                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                                    lineNumber: 255,
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
                                                        fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 248,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Team B *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 272,
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
                                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                                    lineNumber: 282,
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
                                                        fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                                        lineNumber: 292,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 275,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                    lineNumber: 271,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                            children: "Match Start time"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 299,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "datetime-local",
                                            value: formData.entryStopTime ?? "",
                                            onChange: (e)=>handleEntryStopTimeChange(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md dark:bg-zinc-800 dark:text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 302,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-xs text-gray-500 dark:text-gray-400",
                                            children: "After this time users cannot place entries on this prediction."
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                            lineNumber: 308,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                            lineNumber: 225,
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
                                    lineNumber: 315,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Creating..." : "Create Prediction"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                                    lineNumber: 322,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
                    lineNumber: 218,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
            lineNumber: 211,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/predictions/CreatePredictionModal.tsx",
        lineNumber: 210,
        columnNumber: 5
    }, this);
}
_s(CreatePredictionModal, "XMKQhNEd/NfjHrYfpi/0suCvW4g=");
_c = CreatePredictionModal;
var _c;
__turbopack_context__.k.register(_c, "CreatePredictionModal");
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
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function PredictionsSection() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [predictions, setPredictions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchPredictions = async ()=>{
        try {
            setLoading(true);
            const res = await fetch("/api/predictions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const response = await res.json();
            if (!res.ok || !response.success) {
                setError(response.metadata.message);
                return;
            }
            setPredictions(response.data.data);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load predictions");
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PredictionsSection.useEffect": ()=>{
            fetchPredictions();
        }
    }["PredictionsSection.useEffect"], []);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-500 dark:text-gray-400",
                children: "Loading predictions..."
            }, void 0, false, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
            lineNumber: 49,
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
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsModalOpen(true),
                        className: "px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200",
                        children: "Create New Prediction"
                    }, void 0, false, {
                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$predictions$2f$CreatePredictionModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isModalOpen,
                onClose: ()=>setIsModalOpen(false),
                onSuccess: fetchPredictions
            }, void 0, false, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center h-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-500 dark:text-red-400",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6",
                children: predictions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 dark:text-gray-400",
                    children: "No predictions found."
                }, void 0, false, {
                    fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                    lineNumber: 81,
                    columnNumber: 13
                }, this) : predictions.map((prediction)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border border-gray-200 dark:border-zinc-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>router.push(`/prediction/${prediction._id}`),
                                        className: "flex-1 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-bold text-black dark:text-white mb-1",
                                                children: prediction.predictionId
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 95,
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
                                                lineNumber: 98,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 91,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `px-3 py-1 rounded-full text-sm font-medium ${prediction.isVisible ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`,
                                            children: prediction.isVisible ? "Visible" : "Hidden"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                            lineNumber: 103,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 102,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                lineNumber: 90,
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
                                                    backgroundColor: prediction.matchData.teamA.primaryColor,
                                                    color: prediction.matchData.teamA.textColor
                                                },
                                                children: prediction.matchData.teamA.abbreviation
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 118,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white",
                                                children: prediction.matchData.teamA.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 128,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 117,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-500 font-bold",
                                        children: "VS"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 132,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 font-bold text-lg",
                                                style: {
                                                    backgroundColor: prediction.matchData.teamB.primaryColor,
                                                    color: prediction.matchData.teamB.textColor
                                                },
                                                children: prediction.matchData.teamB.abbreviation
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 134,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-white",
                                                children: prediction.matchData.teamB.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 144,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 133,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                lineNumber: 116,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>router.push(`/prediction/${prediction._id}`),
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                                children: "Total Coins"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 156,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-bold text-black dark:text-white",
                                                children: prediction.totalCoins.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 159,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 155,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                                children: "Team A Coins"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 164,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-bold text-blue-600 dark:text-blue-400",
                                                children: prediction.coinsOnTeamA.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 167,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 163,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                                children: "Team B Coins"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 172,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-bold text-purple-600 dark:text-purple-400",
                                                children: prediction.coinsOnTeamB.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 175,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 171,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 dark:text-gray-400 mb-1",
                                                children: "Participants"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 180,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-bold text-black dark:text-white",
                                                children: prediction.responseSubmittedByUsers?.length || 0
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                                lineNumber: 183,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                        lineNumber: 179,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                lineNumber: 151,
                                columnNumber: 17
                            }, this),
                            prediction.winningTeamCoin !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>router.push(`/prediction/${prediction._id}`),
                                className: "mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-600 dark:text-gray-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: "Winning Team Coin:"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                            lineNumber: 196,
                                            columnNumber: 23
                                        }, this),
                                        " ",
                                        prediction.winningTeamCoin.toLocaleString()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                    lineNumber: 195,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                lineNumber: 191,
                                columnNumber: 19
                            }, this),
                            prediction.createdByUserData && (prediction.createdByUserData.email || prediction.createdByUserData.userType) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>router.push(`/prediction/${prediction._id}`),
                                className: "mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 dark:text-gray-400",
                                    children: [
                                        "Created by:",
                                        " ",
                                        prediction.createdByUserData.email || "Unknown",
                                        " ",
                                        prediction.createdByUserData.userType && `(${prediction.createdByUserData.userType})`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                    lineNumber: 212,
                                    columnNumber: 23
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                                lineNumber: 206,
                                columnNumber: 21
                            }, this)
                        ]
                    }, prediction._id, true, {
                        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                        lineNumber: 86,
                        columnNumber: 15
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/predictions/PredictionsSection.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(PredictionsSection, "RJF34a9+zSdwwPt/jD/3nMorPoA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PredictionsSection;
var _c;
__turbopack_context__.k.register(_c, "PredictionsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/LeaderboardSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeaderboardSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
            console.log("leaderboard data", response);
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
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-500 dark:text-gray-400",
                children: "Loading tournaments..."
            }, void 0, false, {
                fileName: "[project]/app/components/LeaderboardSection.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/LeaderboardSection.tsx",
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
                fileName: "[project]/app/components/LeaderboardSection.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/LeaderboardSection.tsx",
            lineNumber: 110,
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
                fileName: "[project]/app/components/LeaderboardSection.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-gray-300 mb-3",
                        children: "Select Tournament"
                    }, void 0, false, {
                        fileName: "[project]/app/components/LeaderboardSection.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedTournament(tournament),
                                className: `px-4 py-2 rounded-md font-medium transition-colors ${selectedTournament === tournament ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"}`,
                                children: tournament
                            }, tournament, false, {
                                fileName: "[project]/app/components/LeaderboardSection.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/LeaderboardSection.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/LeaderboardSection.tsx",
                lineNumber: 122,
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
                        fileName: "[project]/app/components/LeaderboardSection.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    leaderboardLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "Loading leaderboard..."
                        }, void 0, false, {
                            fileName: "[project]/app/components/LeaderboardSection.tsx",
                            lineNumber: 151,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/LeaderboardSection.tsx",
                        lineNumber: 150,
                        columnNumber: 13
                    }, this) : leaderboardError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-red-900/20 border border-red-800 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-400",
                            children: leaderboardError
                        }, void 0, false, {
                            fileName: "[project]/app/components/LeaderboardSection.tsx",
                            lineNumber: 155,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/LeaderboardSection.tsx",
                        lineNumber: 154,
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
                                                children: "Rank"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                lineNumber: 162,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Username"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                lineNumber: 165,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Email"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                lineNumber: 168,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Tournament XP"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                lineNumber: 171,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider",
                                                children: "Total XP"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                lineNumber: 174,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/LeaderboardSection.tsx",
                                        lineNumber: 161,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/LeaderboardSection.tsx",
                                    lineNumber: 160,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-700",
                                    children: Array.isArray(users) && users.length > 0 ? users.map((user, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: `hover:bg-gray-50 dark:hover:bg-zinc-800 ${index === 0 ? "bg-yellow-50 dark:bg-yellow-900/20" : index === 1 ? "bg-gray-50 dark:bg-gray-800/50" : index === 2 ? "bg-orange-50 dark:bg-orange-900/20" : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-flex items-center justify-center w-8 h-8 rounded-full ${index === 0 ? "bg-yellow-400 text-yellow-900" : index === 1 ? "bg-gray-300 text-gray-700" : index === 2 ? "bg-orange-400 text-orange-900" : "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300"}`,
                                                        children: user.rank
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white",
                                                    children: user.userName
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300",
                                                    children: user.email
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white",
                                                    children: user.tournamentXP?.toLocaleString() || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white",
                                                    children: user.totalXP?.toLocaleString() || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/LeaderboardSection.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, user._id, true, {
                                            fileName: "[project]/app/components/LeaderboardSection.tsx",
                                            lineNumber: 182,
                                            columnNumber: 23
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 5,
                                            className: "px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400",
                                            children: "No leaderboard data available"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/LeaderboardSection.tsx",
                                            lineNumber: 225,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/LeaderboardSection.tsx",
                                        lineNumber: 224,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/LeaderboardSection.tsx",
                                    lineNumber: 179,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/LeaderboardSection.tsx",
                            lineNumber: 159,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/LeaderboardSection.tsx",
                        lineNumber: 158,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/LeaderboardSection.tsx",
                lineNumber: 144,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/LeaderboardSection.tsx",
        lineNumber: 117,
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
        textColor: ""
    });
    if (!isOpen) return null;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        // Validate required fields
        if (!formData.name || !formData.abbreviation || !formData.tournamentType || !formData.primaryColor || !formData.secondaryColor || !formData.textColor) {
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
                textColor: formData.textColor
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
                textColor: ""
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
                        lineNumber: 111,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                    lineNumber: 110,
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
                                lineNumber: 117,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 116,
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
                                    lineNumber: 122,
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
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 121,
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
                                    lineNumber: 138,
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
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 137,
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
                                    lineNumber: 158,
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
                                            lineNumber: 169,
                                            columnNumber: 15
                                        }, this),
                                        tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: tournament,
                                                children: tournament
                                            }, tournament, false, {
                                                fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
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
                            className: "grid grid-cols-3 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Primary Color *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 180,
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
                                            lineNumber: 183,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 179,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Secondary Color *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 196,
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
                                            lineNumber: 199,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 195,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-gray-300 mb-2",
                                            children: "Text Color *"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                            lineNumber: 212,
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
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 211,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 178,
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
                                    lineNumber: 231,
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
                                            lineNumber: 236,
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
                                            lineNumber: 239,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 235,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 230,
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
                                    lineNumber: 252,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed",
                                    children: loading ? "Creating..." : "Create Team"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                                    lineNumber: 259,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                            lineNumber: 251,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
                    lineNumber: 114,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
            lineNumber: 109,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/teams/CreateTeamModal.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_s(CreateTeamModal, "N9ZxnzfhAKrAA8Q9VqWtzGU6OdI=");
_c = CreateTeamModal;
var _c;
__turbopack_context__.k.register(_c, "CreateTeamModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/TeamsSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$CreateTeamModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/teams/CreateTeamModal.tsx [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './CreateTournamentModal'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module './EditTeamModal'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
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
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400",
                children: "Loading tournaments..."
            }, void 0, false, {
                fileName: "[project]/app/components/TeamsSection.tsx",
                lineNumber: 129,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/TeamsSection.tsx",
            lineNumber: 128,
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
                fileName: "[project]/app/components/TeamsSection.tsx",
                lineNumber: 137,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/TeamsSection.tsx",
            lineNumber: 136,
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
                        fileName: "[project]/app/components/TeamsSection.tsx",
                        lineNumber: 145,
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
                                fileName: "[project]/app/components/TeamsSection.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsCreateModalOpen(true),
                                className: "px-4 py-2 bg-white text-black rounded-md hover:bg-zinc-200 font-medium",
                                children: "Create New Team"
                            }, void 0, false, {
                                fileName: "[project]/app/components/TeamsSection.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/TeamsSection.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TeamsSection.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-gray-300 mb-3",
                        children: "Select Tournament"
                    }, void 0, false, {
                        fileName: "[project]/app/components/TeamsSection.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-3",
                        children: tournaments.map((tournament)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setSelectedTournament(tournament),
                                className: `px-4 py-2 rounded-md font-medium transition-colors ${selectedTournament === tournament ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white border border-zinc-600 hover:bg-zinc-700"}`,
                                children: tournament
                            }, tournament, false, {
                                fileName: "[project]/app/components/TeamsSection.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/TeamsSection.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TeamsSection.tsx",
                lineNumber: 162,
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
                        fileName: "[project]/app/components/TeamsSection.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this),
                    teamsLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "Loading teams..."
                        }, void 0, false, {
                            fileName: "[project]/app/components/TeamsSection.tsx",
                            lineNumber: 191,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/TeamsSection.tsx",
                        lineNumber: 190,
                        columnNumber: 13
                    }, this) : teamsError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-red-900/20 border border-red-800 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-400",
                            children: teamsError
                        }, void 0, false, {
                            fileName: "[project]/app/components/TeamsSection.tsx",
                            lineNumber: 195,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/TeamsSection.tsx",
                        lineNumber: 194,
                        columnNumber: 13
                    }, this) : teams.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-zinc-800 rounded-lg",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "No teams found for this tournament"
                        }, void 0, false, {
                            fileName: "[project]/app/components/TeamsSection.tsx",
                            lineNumber: 199,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/TeamsSection.tsx",
                        lineNumber: 198,
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
                                                children: "Name"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/TeamsSection.tsx",
                                                lineNumber: 208,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Abbreviation"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/TeamsSection.tsx",
                                                lineNumber: 211,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                                children: "Tournament"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/TeamsSection.tsx",
                                                lineNumber: 214,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/TeamsSection.tsx",
                                        lineNumber: 207,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TeamsSection.tsx",
                                    lineNumber: 206,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    children: teams.map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            onClick: ()=>handleTeamClick(team),
                                            className: "hover:bg-zinc-800/50 transition-colors cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 text-gray-300",
                                                    children: team.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/TeamsSection.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 text-gray-300 uppercase",
                                                    children: team.abbreviation
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/TeamsSection.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border border-zinc-700 px-4 py-3 text-gray-300",
                                                    children: team.tournament
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/TeamsSection.tsx",
                                                    lineNumber: 232,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, team._id, true, {
                                            fileName: "[project]/app/components/TeamsSection.tsx",
                                            lineNumber: 221,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TeamsSection.tsx",
                                    lineNumber: 219,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TeamsSection.tsx",
                            lineNumber: 205,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/TeamsSection.tsx",
                        lineNumber: 204,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TeamsSection.tsx",
                lineNumber: 184,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$teams$2f$CreateTeamModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isCreateModalOpen,
                onClose: ()=>setIsCreateModalOpen(false),
                onSuccess: handleTeamCreated,
                tournaments: tournaments
            }, void 0, false, {
                fileName: "[project]/app/components/TeamsSection.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CreateTournamentModal, {
                isOpen: isCreateTournamentModalOpen,
                onClose: ()=>setIsCreateTournamentModalOpen(false),
                onSuccess: fetchTournaments
            }, void 0, false, {
                fileName: "[project]/app/components/TeamsSection.tsx",
                lineNumber: 251,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditTeamModal, {
                isOpen: isEditModalOpen,
                onClose: ()=>{
                    setIsEditModalOpen(false);
                    setSelectedTeam(null);
                },
                onSuccess: handleTeamUpdated,
                team: selectedTeam
            }, void 0, false, {
                fileName: "[project]/app/components/TeamsSection.tsx",
                lineNumber: 257,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/TeamsSection.tsx",
        lineNumber: 143,
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
"[project]/app/components/WaitlistSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WaitlistSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function WaitlistSection() {
    _s();
    const [waitlist, setWaitlist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const fetchWaitlist = async ()=>{
        try {
            setLoading(true);
            setError("");
            const res = await fetch("/api/waitlist", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (!res.ok) {
                const errorData = await res.json().catch(()=>({}));
                throw new Error(errorData.message || "Failed to fetch waitlist");
            }
            const response = await res.json();
            const data = response.success && response.data.data ? response.data.data : [];
            setWaitlist(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load waitlist");
            setWaitlist([]);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WaitlistSection.useEffect": ()=>{
            fetchWaitlist();
        }
    }["WaitlistSection.useEffect"], []);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-400",
                children: "Loading waitlist..."
            }, void 0, false, {
                fileName: "[project]/app/components/WaitlistSection.tsx",
                lineNumber: 47,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/WaitlistSection.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center h-full p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-400",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/WaitlistSection.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/components/WaitlistSection.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-white",
                    children: "Waitlist"
                }, void 0, false, {
                    fileName: "[project]/app/components/WaitlistSection.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/WaitlistSection.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            waitlist.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-zinc-800 rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400",
                    children: "No waitlist entries yet."
                }, void 0, false, {
                    fileName: "[project]/app/components/WaitlistSection.tsx",
                    lineNumber: 68,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/WaitlistSection.tsx",
                lineNumber: 67,
                columnNumber: 9
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
                                        children: "Email"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/WaitlistSection.tsx",
                                        lineNumber: 75,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                        children: "Type"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/WaitlistSection.tsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "border border-zinc-700 px-4 py-3 text-left text-sm font-semibold text-white",
                                        children: "Submission Time"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/WaitlistSection.tsx",
                                        lineNumber: 81,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/WaitlistSection.tsx",
                                lineNumber: 74,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/WaitlistSection.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: waitlist.map((entry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-zinc-800/50 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "border border-zinc-700 px-4 py-3 text-gray-300",
                                            children: entry.email
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/WaitlistSection.tsx",
                                            lineNumber: 92,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "border border-zinc-700 px-4 py-3 text-gray-300",
                                            children: entry.type
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/WaitlistSection.tsx",
                                            lineNumber: 95,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "border border-zinc-700 px-4 py-3 text-gray-300",
                                            children: entry.submissionTime
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/WaitlistSection.tsx",
                                            lineNumber: 98,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, entry._id, true, {
                                    fileName: "[project]/app/components/WaitlistSection.tsx",
                                    lineNumber: 88,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/components/WaitlistSection.tsx",
                            lineNumber: 86,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/WaitlistSection.tsx",
                    lineNumber: 72,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/WaitlistSection.tsx",
                lineNumber: 71,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/WaitlistSection.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_s(WaitlistSection, "4VgCTIL9IfUv90JGUfQTlGDiNKk=");
_c = WaitlistSection;
var _c;
__turbopack_context__.k.register(_c, "WaitlistSection");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$UsersSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/UsersSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$quiz$2f$QuizzesSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/quiz/QuizzesSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$predictions$2f$PredictionsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/predictions/PredictionsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LeaderboardSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/LeaderboardSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TeamsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/TeamsSection.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WaitlistSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/WaitlistSection.tsx [app-client] (ecmascript)");
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
const VALID_SECTIONS = [
    "users",
    "quizzes",
    "predictions",
    "leaderboard",
    "teams",
    "waitlist"
];
function HomeContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const sectionFromUrl = searchParams.get("section");
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "HomeContent.useState": ()=>sectionFromUrl && VALID_SECTIONS.includes(sectionFromUrl) ? sectionFromUrl : "users"
    }["HomeContent.useState"]);
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
    // Don't render content if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }
    const renderContent = ()=>{
        switch(activeSection){
            case "users":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$UsersSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 48,
                    columnNumber: 16
                }, this);
            case "quizzes":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$quiz$2f$QuizzesSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 50,
                    columnNumber: 16
                }, this);
            case "predictions":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$predictions$2f$PredictionsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 52,
                    columnNumber: 16
                }, this);
            case "leaderboard":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LeaderboardSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 54,
                    columnNumber: 16
                }, this);
            case "teams":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TeamsSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 56,
                    columnNumber: 16
                }, this);
            case "waitlist":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$WaitlistSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 58,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$UsersSection$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 60,
                    columnNumber: 16
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen  font-sans bg-black",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                activeSection: activeSection,
                onSectionChange: setActiveSection
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: renderContent()
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(HomeContent, "2B4Dlly4kap9zB951a/uArcDT+Q=", false, function() {
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
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 79,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HomeContent, {}, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 77,
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

//# sourceMappingURL=app_82738c2c._.js.map