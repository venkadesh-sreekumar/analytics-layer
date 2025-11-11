# Advanced Analytics Guide

## Overview

The Advanced Analytics system provides detailed, user-level event tracking grouped by form. Unlike basic analytics that aggregate all events, this system maintains the complete event history for each user, enabling powerful insights into individual user behavior.

## 🏗️ Data Structure

### Collection Schema

```javascript
{
  formId: "form-1",
  totalUsers: 25,
  totalEvents: 500,
  lastUpdated: "2025-11-11T23:04:57.716Z",
  users: [
    {
      userId: "user123",
      totalEvents: 50,
      firstEvent: "2025-11-11T22:00:00.000Z",
      lastEvent: "2025-11-11T23:00:00.000Z",
      events: [
        {
          eventType: "focus",
          fieldId: "email-1762810408574",
          fieldLabel: "Email",
          value: null,
          timestamp: "2025-11-11T22:11:51.981Z"
        },
        {
          eventType: "change",
          fieldId: "email-1762810408574",
          fieldLabel: "Email",
          value: "test@email.com",
          timestamp: "2025-11-11T22:11:52.096Z"
        }
      ]
    }
  ]
}
```

### How It Works

1. **Worker Processing**: When events are tracked via `/api/analytics/track`, the worker processes them and stores in two places:
   - **Analytics Collection**: Traditional flat event storage
   - **Advanced Analytics Collection**: Grouped by form → user → events

2. **Automatic Grouping**: Events are automatically grouped:
   - By Form ID (one document per form)
   - By User ID (users array within form document)
   - Events stored in chronological order

3. **Real-time Updates**: Every event updates:
   - User's event array
   - User's event counters
   - Form-level totals
   - Last updated timestamp

## 📊 Available Endpoints

### 1. Get All User Data for a Form

```bash
GET /api/advancedAnalytics/:formId
```

**What You Get:**
- Complete list of all users who interacted with the form
- Each user's full event history
- Event counts by type (focus, blur, change, submit)
- Field interaction statistics
- Session duration calculations

**Best For:**
- Building user session replay features
- Identifying problematic user journeys
- Detailed form behavior analysis
- Export functionality for further analysis

**Example:**
```bash
curl http://localhost:4000/api/advancedAnalytics/1
```

### 2. Get Specific User Analytics

```bash
GET /api/advancedAnalytics/:formId/user/:userId
```

**What You Get:**
- Single user's complete event history
- Detailed field-by-field interaction timeline
- Session metrics (duration, event counts)
- Event type breakdown

**Best For:**
- Debugging user-specific issues
- Customer support investigations
- Understanding individual user behavior
- Personalized UX improvements

**Example:**
```bash
curl http://localhost:4000/api/advancedAnalytics/1/user/user123
```

### 3. Get Form Summary

```bash
GET /api/advancedAnalytics/:formId/summary
```

**What You Get:**
- High-level statistics (total/active users, events)
- Average metrics (events per user, session duration)
- Event type distribution
- Top 10 most active users

**Best For:**
- Dashboard displays
- Quick health checks
- Identifying power users
- Overall engagement monitoring

**Example:**
```bash
curl http://localhost:4000/api/advancedAnalytics/1/summary
```

## 🎯 Use Cases

### 1. User Session Replay

Build a feature that shows exactly how a user interacted with your form:

```javascript
// Fetch user's events
const response = await fetch('/api/advancedAnalytics/form-1/user/user123');
const { events } = response.data;

// Play back events chronologically
events.forEach(event => {
  console.log(`${event.timestamp}: ${event.eventType} on ${event.fieldLabel}`);
  // Highlight field, show value changes, etc.
});
```

### 2. Identify Struggling Users

Find users who took a long time or had many interactions:

```javascript
const response = await fetch('/api/advancedAnalytics/form-1');
const { users } = response.data;

// Find users with unusually high event counts
const strugglingUsers = users.filter(user => 
  user.totalEvents > 50 || user.sessionDuration > 300
);

// Reach out to these users or optimize problematic fields
```

### 3. Field-Level User Behavior

Analyze how users interact with specific fields:

```javascript
const response = await fetch('/api/advancedAnalytics/form-1');
const { users } = response.data;

// Count how many users interacted with email field
const emailInteractions = users.filter(user => 
  user.fieldInteractions['email-1762810408574']
);

// Calculate average interactions per user
const avgInteractions = emailInteractions.reduce((sum, user) => 
  sum + user.fieldInteractions['email-1762810408574'].count, 0
) / emailInteractions.length;
```

### 4. Conversion Funnel Analysis

Track users through the form completion process:

```javascript
const response = await fetch('/api/advancedAnalytics/form-1');
const { users } = response.data;

// Count users at each stage
const opened = users.length;
const startedFilling = users.filter(u => u.eventsByType.change > 0).length;
const submitted = users.filter(u => u.eventsByType.submit > 0).length;

console.log(`Opened: ${opened}`);
console.log(`Started: ${startedFilling} (${startedFilling/opened*100}%)`);
console.log(`Submitted: ${submitted} (${submitted/opened*100}%)`);
```

