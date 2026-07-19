import { Router } from "express";
import * as ItemsController from "../controllers/items.controller.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.get("/", ItemsController.getAllItems);
router.get("/my", requireAuth, ItemsController.getMyItems);
router.get("/:id", ItemsController.getItemById);
router.post("/", requireAuth, ItemsController.createItem);
router.put("/:id", requireAuth, ItemsController.updateItem);
router.delete("/:id", requireAuth, ItemsController.deleteItem);
export default router;
//# sourceMappingURL=items.js.map