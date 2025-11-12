import { 
  createSubmission, 
  getSubmissionsByFormId, 
  getSubmissionById,
  getSubmissionStats 
} from "../services/submission.service.js";
import { analyticsQueue } from "../queue/index.js";

export const submitForm = async (req, res) => {
  try {
    const { formId, userId, submittedData, metadata, timestamp, completionTime } = req.body;

    // Validate required fields
    if (!formId || !submittedData) {
      return res.status(400).json({ 
        success: false, 
        message: "formId and submittedData are required" 
      });
    }

    // Store the submission with timestamp (use provided or default to now)
    const submissionData = {
      formId,
      userId,
      submittedData,
      metadata: {
        ...metadata,
        completionTime,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress,
      }
    };

    // Add timestamp if provided, otherwise MongoDB default will be used
    if (timestamp) {
      submissionData.timestamp = new Date(timestamp);
    }

    const submission = await createSubmission(submissionData);

    // Also track the submit event in analytics
    await analyticsQueue.add("track-event", { 
      formId, 
      userId, 
      eventType: "submit",
      eventData: { submissionId: submission._id },
      timestamp: submission.timestamp 
    });

    res.status(201).json({ 
      success: true, 
      message: "Form submitted successfully",
      submissionId: submission._id,
      data: submission
    });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const getFormSubmissions = async (req, res) => {
  try {
    const { formId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;

    const submissions = await getSubmissionsByFormId(formId, limit, skip);

    res.status(200).json({ 
      success: true, 
      count: submissions.length,
      data: submissions 
    });
  } catch (err) {
    console.error("Fetch submissions error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const getSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await getSubmissionById(submissionId);

    if (!submission) {
      return res.status(404).json({ 
        success: false, 
        message: "Submission not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: submission 
    });
  } catch (err) {
    console.error("Fetch submission error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const getFormStats = async (req, res) => {
  try {
    const { formId } = req.params;

    const stats = await getSubmissionStats(formId);

    res.status(200).json({ 
      success: true, 
      data: stats 
    });
  } catch (err) {
    console.error("Fetch stats error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

