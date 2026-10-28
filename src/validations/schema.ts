import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email("Format email tidak valid"),
  name: z.string().trim().min(1, "Nama tidak boleh kosong").optional(),
  password: z
    .string("Password wajib diisi")
    .min(8, "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),
});

export const createPostSchema = z.object({
  title: z
    .string("Title wajib diisi")
    .trim()
    .min(1, "Title tidak boleh kosong")
    .max(200, "Title maksimal 200 karakter"),
  content: z.string().optional(),
  published: z.boolean().optional(),
  authorId: z
    .number("authorId harus berupa angka")
    .int()
    .positive("authorId harus bilangan bulat positif"),
});

export const bulkPostSchema = z
  .array(createPostSchema, "Body harus berupa array post")
  .min(1, "Array tidak boleh kosong")
  .max(100, "Maksimal 100 post per request");

export const createCommentSchema = z.object({
  content: z
    .string("content wajib diisi")
    .trim()
    .min(1, "content tidak boleh kosong"),
  postId: z.number("postId harus berupa angka").int().positive(),
  authorId: z.number("authorId harus berupa angka").int().positive(),
});