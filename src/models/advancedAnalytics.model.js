import mongoose from "mongoose";

const userEventSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  events: [
    {
      eventType: String,
      fieldId: String,
      fieldLabel: String,
      value: String,
      timestamp: Date,
      eventData: Object
    }
  ],
  firstEvent: Date,
  lastEvent: Date,
  totalEvents: { type: Number, default: 0 }
}, { _id: false });

const advancedAnalyticsSchema = new mongoose.Schema({
  formId: { type: String, required: true, unique: true, index: true },
  users: [userEventSchema],
  totalUsers: { type: Number, default: 0 },
  totalEvents: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

// Index for faster queries
advancedAnalyticsSchema.index({ formId: 1, "users.userId": 1 });

export const AdvancedAnalytics = mongoose.model("AdvancedAnalytics", advancedAnalyticsSchema);

