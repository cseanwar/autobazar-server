import { fromNodeHeaders } from "better-auth/node";
import { createAuth } from "../lib/auth.js";
export async function requireAuth(req, res, next) {
    try {
        const auth = createAuth();
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        if (!session?.user) {
            res.status(401).json({ success: false, error: "Unauthorized" });
            return;
        }
        req.userId = session.user.id;
        req.session = session;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, error: "Unauthorized" });
    }
}
//# sourceMappingURL=auth.js.map