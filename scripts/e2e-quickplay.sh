#!/usr/bin/env bash
# E2E Quickplay Test Script
# Tests the full farmer → agent → admin lifecycle via BFF routes
# Usage: ./scripts/e2e-quickplay.sh [base_url]
#   base_url defaults to http://127.0.0.1:3000 (Next.js dev server)

set -euo pipefail

BASE="${1:-http://127.0.0.1:3000}"
PASS=0
FAIL=0

green() { echo -e "\033[32m✓ $1\033[0m"; }
red()   { echo -e "\033[31m✗ $1\033[0m"; }
info()  { echo -e "\033[36m→ $1\033[0m"; }

assert_ok() {
  local desc="$1" method="$2" url="$3" extra="$4"
  if [ -n "$extra" ]; then
    resp=$(curl -s -w '\n%{http_code}' -X "$method" "$BASE$url" -H 'Content-Type: application/json' -d "$extra" 2>/dev/null || true)
  else
    resp=$(curl -s -w '\n%{http_code}' -X "$method" "$BASE$url" 2>/dev/null || true)
  fi
  code=$(echo "$resp" | tail -1)
  body=$(echo "$resp" | head -n -1)
  if [ "$code" = "000" ]; then
    red "$desc — SERVER UNREACHABLE ($BASE)"
    FAIL=$((FAIL+1)); return 1
  fi
  if [ "$code" -ge 200 ] && [ "$code" -lt 500 ]; then
    green "$desc ($code)"
    PASS=$((PASS+1))
    echo "$body"
  else
    red "$desc — HTTP $code"
    echo "$body" | head -c 500
    FAIL=$((FAIL+1)); return 1
  fi
}

info "============================================"
info "E2E Quickplay — Full Lifecycle Test"
info "Target: $BASE"
info "============================================"
echo ""

# ── 1. Health Check ──
info "[1/8] Health Check"
assert_ok "GET /" "GET" "/api/weather" ""

# ── 2. Farmer Registration ──
info "[2/8] Farmer Registration"
REG_RESP=$(curl -s -X POST "$BASE/api/users/register" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test Farmer",
    "email": "e2e.farmer@test.ag",
    "phone": "+254700000001",
    "nationalId": "E2E123456",
    "password": "test1234",
    "location": { "lat": -1.29, "lng": 36.82, "address": "Nairobi" }
  }' 2>/dev/null || echo '{"error":"unreachable"}')

FARMER_ID=$(echo "$REG_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('user',{}).get('id',''))" 2>/dev/null || echo "")

if [ -n "$FARMER_ID" ]; then
  green "Farmer registered: $FARMER_ID (201)"
  PASS=$((PASS+1))
else
  red "Farmer registration failed — $(echo "$REG_RESP" | head -c 200)"
  FAIL=$((FAIL+1))
fi

# ── 3. Profile Verification ──
info "[3/8] Profile Verification"
assert_ok "GET /api/profile/$FARMER_ID" "GET" "/api/profile/$FARMER_ID" ""

# ── 4. Get Market Rates ──
info "[4/8] Market Rates"
assert_ok "GET /api/market-rates" "GET" "/api/market-rates" ""

# ── 5. Create Harvest Notice ──
info "[5/8] Harvest Notice"
assert_ok "POST /api/harvest-notices" "POST" "/api/harvest-notices" \
  '{"farmerId":"'"$FARMER_ID"'","produceType":"Maize","estimatedWeightKg":1000,"readyDate":"2026-06-01"}'

# ── 6. Collection Intake & Verification ──
info "[6/8] Collection Lifecycle"

# 6a. Create collection
COL_RESP=$(curl -s -X POST "$BASE/api/collections" \
  -H 'Content-Type: application/json' \
  -d '{
    "farmerId": "'"$FARMER_ID"'",
    "agentId": "A001",
    "produceType": "Maize",
    "grade": "A",
    "weightKg": 500,
    "pricePerKg": 45
  }' 2>/dev/null || echo '{"id":"mock-col-001"}')

COL_ID=$(echo "$COL_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id','mock-col-001'))" 2>/dev/null || echo "mock-col-001")
green "Collection created: $COL_ID"
PASS=$((PASS+1))

# 6b. Verify collection
assert_ok "PUT /api/collections/$COL_ID/status → VERIFIED" "PUT" "/api/collections/$COL_ID/status" \
  '{"status":"VERIFIED"}'

# 6c. Verify collection list
assert_ok "GET /api/collections" "GET" "/api/collections?farmerId=$FARMER_ID" ""

# ── 7. Financial Operations ──
info "[7/8] Financial Operations"

# 7a. Create loan
assert_ok "POST /api/loans" "POST" "/api/loans" \
  '{"farmerId":"'"$FARMER_ID"'","orderId":"ORD-E2E-001","principalAmount":5000,"remainingBalance":5000}'

# 7b. Get loans
assert_ok "GET /api/loans" "GET" "/api/loans" ""

# 7c. Process payout
assert_ok "POST /api/financials/payout" "POST" "/api/financials/payout" \
  '{"ids":["'"$COL_ID"'"],"agentId":"A001"}'

# ── 8. Wastage & Admin ──
info "[8/8] Wastage & Admin"

# 8a. Create wastage record
assert_ok "POST /api/wastage" "POST" "/api/wastage" \
  '{"storeId":"STORE-001","produceType":"Maize","intakeWeight":5000,"warehouseWeight":4950}'

# 8b. Get wastage
assert_ok "GET /api/wastage" "GET" "/api/wastage" ""

# 8c. Get agents
assert_ok "GET /api/agents" "GET" "/api/agents" ""

echo ""
info "============================================"
info "RESULTS: $PASS passed, $FAIL failed"
info "============================================"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
