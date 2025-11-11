import { Submission } from "../models/submission.model.js";
import { Analytics } from "../models/analytics.model.js";

export const getFormAnalytics = async (formId) => {
  try {
    // Get all submissions for the form
    const submissions = await Submission.find({ formId });
    
    if (submissions.length === 0) {
      return {
        formId,
        totalSubmissions: 0,
        message: "No submissions found for this form"
      };
    }

    // Calculate basic metrics
    const totalSubmissions = submissions.length;
    
    // Calculate completion time statistics
    const completionTimes = submissions
      .map(s => s.metadata?.completionTime)
      .filter(ct => ct !== undefined && ct !== null);
    
    const avgCompletionTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : null;
    
    const minCompletionTime = completionTimes.length > 0
      ? Math.min(...completionTimes)
      : null;
    
    const maxCompletionTime = completionTimes.length > 0
      ? Math.max(...completionTimes)
      : null;

    // Get unique users
    const uniqueUsers = [...new Set(submissions.map(s => s.userId).filter(Boolean))];
    
    // Calculate submissions over time (grouped by day)
    const submissionsByDate = {};
    submissions.forEach(sub => {
      const date = new Date(sub.timestamp).toISOString().split('T')[0];
      submissionsByDate[date] = (submissionsByDate[date] || 0) + 1;
    });

    // Get field-level analytics
    const fieldAnalytics = analyzeFields(submissions);

    // Get first and last submission timestamps
    const timestamps = submissions.map(s => new Date(s.timestamp)).sort((a, b) => a - b);
    const firstSubmission = timestamps[0];
    const lastSubmission = timestamps[timestamps.length - 1];

    return {
      formId,
      overview: {
        totalSubmissions,
        uniqueUsers: uniqueUsers.length,
        firstSubmission,
        lastSubmission,
      },
      completionTime: {
        average: avgCompletionTime ? Math.round(avgCompletionTime * 100) / 100 : null,
        minimum: minCompletionTime ? Math.round(minCompletionTime * 100) / 100 : null,
        maximum: maxCompletionTime ? Math.round(maxCompletionTime * 100) / 100 : null,
        unit: "seconds"
      },
      submissionsByDate,
      fieldAnalytics,
      recentSubmissions: submissions
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5)
        .map(s => ({
          id: s._id,
          userId: s.userId,
          timestamp: s.timestamp,
          completionTime: s.metadata?.completionTime
        }))
    };
  } catch (error) {
    throw new Error(`Failed to generate analytics: ${error.message}`);
  }
};

// Helper function to analyze fields across all submissions
function analyzeFields(submissions) {
  const fieldStats = {};
  
  submissions.forEach(submission => {
    const data = submission.submittedData || {};
    
    Object.keys(data).forEach(fieldName => {
      if (!fieldStats[fieldName]) {
        fieldStats[fieldName] = {
          totalResponses: 0,
          uniqueValues: new Set(),
          valueCounts: {},
          emptyCount: 0
        };
      }
      
      const value = data[fieldName];
      
      if (value === null || value === undefined || value === '') {
        fieldStats[fieldName].emptyCount++;
      } else {
        fieldStats[fieldName].totalResponses++;
        fieldStats[fieldName].uniqueValues.add(String(value));
        
        const valueStr = String(value);
        fieldStats[fieldName].valueCounts[valueStr] = 
          (fieldStats[fieldName].valueCounts[valueStr] || 0) + 1;
      }
    });
  });
  
  // Convert to final format
  const result = {};
  Object.keys(fieldStats).forEach(fieldName => {
    const stats = fieldStats[fieldName];
    const totalSubmissions = submissions.length;
    
    // Get most common values (top 5)
    const topValues = Object.entries(stats.valueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([value, count]) => ({
        value,
        count,
        percentage: Math.round((count / totalSubmissions) * 10000) / 100
      }));
    
    result[fieldName] = {
      totalResponses: stats.totalResponses,
      emptyResponses: stats.emptyCount,
      completionRate: Math.round((stats.totalResponses / totalSubmissions) * 10000) / 100,
      uniqueValues: stats.uniqueValues.size,
      topValues
    };
  });
  
  return result;
}

export const getFormEventAnalytics = async (formId, eventType = null) => {
  try {
    const query = { formId };
    if (eventType) {
      query.eventType = eventType;
    }

    const events = await Analytics.find(query).sort({ timestamp: 1 });
    
    if (events.length === 0) {
      return {
        formId,
        eventType: eventType || "all",
        totalEvents: 0,
        message: "No events found"
      };
    }

    // Group events by type
    const eventsByType = {};
    events.forEach(event => {
      const type = event.eventType || "unknown";
      eventsByType[type] = (eventsByType[type] || 0) + 1;
    });

    // Events over time (grouped by hour)
    const eventsByHour = {};
    events.forEach(event => {
      const hour = new Date(event.timestamp).toISOString().slice(0, 13) + ":00:00Z";
      eventsByHour[hour] = (eventsByHour[hour] || 0) + 1;
    });

    // Field-level interaction analytics
    const fieldInteractions = {};
    events.forEach(event => {
      if (event.fieldId) {
        if (!fieldInteractions[event.fieldId]) {
          fieldInteractions[event.fieldId] = {
            fieldLabel: event.fieldLabel || event.fieldId,
            interactions: 0,
            eventTypes: {}
          };
        }
        fieldInteractions[event.fieldId].interactions++;
        const type = event.eventType || "unknown";
        fieldInteractions[event.fieldId].eventTypes[type] = 
          (fieldInteractions[event.fieldId].eventTypes[type] || 0) + 1;
      }
    });

    // Get unique users from events
    const uniqueUsers = [...new Set(events.map(e => e.userId).filter(Boolean))];

    return {
      formId,
      eventType: eventType || "all",
      overview: {
        totalEvents: events.length,
        uniqueUsers: uniqueUsers.length,
        firstEvent: events[0].timestamp,
        lastEvent: events[events.length - 1].timestamp
      },
      eventsByType,
      eventsByHour,
      fieldInteractions
    };
  } catch (error) {
    throw new Error(`Failed to generate event analytics: ${error.message}`);
  }
};

export const getCombinedAnalytics = async (formId) => {
  try {
    const [submissionAnalytics, eventAnalytics] = await Promise.all([
      getFormAnalytics(formId),
      getFormEventAnalytics(formId)
    ]);

    return {
      formId,
      submissions: submissionAnalytics,
      events: eventAnalytics
    };
  } catch (error) {
    throw new Error(`Failed to generate combined analytics: ${error.message}`);
  }
};

