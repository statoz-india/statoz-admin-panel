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
    "authenticatedFetch",
    ()=>authenticatedFetch,
    "clearSessionCookies",
    ()=>clearSessionCookies,
    "errorResponse",
    ()=>errorResponse,
    "getSessionCookie",
    ()=>getSessionCookie,
    "handleExternalApiResponse",
    ()=>handleExternalApiResponse,
    "requireAuth",
    ()=>requireAuth,
    "successResponse",
    ()=>successResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
const ACCESSTOKEN = "accesstoken";
const API_BASE_URL = process.env.API_BASE_URL;
async function getSessionCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    // Try multiple possible cookie names (backend might use different casing)
    return cookieStore.get(ACCESSTOKEN)?.value || // "accesstoken"
    cookieStore.get("accessToken")?.value || // "accessToken"
    cookieStore.get("accesstoken")?.value // lowercase variant
    ;
}
async function clearSessionCookies() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(ACCESSTOKEN);
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.set("accessToken", "");
    cookieStore.set("refreshToken", "");
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
    if (response.status == 401) {
        try {
            await clearSessionCookies();
        } catch (error) {
            console.error("Error clearing session cookies:", error);
        }
    }
    return response;
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
"[project]/app/api/predictions/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/utils/api-helper.ts [app-route] (ecmascript)");
;
;
async function GET(request, context) {
    try {
        const params = await Promise.resolve(context.params);
        const id = params.id;
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Quiz ID is required"
            }, {
                status: 400
            });
        }
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticatedFetch"])(`/prediction/${id}`);
        if (response.status === 401) {
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])();
        }
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleExternalApiResponse"])(response);
        console.log(data);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$api$2d$helper$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])(data, {
            status: 200
        });
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"]) {
            return error;
        }
        console.error("Error fetching users:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to fetch quizes"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b5e03dcd._.js.map