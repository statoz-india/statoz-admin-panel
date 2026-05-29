module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/utils/api-helper.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACCESSTOKEN",
    ()=>ACCESSTOKEN,
    "REFRESH_TOKEN_COOKIE",
    ()=>REFRESH_TOKEN_COOKIE,
    "authenticatedFetch",
    ()=>authenticatedFetch,
    "clearSessionCookies",
    ()=>clearSessionCookies,
    "errorResponse",
    ()=>errorResponse,
    "getRefreshTokenCookie",
    ()=>getRefreshTokenCookie,
    "getSessionCookie",
    ()=>getSessionCookie,
    "handleExternalApiResponse",
    ()=>handleExternalApiResponse,
    "noRecordFound",
    ()=>noRecordFound,
    "requireAuth",
    ()=>requireAuth,
    "successResponse",
    ()=>successResponse,
    "tryRefreshAccessToken",
    ()=>tryRefreshAccessToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
const ACCESSTOKEN = "accesstoken";
const REFRESH_TOKEN_COOKIE = "refreshtoken";
const API_BASE_URL = process.env.API_BASE_URL;
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
};
async function getSessionCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    // Try multiple possible cookie names (backend might use different casing)
    return cookieStore.get(ACCESSTOKEN)?.value || // "accesstoken"
    cookieStore.get("accessToken")?.value || // "accessToken"
    cookieStore.get("accesstoken")?.value // lowercase variant
    ;
}
async function getRefreshTokenCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || cookieStore.get("refreshToken")?.value;
}
async function clearSessionCookies() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(ACCESSTOKEN);
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    cookieStore.set("accessToken", "");
    cookieStore.set("refreshToken", "");
    cookieStore.set(REFRESH_TOKEN_COOKIE, "");
}
async function tryRefreshAccessToken() {
    const refreshToken = await getRefreshTokenCookie();
    if (!refreshToken || !API_BASE_URL) return null;
    const res = await fetch(`${API_BASE_URL}/users/refresh-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refreshToken
        })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success || !data.data?.accessToken) return null;
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(ACCESSTOKEN, data.data.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24
    });
    if (data.data.refreshToken) {
        cookieStore.set(REFRESH_TOKEN_COOKIE, data.data.refreshToken, {
            ...COOKIE_OPTIONS,
            maxAge: 60 * 60 * 24 * 7
        });
    }
    return data.data.accessToken;
}
async function requireAuth() {
    const sessionCookie = await getSessionCookie();
    if (!sessionCookie) {
        throw __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Unauthorized"
        }, {
            status: 401
        });
    }
    return sessionCookie;
}
async function authenticatedFetch(endpoint, options = {}) {
    const sessionCookie = await getSessionCookie();
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const xsrfToken = cookieStore.get("XSRF-TOKEN")?.value;
    if (!sessionCookie) {
        throw await errorResponse();
    }
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
    const headers = {
        "Content-Type": "application/json",
        "Cache-Control": "private,no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        Cookie: `accessToken=${sessionCookie}`,
        ...options.headers
    };
    if (xsrfToken) {
        headers["X-XSRF-TOKEN"] = xsrfToken;
        headers["Cookie"] += ` ; XSRF-TOKEN=${xsrfToken}`;
    }
    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include"
    });
    if (response.status === 401 || response.status === 498) {
        const newToken = await tryRefreshAccessToken();
        if (newToken) {
            const retryHeaders = {
                ...headers,
                Cookie: `accessToken=${newToken}`
            };
            if (xsrfToken) {
                retryHeaders["X-XSRF-TOKEN"] = xsrfToken;
                retryHeaders["Cookie"] += ` ; XSRF-TOKEN=${xsrfToken}`;
            }
            const retryResponse = await fetch(url, {
                ...options,
                headers: retryHeaders,
                credentials: "include"
            });
            if (retryResponse.status === 401) {
                try {
                    await clearSessionCookies();
                } catch (e) {
                    console.error("Error clearing session cookies:", e);
                }
            }
            return retryResponse;
        }
        try {
            await clearSessionCookies();
        } catch (error) {
            console.error("Error clearing session cookies:", error);
        }
    }
    if (response.status === 404) {}
    return response;
}
async function noRecordFound() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: "No record found"
    }, {
        status: 404
    });
}
async function errorResponse() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: "Unauthorized"
    }, {
        status: 401
    });
}
async function handleExternalApiResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch  {
            errorData = {
                message: errorText || "External API error"
            };
        }
        throw new Error(typeof errorData.error === "string" ? errorData.error : typeof errorData.message === "string" ? errorData.message : "External API request failed");
    }
    const text = await response.text();
    if (!text) {
        throw new Error("Empty response from external API");
    }
    return JSON.parse(text);
}
function successResponse(data, options = {}, metadata) {
    const { message, ...init } = options;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        data,
        metadata: metadata,
        ...message ? {
            message
        } : {}
    }, init);
}
}),
"[project]/app/api/waitlist/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/utils/api-helper.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticatedFetch"])("/waitlist/getAllWaitlist");
        if (response.status === 401) {
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])();
        }
        console.log(response);
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleExternalApiResponse"])(response);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])(data, {
            status: 200
        });
    } catch (error) {
        // If error is a NextResponse (from authenticatedFetch), return it
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return error;
        }
        console.error("Error fetching waitlist:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to fetch waitlist users"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__84cb91ec._.js.map