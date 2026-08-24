import assert from "node:assert/strict";

const baseUrl = (process.env.GLADE_API_BASE_URL || "https://gladeapi.com").replace(/\/$/, "");
const expectedPaths = [
  "/api/amazon/author",
  "/api/amazon/autocomplete",
  "/api/amazon/bestseller-categories",
  "/api/amazon/bestsellers",
  "/api/amazon/categories",
  "/api/amazon/category",
  "/api/amazon/deals",
  "/api/amazon/product",
  "/api/amazon/product/asin-from-gtin",
  "/api/amazon/product/gtin-from-asin",
  "/api/amazon/product/offers",
  "/api/amazon/product/reviews",
  "/api/amazon/product/sales",
  "/api/amazon/product/stock",
  "/api/amazon/product/variants",
  "/api/amazon/search",
  "/api/amazon/seller",
];

const contractResponse = await fetch(`${baseUrl}/api/v1/openapi.json`);
assert.equal(contractResponse.status, 200, "OpenAPI endpoint must return 200");
const contract = await contractResponse.json();
assert.equal(contract.openapi, "3.1.0");
assert.deepEqual(Object.keys(contract.paths).sort(), expectedPaths);
assert.ok(contract.components?.securitySchemes?.ApiKeyAuth);
assert.ok(contract.components?.securitySchemes?.BearerAuth);

const restResponse = await fetch(
  `${baseUrl}/api/amazon/product?asin=B0D1XD1ZV3&domain=US`,
);
assert.equal(restResponse.status, 401, "REST must reject a missing credential");

const graphqlResponse = await fetch(`${baseUrl}/api/graphql`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "query { amazonProduct(input: { asin: \"B0D1XD1ZV3\", domain: US }) { title } }",
  }),
});
assert.equal(graphqlResponse.status, 401, "GraphQL must reject a missing credential");

if (process.argv.includes("--authenticated")) {
  const key = process.env.GLADE_API_KEY?.trim();
  assert.ok(key, "Set GLADE_API_KEY before using --authenticated");
  const response = await fetch(
    `${baseUrl}/api/amazon/product?asin=B0D1XD1ZV3&domain=US`,
    { headers: { "API-KEY": key, Accept: "application/json" } },
  );
  const text = await response.text();
  assert.equal(response.status, 200, `Authenticated product check failed: ${text.slice(0, 500)}`);
  const payload = JSON.parse(text);
  assert.equal(payload.data?.amazonProduct?.asin, "B0D1XD1ZV3");
  console.log("Authenticated product request passed (one unit consumed).");
}

console.log("Live OpenAPI and unauthenticated interface checks passed.");
