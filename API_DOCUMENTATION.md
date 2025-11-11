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

