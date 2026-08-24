"""Fetch one Amazon product through Glade API."""

from glade_client import get


payload = get(
    "/api/amazon/product",
    {"asin": "B0D1XD1ZV3", "domain": "US"},
)
product = payload["data"]["amazonProduct"]
price = product.get("price") or {}

print(f"{product['title']} ({product['asin']})")
print(f"Brand: {product.get('brand') or 'n/a'}")
print(f"Price: {price.get('display') or 'n/a'}")
print(f"Rating: {product.get('rating') or 'n/a'}")
print(f"Prime: {product.get('isPrime')}")
