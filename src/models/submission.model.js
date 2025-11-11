import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  formId: { type: String, required: true, index: true },
  userId: { type: String, index: true },
  submittedData: { type: Object, required: true },  // stores all form field values
  metadata: {
    userAgent: String,
    ipAddress: String,
    completionTime: Number,  // time taken to complete form in seconds
  },
  timestamp: { type: Date, default: Date.now },
});

export const Submission = mongoose.model("Submission", submissionSchema);

