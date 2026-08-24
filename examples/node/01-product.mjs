import { get } from "./glade-client.mjs";

const payload = await get("/api/amazon/product", {
  asin: "B0D1XD1ZV3",
  domain: "US",
});
const product = payload.data.amazonProduct;

console.log(`${product.title} (${product.asin})`);
console.log(`Brand: ${product.brand ?? "n/a"}`);
console.log(`Price: ${product.price?.display ?? "n/a"}`);
console.log(`Rating: ${product.rating ?? "n/a"}`);
console.log(`Prime: ${product.isPrime ?? "n/a"}`);
