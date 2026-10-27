import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserPosts,
  updateUser,
} from "../controllers/userController";

const router = Router();

// Ridwan (6) : CRUD Standar User
router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// Challenge 2: Ambil post milik satu user
router.get("/:id/posts", getUserPosts);

// Ridwan (6) : Update & Delete User
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;