# Analytics Layer API Documentation

## Base URL
`http://localhost:4000/api`

---

## Analytics Endpoints

### Track Event
**POST** `/analytics/track`

Track user interactions with forms (focus, blur, change events, etc.)

**Request Body:**
```json
{
  "formId": "1",
  "userId": "user123",
  "eventType": "focus",
  "value": "test@email.com",
  "fieldId": "email-1762810408574",
  "fieldLabel": "Email",
  "timestamp": "2025-11-11T22:11:50.397Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event queued successfully"
}
```

---

### Get Submission Analytics
**GET** `/analytics/submissions/:formId`

Get comprehensive analytics from the submissions collection for a specific form.

**Example:**
```
GET /analytics/submissions/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formId": "1",
    "overview": {
      "totalSubmissions": 25,
      "uniqueUsers": 18,
      "firstSubmission": "2025-11-10T10:00:00.000Z",
      "lastSubmission": "2025-11-11T22:39:37.309Z"
    },
    "completionTime": {
      "average": 42.5,
      "minimum": 15.2,
      "maximum": 120.8,
      "unit": "seconds"
    },
    "submissionsByDate": {
      "2025-11-10": 10,
      "2025-11-11": 15
    },
    "fieldAnalytics": {
      "name": {
        "totalResponses": 25,
        "emptyResponses": 0,
        "completionRate": 100,
        "uniqueValues": 23,
        "topValues": [
          { "value": "John Doe", "count": 2, "percentage": 8 }
        ]
      },
      "email": {
        "totalResponses": 24,
        "emptyResponses": 1,
        "completionRate": 96,
        "uniqueValues": 24,
        "topValues": []
      }
    },
    "recentSubmissions": [
      {
        "id": "673258a9e4b9c8d1f2a3b4c5",
        "userId": "user123",
        "timestamp": "2025-11-11T22:39:37.309Z",
        "completionTime": 45.5
      }
    ]
  }
}
```

**Metrics Provided:**
- **Overview**: Total submissions, unique users, first/last submission timestamps
- **Completion Time**: Average, minimum, and maximum completion times
- **Submissions by Date**: Daily submission counts
- **Field Analytics**: Per-field statistics including:
  - Total and empty responses
  - Completion rate
  - Number of unique values
  - Top 5 most common values with counts and percentages
- **Recent Submissions**: Last 5 submissions with basic info

---

### Get Event Analytics
**GET** `/analytics/events/:formId`

Get analytics from the events collection (focus, blur, change events) for a specific form.

**Query Parameters:**
- `eventType` (optional) - Filter by specific event type (e.g., "focus", "blur", "change")

**Example:**
```
GET /analytics/events/1
GET /analytics/events/1?eventType=focus
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formId": "1",
    "eventType": "all",
    "overview": {
      "totalEvents": 250,
      "uniqueUsers": 15,
      "firstEvent": "2025-11-10T10:00:00.000Z",
      "lastEvent": "2025-11-11T22:39:37.309Z"
    },
    "eventsByType": {
      "focus": 80,
      "blur": 80,
      "change": 90
    },
    "eventsByHour": {
      "2025-11-11T22:00:00Z": 45,
      "2025-11-11T21:00:00Z": 30
    },
    "fieldInteractions": {
      "email-1762810408574": {
        "fieldLabel": "Email",
        "interactions": 50,
        "eventTypes": {
          "focus": 15,
          "blur": 15,
          "change": 20
        }
      }
    }
  }
}
```

**Metrics Provided:**
- **Overview**: Total events, unique users, time range
- **Events by Type**: Count of each event type (focus, blur, change, etc.)
- **Events by Hour**: Hourly event distribution
- **Field Interactions**: Per-field interaction statistics

---

### Get Full Analytics
**GET** `/analytics/full/:formId`

Get combined analytics including both submission and event data.

**Example:**
```
GET /analytics/full/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formId": "1",
    "submissions": {
      "formId": "1",
      "overview": { ... },
      "completionTime": { ... },
      "submissionsByDate": { ... },
      "fieldAnalytics": { ... },
      "recentSubmissions": [ ... ]
    },
    "events": {
      "formId": "1",
      "overview": { ... },
      "eventsByType": { ... },
      "eventsByHour": { ... },
      "fieldInteractions": { ... }
    }
  }
}
```

**Use Case:** Get a complete picture of form performance including both final submissions and user interaction patterns.

---

## Advanced Analytics Endpoints

