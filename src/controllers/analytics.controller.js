import { analyticsQueue } from "../queue/index.js";

export const trackEvent = async (req, res) => {
  try {
    const { formId, userId, eventType, value, fieldId, fieldLabel, timestamp } = req.body;
    await analyticsQueue.add("track-event", { formId, userId, eventType, value, fieldId, fieldLabel, timestamp });
    res.status(200).json({ success: true, message: "Event queued successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
