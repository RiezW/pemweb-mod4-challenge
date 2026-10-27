// Ridwan

import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

const authorSelect = { select: { id: true, name: true, email: true } };

// Challenge 4: Bulk Create Posts
export const createBulkPosts = async (req: Request, res: Response) => {
  const posts = req.body;

  if (!Array.isArray(posts) || posts.length === 0) {
    throw new HttpError(400, "Body harus berupa array post dan tidak boleh kosong");
  }

  // Validasi setiap item di array
  for (const post of posts) {
    if (!post.title || !post.authorId) {
      throw new HttpError(400, "Setiap item post wajib memiliki title dan authorId");
    }
  }

  const result = await prisma.post.createMany({
    data: posts.map((p) => ({
      title: p.title,
      content: p.content,
      published: p.published ?? false,
      authorId: Number(p.authorId),
    })),
  });

  sendSuccess(res, 201, `Berhasil membuat ${result.count} post`, result);
};

// Challenge 3: Statistik Post per Hari (date_trunc)
export const getDailyPostStats = async (_req: Request, res: Response) => {
  // COUNT(*)::int digunakan agar hasilnya bertipe number (bukan BigInt)
  const stats = await prisma.$queryRaw<Array<{ day: Date; total: number }>>`
    SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::int AS total
    FROM "Post"
    GROUP BY day
    ORDER BY day DESC
  `;

  sendSuccess(res, 200, "Berhasil mengambil statistik harian post", stats);
};

// CRUD Standar Post
export const createPost = async (req: Request, res: Response) => {
  const { title, content, authorId } = req.body ?? {};
  if (!title || !authorId) throw new HttpError(400, "Title dan authorId wajib diisi");

  const post = await prisma.post.create({
    data: { title, content, authorId: parseId(authorId) },
    include: { author: authorSelect },
  });

  sendSuccess(res, 201, "Post berhasil dibuat", post);
};

export const getAllPosts = async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const search = typeof req.query.search === "string" ? req.query.search : "";

  const where = {
    ...(search && { title: { contains: search, mode: "insensitive" as const } }),
  };

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { author: authorSelect },
    }),
    prisma.post.count({ where }),
  ]);

  sendSuccess(res, 200, "Berhasil mengambil data posts", posts, {
    currentPage: page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
  });
};

export const getPostById = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: authorSelect, comments: true },
  });
  if (!post) throw new HttpError(404, "Post tidak ditemukan");

  sendSuccess(res, 200, "Berhasil mengambil data post", post);
};

export const deletePost = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  await prisma.post.delete({ where: { id } });
  sendSuccess(res, 200, "Post berhasil dihapus");
};