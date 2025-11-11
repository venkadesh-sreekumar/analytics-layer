import { analyticsQueue } from "../queue/index.js";
import { getFormAnalytics, getFormEventAnalytics, getCombinedAnalytics } from "../services/analytics.service.js";

export const trackEvent = async (req, res) => {
  try {
    const { formId, userId, eventType, value, fieldId, fieldLabel, timestamp } = req.body;
    await analyticsQueue.add("track-event", { formId, userId, eventType, value, fieldId, fieldLabel, timestamp });
    res.status(200).json({ success: true, message: "Event queued successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSubmissionAnalytics = async (req, res) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({ 
        success: false, 
        message: "formId is required" 
      });
    }

    const analytics = await getFormAnalytics(formId);

    res.status(200).json({ 
      success: true, 
      data: analytics 
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const getEventAnalytics = async (req, res) => {
  try {
    const { formId } = req.params;
    const { eventType } = req.query;

    if (!formId) {
      return res.status(400).json({ 
        success: false, 
        message: "formId is required" 
      });
    }

    const analytics = await getFormEventAnalytics(formId, eventType);

    res.status(200).json({ 
      success: true, 
      data: analytics 
    });
  } catch (err) {
    console.error("Event analytics error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export const getFullAnalytics = async (req, res) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({ 
        success: false, 
        message: "formId is required" 
      });
    }

    const analytics = await getCombinedAnalytics(formId);

    res.status(200).json({ 
      success: true, 
      data: analytics 
    });
  } catch (err) {
    console.error("Combined analytics error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};
