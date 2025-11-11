import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis.js";
import { connectDB } from "../../config/db.js";
import { Analytics } from "../../models/analytics.model.js";

await connectDB(); // ✅ ensure MongoDB is connected before starting the worker

const worker = new Worker(
  "analytics-events",
  async (job) => {
    const { formId, userId, eventType, value, fieldId, fieldLabel, timestamp } = job.data;
    console.log("Before storing", formId, userId, eventType, value, fieldId, fieldLabel, timestamp)
    await Analytics.create({ formId, userId, eventType, value, fieldId, fieldLabel, timestamp });
    console.log(`Processed event: ${eventType} for form ${formId}`);
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => console.log(`✅ Job completed: ${job.id}`));
worker.on("failed", (job, err) => console.error(`❌ Job failed:`, err));
