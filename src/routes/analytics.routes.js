import express from "express";
import { 
  trackEvent, 
  getSubmissionAnalytics, 
  getEventAnalytics,
  getFullAnalytics 
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Track events
router.post("/track", trackEvent);

// Get submission analytics for a form
router.get("/submissions/:formId", getSubmissionAnalytics);

// Get event analytics for a form (optional eventType query parameter)
router.get("/events/:formId", getEventAnalytics);

// Get combined analytics (submissions + events)
router.get("/full/:formId", getFullAnalytics);

export default router;
