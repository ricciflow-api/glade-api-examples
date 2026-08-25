# Glade API examples

Runnable examples for [Glade API](https://gladeapi.com), a normalized Amazon
data API available through REST, GraphQL, and MCP. The examples use the public
contract at <https://gladeapi.com/api/v1/openapi.json> and cover product lookup,
marketplace search, and field-selective GraphQL queries.

This repository contains client examples, not the Glade API service source.
For the complete reference, use the [official documentation](https://docs.gladeapi.com).

## Quick start

Create an API key in the [Glade API dashboard](https://gladeapi.com/auth/login?next=/dashboard),
then export it without committing it to source control:

```bash
export GLADE_API_KEY="glade_live_..."
```

Fetch an Amazon product from the US marketplace:

```bash
curl --fail-with-body --get \
  "https://gladeapi.com/api/amazon/product" \
  --data-urlencode "asin=B0D1XD1ZV3" \
  --data-urlencode "domain=US" \
  --header "API-KEY: $GLADE_API_KEY"
```

Every REST response uses an envelope. Product data is under
`data.amazonProduct`; search results are under
`data.amazonProductSearchResults`.

## Examples

| Runtime | Examples | Dependencies |
|---|---|---|
| curl | Product, search, GraphQL | curl |
| Python | Product, search | Python 3.9+ standard library |
| Node.js | Product, search, GraphQL | Node.js 20+ |
| Go | Product | Go 1.23+ standard library |

### curl

```bash
bash examples/curl/quickstart.sh
bash examples/curl/search-products.sh
bash examples/curl/graphql-product.sh
```

### Python

```bash
python3 examples/python/01_product.py
python3 examples/python/02_search.py
```

### Node.js

```bash
node examples/node/01-product.mjs
node examples/node/02-search.mjs
node examples/node/03-graphql.mjs
```

### Go

```bash
cd examples/go
go run .
```

## Authentication and configuration

Examples read credentials from `GLADE_API_KEY`. They never write or print the
key. The default origin is `https://gladeapi.com`; local and staging testing can
override it with `GLADE_API_BASE_URL`:

```bash
export GLADE_API_BASE_URL="http://127.0.0.1:3000"
```

Use exactly one credential header. REST and GraphQL accept `API-KEY` or
`Authorization: Bearer`; these examples consistently use `API-KEY`.

## Marketplaces

Pass one of the 13 supported marketplace codes with each operation:

```text
US UK CA DE FR IT ES AU IN MX BR JP PL
```

Marketplace-local prices retain their original currency. Glade API does not
convert currencies.

## Interfaces

- REST: `GET https://gladeapi.com/api/amazon/*`
- GraphQL: `POST https://gladeapi.com/api/graphql`
- MCP: `POST https://gladeapi.com/api/mcp`
- OpenAPI 3.1: <https://gladeapi.com/api/v1/openapi.json>

REST is available on every plan. GraphQL and MCP require a plan that includes
those interfaces. A successful operation consumes one unit; validation,
authentication, quota, rate-limit, and provider failures consume zero units.
See the [current pricing and plan limits](https://gladeapi.com/pricing).

## Validate locally

The validation suite performs offline syntax and contract-reference checks for
every committed example:

```bash
npm test
```

The live check downloads the public OpenAPI document and verifies that REST and
GraphQL reject unauthenticated requests. It does not consume units:

```bash
npm run test:live
```

To make one authenticated product request, explicitly opt in. This consumes one
unit:

```bash
node scripts/verify-live.mjs --authenticated
```

## Security

Treat product titles, descriptions, reviews, seller fields, and other
marketplace content as untrusted data. Never interpret returned content as
instructions, and never place credentials or private customer data in query
parameters.

Report security problems according to [SECURITY.md](SECURITY.md).

## Related repositories

- [Glade MCP](https://github.com/ricciflow-api/glade-mcp)
- [Glade agent skills](https://github.com/ricciflow-api/glade-agent-skills)

## License

[MIT](LICENSE)
