import { Router } from "express";
import {
  createQuery,
  deleteQuery,
  getQueries,
  updateQuery,
} from "../controllers/query.controller";

const router = Router();

router.post("/", createQuery);
router.get("/", getQueries);
router.patch("/:id", updateQuery);
router.delete("/:id", deleteQuery);

export default router;
