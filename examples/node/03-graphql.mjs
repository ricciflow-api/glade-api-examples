import { graphql } from "./glade-client.mjs";

const query = `
  query Product($input: ProductInput!) {
    amazonProduct(input: $input) {
      asin
      title
      brand
      price { value currency display }
      rating
      ratingsTotal
      isPrime
      isInStock
    }
  }
`;

const payload = await graphql(query, {
  input: { asin: "B0D1XD1ZV3", domain: "US" },
});

if (payload.errors?.length) throw new Error(JSON.stringify(payload.errors));
console.log(JSON.stringify(payload.data.amazonProduct, null, 2));
