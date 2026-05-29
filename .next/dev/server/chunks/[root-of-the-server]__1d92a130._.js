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
"[project]/app/api/utils/const-helpers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACCESS_TOKEN",
    ()=>ACCESS_TOKEN,
    "REFRESH_TOKEN",
    ()=>REFRESH_TOKEN
]);
const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";
}),
"[project]/app/api/utils/api-helper.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticatedFetch",
    ()=>authenticatedFetch,
    "clearRefreshTokeCookies",
    ()=>clearRefreshTokeCookies,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/utils/const-helpers.ts [app-route] (ecmascript)");
;
;
;
const API_BASE_URL = process.env.API_BASE_URL;
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/"
};
async function getSessionCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACCESS_TOKEN"])?.value;
}
async function getRefreshTokenCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["REFRESH_TOKEN"])?.value;
}
async function clearSessionCookies() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACCESS_TOKEN"]);
    cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACCESS_TOKEN"], "");
}
async function clearRefreshTokeCookies() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["REFRESH_TOKEN"]);
    cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["REFRESH_TOKEN"], "");
}
let refreshPromise = null;
async function tryRefreshAccessToken() {
    if (refreshPromise) {
        return refreshPromise;
    }
    refreshPromise = (async ()=>{
        try {
            const refreshToken = await getRefreshTokenCookie();
            if (!refreshToken || !API_BASE_URL) {
                if (!API_BASE_URL) {
                    console.error("[auth] Refresh skipped: API_BASE_URL is not set");
                } else {
                    console.error("[auth] Refresh skipped: no refresh token in request cookies");
                }
                try {
                    await clearSessionCookies();
                } catch (e) {
                    console.error("Error clearing cookies:", e);
                }
                return null;
            }
            const res = await fetch(`${API_BASE_URL}/authorization/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            });
            if (!res.ok) {
                const errText = await res.text();
                console.error(`[auth] Refresh failed: backend returned ${res.status}`, errText ? errText.slice(0, 200) : "");
                return null;
            }
            let data;
            try {
                data = await res.json();
            } catch (e) {
                console.error("[auth] Refresh failed: invalid JSON response");
                return null;
            }
            if (!data.success || !data.data?.accessToken) {
                console.error("[auth] Refresh failed: success=false or no accessToken in response");
                return null;
            }
            const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
            cookieStore.set(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACCESS_TOKEN"], data.data.accessToken, {
                ...COOKIE_OPTIONS,
                maxAge: 60 * 60 * 24
            });
            return data.data.accessToken;
        } finally{
            refreshPromise = null;
        }
    })();
    return refreshPromise;
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
async function buildAuthHeaders(sessionCookie) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const xsrfToken = cookieStore.get("XSRF-TOKEN")?.value;
    const headers = {
        "Content-Type": "application/json",
        "Cache-Control": "private,no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        Cookie: `accessToken=${sessionCookie ?? ""}`
    };
    if (xsrfToken) {
        headers["X-XSRF-TOKEN"] = xsrfToken;
        headers["Cookie"] += ` ; XSRF-TOKEN=${xsrfToken}`;
    }
    return headers;
}
async function authenticatedFetch(endpoint, options = {}) {
    const sessionCookie = await getSessionCookie();
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
    const headers = {
        ...await buildAuthHeaders(sessionCookie),
        ...options.headers
    };
    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include"
    });
    // On token expired / unauthorized, try refresh and retry once with new token
    if (response.status === 498) {
        const newToken = await tryRefreshAccessToken();
        if (newToken) {
            const retryHeaders = {
                ...await buildAuthHeaders(newToken),
                ...options.headers
            };
            const retryResponse = await fetch(url, {
                ...options,
                headers: retryHeaders,
                credentials: "include"
            });
            if (!retryResponse.ok) {
                console.error(`[auth] Retry after refresh still failed: ${retryResponse.status} for ${endpoint}`);
            }
            return retryResponse;
        }
        console.error(`[auth] Token refresh failed for ${endpoint}; returning original ${response.status}`);
    }
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
async function errorResponse(message) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: message ?? "Unauthorized"
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
"[project]/app/api/events/[id]/distribute-payout/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/utils/api-helper.ts [app-route] (ecmascript)");
;
;
async function POST(_request, context) {
    try {
        const params = await Promise.resolve(context.params);
        const id = params.id?.trim();
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Event ID is required"
            }, {
                status: 400
            });
        }
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticatedFetch"])(`/events/distributeEventPayouts/${encodeURIComponent(id)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });
        if (response.status === 401 || response.status === 498) {
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("Session expired. Please log in again.");
        }
        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch  {
                errorData = {
                    message: errorText || "Failed to distribute payouts"
                };
            }
            const nestedError = errorData.data && typeof errorData.data === "object" && errorData.data !== null && "error" in errorData.data && typeof errorData.data.error === "string" ? errorData.data.error : null;
            const errorMessage = nestedError ?? (typeof errorData.error === "string" ? errorData.error : typeof errorData.message === "string" ? errorData.message : `Failed to distribute payouts (Status: ${response.status})`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: errorMessage
            }, {
                status: response.status || 500
            });
        }
        const backendResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleExternalApiResponse"])(response);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])(backendResponse.data ?? backendResponse, {
            status: 200
        });
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return error;
        }
        console.error("Error distributing event payouts:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to distribute payouts"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1d92a130._.js.map