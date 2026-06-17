export const loader = async () => {
  return new Response("ok", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};

export default function HealthCheck() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #111827 45%, #1f2937 100%)",
        color: "#f9fafb",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <section
        style={{
          padding: "32px 40px",
          borderRadius: "20px",
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          textAlign: "center",
          maxWidth: "520px",
        }}
      >
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "999px",
            background: "#22c55e",
            margin: "0 auto 16px",
            boxShadow: "0 0 0 8px rgba(34, 197, 94, 0.15)",
          }}
        />
        <h1 style={{ margin: 0, fontSize: "32px", lineHeight: 1.15 }}>
          RapidEx Shopify is healthy
        </h1>
        <p style={{ margin: "12px 0 0", color: "#cbd5e1", fontSize: "16px" }}>
          The container is reachable and ready to serve Shopify requests.
        </p>
      </section>
    </main>
  );
}
