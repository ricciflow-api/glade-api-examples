#!/usr/bin/env bash
set -euo pipefail

: "${GLADE_API_KEY:?Set GLADE_API_KEY to a Glade API key}"
GLADE_API_BASE_URL="${GLADE_API_BASE_URL:-https://gladeapi.com}"

curl --fail-with-body --silent --show-error --get \
  "${GLADE_API_BASE_URL}/api/amazon/search" \
  --data-urlencode "searchTerm=wireless earbuds" \
  --data-urlencode "domain=US" \
  --data-urlencode "sort=FEATURED" \
  --data-urlencode "page=1" \
  --data-urlencode "limit=5" \
  --header "API-KEY: ${GLADE_API_KEY}" \
  --header "Accept: application/json"
