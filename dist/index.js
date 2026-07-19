import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { createAuth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import itemsRouter from "./routes/items.js";
import aiRouter from "./routes/ai.js";
import contactRouter from "./routes/contact.js";
const app = express();
const PORT = parseInt(process.env.PORT || "5000");
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser());
async function start() {
    try {
        await connectDB();
        const auth = createAuth();
        app.all(/^\/api\/auth(?:\/.*)?$/, toNodeHandler(auth));
        app.use(express.json());
        app.use("/api/items", itemsRouter);
        app.use("/api/ai", aiRouter);
        app.use("/api/contact", contactRouter);
        app.get("/api/health", (_req, res) => {
            res.json({ status: "ok", timestamp: new Date().toISOString() });
        });
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=index.js.map