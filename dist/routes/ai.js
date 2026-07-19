import { Router } from "express";
import * as AIController from "../controllers/ai.controller.js";
const router = Router();
router.post("/generate-description", AIController.generateDescription);
router.post("/chat", AIController.chat);
router.post("/analyze", AIController.analyzeData);
export default router;
//# sourceMappingURL=ai.js.map