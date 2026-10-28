import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body ?? {}); // Express 5: body bisa undefined

    if (!result.success) {
      res.status(400).json({
        status: false,
        message: "Validasi gagal",
        errors: result.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
      return;
    }

    req.body = result.data; // data bersih, field asing dibuang
    next();
  };