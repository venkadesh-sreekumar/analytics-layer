#!/bin/bash

# Test script for advanced analytics endpoints
BASE_URL="http://localhost:4000/api"
FORM_ID="1"
USER_ID="user123"

echo "======================================"
echo "Testing Advanced Analytics Endpoints"
echo "======================================"
echo ""

echo "1. Getting All User Event Data for Form ${FORM_ID}..."
echo "--------------------------------------"
curl -X GET ${BASE_URL}/advancedAnalytics/${FORM_ID} | jq '.data | {formId, totalUsers, totalEvents, lastUpdated, userCount: (.users | length)}'
echo -e "\n"

echo "2. Getting Analytics for Specific User (${USER_ID})..."
echo "--------------------------------------"
curl -X GET ${BASE_URL}/advancedAnalytics/${FORM_ID}/user/${USER_ID} | jq '.data | {userId, totalEvents, sessionDuration, eventsByType}'
echo -e "\n"

echo "3. Getting Form Summary..."
echo "--------------------------------------"
curl -X GET ${BASE_URL}/advancedAnalytics/${FORM_ID}/summary | jq '.data.summary'
echo -e "\n"

echo "4. Getting Event Type Distribution..."
echo "--------------------------------------"
curl -X GET ${BASE_URL}/advancedAnalytics/${FORM_ID}/summary | jq '.data.eventTypeDistribution'
echo -e "\n"

echo "5. Getting Top Users..."
echo "--------------------------------------"
curl -X GET ${BASE_URL}/advancedAnalytics/${FORM_ID}/summary | jq '.data.topUsers'
echo -e "\n"

echo "======================================"
echo "Advanced Analytics Testing Complete!"
echo "======================================"
echo ""
echo "💡 Tips:"
echo "  - First user event data shows complete event timeline"
echo "  - Summary provides quick overview metrics"
echo "  - User-specific endpoint great for debugging individual sessions"
echo "  - Change FORM_ID and USER_ID variables at top to test different data"

