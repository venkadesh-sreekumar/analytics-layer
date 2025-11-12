import { Submission } from "../models/submission.model.js";

export const createSubmission = async (submissionData) => {
  try {
    console.log("Checking submissionData", submissionData);
    const submission = new Submission(submissionData);
    await submission.save();
    return submission;
  } catch (error) {
    throw new Error(`Failed to create submission: ${error.message}`);
  }
};

export const getSubmissionsByFormId = async (formId, limit = 100, skip = 0) => {
  try {
    console.log("Checking formId", formId, typeof formId);
    const submissions = await Submission.find({ formId });
    return submissions;
  } catch (error) {
    throw new Error(`Failed to fetch submissions: ${error.message}`);
  }
};

export const getSubmissionById = async (submissionId) => {
  try {
    const submission = await Submission.findById(submissionId);
    return submission;
  } catch (error) {
    throw new Error(`Failed to fetch submission: ${error.message}`);
  }
};

export const getSubmissionStats = async (formId) => {
  try {
    const totalSubmissions = await Submission.countDocuments({ formId });
    const avgCompletionTime = await Submission.aggregate([
      { $match: { formId, "metadata.completionTime": { $exists: true } } },
      { $group: { _id: null, avgTime: { $avg: "$metadata.completionTime" } } }
    ]);
    
    return {
      totalSubmissions,
      averageCompletionTime: avgCompletionTime.length > 0 ? avgCompletionTime[0].avgTime : null
    };
  } catch (error) {
    throw new Error(`Failed to fetch submission stats: ${error.message}`);
  }
};

