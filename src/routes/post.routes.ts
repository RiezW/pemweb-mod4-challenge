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

const router = Router();

// Wajib ditaruh di ATAS rute /:id
router.post("/bulk", createBulkPosts);
router.get("/stats/daily", getDailyPostStats);

// Rute standar
router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);

export default router;