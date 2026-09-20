import { Router } from "express";
import { automation, automationStream } from "../controllers/automation.controller";

const router = Router();

router.post("/run", automation);
router.post("/run/stream", automationStream);

export default router;