### Get Advanced Analytics (All User Event Data)
**GET** `/advancedAnalytics/:formId`

Get detailed user-level event tracking for a form. Returns all users grouped by form with their complete event history.

**Example:**
```
GET /advancedAnalytics/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formId": "1",
    "totalUsers": 5,
    "totalEvents": 250,
    "lastUpdated": "2025-11-11T23:04:57.716Z",
    "users": [
      {
        "userId": "user123",
        "totalEvents": 50,
        "firstEvent": "2025-11-11T22:00:00.000Z",
        "lastEvent": "2025-11-11T23:00:00.000Z",
        "sessionDuration": 3600,
        "eventsByType": {
          "focus": 15,
          "blur": 15,
          "change": 20
        },
        "fieldInteractions": {
          "email-1762810408574": {
            "fieldLabel": "Email",
            "count": 10
          },
          "name-1762814811406": {
            "fieldLabel": "Name",
            "count": 8
          }
        },
        "events": [
          {
            "eventType": "focus",
            "fieldId": "email-1762810408574",
            "fieldLabel": "Email",
            "value": null,
            "timestamp": "2025-11-11T22:11:51.981Z"
          },
          {
            "eventType": "change",
            "fieldId": "email-1762810408574",
            "fieldLabel": "Email",
            "value": "test@email.com",
            "timestamp": "2025-11-11T22:11:52.096Z"
          }
        ]
      }
    ]
  }
}
```

**Data Structure:**
- **Form Level**: Total users, total events, last update time
- **User Level**: 
  - User ID and session information
  - Event counts by type (focus, blur, change, etc.)
  - Field interaction counts
  - Complete event timeline sorted by timestamp
  - Session duration in seconds

**Use Cases:**
- Track individual user behavior patterns
- Identify users who struggle with specific fields
- Analyze user journey through the form
- Debug user-specific issues
- Build user session replays

---

### Get User-Specific Analytics
**GET** `/advancedAnalytics/:formId/user/:userId`

Get detailed analytics for a specific user within a form.

**Example:**
```
GET /advancedAnalytics/1/user/user123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formId": "1",
    "userId": "user123",
    "totalEvents": 50,
    "firstEvent": "2025-11-11T22:00:00.000Z",
    "lastEvent": "2025-11-11T23:00:00.000Z",
    "sessionDuration": 3600,
    "eventsByType": {
      "focus": 15,
      "blur": 15,
      "change": 20
    },
    "fieldInteractions": {
      "email-1762810408574": {
        "fieldLabel": "Email",
        "interactions": [
          {
            "eventType": "focus",
            "value": null,
            "timestamp": "2025-11-11T22:11:51.981Z"
          },
          {
            "eventType": "change",
            "value": "s",
            "timestamp": "2025-11-11T22:11:52.096Z"
          }
        ]
      }
    },
    "eventTimeline": [
      {
        "eventType": "focus",
        "fieldId": "email-1762810408574",
        "fieldLabel": "Email",
        "value": null,
        "timestamp": "2025-11-11T22:11:51.981Z"
      }
    ]
  }
}
```

**Use Cases:**
- Debug specific user issues
- Understand individual user behavior
- Provide personalized support
- Analyze user session details

---

### Get Form Analytics Summary
**GET** `/advancedAnalytics/:formId/summary`

Get high-level summary statistics for a form.

**Example:**
```
GET /advancedAnalytics/1/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "formId": "1",
    "summary": {
      "totalUsers": 25,
      "activeUsers": 23,
      "totalEvents": 500,
      "averageEventsPerUser": 21.74,
      "averageSessionDuration": 45.5,
      "lastUpdated": "2025-11-11T23:04:57.716Z"
    },
    "eventTypeDistribution": {
      "focus": 150,
      "blur": 145,
      "change": 200,
      "submit": 5
    },
    "topUsers": [
      {
        "userId": "user123",
        "totalEvents": 50,
        "lastActive": "2025-11-11T23:00:00.000Z"
      },
      {
        "userId": "user456",
        "totalEvents": 45,
        "lastActive": "2025-11-11T22:55:00.000Z"
      }
    ]
  }
}
```

**Metrics Provided:**
- **Summary Stats**: Total/active users, events, averages
- **Event Distribution**: Count of each event type across all users
- **Top Users**: Most active users by event count

**Use Cases:**
- Dashboard overview
- Quick form health check
- Identify power users
- Monitor overall engagement

---

