# Analytics Endpoints Guide

## Overview

The analytics layer now provides three powerful endpoints to analyze form data:

1. **Submission Analytics** - Analyze completed form submissions
2. **Event Analytics** - Analyze user interaction events (focus, blur, change)
3. **Full Analytics** - Combined view of submissions and events

## 📊 Submission Analytics

### Endpoint
```
GET /api/analytics/submissions/:formId
```

### What You Get

**Overview Metrics:**
- Total number of submissions
- Number of unique users
- First and last submission timestamps

**Completion Time Analysis:**
- Average completion time
- Minimum completion time
- Maximum completion time
- All times in seconds

**Submissions by Date:**
- Daily breakdown of submission counts
- Useful for tracking form usage over time

**Field-Level Analytics:**
For each field in your form:
- Total responses (non-empty)
- Empty response count
- Completion rate (percentage)
- Number of unique values
- Top 5 most common values with counts and percentages

**Recent Submissions:**
- Last 5 submissions with basic info

### Example Use Cases

1. **Monitor Form Completion Rates**
   ```bash
   curl http://localhost:4000/api/analytics/submissions/my-form-id
   ```
   Check which fields have low completion rates and optimize them.

2. **Identify Popular Choices**
   See the most common values for multiple-choice or dropdown fields.

3. **Track Usage Over Time**
   Use `submissionsByDate` to see daily trends and identify peak usage times.

4. **Performance Metrics**
   Monitor average completion time to ensure your form isn't too long or complex.

---

## 🎯 Event Analytics

### Endpoint
```
GET /api/analytics/events/:formId?eventType=focus
```

### Query Parameters
- `eventType` (optional) - Filter by event type: "focus", "blur", "change", "open", "submit"

### What You Get

**Overview:**
- Total event count
- Number of unique users
- Time range (first to last event)

**Events by Type:**
- Count of each event type
- Example: `{"focus": 80, "blur": 75, "change": 120}`

**Events by Hour:**
- Hourly breakdown of event activity
- Useful for identifying peak usage times

**Field Interactions:**
For each field:
- Total interaction count
- Breakdown by event type (focus, blur, change)
- Field label for easy identification

### Example Use Cases

1. **Identify Problematic Fields**
   ```bash
   curl http://localhost:4000/api/analytics/events/my-form-id
   ```
   Fields with many focus/blur events but few changes might be confusing to users.

2. **Track User Engagement**
   High event counts indicate active user engagement with the form.

3. **Analyze Specific Interactions**
   ```bash
   curl "http://localhost:4000/api/analytics/events/my-form-id?eventType=change"
   ```
   See which fields users modify most frequently.

4. **Peak Usage Times**
   Use `eventsByHour` to optimize server resources and understand user behavior.

---

## 🔄 Full Combined Analytics

### Endpoint
```
GET /api/analytics/full/:formId
```

### What You Get

Both submission analytics AND event analytics in a single response:

```json
{
  "submissions": { /* All submission metrics */ },
  "events": { /* All event metrics */ }
}
```

### Example Use Cases

1. **Comprehensive Form Report**
   ```bash
   curl http://localhost:4000/api/analytics/full/my-form-id
   ```
   Get everything you need for a complete form performance report.

2. **Correlation Analysis**
   Compare event patterns with actual submission rates to identify drop-off points.

3. **Dashboard Data**
   Single endpoint to power your analytics dashboard with all necessary data.

---

## 📈 Practical Examples

### Example 1: Finding Low-Performing Fields

```bash
# Get submission analytics
curl http://localhost:4000/api/analytics/submissions/registration-form

# Look at fieldAnalytics
# If "phoneNumber" has completionRate: 45%, you know users are skipping it
```

**Action:** Make the field optional or improve its label/help text.

### Example 2: Identifying Confusing Fields

```bash
# Get event analytics
curl http://localhost:4000/api/analytics/events/registration-form

# Check fieldInteractions
# If "email" field has 50 focus events but only 25 change events,
# users might be confused or abandoning the field
```

**Action:** Add better instructions or validation feedback.

### Example 3: Optimizing Form Length

```bash
# Check completion times
curl http://localhost:4000/api/analytics/submissions/survey-form

# If average completion time is 5+ minutes and you're seeing drop-offs,
# consider shortening the form
```

**Action:** Make some fields optional or split into multiple pages.

### Example 4: A/B Testing

```bash
# Compare two form versions
curl http://localhost:4000/api/analytics/submissions/form-v1
curl http://localhost:4000/api/analytics/submissions/form-v2

# Compare metrics like:
# - Average completion time
# - Field completion rates
# - Total submissions
```

**Action:** Choose the better-performing version.

---

## 🛠 Testing

Run the test script to see all endpoints in action:

```bash
./test-analytics.sh
```

Or test individual endpoints:

```bash
# Submission analytics
curl http://localhost:4000/api/analytics/submissions/1 | jq '.'

# Event analytics (all events)
curl http://localhost:4000/api/analytics/events/1 | jq '.'

# Event analytics (focus only)
curl "http://localhost:4000/api/analytics/events/1?eventType=focus" | jq '.'

# Full analytics
curl http://localhost:4000/api/analytics/full/1 | jq '.'
```

---

## 💡 Tips

1. **Use Field Analytics to Optimize Forms**
   - Low completion rates? Field might be confusing or unnecessary
   - High unique values? Good for open text fields
   - Low unique values? Consider making it a dropdown

2. **Monitor Completion Time**
   - Average > 5 minutes? Form might be too long
   - Wide gap between min/max? Some users struggling

3. **Check Event Patterns**
   - Many focus/blur without changes = user confusion
   - High change counts = users fixing mistakes (might need better validation)

4. **Track Over Time**
   - Use `submissionsByDate` to monitor trends
   - Look for drops that might indicate issues

5. **Combine with Other Data**
   - Use both submission and event analytics together
   - High events but low submissions = drop-off issue

---

## 📊 Sample Analytics Dashboard Metrics

Use these endpoints to build a dashboard showing:

1. **Key Performance Indicators (KPIs)**
   - Total submissions (today, this week, all time)
   - Average completion time
   - Conversion rate (events vs submissions)

2. **Field Performance**
   - Completion rate per field
   - Most/least interacted fields
   - Fields with highest drop-off

3. **User Behavior**
   - Peak usage hours
   - Average time per field
   - Common value patterns

4. **Trends**
   - Submissions over time (daily chart)
   - Event activity over time (hourly heatmap)
   - Completion time trends

---

## 🚀 Next Steps

1. **Start Collecting Data**: Make sure your frontend is sending events via `/analytics/track`
2. **Test the Endpoints**: Use the test script to see sample data
3. **Build a Dashboard**: Use the analytics data to create visualizations
4. **Monitor Performance**: Set up alerts for drops in submission rates
5. **Iterate**: Use insights to continuously improve your forms

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

