"""Small standard-library client shared by the Python examples."""

import json
import os
import urllib.error
import urllib.parse
import urllib.request


BASE_URL = os.environ.get("GLADE_API_BASE_URL", "https://gladeapi.com").rstrip("/")
TIMEOUT_SECONDS = 30
USER_AGENT = "glade-api-examples-python/1.0"


def _api_key():
    key = os.environ.get("GLADE_API_KEY", "").strip()
    if not key:
        raise RuntimeError("Set GLADE_API_KEY to a Glade API key")
    return key


def get(path, params):
    """Call one Glade REST endpoint and return its decoded JSON envelope."""
    query = urllib.parse.urlencode(
        {name: value for name, value in params.items() if value is not None}
    )
    request = urllib.request.Request(
        f"{BASE_URL}{path}?{query}",
        headers={
            "API-KEY": _api_key(),
            "Accept": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")[:2000]
        raise RuntimeError(f"Glade API returned HTTP {error.code}: {detail}") from error
    except urllib.error.URLError as error:
        raise RuntimeError(f"Could not reach Glade API: {error.reason}") from error
