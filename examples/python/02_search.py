"""Search the US Amazon marketplace through Glade API."""

from glade_client import get


payload = get(
    "/api/amazon/search",
    {
        "searchTerm": "wireless earbuds",
        "domain": "US",
        "sort": "FEATURED",
        "page": 1,
        "limit": 5,
    },
)
search = payload["data"]["amazonProductSearchResults"]
products = (search.get("productResults") or {}).get("results") or []

for index, product in enumerate(products, start=1):
    price = product.get("price") or {}
    print(
        f"{index}. {product.get('title') or 'Untitled'} "
        f"[{product.get('asin') or 'no ASIN'}] — {price.get('display') or 'n/a'}"
    )
