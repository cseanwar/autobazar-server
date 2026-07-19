export declare function createAuth(): import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    baseURL: string;
    trustedOrigins: string[];
    emailAndPassword: {
        enabled: true;
        autoSignIn: true;
    };
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
        };
    };
    advanced: {
        defaultCookieAttributes: {
            secure: boolean;
            httpOnly: true;
            sameSite: "none" | "lax";
        };
    };
}>;
//# sourceMappingURL=auth.d.ts.map