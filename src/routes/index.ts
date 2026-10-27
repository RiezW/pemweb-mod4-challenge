import { Router } from "express";
import commentRouter from "./comment.routes";
import userRouter from "./user.routes";

const router = Router();

router.use("/comments", commentRouter);
router.use("/users", userRouter);

export default router;