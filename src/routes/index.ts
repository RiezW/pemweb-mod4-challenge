import { Router } from "express";
import commentRouter from "./comment.routes";
import postRouter from "./post.routes"; // Ridwan
import userRouter from "./user.routes";

const router = Router();

router.use("/users", userRouter);
router.use("/posts", postRouter); // Ridwan
router.use("/comments", commentRouter);

export default router;