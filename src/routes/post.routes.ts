// Ridwan
import { Router } from "express";
import {
  createBulkPosts,
  createPost,
  deletePost,
  getAllPosts,
  getDailyPostStats,
  getPostById,
} from "../controllers/postController";

import { validate } from "../middlewares/validate";
import { bulkPostSchema, createPostSchema } from "../validations/schema";

const router = Router();

// Wajib ditaruh di ATAS rute /:id
router.post("/bulk", validate(bulkPostSchema), createBulkPosts); // baris 18
router.post("/", validate(createPostSchema), createPost);

// Rute standar
router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);

export default router;