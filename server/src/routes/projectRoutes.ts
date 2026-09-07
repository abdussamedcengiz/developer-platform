import { Router } from "express";
import * as projectController from "../controllers/projectController";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validate";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validation/schemas";

const router = Router();

// --- HERKESE ACIK (okuma) ---
// Projelerde taslak kavrami yok; optionalAuth'a gerek de yok.
router.get("/", projectController.listProjects);
router.get("/:slug", projectController.getProject);

// --- KORUMALI (yazma) ---
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(createProjectSchema),
  projectController.createProject,
);
router.put(
  "/:slug",
  requireAuth,
  requireAdmin,
  validateBody(updateProjectSchema),
  projectController.updateProject,
);
router.delete(
  "/:slug",
  requireAuth,
  requireAdmin,
  projectController.deleteProject,
);

export default router;
