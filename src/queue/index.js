import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const analyticsQueue = new Queue("analytics-events", {
  connection: redisConnection,
});
