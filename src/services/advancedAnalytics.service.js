import { AdvancedAnalytics } from "../models/advancedAnalytics.model.js";

export const getAdvancedAnalyticsByFormId = async (formId) => {
  try {
    const analytics = await AdvancedAnalytics.findOne({ formId });

    if (!analytics) {
      return {
        formId,
        message: "No analytics data found for this form",
        users: [],
        totalUsers: 0,
        totalEvents: 0
      };
    }

    // Sort users by last event (most recent first)
    const sortedUsers = analytics.users.sort((a, b) => 
      new Date(b.lastEvent) - new Date(a.lastEvent)
    );

    // Calculate additional metrics
    const userMetrics = sortedUsers.map(user => {
      const events = user.events || [];
      const eventsByType = {};
      const fieldInteractions = {};

      events.forEach(event => {
        // Count by event type
        eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;

        // Count field interactions
        if (event.fieldId) {
          if (!fieldInteractions[event.fieldId]) {
            fieldInteractions[event.fieldId] = {
              fieldLabel: event.fieldLabel || event.fieldId,
              count: 0
            };
          }
          fieldInteractions[event.fieldId].count++;
        }
      });

      return {
        userId: user.userId,
        totalEvents: user.totalEvents,
        firstEvent: user.firstEvent,
        lastEvent: user.lastEvent,
        sessionDuration: user.lastEvent && user.firstEvent 
          ? Math.round((new Date(user.lastEvent) - new Date(user.firstEvent)) / 1000)
          : 0,
        eventsByType,
        fieldInteractions,
        events: events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      };
    });

    return {
      formId: analytics.formId,
      totalUsers: analytics.totalUsers,
      totalEvents: analytics.totalEvents,
      lastUpdated: analytics.lastUpdated,
      users: userMetrics
    };
  } catch (error) {
    throw new Error(`Failed to get advanced analytics: ${error.message}`);
  }
};

export const getUserAnalytics = async (formId, userId) => {
  try {
    const analytics = await AdvancedAnalytics.findOne({ formId });

    if (!analytics) {
      return {
        formId,
        userId,
        message: "No analytics data found",
        events: []
      };
    }

    const user = analytics.users.find(u => u.userId === userId);

    if (!user) {
      return {
        formId,
        userId,
        message: "User not found in analytics",
        events: []
      };
    }

    // Calculate metrics for this specific user
    const eventsByType = {};
    const fieldInteractions = {};
    const eventTimeline = [];

    user.events.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;

      if (event.fieldId) {
        if (!fieldInteractions[event.fieldId]) {
          fieldInteractions[event.fieldId] = {
            fieldLabel: event.fieldLabel || event.fieldId,
            interactions: []
          };
        }
        fieldInteractions[event.fieldId].interactions.push({
          eventType: event.eventType,
          value: event.value,
          timestamp: event.timestamp
        });
      }

      eventTimeline.push({
        eventType: event.eventType,
        fieldId: event.fieldId,
        fieldLabel: event.fieldLabel,
        value: event.value,
        timestamp: event.timestamp
      });
    });

    return {
      formId,
      userId: user.userId,
      totalEvents: user.totalEvents,
      firstEvent: user.firstEvent,
      lastEvent: user.lastEvent,
      sessionDuration: user.lastEvent && user.firstEvent 
        ? Math.round((new Date(user.lastEvent) - new Date(user.firstEvent)) / 1000)
        : 0,
      eventsByType,
      fieldInteractions,
      eventTimeline: eventTimeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    };
  } catch (error) {
    throw new Error(`Failed to get user analytics: ${error.message}`);
  }
};

export const getFormSummary = async (formId) => {
  try {
    const analytics = await AdvancedAnalytics.findOne({ formId });

    if (!analytics) {
      return {
        formId,
        message: "No analytics data found",
        summary: null
      };
    }

    // Calculate summary statistics
    const activeUsers = analytics.users.filter(u => u.totalEvents > 0).length;
    const avgEventsPerUser = activeUsers > 0 
      ? Math.round((analytics.totalEvents / activeUsers) * 100) / 100 
      : 0;

    const sessionDurations = analytics.users
      .map(u => {
        if (u.lastEvent && u.firstEvent) {
          return (new Date(u.lastEvent) - new Date(u.firstEvent)) / 1000;
        }
        return 0;
      })
      .filter(d => d > 0);

    const avgSessionDuration = sessionDurations.length > 0
      ? Math.round((sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length) * 100) / 100
      : 0;

    // Get event type distribution
    const eventTypeDistribution = {};
    analytics.users.forEach(user => {
      user.events.forEach(event => {
        eventTypeDistribution[event.eventType] = (eventTypeDistribution[event.eventType] || 0) + 1;
      });
    });

    // Get most active users
    const topUsers = analytics.users
      .sort((a, b) => b.totalEvents - a.totalEvents)
      .slice(0, 10)
      .map(u => ({
        userId: u.userId,
        totalEvents: u.totalEvents,
        lastActive: u.lastEvent
      }));

    return {
      formId: analytics.formId,
      summary: {
        totalUsers: analytics.totalUsers,
        activeUsers,
        totalEvents: analytics.totalEvents,
        averageEventsPerUser: avgEventsPerUser,
        averageSessionDuration: avgSessionDuration,
        lastUpdated: analytics.lastUpdated
      },
      eventTypeDistribution,
      topUsers
    };
  } catch (error) {
    throw new Error(`Failed to get form summary: ${error.message}`);
  }
};