## Submission Endpoints

### Submit Form
**POST** `/submissions/submit`

Submit complete form data with all field values.

**Request Body:**
```json
{
  "formId": "1",
  "userId": "user123",
  "submittedData": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "message": "This is my message"
  },
  "metadata": {
    "completionTime": 45.5
  },
  "timestamp": "2025-11-11T22:15:30.123Z"
}
```

**Note:** The `timestamp` field is optional. If not provided, the current server time will be used.

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "submissionId": "673258a9e4b9c8d1f2a3b4c5",
  "data": {
    "_id": "673258a9e4b9c8d1f2a3b4c5",
    "formId": "1",
    "userId": "user123",
    "submittedData": {
      "name": "John Doe",
      "email": "john@example.com",
      "age": 25,
      "message": "This is my message"
    },
    "metadata": {
      "completionTime": 45.5,
      "userAgent": "Mozilla/5.0...",
      "ipAddress": "127.0.0.1"
    },
    "timestamp": "2025-11-11T22:15:30.123Z"
  }
}
```

---

### Get Form Submissions
**GET** `/submissions/form/:formId`

Get all submissions for a specific form.

**Query Parameters:**
- `limit` (optional, default: 100) - Maximum number of submissions to return
- `skip` (optional, default: 0) - Number of submissions to skip (for pagination)

**Example:**
```
GET /submissions/form/1?limit=10&skip=0
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "673258a9e4b9c8d1f2a3b4c5",
      "formId": "1",
      "userId": "user123",
      "submittedData": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "metadata": {
        "completionTime": 45.5
      },
      "timestamp": "2025-11-11T22:15:30.123Z"
    }
  ]
}
```

---

### Get Single Submission
**GET** `/submissions/:submissionId`

Get a specific submission by its ID.

**Example:**
```
GET /submissions/673258a9e4b9c8d1f2a3b4c5
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "673258a9e4b9c8d1f2a3b4c5",
    "formId": "1",
    "userId": "user123",
    "submittedData": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "metadata": {
      "completionTime": 45.5
    },
    "timestamp": "2025-11-11T22:15:30.123Z"
  }
}
```

---

### Get Form Statistics
**GET** `/submissions/form/:formId/stats`

Get statistics for a specific form (total submissions, average completion time).

**Example:**
```
GET /submissions/form/1/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSubmissions": 25,
    "averageCompletionTime": 42.3
  }
}
```

---

## Example Usage

### Complete Form Submission Flow

1. **User opens the form** - Track the 'open' event:
```bash
curl -X POST http://localhost:4000/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "formId": "1",
    "userId": "user123",
    "eventType": "open",
    "timestamp": "2025-11-11T22:00:00.000Z"
  }'
```

2. **User interacts with fields** - Track focus, blur, change events:
```bash
curl -X POST http://localhost:4000/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "formId": "1",
    "userId": "user123",
    "eventType": "focus",
    "fieldId": "email",
    "fieldLabel": "Email",
    "timestamp": "2025-11-11T22:01:00.000Z"
  }'
```

3. **User submits the form** - Store the complete form data:
```bash
curl -X POST http://localhost:4000/api/submissions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "formId": "1",
    "userId": "user123",
    "submittedData": {
      "name": "John Doe",
      "email": "john@example.com",
      "age": 25
    },
    "metadata": {
      "completionTime": 60
    },
    "timestamp": "2025-11-11T22:15:30.123Z"
  }'
```

4. **View all submissions for the form**:
```bash
curl http://localhost:4000/api/submissions/form/1
```

5. **View form statistics**:
```bash
curl http://localhost:4000/api/submissions/form/1/stats
```

6. **Get submission analytics**:
```bash
curl http://localhost:4000/api/analytics/submissions/1
```

7. **Get event analytics**:
```bash
curl http://localhost:4000/api/analytics/events/1
```

8. **Get full combined analytics**:
```bash
curl http://localhost:4000/api/analytics/full/1
```

9. **Get advanced analytics (all user event data)**:
```bash
curl http://localhost:4000/api/advancedAnalytics/1
```

10. **Get analytics for a specific user**:
```bash
curl http://localhost:4000/api/advancedAnalytics/1/user/user123
```

11. **Get form analytics summary**:
```bash
curl http://localhost:4000/api/advancedAnalytics/1/summary
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created (for submissions)
- `400` - Bad Request (missing required fields)
- `404` - Not Found
- `500` - Internal Server Error

