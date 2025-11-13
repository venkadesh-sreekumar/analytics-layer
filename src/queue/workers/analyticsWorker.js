import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis.js";
import { connectDB } from "../../config/db.js";
import { Analytics } from "../../models/analytics.model.js";
import { AdvancedAnalytics } from "../../models/advancedAnalytics.model.js";

await connectDB(); // ✅ ensure MongoDB is connected before starting the worker

const worker = new Worker(
  "analytics-events",
  async (job) => {
    const { formId, userId, eventType, value, fieldId, fieldLabel, timestamp, eventData } = job.data;
    
    // Store in regular Analytics collection
    await Analytics.create({ formId, userId, eventType, value, fieldId, fieldLabel, timestamp, eventData });
    
    // Store in Advanced Analytics collection (grouped by form and user)
    await updateAdvancedAnalytics({ formId, userId, eventType, value, fieldId, fieldLabel, timestamp, eventData });
    
    console.log(`Processed event: ${eventType} for form ${formId}`);
  },
  { connection: redisConnection }
);

// Function to update the advanced analytics collection
async function updateAdvancedAnalytics({ formId, userId, eventType, value, fieldId, fieldLabel, timestamp, eventData }) {
  const eventTimestamp = timestamp ? new Date(timestamp) : new Date();
  
  const eventRecord = {
    eventType,
    fieldId,
    fieldLabel,
    value,
    timestamp: eventTimestamp,
    eventData
  };

  // Try to find existing document for this form
  let analytics = await AdvancedAnalytics.findOne({ formId });

  if (!analytics) {
    // Create new document if form doesn't exist
    analytics = new AdvancedAnalytics({
      formId,
      users: [{
        userId: userId || 'anonymous',
        events: [eventRecord],
        firstEvent: eventTimestamp,
        lastEvent: eventTimestamp,
        totalEvents: 1
      }],
      totalUsers: 1,
      totalEvents: 1,
      lastUpdated: new Date()
    });
    await analytics.save();
  } else {
    // Find user in existing form document
    const userIndex = analytics.users.findIndex(u => u.userId === (userId || 'anonymous'));

    if (userIndex === -1) {
      // New user for this form
      analytics.users.push({
        userId: userId || 'anonymous',
        events: [eventRecord],
        firstEvent: eventTimestamp,
        lastEvent: eventTimestamp,
        totalEvents: 1
      });
      analytics.totalUsers = analytics.users.length;
    } else {
      // Existing user - add event
      analytics.users[userIndex].events.push(eventRecord);
      analytics.users[userIndex].lastEvent = eventTimestamp;
      analytics.users[userIndex].totalEvents = analytics.users[userIndex].events.length;
    }

    analytics.totalEvents = analytics.users.reduce((sum, user) => sum + user.totalEvents, 0);
    analytics.lastUpdated = new Date();
    
    await analytics.save();
  }
}

worker.on("completed", (job) => console.log(`✅ Job completed: ${job.id}`));
worker.on("failed", (job, err) => console.error(`❌ Job failed:`, err));
