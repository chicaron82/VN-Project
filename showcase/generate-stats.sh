#!/bin/bash
# Generate Real Stats for Showcase
# Pulls actual test counts and TypeScript error counts

echo "📊 Generating real stats for showcase..."

# Get test count from Vitest
echo "Running tests to get count..."
TEST_OUTPUT=$(npm test -- --reporter=json 2>&1 || true)
TEST_COUNT=$(echo "$TEST_OUTPUT" | grep -o '"numPassedTests":[0-9]*' | grep -o '[0-9]*' | head -1)

# Fallback if test count not found
if [ -z "$TEST_COUNT" ]; then
    echo "⚠️  Could not parse test count, trying alternative method..."
    TEST_COUNT=$(npm test 2>&1 | grep -o "[0-9]* passed" | grep -o "[0-9]*" | head -1)
fi

# Get TypeScript error count
echo "Checking TypeScript errors..."
TS_ERROR_COUNT=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")

# Get phase count from timeline data
PHASE_COUNT=$(grep -o '"phase":' showcase/timeline-data.js | wc -l)

echo ""
echo "✅ Stats collected:"
echo "   Tests Passing: $TEST_COUNT"
echo "   TypeScript Errors: $TS_ERROR_COUNT"
echo "   Phases Complete: $PHASE_COUNT"
echo ""

# Create stats JSON file
cat > showcase/stats.json << EOF
{
  "testsPass": ${TEST_COUNT:-0},
  "tsErrors": ${TS_ERROR_COUNT:-0},
  "phasesComplete": ${PHASE_COUNT:-0},
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "📝 Created showcase/stats.json"
echo ""
echo "💡 To update showcase HTML, run:"
echo "   node showcase/update-stats.js"
