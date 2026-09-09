import { prisma } from "../lib/prisma";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validation/schemas";

// Projelerde "published" gibi bir gorunurluk alani YOK:
// portfolyoya eklenen her proje gosterilmek icin eklenir.
// Yaziyla arasindaki bu fark bilincli, gozden kacan bir eksik degil.

export function getAllProjects() {
  return prisma.project.findMany({
    orderBy: [
      { featured: "desc" }, // önce öne çıkanlar
      { createdAt: "desc" }, // sonra yeniden eskiye
    ],
  });
}

export function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
  });
}

export function createProject(data: CreateProjectInput) {
  return prisma.project.create({ data });
}

export function updateProject(slug: string, data: UpdateProjectInput) {
  return prisma.project.update({
    where: { slug },
    data,
  });
}

export function deleteProject(slug: string) {
  return prisma.project.delete({
    where: { slug },
  });
}
