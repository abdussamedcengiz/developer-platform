import { prisma } from "../lib/prisma";

type CreateProjectInput = {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
};

type UpdateProjectInput = {
  title?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
};

export function getAllProjects() {
  return prisma.project.findMany({
    orderBy: [
      { featured: "desc" }, // önce öne çıkanlar
      { createdAt: "desc" }, // sonra yeniden eskiye
    ],
  });
}

export function createProject(data: CreateProjectInput) {
  return prisma.project.create({ data });
}

export function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
  });
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
