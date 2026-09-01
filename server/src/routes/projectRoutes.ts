import { Router } from "express";
import * as projectController from "../controllers/projectController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

// --- HERKESE ACIK (okuma) ---
router.get("/", projectController.listProjects);
router.get("/:slug", projectController.getProject);

// --- KORUMALI (yazma) ---
router.post("/", requireAuth, projectController.createProject);
router.put("/:slug", requireAuth, projectController.updateProject);
router.delete("/:slug", requireAuth, projectController.deleteProject);

export default router;
