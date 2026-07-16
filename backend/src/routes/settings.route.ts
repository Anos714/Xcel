import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controllers";

const router = Router();


router.get('/',getSettings);
router.patch('/:settingId',updateSettings);

export default router;