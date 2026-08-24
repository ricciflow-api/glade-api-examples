#!/usr/bin/env bash
set -euo pipefail

: "${GLADE_API_KEY:?Set GLADE_API_KEY to a Glade API key}"
GLADE_API_BASE_URL="${GLADE_API_BASE_URL:-https://gladeapi.com}"

curl --fail-with-body --silent --show-error \
  "${GLADE_API_BASE_URL}/api/graphql" \
  --header "API-KEY: ${GLADE_API_KEY}" \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --data-binary '{"query":"query Product($input: ProductInput!) { amazonProduct(input: $input) { asin title brand price { value currency display } rating ratingsTotal isPrime isInStock } }","variables":{"input":{"asin":"B0D1XD1ZV3","domain":"US"}}}'
