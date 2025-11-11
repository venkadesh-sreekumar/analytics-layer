import express from "express";
import { trackEvent } from "../controllers/analytics.controller.js";

const router = express.Router();

router.post("/track", trackEvent);

export default router;
