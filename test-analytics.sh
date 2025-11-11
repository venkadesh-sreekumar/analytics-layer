#!/bin/bash

# Test script for analytics endpoints
BASE_URL="http://localhost:4000/api"
FORM_ID="1"

echo "======================================"
echo "Testing Analytics Endpoints"
echo "======================================"
echo ""

echo "1. Getting Submission Analytics for Form ${FORM_ID}..."
echo "--------------------------------------"
curl -X GET ${BASE_URL}/analytics/submissions/${FORM_ID} | jq '.'
echo -e "\n"

echo "2. Getting Event Analytics for Form ${FORM_ID}..."
echo "--------------------------------------"
curl -X GET ${BASE_URL}/analytics/events/${FORM_ID} | jq '.'
echo -e "\n"

echo "3. Getting Event Analytics (focus events only)..."
echo "--------------------------------------"
curl -X GET "${BASE_URL}/analytics/events/${FORM_ID}?eventType=focus" | jq '.'
echo -e "\n"

echo "4. Getting Full Combined Analytics..."
echo "--------------------------------------"
curl -X GET ${BASE_URL}/analytics/full/${FORM_ID} | jq '.'
echo -e "\n"

echo "5. Getting Basic Submission Stats..."
echo "--------------------------------------"
curl -X GET ${BASE_URL}/submissions/form/${FORM_ID}/stats | jq '.'
echo -e "\n"

echo "======================================"
echo "Analytics Testing Complete!"
echo "======================================"
echo ""
echo "💡 Tips:"
echo "  - Use jq to format JSON output (install with: brew install jq)"
echo "  - If jq is not installed, remove '| jq' from commands"
echo "  - Change FORM_ID variable at top of script to test different forms"

