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
"[project]/app/api/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OPTIONS",
    ()=>OPTIONS,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/utils/const-helpers.ts [app-route] (ecmascript)");
;
;
const API_BASE_URL = process.env.API_BASE_URL;
async function POST(request) {
    try {
        const body = await request.json();
        if (!body.email || !body.password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Email and password are required"
            }, {
                status: 400
            });
        }
        if (body.password.length < 6) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Password must be at least 6 characters"
            }, {
                status: 400
            });
        }
        const response = await fetch(`${API_BASE_URL}/authorization/email-password-auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: body.email,
                password: body.password,
                name: body.name,
                deviceType: body.deviceType ?? "web"
            })
        });
        const data = await response.json();
        const nextResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data, {
            status: response.status
        });
        if (data?.success && data?.data?.accessToken) {
            nextResponse.cookies.set(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACCESS_TOKEN"], data.data.accessToken, {
                httpOnly: true,
                secure: ("TURBOPACK compile-time value", "development") === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24
            });
            if (data.data.refreshToken) {
                nextResponse.cookies.set(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$utils$2f$const$2d$helpers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["REFRESH_TOKEN"], data.data.refreshToken, {
                    httpOnly: true,
                    secure: ("TURBOPACK compile-time value", "development") === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7
                });
            }
        }
        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader) {
            nextResponse.headers.set("set-cookie", setCookieHeader);
        }
        nextResponse.headers.set("Access-Control-Allow-Origin", "*");
        nextResponse.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
        nextResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
        nextResponse.headers.set("Access-Control-Allow-Credentials", "true");
        return nextResponse;
    } catch (error) {
        console.error("Proxy error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Failed to connect to backend server"
        }, {
            status: 500
        });
    }
}
async function OPTIONS() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3270fb35._.js.map