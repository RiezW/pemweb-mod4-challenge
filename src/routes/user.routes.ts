import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserPosts,
  updateUser,
} from "../controllers/userController";
import { createUserSchema } from "../validations/schema";
import { validate } from "../middlewares/validate";

const router = Router();

// Ridwan (6) : CRUD Standar User
router.post("/", validate(createUserSchema), createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// Challenge 2: Ambil post milik satu user
router.get("/:id/posts", getUserPosts);

// Ridwan (6) : Update & Delete User
router.patch("/:id", validate(createUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;