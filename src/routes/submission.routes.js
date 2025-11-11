import express from "express";
import { 
  submitForm, 
  getFormSubmissions, 
  getSubmission,
  getFormStats 
} from "../controllers/submission.controller.js";

const router = express.Router();

// Submit form data
router.post("/submit", submitForm);

// Get all submissions for a specific form
router.get("/form/:formId", getFormSubmissions);

// Get submission statistics for a form
router.get("/form/:formId/stats", getFormStats);

// Get a specific submission by ID
router.get("/:submissionId", getSubmission);

export default router;

