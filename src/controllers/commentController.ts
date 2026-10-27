import type { Request, Response } from "express";
import prisma from "../config/prisma";
import { HttpError } from "../utils/http-error";
import { parseId } from "../utils/parse";
import { sendSuccess } from "../utils/response";

const commentRelations = {
  post: { select: { id: true, title: true } },
  author: { select: { id: true, name: true, email: true } },
};

export const createComment = async (req: Request, res: Response) => {
  const { content, postId, authorId } = req.body ?? {};

  if (typeof content !== "string" || !content.trim() || !postId || !authorId) {
    throw new HttpError(400, "Content, postId, dan authorId wajib diisi");
  }

  const parsedPostId = parseId(postId);
  const parsedAuthorId = parseId(authorId);

  const [post, author] = await Promise.all([
    prisma.post.findUnique({ where: { id: parsedPostId } }),
    prisma.user.findUnique({ where: { id: parsedAuthorId } }),
  ]);

  if (!post) throw new HttpError(404, "Post tidak ditemukan");
  if (!author) throw new HttpError(404, "User tidak ditemukan");

  const comment = await prisma.comment.create({
    data: { content: content.trim(), postId: parsedPostId, authorId: parsedAuthorId },
    include: commentRelations,
  });

  sendSuccess(res, 201, "Comment berhasil dibuat", comment);
};

export const getAllComments = async (_req: Request, res: Response) => {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: commentRelations,
  });

  sendSuccess(res, 200, "Berhasil mengambil data comments", comments);
};

export const getCommentById = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: commentRelations,
  });

  if (!comment) throw new HttpError(404, "Comment tidak ditemukan");

  sendSuccess(res, 200, "Berhasil mengambil data comment", comment);
};

export const updateComment = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const { content } = req.body ?? {};

  if (typeof content !== "string" || !content.trim()) {
    throw new HttpError(400, "Content wajib diisi");
  }

  const comment = await prisma.comment.update({
    where: { id },
    data: { content: content.trim() },
    include: commentRelations,
  });

  sendSuccess(res, 200, "Comment berhasil diupdate", comment);
};

export const deleteComment = async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  await prisma.comment.delete({ where: { id } });

  sendSuccess(res, 200, "Comment berhasil dihapus");
};