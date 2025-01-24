#!/bin/bash

# Base URL of the API
BASE_URL="http://localhost:5000"

# Colors for output
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Helper function to print results
function print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✔ $2${NC}"
  else
    echo -e "${RED}✘ $2${NC}"
  fi
}

# Test the base route
echo "Testing base route..."
curl -X GET $BASE_URL/ -i
print_result $? "Base route (/)"

# Test user signup
echo "Testing user signup..."
SIGNUP_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"name": "Test User", "email": "testuser@example.com", "password": "password123"}')

echo $SIGNUP_RESPONSE
print_result $? "User signup (/api/auth/signup)"

# Test user login and extract token
echo "Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "testuser@example.com", "password": "password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
  print_result 0 "User login (/api/auth/login)"
else
  print_result 1 "User login (/api/auth/login)"
  echo -e "${RED}Error: Unable to extract token. Exiting.${NC}"
  exit 1
fi

# Test getting all blogs (protected route)
echo "Testing get all blogs..."
curl -s -X GET $BASE_URL/api/blogs \
-H "Authorization: Bearer $TOKEN" -i
print_result $? "Get all blogs (/api/blogs)"

# Test creating a blog post (protected route)
echo "Testing create blog post..."
CREATE_BLOG_RESPONSE=$(curl -s -X POST $BASE_URL/api/blogs \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"title": "My First Blog", "content": "This is a test blog post."}')

BLOG_ID=$(echo $CREATE_BLOG_RESPONSE | jq -r '._id')

if [ "$BLOG_ID" != "null" ]; then
  print_result 0 "Create blog post (/api/blogs)"
else
  print_result 1 "Create blog post (/api/blogs)"
  echo -e "${RED}Error: Unable to extract blog ID. Exiting.${NC}"
  exit 1
fi

# Test updating a blog post (protected route)
echo "Testing update blog post..."
curl -s -X PUT $BASE_URL/api/blogs/$BLOG_ID \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"title": "Updated Blog Title", "content": "Updated content for the blog post."}' -i
print_result $? "Update blog post (/api/blogs/:id)"

# Test deleting a blog post (protected route)
echo "Testing delete blog post..."
curl -s -X DELETE $BASE_URL/api/blogs/$BLOG_ID \
-H "Authorization: Bearer $TOKEN" -i
print_result $? "Delete blog post (/api/blogs/:id)"

# Cleanup: Optional
# Delete test user from the database manually if needed

echo -e "${GREEN}All tests completed.${NC}"
