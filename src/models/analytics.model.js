import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  formId: String,
  userId: String,
  eventType: String,   // e.g. "open", "submit", "question_time"
  eventData: Object,   // store extra info like timeSpent, questionId, etc.
  fieldId: String,
  fieldLabel: String,
  value: String,
  timestamp: { type: Date, default: Date.now },
});

export const Analytics = mongoose.model("Analytics", analyticsSchema);
