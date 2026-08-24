import { get } from "./glade-client.mjs";

const payload = await get("/api/amazon/search", {
  searchTerm: "wireless earbuds",
  domain: "US",
  sort: "FEATURED",
  page: 1,
  limit: 5,
});
const products = payload.data.amazonProductSearchResults?.productResults?.results ?? [];

for (const [index, product] of products.entries()) {
  console.log(
    `${index + 1}. ${product.title ?? "Untitled"} [${product.asin ?? "no ASIN"}] — ${product.price?.display ?? "n/a"}`,
  );
}
