#!/bin/bash

# Test script for submission endpoints
BASE_URL="http://localhost:4000/api"

echo "======================================"
echo "Testing Submission Endpoints"
echo "======================================"
echo ""

# 1. Submit a test form
echo "1. Submitting test form..."
curl -X POST ${BASE_URL}/submissions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "formId": "test-form-1",
    "userId": "user123",
    "submittedData": {
      "name": "John Doe",
      "email": "john@example.com",
      "age": 25,
      "message": "This is a test submission"
    },
    "metadata": {
      "completionTime": 45.5
    },
    "timestamp": "2025-11-11T22:39:37.309Z"
  }'
echo -e "\n"

# 2. Submit another test form
echo "2. Submitting another test form..."
curl -X POST ${BASE_URL}/submissions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "formId": "test-form-1",
    "userId": "user456",
    "submittedData": {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "age": 30,
      "message": "Another test submission"
    },
    "metadata": {
      "completionTime": 60
    }
  }'
echo -e "\n"

# 3. Get all submissions for the form
echo "3. Getting all submissions for form 'test-form-1'..."
curl -X GET ${BASE_URL}/submissions/form/test-form-1
echo -e "\n"

# 4. Get submissions with pagination
echo "4. Getting submissions with pagination (limit=1, skip=0)..."
curl -X GET "${BASE_URL}/submissions/form/test-form-1?limit=1&skip=0"
echo -e "\n"

# 5. Get form statistics
echo "5. Getting form statistics..."
curl -X GET ${BASE_URL}/submissions/form/test-form-1/stats
echo -e "\n"

echo "======================================"
echo "Testing Complete!"
echo "======================================"

