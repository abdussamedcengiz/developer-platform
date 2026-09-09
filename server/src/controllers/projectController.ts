import type { Request, Response } from "express";
import * as projectService from "../services/projectService";
import { ApiError } from "../utils/ApiError";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validation/schemas";

export async function listProjects(_req: Request, res: Response) {
  const projects = await projectService.getAllProjects();
  res.json(projects);
}

export async function getProject(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;

  const project = await projectService.getProjectBySlug(slug);

  if (!project) {
    // Onceki surumde bu mesaj "yazi bulunamadi" diyordu --
    // post controller'dan kopyalanmis ve duzeltilmemisti.
    throw ApiError.notFound(`"${slug}" slug'lı proje bulunamadı`);
  }

  res.json(project);
}

export async function createProject(req: Request, res: Response) {
  const data = req.body as CreateProjectInput;

  const newProject = await projectService.createProject(data);

  res.status(201).json(newProject);
}

export async function updateProject(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;
  const data = req.body as UpdateProjectInput;

  const updated = await projectService.updateProject(slug, data);

  res.json(updated);
}

export async function deleteProject(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;

  await projectService.deleteProject(slug);

  res.status(204).send();
}
