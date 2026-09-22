#!/usr/bin/env bash
set -euo pipefail

: "${GLADE_API_KEY:?Set GLADE_API_KEY to a Glade API key}"
GLADE_API_BASE_URL="${GLADE_API_BASE_URL:-https://gladeapi.com}"

curl --fail-with-body --include --get \
  "${GLADE_API_BASE_URL%/}/api/amazon/product/sales" \
  --data-urlencode "asin=B0D1XD1ZV3" \
  --data-urlencode "domain=US" \
  --header "API-KEY: ${GLADE_API_KEY}"
