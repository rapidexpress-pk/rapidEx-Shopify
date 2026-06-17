import { useEffect } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { syncBackendInstall } from "../lib/backend.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return {
    shop: session.shop,
  };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const result = await syncBackendInstall(session);

  return {
    ok: true,
    result,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const { shop } = useLoaderData();
  const isSyncing =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  useEffect(() => {
    if (fetcher.data?.ok) {
      // Keep the merchant informed after a successful sync.
      console.info("Shopify store synced to backend.");
    }
  }, [fetcher.data?.ok]);

  const syncNow = () => fetcher.submit({}, { method: "POST" });

  return (
    <s-page heading="RapidEx Connector">
      <s-section heading="Store connection">
        <s-paragraph>
          <s-text>The store </s-text>
          <s-text>{shop || "this Shopify store"}</s-text>
          <s-text> is set up to sync with the RapidEx backend.</s-text>
        </s-paragraph>
        <s-paragraph>
          The app automatically syncs after install. Use the button below if
          you need to refresh the backend registration after a scope change or
          reinstall.
        </s-paragraph>
        <s-button onClick={syncNow} {...(isSyncing ? { loading: true } : {})}>
          Sync backend now
        </s-button>
        {fetcher.data?.ok && (
          <s-paragraph>Backend sync completed successfully.</s-paragraph>
        )}
        {fetcher.data?.result?.message && (
          <s-paragraph>{fetcher.data.result.message}</s-paragraph>
        )}
      </s-section>
      <s-section heading="What happens next">
        <s-paragraph>
          RapidEx stores the shop in Laravel, creates the internal shipper
          reference, and registers Shopify webhooks for order ingestion.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