### 5. A/B Testing User Behavior

Compare user behavior between form versions:

```javascript
const [v1, v2] = await Promise.all([
  fetch('/api/advancedAnalytics/form-v1/summary'),
  fetch('/api/advancedAnalytics/form-v2/summary')
]);

console.log('Version 1:', {
  avgEvents: v1.data.summary.averageEventsPerUser,
  avgDuration: v1.data.summary.averageSessionDuration
});

console.log('Version 2:', {
  avgEvents: v2.data.summary.averageEventsPerUser,
  avgDuration: v2.data.summary.averageSessionDuration
});
```

## 🔍 Advanced Queries

### Find Users Who Abandoned Form

```bash
# Get all users
curl http://localhost:4000/api/advancedAnalytics/1

# Filter users without 'submit' event
# (do this in your application code)
```

### Track Field Edit Frequency

Users who change a field multiple times might be:
- Confused about the expected format
- Encountering validation issues
- Fixing typos

Look for fields with high change/focus ratios.

### Calculate Time Spent Per Field

Use event timestamps to calculate time between focus and blur:

```javascript
const fieldTime = {};
for (let i = 0; i < events.length - 1; i++) {
  if (events[i].eventType === 'focus' && events[i+1].eventType === 'blur') {
    const duration = new Date(events[i+1].timestamp) - new Date(events[i].timestamp);
    fieldTime[events[i].fieldId] = (fieldTime[events[i].fieldId] || 0) + duration;
  }
}
```

## 💡 Performance Considerations

### MongoDB Document Size

Each form has one document containing all users and their events. MongoDB has a 16MB document size limit.

**Estimated Capacity:**
- Average event: ~200 bytes
- ~80,000 events per form
- For high-traffic forms, consider archiving old data

### Query Performance

- Form-level queries are fast (single document lookup)
- User-specific queries use indexed fields
- For very large datasets, consider pagination:

```javascript
// In your service, add pagination
const analytics = await AdvancedAnalytics.findOne({ formId })
  .slice('users', [skip, limit]);
```

### Real-time Updates

Each event triggers a document update. For high-volume forms:
- Updates are atomic and safe
- MongoDB handles concurrent writes
- Consider batching for extremely high volumes (1000+ events/sec)

## 🚀 Integration Examples

### React Dashboard Component

```jsx
import { useEffect, useState } from 'react';

function UserAnalyticsDashboard({ formId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/advancedAnalytics/${formId}/summary`)
      .then(res => res.json())
      .then(result => setData(result.data));
  }, [formId]);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Form Analytics</h2>
      <div className="stats">
        <div>Total Users: {data.summary.totalUsers}</div>
        <div>Total Events: {data.summary.totalEvents}</div>
        <div>Avg Session: {data.summary.averageSessionDuration}s</div>
      </div>
      
      <h3>Top Users</h3>
      <ul>
        {data.topUsers.map(user => (
          <li key={user.userId}>
            {user.userId}: {user.totalEvents} events
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Node.js Data Export

```javascript
import fs from 'fs';

async function exportFormData(formId) {
  const response = await fetch(`http://localhost:4000/api/advancedAnalytics/${formId}`);
  const { data } = await response.json();
  
  // Convert to CSV
  const csv = data.users.flatMap(user => 
    user.events.map(event => 
      `${user.userId},${event.eventType},${event.fieldId},${event.timestamp}`
    )
  ).join('\n');
  
  fs.writeFileSync(`form-${formId}-export.csv`, 'userId,eventType,fieldId,timestamp\n' + csv);
}
```

## 🧪 Testing

```bash
# Test the advanced analytics endpoints
curl http://localhost:4000/api/advancedAnalytics/1 | jq '.'
curl http://localhost:4000/api/advancedAnalytics/1/user/user123 | jq '.'
curl http://localhost:4000/api/advancedAnalytics/1/summary | jq '.'
```

## 📈 Comparison: Basic vs Advanced Analytics

| Feature | Basic Analytics | Advanced Analytics |
|---------|----------------|-------------------|
| Data Structure | Flat event list | Grouped by form → user |
| User Tracking | Aggregated | Individual sessions |
| Query Speed | Fast for totals | Fast for user-level |
| Use Case | Overall metrics | User behavior analysis |
| Session Replay | No | Yes |
| Storage | Linear growth | Grouped (more efficient) |

## 🎓 Best Practices

1. **Use Summary for Dashboards**: Don't fetch full user data for overview displays
2. **Cache Results**: Form summary data changes slowly, cache for 5-10 minutes
3. **Monitor Document Size**: Archive old data for high-traffic forms
4. **Index by Date**: Consider adding date-based queries for time-range analysis
5. **Privacy Compliance**: Be aware of data retention policies and user privacy rights

---

For API reference, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

