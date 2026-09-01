import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import * as projectService from "../services/projectService";

export async function createProject(req: Request, res: Response) {
  const { title, slug, description, imageUrl, githubUrl, demoUrl, featured } =
    req.body;

  if (!title || !slug || !description) {
    res.status(400).json({ error: "title, slug ve description zorunludur" });
    return;
  }

  try {
    const newProject = await projectService.createProject({
      title,
      slug,
      description,
      imageUrl,
      githubUrl,
      demoUrl,
      featured,
    });
    res.status(201).json(newProject);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({ error: `"${slug}" slug'i zaten kullaniliyor` });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Proje olusturulurken bir hata olustu" });
  }
}

export async function listProjects(req: Request, res: Response) {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "proje gelirken bir hata oldu" });
  }
}

export async function getProject(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;

  try {
    const project = await projectService.getProjectBySlug(slug);

    if (!project) {
      res.status(404).json({ error: `"${slug}" slug'li proje bulunamadi` });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Proje getirilirken bir hata olustu" });
  }
}

export async function updateProject(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;
  const {
    title,
    slug: newSlug,
    description,
    imageUrl,
    githubUrl,
    demoUrl,
    featured,
  } = req.body;

  try {
    // Gonderilmeyen alanlar undefined kalir; Prisma onlari atlar.
    const updated = await projectService.updateProject(slug, {
      title,
      slug: newSlug,
      description,
      imageUrl,
      githubUrl,
      demoUrl,
      featured,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ error: `"${slug}" slug'li yazi bulunamadi` });
        return;
      }
      if (error.code === "P2002") {
        res
          .status(409)
          .json({ error: `"${newSlug}" slug'i zaten kullaniliyor` });
        return;
      }
    }

    console.error(error);
    res.status(500).json({ error: "Proje guncellenirken bir hata olustu" });
  }
}

export async function deleteProject(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;

  try {
    await projectService.deleteProject(slug);
    res.status(204).send();
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ error: `"${slug}" slug'li yazi bulunamadi` });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Proje silinirken bir hata olustu" });
  }
}
