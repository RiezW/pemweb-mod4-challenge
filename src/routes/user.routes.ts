import { Router } from "express";
import { getUserPosts } from "../controllers/userController";

const router = Router();

router.get("/:id/posts", getUserPosts);

export default router;