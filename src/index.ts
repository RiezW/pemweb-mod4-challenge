import "dotenv/config";
import express from "express";
import prisma from "./config/prisma";
import { errorHandler, notFound } from "./middlewares/error";
import router from "./routes";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("Server is up and running");
});

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: true, message: "Server dan database OK" });
});

app.use("/api", router);

// Letakkan setelah semua endpoint dan router.
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, (error?: Error) => {
  if (error) throw error;
  console.log(`Express is running on Port ${PORT}`);
});