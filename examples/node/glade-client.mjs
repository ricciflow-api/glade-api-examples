const baseUrl = (process.env.GLADE_API_BASE_URL || "https://gladeapi.com").replace(/\/$/, "");

function apiKey() {
  const key = process.env.GLADE_API_KEY?.trim();
  if (!key) throw new Error("Set GLADE_API_KEY to a Glade API key");
  return key;
}

async function decode(response) {
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    throw new Error(`Glade API returned HTTP ${response.status}: ${text.slice(0, 2000)}`);
  }
  return payload;
}

export async function get(path, params) {
  const url = new URL(`${baseUrl}${path}`);
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(name, String(value));
  }
  return decode(
    await fetch(url, {
      headers: {
        "API-KEY": apiKey(),
        Accept: "application/json",
        "User-Agent": "glade-api-examples-node/1.0",
      },
    }),
  );
}

export async function graphql(query, variables = {}) {
  return decode(
    await fetch(`${baseUrl}/api/graphql`, {
      method: "POST",
      headers: {
        "API-KEY": apiKey(),
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "glade-api-examples-node/1.0",
      },
      body: JSON.stringify({ query, variables }),
    }),
  );
}
