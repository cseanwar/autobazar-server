import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getDB } from "../config/db.js";
export function createAuth() {
    const db = getDB();
    return betterAuth({
        database: mongodbAdapter(db, {
            usePlural: true,
        }),
        baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
        trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
        },
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID || "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            },
        },
        advanced: {
            defaultCookieAttributes: {
                secure: process.env.NODE_ENV === "production",
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            },
        },
    });
}
//# sourceMappingURL=auth.js.map