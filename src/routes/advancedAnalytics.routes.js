import express from "express";
import { 
  getAdvancedAnalytics, 
  getUserAnalyticsData,
  getFormAnalyticsSummary 
} from "../controllers/advancedAnalytics.controller.js";

const router = express.Router();

// Get all user event data for a form
router.get("/:formId", getAdvancedAnalytics);

// Get summary statistics for a form
router.get("/:formId/summary", getFormAnalyticsSummary);

// Get event data for a specific user in a form
router.get("/:formId/user/:userId", getUserAnalyticsData);

export default router;

