import { Router } from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  updateComment,
} from "../controllers/commentController";
import { createCommentSchema } from "../validations/schema";
import { validate } from "../middlewares/validate";

const router = Router();

router.post("/", validate(createCommentSchema), createComment);
router.get("/", getAllComments);
router.get("/:id", getCommentById);
router.patch("/:id", validate(createCommentSchema), updateComment);
router.delete("/:id", deleteComment);

export default router;