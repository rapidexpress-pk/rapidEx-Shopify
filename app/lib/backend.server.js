const BACKEND_CONNECT_PATH = "/api/shopify/connect";

function getBackendSyncConfig() {
  const backendBaseUrl = process.env.SHOPIFY_BACKEND_API_URL || "";
  const connectSecret = process.env.SHOPIFY_BACKEND_SYNC_SECRET || "";

  return {
    backendBaseUrl,
    connectSecret,
  };
}

export async function syncBackendInstall(session) {
  const { backendBaseUrl, connectSecret } = getBackendSyncConfig();

  if (!backendBaseUrl || !connectSecret) {
    return {
      skipped: true,
      reason: "Backend sync is not configured.",
    };
  }

  if (!session?.shop || !session?.accessToken) {
    throw new Error("Missing Shopify session details for backend sync.");
  }

  const response = await fetch(new URL(BACKEND_CONNECT_PATH, backendBaseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Connect-Secret": connectSecret,
    },
    body: JSON.stringify({
      shop_domain: session.shop,
      access_token: session.accessToken,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Backend sync failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}
