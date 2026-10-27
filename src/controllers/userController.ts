import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

export const getUserPosts = async (req: Request, res: Response) => {
  const userId = parseId(req.params.id);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const published =
    req.query.published === undefined
      ? undefined
      : req.query.published === "true";

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) throw new HttpError(404, "User tidak ditemukan");

  const where = {
    authorId: userId,
    ...(published !== undefined && { published }),
  };

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.count({ where }),
  ]);

  sendSuccess(res, 200, "Berhasil mengambil data posts milik user", posts, {
    currentPage: page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  });
};