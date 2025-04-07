import { body, validationResult } from "express-validator";
import type { RequestHandler } from "express";

export const validateUrl: RequestHandler[] = [
  body("original").isURL().withMessage("Invalid URL format"),
  ((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  }) as RequestHandler,
];
