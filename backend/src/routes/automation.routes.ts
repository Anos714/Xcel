import { Router } from "express";
import { automation } from "../controllers/automation.controller";

const router = Router();

router.post("/run", automation);

export default router;
